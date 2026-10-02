"""Text ingestion → staged drafts → human approve/reject (FR-REG-08, T-046). Included before the data router so
`/exceptions/drafts` wins over `/exceptions/{id}`."""

import hashlib
import json
import time
from collections import defaultdict, deque
from typing import Annotated, Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.auth.deps import WorkspaceContext, member, reviewer, viewer
from app.errors import ApiError, not_found
from app.ids import DAY, new_id, now
from app.ingest.extractor import extract
from app.ingest.loaders import load_bundle
from app.ingest.resolver import resolve
from app.services import sentinel, views
from app.services.audit import audit

router = APIRouter(prefix="/workspaces/{ws_id}/exceptions")
_window: dict[str, deque[float]] = defaultdict(deque)
PER_HOUR = 10


class IngestIn(BaseModel):
    text: Annotated[str, Field(min_length=20, max_length=20000)]
    source_ref: str | None = Field(None, max_length=300)


class ApproveIn(BaseModel):
    owner_id: str | None = None
    control_id: str | None = None
    service_ids: list[str] | None = None
    expires_at: int | None = None
    severity: int | None = Field(None, ge=1, le=5)
    title: str | None = Field(None, min_length=3, max_length=160)


def _draft_out(row: dict[str, Any]) -> dict[str, Any]:
    e = row["e"]
    staged = json.loads(e.get("staged_json") or "{}")
    return {
        "id": e["id"],
        "title": e["title"],
        "kind": e["kind"],
        "severity": e["severity"],
        "granted_at": e["granted_at"],
        "expires_at": e["expires_at"],
        "description": e.get("description"),
        "control": views.ref("Control", row["control"]),
        "owner": views.ref("Person", row["owner"]),
        "services": views.refs("Service", row["services"]),
        "unresolved": staged.get("unresolved", {}),
        "warnings": staged.get("warnings", []),
        "hints": staged.get("hints", {}),
        "version": e["version"],
    }


def _limit(ws_id: str) -> None:
    q, t = _window[ws_id], time.time()
    while q and t - q[0] > 3600:
        q.popleft()
    if len(q) >= PER_HOUR:
        raise ApiError("RATE_LIMITED", "Text ingestion is limited to 10 per hour.", headers={"Retry-After": "600"})
    q.append(t)


@router.post("/ingest-text", status_code=201)
async def ingest_text(body: IngestIn, ctx: WorkspaceContext = Depends(member)) -> dict[str, Any]:
    _limit(ctx.ws_id)
    x = await extract(ctx.ws_id, ctx.workspace.get("ai_mode", "cloud"), body.text)
    reg = await ctx.org.read("registry_snapshot")
    by = defaultdict(list)
    for r in reg:
        by[r["label"]].append(r)
    res = resolve(x, by["Person"], by["Service"], by["Control"])
    draft_id = new_id("exc")
    staged = {
        "unresolved": res["unresolved"],
        "warnings": x.warnings,
        "hints": {
            "owner": x.owner_hint.model_dump() if x.owner_hint else None,
            "services": x.service_hints,
            "control": x.control_hint,
            "compensating_control": x.compensating_control_description,
        },
    }
    await ctx.org.write(
        "draft_create",
        id=draft_id,
        title=x.title,
        kind=x.kind,
        severity=x.severity_suggested,
        granted_at=ctx.as_of,
        expires_at=ctx.as_of + (x.duration_days or 30) * DAY,
        description=x.compensating_control_description,
        now=now(),
        actor=ctx.user.id,
        staged_json=json.dumps(staged),
        control_id=res["control_id"],
        owner_id=res["owner_id"],
        approver_id=res["approver_id"],
        service_ids=res["service_ids"],
    )
    if x.evidence_excerpt:
        await load_bundle(
            ctx.org,
            {
                "bundle_version": 1,
                "evidence": [
                    {
                        "id": new_id("ev"),
                        "exception_id": draft_id,
                        "kind": "chat",
                        "source_ref": body.source_ref or "pasted text",
                        "captured_at": now(),
                        "excerpt": x.evidence_excerpt,
                        "content_hash": hashlib.sha256(body.text.encode()).hexdigest(),
                    }
                ],
            },
            source="ingest",
            actor=ctx.user.id,
        )
    await audit(
        ctx.org,
        actor_kind="user",
        actor_id=ctx.user.id,
        action="exception.staged",
        target_kind="Exception",
        target_id=draft_id,
        summary=x.title,
        diff={"warnings": x.warnings},
    )
    return await _get_draft(ctx, draft_id)


async def _get_draft(ctx: WorkspaceContext, draft_id: str) -> dict[str, Any]:
    for row in await ctx.org.read("drafts_list"):
        if row["e"]["id"] == draft_id:
            return _draft_out(row)
    raise not_found("draft")


@router.get("/drafts")
async def list_drafts(ctx: WorkspaceContext = Depends(viewer)) -> list[dict[str, Any]]:
    return [_draft_out(r) for r in await ctx.org.read("drafts_list")]


@router.post("/drafts/{draft_id}/approve")
async def approve(draft_id: str, body: ApproveIn, ctx: WorkspaceContext = Depends(reviewer)) -> dict[str, Any]:
    d = await _get_draft(ctx, draft_id)
    owner_id = body.owner_id or (d["owner"] or {}).get("id")
    control_id = body.control_id or (d["control"] or {}).get("id")
    service_ids = body.service_ids or [s["id"] for s in d["services"]]
    expires_at = body.expires_at or d["expires_at"]
    errors = [
        {"field": f, "message": "Required before approval"}
        for f, v in (("owner_id", owner_id), ("control_id", control_id), ("service_ids", service_ids))
        if not v
    ]
    if expires_at <= ctx.as_of:
        errors.append({"field": "expires_at", "message": "Must be after today"})
    if errors:
        raise ApiError("VALIDATION_ERROR", "Complete the draft before approving.", errors)
    if not await ctx.org.write(
        "draft_complete",
        id=draft_id,
        control_id=control_id,
        owner_id=owner_id,
        service_ids=service_ids,
        expires_at=expires_at,
        severity=body.severity or d["severity"],
        title=body.title or d["title"],
        now=now(),
    ):
        raise ApiError(
            "VALIDATION_ERROR",
            "Owner must be an active person and the control must exist.",
            [{"field": "owner_id", "message": "Check owner and control"}],
        )
    await audit(
        ctx.org,
        actor_kind="user",
        actor_id=ctx.user.id,
        action="exception.approved",
        target_kind="Exception",
        target_id=draft_id,
    )
    await sentinel.mark_dirty(ctx.ws_id)
    return await views.get_exception(ctx, draft_id)


@router.post("/drafts/{draft_id}/reject", status_code=204)
async def reject(draft_id: str, ctx: WorkspaceContext = Depends(reviewer)) -> None:
    if not (await ctx.org.write("draft_delete", id=draft_id))[0]["n"]:
        raise not_found("draft")
    await audit(
        ctx.org,
        actor_kind="user",
        actor_id=ctx.user.id,
        action="exception.rejected",
        target_kind="Exception",
        target_id=draft_id,
    )

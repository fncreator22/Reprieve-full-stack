import json
from typing import Any

from fastapi import APIRouter, BackgroundTasks, Depends, Request, status

from app.auth.deps import (
    CurrentUser,
    WorkspaceContext,
    admin,
    any_status,
    current_user,
    forget_user,
    platform_repo,
    viewer,
)
from app.errors import ApiError
from app.ids import now
from app.models.api import (
    AiSettings,
    ClockIn,
    ClockOut,
    LinkPerson,
    MeOut,
    MePatch,
    OnboardingPatch,
    Role,
    WorkspaceCreate,
    WorkspaceOut,
)
from app.services import events, sentinel, workspaces
from app.services.audit import audit

router = APIRouter()


def workspace_out(w: dict[str, Any], role: str, person_id: str | None) -> dict[str, Any]:
    keys = (
        "id",
        "slug",
        "name",
        "status",
        "data_mode",
        "clock_mode",
        "as_of",
        "ai_mode",
        "onboarding_step",
        "onboarding_done",
        "last_sentinel_at",
    )
    out = {k: w.get(k) for k in keys}
    if out["clock_mode"] == "live":
        out["as_of"] = now()
    return {**out, "role": role, "person_id": person_id}


@router.get("/me", response_model=MeOut)
async def me(user: CurrentUser = Depends(current_user)) -> dict[str, Any]:
    rows = await platform_repo().read("p_memberships", user_id=user.id)
    return {"user": {"id": user.id, "email": user.email, "name": user.name, "prefs": user.prefs}, "memberships": rows}


@router.patch("/me", response_model=MeOut)
async def patch_me(body: MePatch, user: CurrentUser = Depends(current_user)) -> dict[str, Any]:
    prefs = json.dumps({**user.prefs, **body.prefs}) if body.prefs is not None else None
    await platform_repo().write("p_user_update", user_id=user.id, name=body.name, prefs_json=prefs)
    forget_user(user.clerk_user_id)
    user.name = body.name or user.name
    user.prefs = json.loads(prefs) if prefs else user.prefs
    return await me(user)


@router.post("/workspaces", response_model=WorkspaceOut, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    body: WorkspaceCreate, tasks: BackgroundTasks, user: CurrentUser = Depends(current_user)
) -> dict[str, Any]:
    platform = platform_repo()
    try:
        ws_id = await workspaces.create(platform, user.id, body.name, body.slug, body.data_mode)
    except ApiError:
        forget_user(user.clerk_user_id)
        raise
    tasks.add_task(workspaces.provision, platform, ws_id, body.data_mode)
    w = (await platform.read("p_workspace_get", ws_id=ws_id))[0]["w"]
    return workspace_out(w, "owner", None)


@router.get("/workspaces", response_model=list[WorkspaceOut])
async def list_workspaces(user: CurrentUser = Depends(current_user)) -> list[dict[str, Any]]:
    platform = platform_repo()
    out = []
    for m in await platform.read("p_memberships", user_id=user.id):
        w = (await platform.read("p_workspace_get", ws_id=m["workspace_id"]))[0]["w"]
        out.append(workspace_out(w, m["role"], m["person_id"]))
    return out


@router.get("/workspaces/{ws_id}", response_model=WorkspaceOut)
async def get_workspace(ctx: WorkspaceContext = Depends(any_status)) -> dict[str, Any]:
    return workspace_out(ctx.workspace, ctx.role.value, ctx.person_id)


@router.post("/workspaces/{ws_id}/reprovision", response_model=WorkspaceOut)
async def reprovision(tasks: BackgroundTasks, ctx: WorkspaceContext = Depends(any_status)) -> dict[str, Any]:
    """Rehydrate (FR / 03 §6.5): rebuild graphs from the sample, or blank. Admins only."""
    if not ctx.at_least(Role.admin):
        raise ApiError("FORBIDDEN", "Only admins can restore a workspace.")
    mode = "sample" if ctx.workspace["data_mode"] == "sample" else "blank"
    w = await workspaces.set_fields(ctx.platform, ctx.ws_id, status="provisioning")
    tasks.add_task(workspaces.provision, ctx.platform, ctx.ws_id, mode)
    return workspace_out(w, ctx.role.value, ctx.person_id)


@router.post("/workspaces/{ws_id}/sample-data", response_model=WorkspaceOut)
async def sample_data(tasks: BackgroundTasks, ctx: WorkspaceContext = Depends(any_status)) -> dict[str, Any]:
    """Reset the sample (03 §10.2) or retry a failed provisioning; same path as rehydrate."""
    return await reprovision(tasks, ctx)


@router.patch("/workspaces/{ws_id}/onboarding", response_model=WorkspaceOut)
async def onboarding(body: OnboardingPatch, ctx: WorkspaceContext = Depends(viewer)) -> dict[str, Any]:
    w = await workspaces.set_fields(
        ctx.platform, ctx.ws_id, onboarding_step=body.step, onboarding_done=body.step == "done"
    )
    return workspace_out(w, ctx.role.value, ctx.person_id)


@router.post("/workspaces/{ws_id}/link-person", status_code=204)
async def link_person(body: LinkPerson, ctx: WorkspaceContext = Depends(viewer)) -> None:
    if body.person_id is not None:
        rows = await ctx.org.read("entity_get", label="Person", id=body.person_id)
        if not rows or rows[0]["n"].get("status") != "active":
            raise ApiError("VALIDATION_ERROR", "Pick an active person.", [{"field": "person_id", "message": "Unknown"}])
    await ctx.platform.write("p_link_person", user_id=ctx.user.id, ws_id=ctx.ws_id, person_id=body.person_id)


@router.get("/workspaces/{ws_id}/members")
async def members(ctx: WorkspaceContext = Depends(admin)) -> list[dict[str, Any]]:
    return await ctx.platform.read("p_workspace_members", ws_id=ctx.ws_id)


@router.get("/workspaces/{ws_id}/clock", response_model=ClockOut)
async def get_clock(ctx: WorkspaceContext = Depends(viewer)) -> dict[str, Any]:
    return {"clock_mode": ctx.workspace["clock_mode"], "as_of": ctx.as_of}


@router.put("/workspaces/{ws_id}/clock", response_model=ClockOut)
async def set_clock(body: ClockIn, request: Request, ctx: WorkspaceContext = Depends(admin)) -> dict[str, Any]:
    if ctx.workspace["clock_mode"] != "simulated":
        raise ApiError("INVARIANT_VIOLATION", "Live workspaces always use today. Use what-if preview instead.")
    await workspaces.set_fields(ctx.platform, ctx.ws_id, as_of=body.as_of)
    await audit(
        ctx.org,
        actor_kind="user",
        actor_id=ctx.user.id,
        action="clock.changed",
        target_kind="Workspace",
        target_id=ctx.ws_id,
        diff={"from": ctx.as_of, "to": body.as_of},
        request_id=getattr(request.state, "request_id", None),
    )
    events.publish(ctx.ws_id, "clock.changed", {"as_of": body.as_of})
    await sentinel.run(ctx.ws_id, "clock")
    return {"clock_mode": "simulated", "as_of": body.as_of}


@router.get("/workspaces/{ws_id}/ai-settings", response_model=AiSettings)
async def get_ai(ctx: WorkspaceContext = Depends(viewer)) -> dict[str, Any]:
    return {"ai_mode": ctx.workspace["ai_mode"]}


@router.put("/workspaces/{ws_id}/ai-settings", response_model=AiSettings)
async def set_ai(body: AiSettings, ctx: WorkspaceContext = Depends(admin)) -> dict[str, Any]:
    await workspaces.set_fields(ctx.platform, ctx.ws_id, ai_mode=body.ai_mode)
    await audit(
        ctx.org,
        actor_kind="user",
        actor_id=ctx.user.id,
        action="ai_mode.changed",
        target_kind="Workspace",
        target_id=ctx.ws_id,
        diff={"ai_mode": body.ai_mode},
    )
    return {"ai_mode": body.ai_mode}


@router.post("/workspaces/{ws_id}/sentinel/run")
async def run_sentinel(ctx: WorkspaceContext = Depends(admin)) -> dict[str, Any]:
    result = await sentinel.run(ctx.ws_id, "manual")
    if result is None:
        raise ApiError("INVARIANT_VIOLATION", "Sentinel is already running.")
    return result


@router.get("/workspaces/{ws_id}/sentinel/runs")
async def sentinel_runs(ctx: WorkspaceContext = Depends(viewer)) -> list[dict[str, Any]]:
    return [r["r"] for r in await ctx.org.read("sentinel_runs", limit=20)]


@router.get("/workspaces/{ws_id}/notifications")
async def notifications(ctx: WorkspaceContext = Depends(viewer)) -> list[dict[str, Any]]:
    rows = await ctx.org.read("notifications_list", user_id=ctx.user.id, limit=50)
    return [
        {k: r["n"].get(k) for k in ("id", "kind", "title", "body", "ref_kind", "ref_id", "created_at", "read_at")}
        for r in rows
    ]


@router.post("/workspaces/{ws_id}/notifications/{ntf_id}/read", status_code=204)
async def read_notification(ntf_id: str, ctx: WorkspaceContext = Depends(viewer)) -> None:
    await ctx.org.write("notifications_read", user_id=ctx.user.id, id=ntf_id, now=now())


@router.post("/workspaces/{ws_id}/notifications/read-all", status_code=204)
async def read_all(ctx: WorkspaceContext = Depends(viewer)) -> None:
    await ctx.org.write("notifications_read", user_id=ctx.user.id, id=None, now=now())

import json
from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.auth.deps import WorkspaceContext, admin, viewer
from app.services import plugins, workspaces
from app.services.audit import audit

router = APIRouter()


class TestPluginRequest(BaseModel):
    plugin: str
    config: dict[str, Any]


@router.get("/workspaces/{ws_id}/integrations")
async def get_integrations(ctx: WorkspaceContext = Depends(viewer)) -> dict[str, Any]:
    return plugins.get_integrations(ctx.workspace)


@router.put("/workspaces/{ws_id}/integrations")
async def update_integrations(
    body: dict[str, Any], ctx: WorkspaceContext = Depends(admin)
) -> dict[str, Any]:
    current = plugins.get_integrations(ctx.workspace)
    # Merge updates
    updated = {**current}
    for k, v in body.items():
        if k in updated and isinstance(v, dict):
            updated[k] = {**updated[k], **v}
        else:
            updated[k] = v

    await workspaces.set_fields(
        ctx.platform, ctx.ws_id, integrations_json=json.dumps(updated)
    )
    await audit(
        ctx.org,
        actor_kind="user",
        actor_id=ctx.user.id,
        action="integrations.updated",
        target_kind="Workspace",
        target_id=ctx.ws_id,
        diff={"keys_updated": list(body.keys())},
    )
    return updated


@router.post("/workspaces/{ws_id}/integrations/test")
async def test_integration(
    body: TestPluginRequest, ctx: WorkspaceContext = Depends(admin)
) -> dict[str, Any]:
    return await plugins.send_test_ping(body.plugin, body.config, ctx.ws_id)

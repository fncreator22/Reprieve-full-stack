"""Dependency chain (03 §10.5): current_user → membership (404) → role → WorkspaceContext."""

import json
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from typing import Any

from cachetools import TTLCache
from fastapi import Depends, Header, Path, Query

from app.auth.clerk import Claims, verify
from app.config import get_settings
from app.errors import ApiError
from app.graph.client import get_db, graph_names, platform_graph
from app.graph.repo import Repo
from app.ids import is_id, new_id, now
from app.models.api import ROLE_RANK, Role


@dataclass
class CurrentUser:
    id: str
    clerk_user_id: str
    email: str
    name: str | None
    prefs: dict[str, Any]


@dataclass
class WorkspaceContext:
    ws_id: str
    workspace: dict[str, Any]
    role: Role
    person_id: str | None
    user: CurrentUser
    org: Repo
    mem: Repo
    platform: Repo
    as_of: int

    def at_least(self, role: Role) -> bool:
        return ROLE_RANK[self.role] >= ROLE_RANK[role]


_user_cache: TTLCache[str, CurrentUser] = TTLCache(maxsize=2048, ttl=300)


def platform_repo() -> Repo:
    return Repo(get_db(), platform_graph())


def workspace_as_of(w: dict[str, Any]) -> int:
    return int(w["as_of"]) if w.get("clock_mode") == "simulated" else now()


async def current_user(authorization: str | None = Header(default=None)) -> CurrentUser:
    s = get_settings()
    if not authorization and s.dev_auth and s.env_name == "local":
        claims = Claims("dev_local", "dev@localhost", True, "Local Dev")  # local-only bypass, never in other envs
    elif not authorization or not authorization.startswith("Bearer "):
        raise ApiError("UNAUTHENTICATED", "Sign in to continue.")
    else:
        claims = await verify(authorization.removeprefix("Bearer ").strip())
    if not claims.email_verified:
        raise ApiError("EMAIL_NOT_VERIFIED", "Verify your email to continue.")
    cached = _user_cache.get(claims.clerk_user_id)
    if cached and cached.email == claims.email:
        return cached
    row = (
        await platform_repo().write(
            "p_user_upsert",
            id=new_id("usr"),
            clerk_user_id=claims.clerk_user_id,
            email=claims.email,
            name=claims.name,
            now=now(),
        )
    )[0]
    user = CurrentUser(
        row["id"], claims.clerk_user_id, row["email"], row["name"], json.loads(row["prefs_json"] or "{}")
    )
    _user_cache[claims.clerk_user_id] = user
    return user


def forget_user(clerk_user_id: str) -> None:
    _user_cache.pop(clerk_user_id, None)


async def load_context(user: CurrentUser, ws_id: str, as_of: int | None = None) -> WorkspaceContext:
    if not is_id(ws_id, "ws"):
        raise ApiError("NOT_FOUND", "We can't find that workspace.")
    platform = platform_repo()
    rows = await platform.read("p_membership", user_id=user.id, ws_id=ws_id)
    if not rows:
        raise ApiError("NOT_FOUND", "We can't find that workspace.")
    w, role, person_id = rows[0]["w"], Role(rows[0]["role"]), rows[0]["person_id"]
    names = graph_names(ws_id)
    db = get_db()
    return WorkspaceContext(
        ws_id,
        w,
        role,
        person_id,
        user,
        Repo(db, names.org),
        Repo(db, names.mem),
        platform,
        as_of if as_of is not None else workspace_as_of(w),
    )


def require(min_role: Role, *, ready: bool = True) -> Callable[..., Awaitable[WorkspaceContext]]:
    async def dep(
        ws_id: str = Path(...),
        as_of: int | None = Query(default=None, ge=0),
        user: CurrentUser = Depends(current_user),
    ) -> WorkspaceContext:
        ctx = await load_context(user, ws_id, as_of)
        if ROLE_RANK[ctx.role] < ROLE_RANK[min_role]:
            raise ApiError("FORBIDDEN", f"This action needs the {min_role.value} role or higher.")
        if ready:
            status = ctx.workspace["status"]
            if status == "provisioning":
                raise ApiError("WORKSPACE_PROVISIONING", "This workspace is still being set up.")
            if status == "failed":
                raise ApiError("WORKSPACE_DATA_MISSING", "Setup failed. Re-provision this workspace.")
            if not await ctx.org.exists():
                raise ApiError("WORKSPACE_DATA_MISSING", "This workspace needs to be restored.")
        return ctx

    return dep


viewer = require(Role.viewer)
member = require(Role.member)
reviewer = require(Role.reviewer)
admin = require(Role.admin)
owner = require(Role.owner)
any_status = require(Role.viewer, ready=False)

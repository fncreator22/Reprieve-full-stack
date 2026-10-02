"""Clerk session JWT verification via cached JWKS (ADR-0003)."""

import time
from dataclasses import dataclass
from typing import Any

import httpx
import jwt

from app.config import get_settings
from app.errors import ApiError

_JWKS_TTL = 3600


@dataclass(frozen=True)
class Claims:
    clerk_user_id: str
    email: str
    email_verified: bool
    name: str | None


class JwksCache:
    def __init__(self) -> None:
        self.keys: dict[str, Any] = {}
        self.fetched_at = 0.0

    async def key(self, kid: str) -> Any:
        if kid not in self.keys or time.monotonic() - self.fetched_at > _JWKS_TTL:
            await self.refresh()
        if kid not in self.keys:
            raise ApiError("UNAUTHENTICATED", "Unknown signing key.")
        return self.keys[kid]

    async def refresh(self) -> None:
        url = get_settings().clerk_jwks_url
        if not url:
            raise ApiError("UNAUTHENTICATED", "Authentication is not configured.")
        async with httpx.AsyncClient(timeout=5) as client:
            data = (await client.get(url)).raise_for_status().json()
        self.keys = {k["kid"]: jwt.PyJWK(k).key for k in data["keys"]}
        self.fetched_at = time.monotonic()


jwks = JwksCache()


def _truthy(v: Any) -> bool:
    return v is True or (isinstance(v, str) and v.lower() == "true")


async def verify(token: str) -> Claims:
    try:
        kid = jwt.get_unverified_header(token).get("kid", "")
        key = await jwks.key(kid)
        s = get_settings()
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            issuer=s.clerk_issuer or None,
            options={"require": ["exp", "sub"], "verify_iss": bool(s.clerk_issuer)},
            leeway=5,
        )
    except ApiError:
        raise
    except jwt.PyJWTError as ex:
        raise ApiError("UNAUTHENTICATED", "Your session is invalid or expired.") from ex
    email = payload.get("email")
    if not email:
        raise ApiError("UNAUTHENTICATED", "Session token is missing the email claim.")
    return Claims(payload["sub"], email, _truthy(payload.get("email_verified")), payload.get("name") or None)

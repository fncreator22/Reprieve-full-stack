"""End-to-end API flow on the sample workspace (FLOW-01, 04, 05, 08, 09) plus tenancy (FR-AUTH-07)."""

import httpx
import pytest

from app.api.system import bootstrap as system_bootstrap
from app.graph import client as graph_client
from app.main import app
from tests.api_helpers import auth

A = auth("user_a", "a@example.com")
B = auth("user_b", "b@example.com")


@pytest.fixture
async def api(db):
    graph_client._db = None
    await system_bootstrap()
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://t/api/v1") as c:
        yield c
    await graph_client.close_db()


async def test_auth_required_and_unverified(api):
    assert (await api.get("/me")).json()["code"] == "UNAUTHENTICATED"
    r = await api.get("/me", headers=auth("u", verified=False))
    assert r.status_code == 403 and r.json()["code"] == "EMAIL_NOT_VERIFIED"


async def test_sample_flow(api):
    me = (await api.get("/me", headers=A)).json()
    assert me["memberships"] == []
    r = await api.post("/workspaces", headers=A, json={"name": "Acme", "slug": "acme-flow", "data_mode": "sample"})
    assert r.status_code == 201, r.text
    ws = r.json()["id"]
    w = (await api.get(f"/workspaces/{ws}", headers=A)).json()
    assert w["status"] == "ready" and w["clock_mode"] == "simulated" and w["as_of"] == 1792195200
    dup = await api.post("/workspaces", headers=A, json={"name": "X", "slug": "acme-flow", "data_mode": "blank"})
    assert dup.status_code == 422

    base = f"/workspaces/{ws}"
    top = (await api.get(f"{base}/risk/services", headers=A)).json()
    assert top[0]["band"] == "critical" and top[0]["service"]["id"] in {
        "svc_checkout_api",
        "svc_payments_gateway",
        "svc_mobile_api",
    }
    detail = (await api.get(f"{base}/risk/services/svc_checkout_api", headers=A)).json()
    assert detail["breakdown"]["contributions"] and detail["proof"]["edges"]
    summary = (await api.get(f"{base}/risk/summary", headers=A)).json()
    assert summary["open_alerts"]["critical"] >= 1 and summary["active_exceptions"] > 20

    alerts = (await api.get(f"{base}/alerts?limit=100", headers=A)).json()["items"]
    ghost = next(a for a in alerts if a["rule_id"] == "R2" and a["subject"]["id"] == "exc_ghost_vault_key")
    assert ghost["proof"]["nodes"] and ghost["subject"]["kind"] == "Exception"
    assert (await api.get(f"{base}/alerts?rule=R8", headers=A)).json()["items"][0]["rule_id"] == "R8"

    cands = (await api.get(f"{base}/alerts/{ghost['id']}/owner-candidates", headers=A)).json()
    assert cands[0]["person"]["id"] == "per_marcus_bell" and cands[0]["reason_code"] == "team_lead"

    rev = (await api.post(f"{base}/alerts/{ghost['id']}/propose-review", headers=A, json={})).json()
    assert rev["status"] == "pending" and rev["precedent"] == []
    bad = await api.post(
        f"{base}/reviews/{rev['id']}/decide",
        headers=A,
        json={"decision": "reassign", "note": "Marcus leads payments now"},
    )
    assert bad.status_code == 422
    ok = await api.post(
        f"{base}/reviews/{rev['id']}/decide",
        headers=A,
        json={"decision": "reassign", "note": "Marcus leads payments now", "new_owner_id": "per_marcus_bell"},
    )
    assert ok.status_code == 200, ok.text
    assert ok.json()["status"] == "decided" and ok.json()["effects"]
    again = await api.post(
        f"{base}/reviews/{rev['id']}/decide",
        headers=A,
        json={"decision": "revoke", "note": "second attempt should fail"},
    )
    assert again.json()["code"] == "INVARIANT_VIOLATION"
    exc = (await api.get(f"{base}/exceptions/exc_ghost_vault_key", headers=A)).json()
    assert exc["owner"]["id"] == "per_marcus_bell"

    # precedent: a later review on the same control recalls the outcome (FLOW-09)
    r7 = next(a for a in alerts if a["rule_id"] == "R7" and a["subject"]["id"] == "exc_ghost_vault_key")
    rev2 = (await api.post(f"{base}/alerts/{r7['id']}/propose-review", headers=A, json={})).json()
    assert rev2["precedent"] and rev2["precedent"][0]["decision"] == "reassign"

    # renew creates a deterministic successor and a RENEWS link
    r5 = next(a for a in alerts if a["rule_id"] == "R5")
    rev3 = (
        await api.post(f"{base}/alerts/{r5['id']}/propose-review", headers=A, json={"exception_id": "exc_tls_pin_4"})
    ).json()
    ren = await api.post(
        f"{base}/reviews/{rev3['id']}/decide",
        headers=A,
        json={"decision": "renew", "note": "Vendor fix lands in November", "new_expires_at": 1795000000},
    )
    assert ren.status_code == 200, ren.text
    old = (await api.get(f"{base}/exceptions/exc_tls_pin_4", headers=A)).json()
    assert old["status"] == "renewed" and len(old["renewal_chain"]) == 5 and old["renewal_chain"][0] == "exc_tls_pin_1"

    # exceptions list, filters, effective status
    expired = (await api.get(f"{base}/exceptions?effective_status=expired", headers=A)).json()["items"]
    assert [e["id"] for e in expired] == ["exc_gw_tls_legacy"]
    assert (await api.get(f"{base}/exceptions?q=hsm", headers=A)).json()["items"][0]["id"] == "exc_vault_hsm_pin"

    # graph explorer, search, generic proof path
    g = (await api.get(f"{base}/graph", headers=A)).json()
    assert g["nodes"] and g["edges"] and not g["truncated"]
    focus = (await api.get(f"{base}/graph?focus=svc_checkout_api&depth=1", headers=A)).json()
    assert any(n["id"] == "svc_payments_gateway" for n in focus["nodes"])
    assert (await api.get(f"{base}/search?q=vault", headers=A)).json()
    pp = (await api.get(f"{base}/graph/proof-path?from=cp_checkout&to=exc_vault_hsm_pin", headers=A)).json()
    assert pp["nodes"][0]["id"] == "cp_checkout" and pp["nodes"][-1]["id"] == "exc_vault_hsm_pin"

    # clock: advancing reruns detection (FLOW-08)
    c = await api.put(f"{base}/clock", headers=A, json={"as_of": 1792195200 + 12 * 86400})
    assert c.status_code == 200
    after = (await api.get(f"{base}/alerts?rule=R1&limit=100", headers=A)).json()["items"]
    assert any(a["subject"]["id"] == "exc_etl_pii_columns" for a in after)

    # memory: outcomes, precedent, handoffs (new high alerts handed to Steward; closed when a review opens)
    outs = (await api.get(f"{base}/memory/outcomes", headers=A)).json()
    assert {o["decision"] for o in outs} >= {"reassign", "renew"}
    prec = (await api.get(f"{base}/memory/precedent?control_id=ctl_key_rotation", headers=A)).json()
    assert prec and prec[0]["decision"] == "reassign"
    hands = (await api.get(f"{base}/memory/handoffs", headers=A)).json()
    by_alert = {h["payload_id"]: h for h in hands}
    assert by_alert[ghost["id"]]["status"] == "done" and by_alert[ghost["id"]]["kind"] == "owner_unresolved"
    assert any(h["status"] == "open" for h in hands)
    # registry + people + this-is-me
    team = (await api.get(f"{base}/teams/team_payments", headers=A)).json()
    assert team["label"] == "Team" and any(e["type"] == "OWNS" for e in team["edges"])
    assert len((await api.get(f"{base}/people", headers=A)).json()) == 40
    assert (await api.post(f"{base}/link-person", headers=A, json={"person_id": "per_priya_raman"})).status_code == 422
    assert (await api.post(f"{base}/link-person", headers=A, json={"person_id": "per_marcus_bell"})).status_code == 204
    mine = (await api.get(f"{base}/reviews?assigned_to_me=true&status=pending", headers=A)).json()["items"]
    assert any(r["id"] == rev2["id"] for r in mine)
    notes = (await api.get(f"{base}/notifications", headers=A)).json()
    assert any(n["kind"] == "review_assigned" for n in notes)

    # tenancy: B cannot see A's workspace on any route (404, no existence leak)
    for path in [
        "",
        "/risk/services",
        "/alerts",
        f"/alerts/{ghost['id']}",
        "/exceptions",
        "/graph",
        "/people",
        f"/reviews/{rev['id']}",
        "/clock",
        "/notifications",
    ]:
        r = await api.get(f"{base}{path}", headers=B)
        assert r.status_code == 404 and r.json()["code"] == "NOT_FOUND", path
    assert (await api.get("/workspaces/ws_notavalidid!", headers=A)).status_code == 404


async def test_email_from_clerk_backend_api_when_claim_missing(api, monkeypatch):
    """Tokens without custom claims: the API looks the user up via Clerk's Backend API (respx-mocked)."""
    import time

    import jwt as pyjwt
    import respx

    from app.auth import clerk
    from app.config import get_settings
    from tests.api_helpers import _KEY

    monkeypatch.setattr(get_settings(), "clerk_secret_key", "sk_test_x")
    now = int(time.time())
    tok = pyjwt.encode({"sub": "user_noclaim", "exp": now + 600}, _KEY, algorithm="RS256", headers={"kid": "test"})
    user = {
        "primary_email_address_id": "idn_1",
        "first_name": "Ana",
        "last_name": "Lee",
        "email_addresses": [
            {"id": "idn_1", "email_address": "ana@example.com", "verification": {"status": "verified"}}
        ],
    }
    with respx.mock(assert_all_called=True) as mock:
        mock.get(f"{clerk.CLERK_API}/users/user_noclaim").respond(200, json=user)
        me = (await api.get("/me", headers={"Authorization": f"Bearer {tok}"})).json()
    assert me["user"]["email"] == "ana@example.com" and me["user"]["name"] == "Ana Lee"


async def test_dev_auth_only_local(api, monkeypatch):
    from app.config import get_settings

    s = get_settings()
    monkeypatch.setattr(s, "dev_auth", True)
    assert (await api.get("/me")).json()["user"]["email"] == "dev@localhost"
    monkeypatch.setattr(s, "env_name", "production")
    assert (await api.get("/me")).status_code == 401

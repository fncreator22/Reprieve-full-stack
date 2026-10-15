"""Post-deploy smoke test suite.

Validates the running Reprieve API health probes and critical traversal paths:
- Shallow health check (`GET /health`).
- Deep graph database connectivity check (`GET /internal/health/deep`).
- Sample workspace automated provisioning & state convergence under 60 seconds.
- Risk service ranking and top critical failure verification.
- Rule R2 (Ghost Owner) detection and shortest proof path graph structure.
- Precedent and candidate owner resolution.

Environment variables:
- `API_URL`: Base URL of the API server (default: `http://localhost:8000`).
- `INTERNAL_TICK_SECRET`: Secret header for internal deep health checks.
- `SMOKE_TOKEN`: Optional Clerk session JWT for full end-to-end workspace walk.
"""

import os
import sys
import time
import uuid

import httpx

API = os.getenv("API_URL", "http://localhost:8000").rstrip("/")


def check(ok: bool, what: str) -> None:
    print(("PASS " if ok else "FAIL ") + what)
    if not ok:
        sys.exit(1)


with httpx.Client(timeout=90) as c:
    check(c.get(f"{API}/health").json().get("status") == "ok", "health")
    secret = os.getenv("INTERNAL_TICK_SECRET")
    if secret:
        check(c.get(f"{API}/internal/health/deep", headers={"X-Internal-Secret": secret}).status_code == 200, "deep health")
    token = os.getenv("SMOKE_TOKEN")
    if token:
        h = {"Authorization": f"Bearer {token}"}
        slug = f"smoke-{uuid.uuid4().hex[:8]}"
        ws = c.post(f"{API}/api/v1/workspaces", headers=h, json={"name": "Smoke", "slug": slug, "data_mode": "sample"})
        check(ws.status_code == 201, "create sample workspace")
        base = f"{API}/api/v1/workspaces/{ws.json()['id']}"
        for _ in range(60):
            if c.get(base, headers=h).json()["status"] in ("ready", "failed"):
                break
            time.sleep(1)
        check(c.get(base, headers=h).json()["status"] == "ready", "provisioned under 60 s")
        top = c.get(f"{base}/risk/services", headers=h).json()
        check(top[0]["band"] == "critical", f"top risk service is critical ({top[0]['service']['label']})")
        alerts = c.get(f"{base}/alerts?rule=R2", headers=h).json()["items"]
        check(bool(alerts) and bool(alerts[0]["proof"]["edges"]), "ghost-owner alert has a proof path")
        cands = c.get(f"{base}/alerts/{alerts[0]['id']}/owner-candidates", headers=h).json()
        check(bool(cands), f"owner resolution ({cands[0]['person']['label'] if cands else 'none'})")
print("smoke ok")

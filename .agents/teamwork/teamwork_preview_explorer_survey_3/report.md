# Testing Infrastructure & E2E Validation Survey Report

**Explorer**: Explorer 3 (Testing Infrastructure & E2E Validation)  
**Assigned Directory**: `.agents/teamwork/teamwork_preview_explorer_survey_3/`  
**Date**: October 9, 2026  
**Context**: Original User Request (Company Brain with FalkorDB, FastAPI, Next.js, Avalanche Centrality, Temporal Collision, Grounded Conversational Intelligence, and <100ms Latency)

---

## 1. Executive Summary

The existing repository (product name: **Reprieve**) contains a well-structured, production-grade test and evaluation harness for the backend, built around **pytest**, **pytest-asyncio**, **respx**, and a live containerized **FalkorDB** graph database. The architecture enforces strict architectural boundaries: the LLM never generates Cypher; queries are named, parameterized `.cypher` files; the detection engine executes deterministically without LLMs; and all conversational responses pass through a strict regex-backed groundedness validator (`app/agents/guard.py`).

However, the frontend currently has **zero automated test runners** configured in `package.json` (no Vitest, Jest, or Playwright configuration), relying exclusively on `tsc --noEmit` and `eslint`. Furthermore, while the current backend has evaluation for existing detection rules (R1–R8) and graph algorithms (PageRank, Betweenness, WCC), it **does not yet implement or test**:
1. **Avalanche Centrality & Cascading Failure Propagation** (mathematical multi-hop reachability and failure probability).
2. **Temporal Expiry Collision Dynamics** (calendar-window convergence modeling for simultaneous expirations across dependent services).
3. **Performance regression test harness explicitly enforcing <100ms latency** on predictive graph queries.
4. **Dual-pane interactive frontend-backend E2E testing** (verifying temporal slider stepping, dynamic canvas heatmap updates, pulse animations, proof cards, and grounded conversational sidebar).

This report documents the current testing architecture and provides a comprehensive, actionable specification for testing infrastructure, automated pytest suites, performance benchmarking, grounded conversational validation, and a 4-Tier E2E validation plan.

---

## 2. Current Testing & Verification Infrastructure Audit

### 2.1 Backend Test Framework & Configuration

The backend is configured with modern Python 3.12 tooling managed by `uv`:

- **Test Runner**: `pytest` (>=9.1.1) with `pytest-asyncio` (>=1.4.0)
- **Mocking**: `respx` (>=0.23.1) for HTTP request interception (used for Clerk Auth API mocks)
- **Linter & Type Checker**: `ruff` (>=0.16.10), `mypy` (>=2.4.0)
- **Configuration** (`backend/pyproject.toml`):
  ```toml
  [tool.pytest.ini_options]
  asyncio_mode = "auto"
  asyncio_default_fixture_loop_scope = "function"
  testpaths = ["tests"]
  ```

### 2.2 Test Execution Scripts & Workflows

Test workflows are defined across multiple configuration files:
- **`Makefile`**:
  - `make test`: Executes `cd backend && uv run pytest -q` (runs unit, graph, contract, and tenancy tests against FalkorDB).
  - `make lint`: Executes `cd backend && uv run ruff check . && uv run mypy`.
  - `make eval`: Executes `cd backend && uv run python ../eval/run_eval.py` (evaluates recall on planted scenarios, false positives on control services, calibration, owner resolution, and query latency; outputs `eval/report.md`).
  - `make smoke`: Executes `cd backend && uv run python ../scripts/smoke.py` (black-box post-deploy smoke test verifying health, workspace provisioning, top risk, ghost-owner alert, and owner resolution).
  - `make reset`: Executes `cd backend && uv run python ../scripts/reset_graphs.py` (drops all `dev_*` graphs).

### 2.3 Existing Test Inventory

The backend test suite (`backend/tests/`) contains 6 core test modules:

| Test File | Focus & Scope | Execution Mode | Key Assertions / Invariants |
| :--- | :--- | :--- | :--- |
| `tests/test_graph_base.py` | Schema & Client validation | Pure Unit + Graph | Slug validation (`graph_names`), idempotent schema bootstrap (`ensure_schema`), unique property constraint enforcement, mandatory property constraints. |
| `tests/test_seed_load.py` | Seed Ingestion Performance & Invariants | Live Graph | Ingests `data/seed/northwind.json` under 30s; verifies exact counts: 8 Teams, 40 People, 25 Services, 60 Exceptions, 60 WAIVES, 60 OWNED_BY, 3 RENEWS. Asserts idempotency on reload. |
| `tests/test_detection_seed.py` | Detection Rules (R1–R8) & Scoring | Live Graph | Evaluates `run_rules` against `data/ground_truth.json`: asserts 100% recall on 5 planted scenarios (S1–S5), 0 false positives on control services, critical band for critical services, low band for controls, proof edges present, and exact determinism across duplicate runs. |
| `tests/test_api_flow.py` | Full Workspace API lifecycle & Tenancy | Live Graph + ASGI | Flow from workspace creation (`data_mode: sample`), risk ranking, ghost owner alerts, review proposals, human review decisions, renewal successor chains, graph search, proof-path retrieval, clock advance (`as_of`), memory outcomes, and strict tenancy isolation (User B receives 404 with 0 existence leaks on User A's workspace). |
| `tests/test_steward.py` | Conversational Agent & Grounding | Live Graph + Mock LLM | Tests `ground()` function (drops unknown entity IDs), SSE event streaming (`run.started`, `tool.call`, `tool.result`, `done`, `final`), citation extraction, quick answers, human-in-the-loop action approval gate, and fallback when AI is disabled. |
| `tests/test_ingest.py` | Ingestion, Resolution & Injection Defense | Live Graph + Mock LLM | Tests prompt injection heuristic defense (`hostile_thread.txt`), deterministic fuzzy resolution of people/services/controls, staging of draft exceptions, and human approval barrier before activation. |

### 2.4 Frontend Test Infrastructure Audit

The frontend (`frontend/package.json`) uses Next.js 16.3.8, React 19.2.8, Tailwind CSS v4, Motion, GSAP, and TanStack React Query:
- **Scripts present**: `"dev"`, `"build"`, `"start"`, `"lint"`, `"typecheck"`.
- **Current Deficit**: **No test framework is installed or configured** in `frontend/package.json`. There are no Vitest, Jest, Cypress, or Playwright configurations, packages, or test files in the frontend directory.
- **Documentation Alignment**: `CLAUDE.md` line 20 and `docs/06-implementation-plan.md` explicitly reference Playwright (`playwright-cli`, `webapp-testing`) and Vitest with React Testing Library as the intended quality gates.

---

## 3. FalkorDB Test Execution & Mocking Architecture

### 3.1 Live Database Testing Model

FalkorDB is **not mocked in-memory** using mock clients or in-process stubs for graph queries. Instead, tests run against a real FalkorDB server instance:
- **Image**: `falkordb/falkordb:v4.22.0` (pinned in `docker-compose.yml`).
- **Connection**: `falkordb.asyncio.FalkorDB(host=..., port=...)` connecting to `localhost:6379` or `FALKORDB_HOST`/`FALKORDB_PORT`.
- **Test Isolation**: 
  - Dynamic graph name allocation: Each test function receives a unique graph name formatted as `test_{request.node.name[:40]}` (via `Repo(db, f"test_{request.node.name[:40]}")` in `conftest.py`).
  - Graph prefixing: `os.environ.setdefault("GRAPH_PREFIX", "test_")`.
  - Teardown: In `backend/tests/conftest.py`, the `db` fixture iterates `await d.list_graphs()` and deletes every graph starting with `test_`:
    ```python
    @pytest.fixture
    async def db():
        from app.auth import deps
        deps._user_cache.clear()
        d = FalkorDB(host=os.getenv("FALKORDB_HOST", "localhost"), port=int(os.getenv("FALKORDB_PORT", "6379")))
        yield d
        for name in await d.list_graphs():
            if name.startswith("test_"):
                await d.select_graph(name).delete()
        await d.aclose()
    ```

### 3.2 Seeded Graph Fixtures

For tests requiring full graph state (detection, API flow, agent tests):
- `@pytest.fixture async def seeded(repo)` calls `ensure_schema(repo, ORG)` and `load_bundle(repo, read_bundle(), source="sample")`.
- Ingestion executes deterministically from `data/seed/northwind.json`.
- For API tests, `tests/test_api_flow.py` provisions a workspace with `"data_mode": "sample"`, which invokes `system_bootstrap()` and the internal loader.

### 3.3 LLM & External Services Mocking

In adherence to hard rule #2 ("detection/ never imports agents/ and never calls an LLM"):
- **LLM Calls**: MOCKED in all tests. Tests monkeypatch `app.agents.llm.stream_chat` and `app.agents.llm.complete_json` with deterministic script queues or generators (`fake(ws_id, ai_mode, messages, tools)`), returning typed `LLMEvent` objects.
- **Clerk Authentication**: MOCKED using `respx.mock` to simulate Clerk Backend API endpoints (`/users/{id}`) or by generating valid test JWTs with RS256 test key pairs (`tests/api_helpers.py`).

### 3.4 FalkorDB Cypher Subset Constraints (from `docs/spike-notes.md`)

When designing test assertions and predictive queries, the following FalkorDB behavior must be strictly respected:
1. `algo.betweenness({nodeLabels:['Service'], relationshipTypes:['DEPENDS_ON']}) YIELD node, score` returns raw, unnormalized scores.
2. `algo.pageRank('Service', 'DEPENDS_ON') YIELD node, score` requires positional label and relationship arguments.
3. `algo.SPpaths({sourceNode:a, targetNode:b, relTypes:['DEPENDS_ON'], relDirection:'both', pathCount:1, maxLen:6}) YIELD path` works without `weightProp`.
4. `shortestPath()` inside `MATCH` is **unsupported** by FalkorDB; undirected `shortestPath` is unsupported.
5. Path alias filtering like `RETURN [n IN nodes(p)|n.id] ... ORDER BY length(p)` errors unless aliased in a prior `WITH` clause: `WITH p, length(p) AS l ORDER BY l LIMIT 1 RETURN ...`.
6. Batch writes must not exceed 500 rows per `UNWIND`.

---

## 4. Test Data Fixtures & Seed Data Analysis

### 4.1 Existing Northwind Pay Dataset

Generated via `scripts/generate_seed.py` into `data/seed/northwind.json`:
- **Temporal Baseline**: `AS_OF = 1792195200` (17 October 2026 00:00 UTC).
- **Topology**:
  - 8 Teams, 40 People, 25 Services, 12 Controls, 4 Customer Paths, 6 Runbooks.
  - 60 Exceptions (active, expiring, expired, renewed, revoked, closed, draft).
- **Existing Planted Scenarios (`data/ground_truth.json`)**:
  - **S1 (Checkout Collision)**: `svc_checkout_api` affected by 4 exceptions across its dependencies (`svc_payments_gateway`, `svc_fraud_scoring`, `svc_card_vault`), triggering rule R4 and customer path rule R8 (`cp_checkout`).
  - **S2 (Ghost Owner)**: `exc_ghost_vault_key` owned by departed Priya Raman; `exc_ledger_batch_export` owned by moved Dmitri Volkov.
  - **S3 (Single Fallback)**: SRE Sam Okafor is the sole reliance for 3 compensating controls (`cc_fraud_spot_check`, `cc_refund_manual_review`, `cc_vault_log_review`).
  - **S4 (Renewal Treadmill)**: `exc_tls_pin_4` in a 4-generation renewal chain.
  - **S5 (Quiet Expiry Week)**: 4 exceptions expiring within 6 days in `team_data` (`exc_etl_pii_columns`, `exc_etl_change_freeze`, `exc_reporting_budget`, `exc_features_tests`).
  - **Control Services**: 3 healthy services (`svc_status_page`, `svc_docs_portal`, `svc_email_relay`) that must remain in the "low" risk band with 0 alerts.

### 4.2 Gaps & Seed Enhancements Required for R1 & R2

To satisfy the requirements in `ORIGINAL_REQUEST.md`:
1. **Planted Cascading Failure Paths (Avalanche Centrality)**:
   - Need clear multi-hop dependency chains where single points of failure propagate to critical customer paths:
     - Root critical services: `svc_secrets_manager` and `svc_card_vault`.
     - Dependency path: `svc_secrets_manager` $\rightarrow$ `svc_auth` & `svc_card_vault` $\rightarrow$ `svc_payments_gateway` & `svc_mobile_api` $\rightarrow$ `svc_checkout_api` $\rightarrow$ `cp_checkout` and `cp_mobile_pay`.
     - Revocation/compromise of `svc_secrets_manager` or `svc_card_vault` must yield maximal Avalanche Centrality, with reachability covering $\ge 5$ tier-1/tier-2 services.
2. **Planted Future Expiry Clusters (Temporal Collision Dynamics)**:
   - Current seed has an expiry cluster only at $+11$d to $+16$d (S5).
   - We must plant additional future collision clusters aligned with standard projection slider horizons:
     - **+7 Day Window** ($[+0\text{d}, +7\text{d}]$): Immediate convergence on `svc_checkout_api` and `svc_payments_gateway` (`exc_chk_3ds_bypass` at +3d, `exc_gw_tls_legacy` expired at -2d).
     - **+30 Day Window** ($[+25\text{d}, +35\text{d}]$): Convergence of `exc_ghost_vault_key` (+30d) and `exc_ledger_batch_export` (+25d), compounding on `svc_card_vault` and `svc_reconciliation`.
     - **+90 Day Window** ($[+40\text{d}, +60\text{d}]$): Massive multi-service expiry convergence: `exc_gw_rate_limit` (+45d), `exc_fraud_model_skip` (+40d), `exc_vault_hsm_pin` (+50d), and `exc_tls_pin_4` (+60d), simultaneously destabilizing Payment Gateway, Fraud Scoring, and Card Vault.

---

## 5. Proposed Testing Strategy & Technical Specifications

### 5.1 Automated Pytest Suite for Predictive Queries & Mathematical Functions

We propose creating a dedicated test module: `backend/tests/test_predictions.py`.

#### A. Mathematical Scoring Unit Tests (Pure Python)
Test without database dependencies to guarantee mathematical rigor:
1. **Avalanche Centrality Calculation**:
   - Given a directed acyclic dependency subgraph $G=(V, E)$ where edges represent dependencies ($u \text{ depends on } v$):
   - Avalanche Score $A(v) = \sum_{u \in \text{Downstream}(v)} \text{TierWeight}(u) \cdot \prod_{e \in \text{path}(v, u)} (1 - R(e))$, where $R(e)$ is redundancy/resilience.
   - Assert: Upstream bottleneck nodes (`svc_secrets_manager`, `svc_k8s_platform`) have significantly higher Avalanche scores than leaf services (`svc_docs_portal`).
   - Assert: Monotonicity — adding dependent downstream services strictly increases Avalanche Centrality.
2. **Temporal Collision Dynamics Scoring**:
   - Input: List of exceptions with $(expires\_at, service\_id, severity)$.
   - Function: Aggregates expiries into sliding calendar windows (7d, 30d, 90d).
   - Collision Index $C(w) = N_{\text{exp}}(w) \times \sum_{e \in w} \text{Severity}(e) \times \text{DensityFactor}(w)$.
   - Assert: Planted clusters at +7d, +30d, and +90d produce distinct collision peaks.
3. **Determinism Test**:
   - Execute scoring 100 times with randomized input ordering; assert float results are bit-exact identical.

#### B. Predictive Cypher Queries Integration Tests
Test against live isolated FalkorDB graph (`seeded` fixture):
1. **Query `predict_avalanche_cascades.cypher`**:
   - Traverses inverse `DEPENDS_ON` relationships up to 4 hops.
   - Returns reachable downstream service IDs, affected customer paths, and propagation probability.
   - Verifies that querying with `source_service: 'svc_secrets_manager'` returns `svc_checkout_api`, `svc_payments_gateway`, `svc_auth`, and `svc_mobile_api`.
2. **Query `predict_temporal_collisions.cypher`**:
   - Filters active/expiring exceptions within `$horizon_start` and `$horizon_end`.
   - Groups by `target_service` and `target_team`.
   - Returns cluster count, total severity, and multi-service overlap flags.
   - Verifies that S5 (team_data cluster at +11d to +16d) and the +90d cluster are identified with correct counts.

```python
# Specification snippet for backend/tests/test_predictions.py
async def test_avalanche_centrality_top_bottlenecks(seeded):
    repo = seeded
    results = await repo.read("predict_avalanche_cascades", max_hops=4)
    ranked = sorted(results, key=lambda r: -r["avalanche_score"])
    top_ids = [r["service_id"] for r in ranked[:3]]
    assert "svc_secrets_manager" in top_ids or "svc_card_vault" in top_ids
    assert all(r["downstream_count"] >= 1 for r in ranked if r["avalanche_score"] > 0)

async def test_temporal_collision_projections(seeded):
    repo = seeded
    as_of = 1792195200
    # +30d projection
    c30 = await repo.read("predict_temporal_collisions", as_of=as_of, horizon_days=30)
    assert any(c["cluster_name"] == "Quiet Expiry Week" or c["team_id"] == "team_data" for c in c30)
```

---

### 5.2 Performance Test Harness (<100ms Latency Verification)

The requirement states: **"All graph traversals for predictions must execute deterministically in under 100ms on the seeded graph."**

We specify a dedicated benchmark harness integrated into `eval/run_eval.py` and callable via `pytest -m benchmark`:

```python
# Proposed benchmark harness in backend/tests/test_performance_harness.py
import time
import statistics
import pytest

PREDICTIVE_QUERIES = [
    ("predict_avalanche_cascades", {"max_hops": 4}),
    ("predict_temporal_collisions", {"as_of": 1792195200, "horizon_days": 30}),
    ("predict_temporal_collisions", {"as_of": 1792195200, "horizon_days": 90}),
    ("predict_blast_radius", {"service_id": "svc_secrets_manager", "max_hops": 4}),
]

@pytest.mark.benchmark
async def test_predictive_queries_latency_under_100ms(seeded):
    repo = seeded
    warmup_runs = 5
    sample_runs = 30
    latencies = {}

    for query_name, params in PREDICTIVE_QUERIES:
        # Warmup
        for _ in range(warmup_runs):
            await repo.read(query_name, **params)
        
        # Benchmark
        samples = []
        for _ in range(sample_runs):
            t0 = time.monotonic()
            res = await repo.read(query_name, **params)
            samples.append((time.monotonic() - t0) * 1000.0)
            assert res is not None

        p95 = statistics.quantiles(samples, n=20)[18]  # 95th percentile
        p50 = statistics.median(samples)
        max_lat = max(samples)
        latencies[query_name] = {"p50": p50, "p95": p95, "max": max_lat}

        assert p95 < 100.0, f"Query {query_name} p95 latency {p95:.2f}ms exceeded 100ms limit! (max: {max_lat:.2f}ms)"

    print("\n--- Predictive Queries Latency (ms) ---")
    for q, stats in latencies.items():
        print(f"{q}: p50={stats['p50']:.1f}ms, p95={stats['p95']:.1f}ms, max={stats['max']:.1f}ms")
```

#### Evaluation Integration (`eval/run_eval.py` update):
Add the predictive query p95 benchmarks to the table in `eval/report.md`:
- `| Predictive Avalanche Traversal p95 | xx.x ms | < 100 ms |`
- `| Predictive Temporal Collision p95 | xx.x ms | < 100 ms |`
- If any predictive query exceeds 100ms, the eval fails with exit code 1.

---

### 5.3 Grounded Conversational Test Suite

Requirements state:
- All conversational responses cite valid, existing node IDs from FalkorDB (`Exception`, `Service`, `Person`, `Team`, `Control`).
- The agent explicitly refuses or flags data absence when asked about unmodeled entities or speculative facts not present in the graph.

We specify a dedicated test suite in `backend/tests/test_conversational_grounding.py`:

```python
# Specification for test_conversational_grounding.py
import pytest
from app.agents.guard import ground
from app.agents import tools, llm

# Test Suite 1: Pure Grounding Engine Invariants
def test_grounding_rejects_hallucinated_ids():
    known = {"svc_checkout_api": "Checkout API", "per_marcus_bell": "Marcus Bell"}
    
    # Text with both valid and hallucinated IDs
    raw_md = (
        "Checkout is handled by `svc_checkout_api` and lead `per_marcus_bell`. "
        "However, crypto module `svc_quantum_vault` and manager `per_satoshi_nakamoto` are also failing."
    )
    clean, citations, removed_count = ground(raw_md, known)
    
    assert removed_count == 1  # The hallucinated sentence is pruned
    assert "svc_quantum_vault" not in clean
    assert "per_satoshi_nakamoto" not in clean
    assert "svc_checkout_api" in clean
    assert len(citations) == 2
    assert {c["id"] for c in citations} == {"svc_checkout_api", "per_marcus_bell"}

# Test Suite 2: Negative & Adversarial Intent Grounding
@pytest.mark.parametrize("query,expected_refusal_substring", [
    ("What is the risk score for svc_nonexistent_crypto_service?", "not found in the graph"),
    ("Who approved the AWS S3 public bucket waiver?", "no recorded exception"),
    ("Predict the failure if per_unknown_admin is fired tomorrow.", "not an active entity"),
])
async def test_steward_refusal_on_unmodeled_entities(ws_client, query, expected_refusal_substring):
    # Sends query to /chat/sessions/{id}/messages
    # Asserts that assistant response does NOT cite unmodeled IDs
    # Asserts that refusal or data absence disclaimer is present
    ...

# Test Suite 3: Grounded Predictive Conversational Query
async def test_steward_grounded_avalanche_explanation(ws_client, monkeypatch):
    # Simulates query: "What happens if secrets_manager fails?"
    # Steward must execute predict_avalanche_cascades tool
    # Assistant answer citations must strictly match tool returned nodes
    # Must cite valid downstream nodes: svc_auth, svc_card_vault, svc_payments_gateway
    ...
```

---

### 5.4 End-to-End Integration Tests (Next.js Frontend & FastAPI Backend)

To test the integration between Next.js and FastAPI, we specify an E2E testing architecture using **Playwright** with the FastAPI backend running in test mode.

#### A. Playwright Configuration Setup
In `frontend/playwright.config.ts`:
- WebServer 1: Backend on port 8000 (`cd ../backend && uv run uvicorn app.main:app --port 8000`).
- WebServer 2: Frontend on port 3000 (`pnpm dev --port 3000`).
- Base URL: `http://localhost:3000`.
- Environment: `NEXT_PUBLIC_API_URL=http://localhost:8000`, `DEV_AUTH=true`.

#### B. Key E2E Integration Scenarios (`frontend/e2e/dual_pane_simulation.spec.ts`):
1. **Dual-Pane Layout Synchronization**:
   - Load `/w/sample-ws/graph`.
   - Verify sidebar contains Steward chat pane and main canvas contains force-directed graph.
2. **Interactive Temporal Slider & Visual Reactivity**:
   - Step temporal slider to **+7d**, **+30d**, and **+90d**.
   - Assert API call to `/api/v1/workspaces/{ws}/predictions/temporal?horizon=30` returns 200.
   - Assert force-directed canvas nodes dynamically update:
     - Nodes in the collision cluster (`team_data` or `svc_payments_gateway`) receive high-risk color tokens (Amber/Red).
     - Border and connection pulse animations trigger on avalanche pathways.
3. **Interactive Proof Card Verification**:
   - Click on high-risk node `svc_checkout_api` or collision node in the canvas.
   - Verify Proof Card modal/drawer opens displaying:
     - Mathematical risk score breakdown (raw, multiplier, final).
     - Contributing upstream exceptions with links.
     - Multi-hop dependency path with ordered edge types (`DEPENDS_ON`, `WAIVES`).
4. **Conversational SSE Stream Rendering**:
   - Send message in chat sidebar: "Show avalanche risk for secrets_manager".
   - Verify SSE stream events (`run.started`, `tool.call`, `token`, `final`) render seamlessly without React hydration errors or markdown layout shift.
   - Verify citations rendered as interactive chips linking to graph focus nodes.

---

## 6. Comprehensive 4-Tier E2E Test Plan

To provide exhaustive quality coverage without brittle tests, we define a 4-Tier validation hierarchy:

```
+---------------------------------------------------------------+
|         Tier 4: Real-World Enterprise User Scenarios          |
|    (Freeze planning, avalanche drill, auditor compliance)     |
+---------------------------------------------------------------+
|            Tier 3: Pairwise & Cross-Feature Integration       |
|    (Slider + Chat, Multi-Tenancy isolation, Write invalidation)|
+---------------------------------------------------------------+
|             Tier 2: Boundary & Edge Condition Tests           |
| (Empty graphs, single-node, cycles, extreme dates, rate limits)|
+---------------------------------------------------------------+
|             Tier 1: Feature Functionality Unit/API Tests      |
|    (Avalanche Cypher, Collision math, Slider, SSE, Proofs)    |
+---------------------------------------------------------------+
```

---

### Tier 1: Feature Functionality Tests

Verify each new capability in isolation:

| Test ID | Area | Target | Verification Method | Pass Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **T1.1** | Mathematical Engine | Avalanche Centrality scoring | `pytest backend/tests/test_predictions.py -k test_avalanche_math` | Formula evaluates accurately; upstream bottlenecks score higher than leaf nodes. |
| **T1.2** | Mathematical Engine | Temporal Expiry Collision bucketing | `pytest backend/tests/test_predictions.py -k test_collision_math` | Groups expirations into 7d, 30d, 90d buckets; density factors calculated correctly. |
| **T1.3** | Graph Database | Predictive Cypher query execution | `pytest backend/tests/test_predictions.py -k test_predictive_cypher` | Named queries execute via `repo.read`; return structured rows in $<100$ms. |
| **T1.4** | Backend API | Prediction endpoints payload format | `pytest backend/tests/test_api_flow.py -k test_prediction_endpoints` | `GET /risk/predictions/avalanche` and `GET /risk/predictions/temporal` return HTTP 200 with schema-valid payloads. |
| **T1.5** | Conversational Agent | Grounded citation validation | `pytest backend/tests/test_steward.py -k test_ground_removes_unknown_ids` | Valid IDs preserved in `citations`; unverified IDs pruned from text. |
| **T1.6** | Frontend Component | Temporal Slider component state | Vitest component test | Dragging/clicking slider updates internal step value (+0d, +7d, +30d, +90d). |
| **T1.7** | Frontend Canvas | Force-directed node styling | Playwright DOM / canvas check | Nodes render with designated color palette matching risk band tokens. |

---

### Tier 2: Boundary & Edge Condition Tests

Stress-test the system under adverse and extreme inputs:

| Test ID | Area | Scenario | Input Condition | Expected Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **T2.1** | Graph Engine | Empty / Blank Workspace | Graph contains 0 services and 0 exceptions (`data_mode: blank`). | Avalanche Centrality returns empty list `[]`; Temporal Collision returns empty clusters; 0 crashes. |
| **T2.2** | Mathematical Engine | Cyclic Service Dependencies | Services A $\rightarrow$ B $\rightarrow$ C $\rightarrow$ A (dependency cycle). | Graph traversal algorithm terminates via visited-set cycle breaking; no infinite loops or timeouts. |
| **T2.3** | Mathematical Engine | Zero-Collision Time Window | Time window where no exceptions expire (e.g. $[+180\text{d}, +210\text{d}]$). | Returns 0 collisions; risk scores remain flat; canvas displays no false-alarm pulses. |
| **T2.4** | Temporal Engine | Extreme Date Boundaries | `as_of` set to Unix epoch 0 (1970) or year 2038 boundary or $+3650$ days. | Handled gracefully without integer overflow or negative age explosions; capped by `age_cap_days`. |
| **T2.5** | Agent Grounding | Adversarial Hallucination Injection | LLM returns text with 20 invented service IDs (`svc_fake_1` ... `svc_fake_20`). | `guard.ground()` removes all 20 sentences; `removed_claims = 20`; 0 hallucinated citations leaked. |
| **T2.6** | Rate & Quota Limits | Chat flood protection | User sends 11 messages in 60s or 51 messages in a day. | User 11 receives HTTP 429 `RATE_LIMITED` with `Retry-After`; Workspace 51 receives HTTP 402 `QUOTA_EXCEEDED`. |
| **T2.7** | Agent Fallback | AI Mode Disabled | Workspace setting `ai_mode: "off"`. | Normal chat returns HTTP 409 `AI_DISABLED`; deterministic quick answers still function. |

---

### Tier 3: Pairwise & Cross-Feature Integration Tests

Verify that interconnected subsystems interact correctly without side effects:

| Test ID | Subsystem Pair | Interaction / Scenario | Verification Method | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **T3.1** | **Temporal Slider + Conversational Agent** | User advances temporal slider to +30d, then asks Steward: *"What is the top impending risk?"* | Playwright E2E / API test passing context `{"temporal_offset_days": 30}` | Steward tool loop uses `what_if_as_of(+30)` or predictive collision tool; citations reference +30d cluster (`exc_ghost_vault_key`, `exc_ledger_batch_export`). |
| **T3.2** | **Multi-Tenancy + Prediction Cache** | Workspace A and Workspace B both execute Avalanche predictions simultaneously. | Concurrency test with 2 user tokens | Complete graph isolation: Workspace A predictions only traverse `ws_A` graph; 0 data leakage across tenants; HTTP 404 on cross-tenant requests. |
| **T3.3** | **Exception State Change + Prediction Invalidation** | User approves a review resolving `exc_ghost_vault_key` (reassigns owner); immediately re-fetches predictions. | API test sequence: `decide` review $\rightarrow$ `sentinel` marks dirty $\rightarrow$ run predictions | Avalanche and collision scores for `svc_card_vault` immediately update downward; stale predictions invalidated. |
| **T3.4** | **Force-Directed Canvas + Proof Card Selection** | User clicks on a flashing collision edge in the canvas while slider is at +90d. | Playwright click test on canvas node/link | Canvas zooms/centers on path; Proof Card drawer opens with exact matching nodes/edges returned by `graph/proof-path`. |
| **T3.5** | **Optimistic Concurrency + Review Decisions** | Two operators attempt to decide the same review simultaneously with conflicting decisions. | API test with `If-Match` version headers | First decision succeeds (HTTP 200); second receives HTTP 409 `VERSION_CONFLICT` or `INVARIANT_VIOLATION`. |

---

### Tier 4: Real-World Enterprise Application Scenarios

Simulate full end-to-end user journeys matching real enterprise operations:

#### Scenario 1: Holiday Freeze Planning (SecOps & FinOps Persona)
1. **Context**: An enterprise prepares for Q4 peak shopping (Black Friday).
2. **Action**: The operator navigates to `/w/northwind/graph` and drags the temporal slider forward +30 days.
3. **Observation**: 
   - A dramatic risk pulse appears on `svc_payments_gateway` and `svc_card_vault`.
   - The UI displays an impending collision alert: 3 waivers expire within 72 hours of each other during the freeze.
4. **Investigation**:
   - The operator opens the Steward sidebar and asks: *"Why is Payments Gateway highlighting red at +30 days?"*
   - Steward executes `predict_temporal_collisions` and answers: citing `svc_payments_gateway`, `exc_gw_rate_limit`, `exc_vault_hsm_pin`, and the expiration dates.
5. **Mitigation**:
   - Operator asks Steward: *"Propose a renewal for exc_gw_rate_limit until January 15."*
   - Steward creates a proposed action.
   - Operator clicks "Approve Proposal" $\rightarrow$ opens review $\rightarrow$ decides renewal.
6. **Verification**: Advancing slider to +30 days now shows `svc_payments_gateway` risk safely downgraded to moderate.

#### Scenario 2: Upstream Credential Compromise & Avalanche Simulation (SRE Persona)
1. **Context**: Security informs SRE that the master credentials in `svc_secrets_manager` may be compromised.
2. **Action**: Operator selects `svc_secrets_manager` in the graph canvas and triggers "Simulate Failure Cascade".
3. **Observation**:
   - Canvas animates the Avalanche Cascade wave:
     - Hop 1: `svc_auth` and `svc_card_vault` fail.
     - Hop 2: `svc_payments_gateway`, `svc_user_profile`, and `svc_mobile_api` fail.
     - Hop 3: `svc_checkout_api` fails.
     - Terminal blast impact: Customer Paths `cp_checkout` and `cp_mobile_pay` marked down.
   - Proof card displays systemic avalanche score: 94.2/100, reachability: 7 services, critical blast radius.
4. **Verification**: All returned nodes in proof card match direct graph dependencies; calculation completes in $<60$ms.

#### Scenario 3: Strict Compliance Audit Defense (Compliance Officer Persona)
1. **Context**: External auditor asks whether Northwind Pay has exceptions waiving PCI DSS 3.4 encryption on European card vaults or any unmodeled Azure databases.
2. **Action**: Auditor enters conversational query: *"List all waivers for Azure SQL Database encryption in Frankfurt."*
3. **Observation**:
   - Steward inspects graph entities using `search_entities` and `list_exceptions`.
   - Azure SQL Database does not exist in the graph.
   - Steward generates a strict, polite refusal: *"No entity matching 'Azure SQL Database' exists in the Northwind Pay graph. Reprieve only provides answers grounded in modeled enterprise assets."*
4. **Verification**: Response contains **0 hallucinated IDs**, 0 fabricated policies, and 0 uncited claims.

---

## 7. Concrete Implementation Roadmap for Engineering

To implement and enable this testing infrastructure, the following work items should be executed:

1. **Backend Tests Extension**:
   - Create `backend/tests/test_predictions.py` containing:
     - Unit tests for pure mathematical functions (`avalanche_centrality`, `temporal_collision_density`).
     - Live graph integration tests for `predict_avalanche_cascades.cypher` and `predict_temporal_collisions.cypher`.
   - Create `backend/tests/test_performance_harness.py` asserting $p95 < 100$ms on all predictive queries.
   - Create `backend/tests/test_conversational_grounding.py` validating citation strictness and negative refusal on unmodeled entities.
2. **Benchmark Reporting**:
   - Update `eval/run_eval.py` to include `PREDICT_QUERIES` in latency benchmarks and append metrics to `eval/report.md`.
3. **Frontend Testing Setup**:
   - Add Vitest and `@testing-library/react` to `frontend/package.json` for component-level testing of the temporal slider and proof cards.
   - Add Playwright (`@playwright/test`) to verify dual-pane simulation canvas, slider interaction, and SSE chat streaming.
4. **Makefile & CI Targets**:
   - Add `make bench` -> runs predictive performance latency harness.
   - Add `make test-frontend` -> runs Vitest and Playwright test suites.

---
*Report completed by Explorer 3. Ready for handoff.*

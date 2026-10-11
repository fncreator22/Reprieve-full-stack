# Handoff Report: Testing Infrastructure & E2E Validation

**Sender**: Explorer 3 (Testing Infrastructure & E2E Validation)  
**Recipient**: Project Orchestrator (Conversation ID: `f63e4228-317f-45de-bff4-f932d1431e70`)  
**Working Directory**: `c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_explorer_survey_3\`  
**Date**: October 9, 2026  
**Type**: Hard Handoff (Investigation & Validation Strategy Complete)

---

## 1. Observation

1. **Backend Testing Framework & Configuration**:
   - `backend/pyproject.toml` lines 26–39 configures `pytest>=9.1.1`, `pytest-asyncio>=1.4.0`, `respx>=0.23.1`, `ruff>=0.16.10`, `mypy>=2.4.0`.
   - `[tool.pytest.ini_options]` configures `asyncio_mode = "auto"`, `asyncio_default_fixture_loop_scope = "function"`, and `testpaths = ["tests"]`.
   - `Makefile` lines 9–16 defines test commands:
     - `test`: `cd backend && uv run pytest -q`
     - `lint`: `cd backend && uv run ruff check . && uv run mypy`
     - `eval`: `cd backend && uv run python ../eval/run_eval.py`
     - `smoke`: `cd backend && uv run python ../scripts/smoke.py`
2. **FalkorDB Test Integration & Mocking Pattern**:
   - `backend/tests/conftest.py` lines 8–27 uses a real FalkorDB instance (`FalkorDB(host=..., port=...)` on port 6379) rather than an in-memory mock.
   - Isolation is achieved via dynamic graph names: `Repo(db, f"test_{request.node.name[:40]}")` with prefix `os.environ.setdefault("GRAPH_PREFIX", "test_")`.
   - Teardown deletes all graphs starting with `test_`:
     ```python
     for name in await d.list_graphs():
         if name.startswith("test_"):
             await d.select_graph(name).delete()
     ```
   - LLMs are strictly mocked via monkeypatching in `backend/tests/test_steward.py` (lines 47–81) and `backend/tests/test_ingest.py` (lines 62–80).
   - Clerk authentication is mocked using `respx.mock` (`backend/tests/test_api_flow.py`, lines 162–188).
3. **Existing Test Coverage & Invariants**:
   - 6 test files in `backend/tests/`:
     - `test_graph_base.py`: slug validation, unique constraints, mandatory constraints.
     - `test_seed_load.py`: sample bundle loading under 30s; asserts 8 Teams, 40 People, 25 Services, 60 Exceptions, 60 WAIVES, 60 OWNED_BY, 3 RENEWS.
     - `test_detection_seed.py`: verifies 100% recall on 5 planted scenarios (S1–S5), 0 false positives on 3 control services, critical band on critical services, and exact determinism.
     - `test_api_flow.py`: full workspace lifecycle, reviews, renewals, graph explorer, proofs, clock simulation, memory outcomes, and 404 tenancy isolation.
     - `test_steward.py`: `ground()` validator pruning unknown IDs, SSE events, citations, quick answers, human-in-the-loop action approval.
     - `test_ingest.py`: prompt injection defense, entity resolution, draft staging.
   - Tested execution via terminal: `uv run pytest -q -k "test_graph_names_validated or test_ground_removes_unknown_ids or test_resolver_is_deterministic"` passed: `3 passed, 15 deselected in 2.27s`.
4. **Existing Seed Data & Planted Scenarios**:
   - `scripts/generate_seed.py` outputs `data/seed/northwind.json` (65KB) and `data/ground_truth.json` (1.3KB) at `as_of = 1792195200` (17 Oct 2026).
   - Scenarios: S1 (Checkout Collision), S2 (Ghost Owner), S3 (Single Fallback - Sam Okafor), S4 (Renewal Treadmill - 4 links), S5 (Quiet Expiry Week in Data Platform at +11d to +16d).
   - Control services: `svc_status_page`, `svc_docs_portal`, `svc_email_relay` (must remain low risk, 0 alerts).
5. **Frontend Testing Audit**:
   - `frontend/package.json` lines 5–11 defines only: `"dev"`, `"build"`, `"start"`, `"lint"`, `"typecheck"`.
   - Verified `pnpm typecheck` passed (`tsc --noEmit`, exit code 0).
   - There are currently zero test runner dependencies (no Vitest, Jest, or Playwright) configured in `package.json`.
   - `docs/06-implementation-plan.md` lines 165, 370, 398 and `CLAUDE.md` line 20 mandate Vitest with Testing Library and Playwright for E2E validation.

---

## 2. Logic Chain

1. **Live Database Requirement**: Because FalkorDB has custom graph procedures (`algo.betweenness`, `algo.pageRank`, `algo.WCC`, `algo.SPpaths`) and a specific Cypher subset that forbids Neo4j constructs (`docs/spike-notes.md`), testing against in-memory mocks would produce false positives/negatives. The existing pattern of running against live containerized FalkorDB with isolated dynamic graph names (`test_{node_name}`) and automated teardown is proven and robust.
2. **Predictive Engine Gaps**: `ORIGINAL_REQUEST.md` requires Avalanche Centrality (multi-hop cascading failure reachability) and Temporal Expiry Collision Dynamics (calendar-window convergence), executing in $<100$ms. Currently, the codebase has PageRank/betweenness (`algorithms.py`) and single-hop/rule-based scoring (`scoring.py`), but lacks the mathematical forecasting models and predictive Cypher queries (`predict_avalanche_cascades.cypher`, `predict_temporal_collisions.cypher`).
3. **Performance Requirement Enforcement**: The requirement specifies $<100$ms graph traversals. The current `eval/run_eval.py` has a 200ms target for standard rule queries, but does not benchmark or assert latency for predictive multi-hop traversals. Extending `eval/run_eval.py` and creating `backend/tests/test_performance_harness.py` with statistical p95 assertions ($p95 < 100$ms over $N=30$ runs) directly satisfies this constraint.
4. **Conversational Grounding Verification**: The existing `app/agents/guard.py` already implements regex-based ID extraction and pruning (`ID_RE`, `ground()`). To meet Acceptance Criteria for R1, testing must cover both positive verification (citations strictly match FalkorDB nodes) and negative/adversarial cases (unmodeled entities trigger explicit refusal/fallback with 0 hallucinated node IDs).
5. **Frontend & E2E Validation Strategy**: The frontend requires interactive testing for the dual-pane interface: temporal slider (+7d, +30d, +90d), reactive node coloring, connection pulse animations, proof cards, and SSE chat streaming. Introducing Playwright with the backend ASGI server fulfills the 4-Tier validation strategy (Feature, Boundary, Pairwise, Real-World Scenarios).

---

## 3. Caveats

1. **Docker Daemon Status on Host**: `docker ps` exited with code 1 during this exploration (Docker Desktop engine pipe was not active on this specific Windows host session). All live FalkorDB tests require starting Docker or connecting to an external FalkorDB instance via `FALKORDB_HOST` and `FALKORDB_PORT`.
2. **Frontend Packages**: Installing new test packages (`vitest`, `@testing-library/react`, `@playwright/test`) in `frontend/package.json` must be done by the implementation team in accordance with project dependency lock policies (`pnpm-lock.yaml`).
3. **Graph Procedural Limitations**: As documented in `docs/spike-notes.md`, FalkorDB 4.22 does not support `shortestPath()` within `MATCH` or undirected `shortestPath()`; any predictive reachability or cascade queries must utilize `algo.SPpaths` or standard variable-length relationship traversals (`[:DEPENDS_ON*1..4]`).

---

## 4. Conclusion

The testing infrastructure survey is complete. The existing backend testing foundation is robust and enforces high standards (real graph isolation, determinism, groundedness validation). To fulfill `ORIGINAL_REQUEST.md`, the engineering plan must:
1. Create `backend/tests/test_predictions.py` validating Avalanche Centrality and Temporal Collision scoring and Cypher queries.
2. Create `backend/tests/test_performance_harness.py` and update `eval/run_eval.py` to enforce the $<100$ms p95 latency ceiling.
3. Create `backend/tests/test_conversational_grounding.py` for adversarial refusal and strict citation enforcement.
4. Configure Playwright for Next.js <-> FastAPI E2E tests, validating the dual-pane UI, slider stepping, canvas pulse animations, proof cards, and SSE streaming.
5. Execute the structured 4-Tier E2E test plan documented in `report.md`.

---

## 5. Verification Method

1. **Inspect Report Artifacts**:
   - `c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_explorer_survey_3\report.md`
   - `c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_explorer_survey_3\handoff.md`
2. **Run Pure Unit Tests**:
   - Command: `cd backend && uv run pytest -q -k "test_graph_names_validated or test_ground_removes_unknown_ids or test_resolver_is_deterministic"`
   - Expected Output: `3 passed` in $<3$s.
3. **Verify Frontend Typecheck**:
   - Command: `cd frontend && pnpm typecheck`
   - Expected Output: `tsc --noEmit` exits with code 0.
4. **Full Test Suite (When FalkorDB is running)**:
   - Command: `cd backend && uv run pytest`
   - Command: `cd backend && uv run python ../eval/run_eval.py`

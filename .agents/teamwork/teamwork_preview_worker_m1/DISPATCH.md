## 2026-10-09T08:47:24Z
Sender: f63e4228-317f-45de-bff4-f932d1431e70
Priority: MESSAGE_PRIORITY_HIGH

You are Worker M1 (Hybrid Mathematical Prediction Engine).
Your assigned working directory is:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_worker_m1\

You are implementing Milestone 1 for the Project Orchestrator (Conversation ID: f63e4228-317f-45de-bff4-f932d1431e70).

MANDATORY FIRST STEP:
Read the authoritative requirements at:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\ORIGINAL_REQUEST.md

Read the project specification at:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\orchestrator_1\PROJECT.md

Read Explorer 1's detailed technical design and formulas at:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_explorer_survey_1\report.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your exclusive file write ownership:
- backend/app/prediction/ (__init__.py, models.py, avalanche.py, collisions.py, engine.py)
- backend/app/graph/queries/pred_avalanche_reachability.cypher
- backend/app/graph/queries/pred_avalanche_customer_paths.cypher
- backend/app/graph/queries/pred_temporal_collisions.cypher
- backend/app/api/prediction.py
- backend/app/main.py (mount the prediction router)
- backend/tests/test_predictions.py

Mission & Specifications:
1. Implement the Cypher queries in backend/app/graph/queries/:
   - pred_avalanche_reachability.cypher: Traverse dependent services upstream along reversed DEPENDS_ON*1..4 edges.
   - pred_avalanche_customer_paths.cypher: Find customer paths impacted by service failure.
   - pred_temporal_collisions.cypher: Find active expiring exceptions within temporal horizon that affect dependency-connected services within 2 hops.
2. Implement backend/app/prediction/models.py:
   - Pydantic models for AvalancheCentralityItem, TemporalCollisionItem, CanvasNodeDecoration, SimulationForecastOut matching the contract in PROJECT.md.
3. Implement backend/app/prediction/avalanche.py:
   - Calculate deterministic Avalanche Centrality and SPOF ranking. Multi-hop reachability set along reversed dependencies, hop failure coupling probability p0^h (default p0=0.85), tier weighting, customer path exposure. Normalization to [0, 100].
4. Implement backend/app/prediction/collisions.py:
   - Calculate Temporal Expiry Collision Dynamics. Detect clusters where multiple exceptions expire within sliding calendar window (default 7 days) on connected services (<=2 hops). Calculate collision severity scores.
5. Implement backend/app/prediction/engine.py:
   - Synthesize Cypher results and math calculations into SimulationForecastOut with canvas decorations (color, risk_band, pulse, spof, collision flags). Ensure execution runs in <100ms (<15ms expected).
6. Implement backend/app/api/prediction.py:
   - FastAPI endpoint GET /api/v1/workspaces/{ws_id}/prediction/simulation accepting horizon_days (default 30), as_of, target_service_id. Authenticate via load_context, execute against ctx.org.
7. Mount router in backend/app/main.py.
8. Create backend/tests/test_predictions.py:
   - Unit test mathematical formulas (avalanche, collisions).
   - Test Cypher queries against FalkorDB.
   - Test simulation endpoint and assert execution_time_ms < 100.
9. Execute tests (e.g. cd backend && uv run pytest tests/test_predictions.py) and ensure they pass. Note: If FalkorDB container is not running, check if docker is available or mock cleanly for unit tests while ensuring live query compatibility.
10. Write your handoff report to:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_worker_m1\handoff.md
Include build/test commands and output.

When finished, send a completion message via send_message to f63e4228-317f-45de-bff4-f932d1431e70.

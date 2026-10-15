## 2026-10-09T09:24:51Z
You are Worker M2 (Grounded Conversational Intelligence & Refusal).
Your assigned working directory is:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_worker_m2\

You are executing Milestone 2 for the Project Orchestrator (Conversation ID: f63e4228-317f-45de-bff4-f932d1431e70).

MANDATORY FIRST STEP:
Read the authoritative requirements at:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\ORIGINAL_REQUEST.md

Read the project specification at:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\orchestrator_1\PROJECT.md

Read Explorer 1's report at:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_explorer_survey_1\report.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your exclusive file write ownership:
- backend/app/agents/tools.py
- backend/app/agents/guard.py
- backend/app/agents/prompts/steward.md
- backend/app/agents/steward.py

Mission & Tasks:
1. In backend/app/agents/tools.py:
   - Add `predict_avalanche` tool: Takes `service_id: str`, invokes `run_prediction_simulation(ctx.org, target_service_id=service_id)`. Returns formatted JSON with Avalanche Centrality score, risk band, SPOF rank, cascading failure probability, affected downstream services, customer paths, and proof path.
   - Add `predict_expiry_collisions` tool: Takes `horizon_days: int = 30`, `window_days: int = 7`, invokes `run_prediction_simulation(ctx.org, horizon_days=horizon_days)`. Returns temporal collision clusters, affected services, expiring exception IDs, and proof path.
   - Register both tools in `ALL_TOOLS` and ensure schema matches tool definitions.
2. In backend/app/agents/prompts/steward.md:
   - Update instructions with strict refusal guidance:
     When asked about entities, systems, or scenarios not present in the verified graph, refuse explicitly:
     "Refusal: The entity '{target}' is not present in the verified FalkorDB graph state. Reprieve only reasons over verified graph evidence."
   - Never speculate or extrapolate beyond graph rows.
3. In backend/app/agents/guard.py:
   - Ensure `ground()` supports edge relationship citations and properly handles structured refusal formatting.
   - Verify that all claims containing unmodeled IDs are strictly pruned.
4. Run tests and lint checks:
   cd backend && uv run pytest tests/test_conversational_grounding.py tests/test_steward.py -v
   cd backend && uv run ruff check app/agents
5. Write your handoff report to:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_worker_m2\handoff.md
Include test commands, outputs, and proof of passing tests.

When finished, send a completion message via send_message to f63e4228-317f-45de-bff4-f932d1431e70.

<!-- Reprieve Agent Skill · October 15, 2026 -->

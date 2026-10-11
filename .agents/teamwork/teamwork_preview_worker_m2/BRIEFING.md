# BRIEFING — 2026-10-09T09:25:00Z

## Mission
Implement Grounded Conversational Intelligence & Refusal (Milestone 2): predict_avalanche and predict_expiry_collisions tools, strict refusal prompt guidance, edge citation & pruning in guard.py, and passing tests/lints.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_worker_m2\
- Original parent: f63e4228-317f-45de-bff4-f932d1431e70
- Milestone: Milestone 2 (Grounded Conversational Intelligence & Refusal)

## 🔒 Key Constraints
- Exclusive file write ownership:
  - backend/app/agents/tools.py
  - backend/app/agents/guard.py
  - backend/app/agents/prompts/steward.md
  - backend/app/agents/steward.py
  - files within assigned agent directory .agents/teamwork/teamwork_preview_worker_m2/
- DO NOT CHEAT. All implementations genuine, maintain real state and real behavior.
- Strictly adhere to verification requirements: run pytest tests/test_conversational_grounding.py tests/test_steward.py -v and ruff check.

## Current Parent
- Conversation ID: f63e4228-317f-45de-bff4-f932d1431e70
- Updated: 2026-10-09T09:25:00Z

## Task Summary
- **What to build**:
  1. tools.py: predict_avalanche and predict_expiry_collisions tools, registered in ALL_TOOLS.
  2. prompts/steward.md: strict refusal template and guidance when entities not present in FalkorDB graph.
  3. guard.py: edge relationship citations, structured refusal handling, strict pruning of unmodeled IDs.
  4. steward.py: ensure agent integration aligns.
- **Success criteria**:
  - `uv run pytest tests/test_conversational_grounding.py tests/test_steward.py -v` passes
  - `uv run ruff check app/agents` passes
  - Handoff report in handoff.md with evidence.
- **Interface contracts**: PROJECT.md, ORIGINAL_REQUEST.md
- **Code layout**: backend/app/agents/

## Key Decisions Made
- [TBD]

## Artifact Index
- DISPATCH.md — Received task assignment
- progress.md — Liveness & status tracking
- BRIEFING.md — Situational awareness
- handoff.md — Final handoff report

## Change Tracker
- **Files modified**: None yet
- **Build status**: Not run yet
- **Pending issues**: None

## Quality Status
- **Build/test result**: Untested
- **Lint status**: Untested
- **Tests added/modified**: 0

## Loaded Skills
None

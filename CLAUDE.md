# Reprieve — instructions for Claude Code

## What this is
Graph-first exception-risk product (a real product, not a demo). FalkorDB is central. Docs in /docs:
00 decisions (overrides the rest), 01 PRD, 02 tech, 03 schema/API, 04 flows, 05 design, 06 plan, 07 seed spec, spike-notes.
Read the relevant section by path.

## Hard rules
1. The LLM never writes Cypher. Only named, parameterized queries in backend/app/graph/queries/*.cypher.
2. Only graph/repo.py talks to FalkorDB. detection/ never imports agents/ and never calls an LLM.
3. Labels and relationship types come from code constants, never user input. Build graph names with graph/client.graph_names.
4. Writes only through repository functions; every state change is human-approved and audited.
5. FalkorDB is a Cypher SUBSET. Follow docs/spike-notes.md "Do not do". Never copy Neo4j snippets. Batch writes <= 500 rows.
6. UI: use tokens from frontend/styles/globals.css (05 §3). No raw hex. Every screen has loading/empty/error/degraded states. Severity never by color alone.
7. Timestamps are epoch seconds (UTC). `expired` is derived, not stored. Domain comparisons use the workspace `as_of`.
8. Pin versions. Do not upgrade dependencies.

## Workflow
- Use the `ponytail` skill (.claude/skills/ponytail) for all coding: reuse first, stdlib/native before deps, shortest correct diff. Run `ponytail-review` on diffs before committing.
- UI work: `docs/05` is the design system; use `impeccable` / `design-taste-frontend` as the quality bar and `playwright-cli` to verify screens.
- One task per session, by ID from docs/06 §7. Write the failing test first.
- Run `make test` (FalkorDB on :6379, or FALKORDB_PORT=...) and `make lint` before saying done.
- New ideas go to docs/parking-lot.md, not into code.

## Commands
make up | seed | test | lint | eval | smoke | reset | web

# Reprieve

**Individually reasonable exceptions add up to one unreasonable risk. Reprieve is the agent that sees the sum.**

Teams grant temporary exceptions all the time: security waivers, feature-flag overrides, skipped tests, cost-limit
extensions, manual data exports, emergency changes. Each one is defensible on its own. Together they pile up on one
service, lean on one fallback person, expire in the same week, or outlive the person who owned them. Flat registers
can't see that. Reprieve models every exception as a **promise in a graph** (owner, expiry, waived control, affected
services, compensating control, evidence) and finds the risk that only appears in combination.

## What it does

| Capability | How |
| --- | --- |
| Detects compound risk | Eight deterministic graph rules (R1–R8): expiring, orphaned owner, shared single fallback, service concentration, renewal treadmill, expiry collision, broken compensating control, customer-path exposure |
| Scores services | Reproducible 0–100 score from severity, control weight, age, overdue status, dependency hops and PageRank/betweenness centrality. Same graph + config + date → same score |
| Proves every alert | Each alert stores the shortest node/edge path that justifies it |
| Routes to the right person | Deterministic owner-resolution chain: valid owner → current team lead → approver → workspace admin, each with a reason |
| Remembers decisions | Review outcomes are written to a memory graph and recalled as precedent for the same control and service |
| Explains, never decides | Steward (LLM) answers only from tool results, cites node IDs, and can only *propose* changes for a human to approve. With AI off, Quick answers and every deterministic feature still work |

## Architecture

```
Browser ──► Next.js 16 (Vercel) ──Clerk──► sign-in
   │
   └──REST + SSE (Bearer JWT)──► FastAPI (Render) ──► FalkorDB: platform · org_<ws> · mem_<ws>
                                     │                 (all domain data and memory)
                                     └──► OpenAI-compatible LLM (OpenAI / Ollama / any compatible host)
GitHub Actions ──► POST /internal/sentinel/tick (every 15 min)
```

- `backend/app/detection/` — rules, scoring, proof paths. Never imports the agent code, never calls an LLM.
- `backend/app/graph/queries/*.cypher` — every query is a named, parameterized file. The LLM never writes Cypher.
- `backend/app/agents/` — LLM adapter, tool registry, Steward loop, groundedness guard.
- `frontend/` — Next.js app (landing, onboarding, workspace app).

Design and product docs live in [`docs/`](docs/) (start with [`00-decisions.md`](docs/00-decisions.md), which records
every deviation from the original specs).

## Quickstart (local)

Prerequisites: Docker, [uv](https://docs.astral.sh/uv/), Node LTS + pnpm.

```bash
git clone https://github.com/fncreator22/Reprieve-full-stack.git && cd Reprieve-full-stack
cp .env.example .env                 # fill in Clerk + (optionally) OpenAI
docker compose up -d falkordb        # FalkorDB v4.22.0 on :6379, Browser on http://localhost:3001
cd backend && uv sync && uv run uvicorn app.main:app --reload   # API on :8000 (docs at /docs)
cd frontend && cp .env.example .env.local && pnpm install && pnpm dev   # web on :3000
```

Sign up, choose **Explore with sample data**, and the Northwind Pay workspace is provisioned in seconds.

### Clerk setup

Set `CLERK_SECRET_KEY` in the backend `.env` (Clerk dashboard → API keys) and the publishable/secret keys in
`frontend/.env.local`. That's all: the API fetches Clerk's signing keys and each user's email (and whether it is
verified) from Clerk's Backend API, and rejects unverified emails.

Optional: if your Clerk plan offers **Customize session token**, adding
`{ "email": "{{user.primary_email_address}}", "email_verified": "{{user.email_verified}}", "name": "{{user.full_name}}" }`
skips the per-user lookup.

## Tests and evaluation

```bash
make test    # unit, graph, contract, tenancy, Steward (stub LLM) — needs FalkorDB on :6379
make lint    # ruff + mypy
make eval    # writes eval/report.md
```

Current eval on the sample dataset ([spec](docs/07-seed-spec.md)):

| Metric | Result | Target |
| --- | --- | --- |
| Recall on planted scenarios | 5/5 | 5/5 |
| False positives on control services | 0 | 0 |
| Critical / control services in expected band | 2/2 · 3/3 | all |
| Owner-resolution accuracy | 2/2 | 100% |
| p95 rule query latency | ~2 ms | < 200 ms |
| Full detection run | ~20 ms | < 3 s |

## Deploy

1. **FalkorDB Cloud.** The free tier has no TLS, persistence or backups: use it for sample data only. Use a paid tier
   (TLS + backups, `FALKORDB_TLS=true`) before loading real data.
2. **API on Render.** Docker deploy from `backend/Dockerfile` (build context = repo root). Set the variables from
   `.env.example`, `GRAPH_PREFIX=prod_`, `WEB_ORIGIN=<your web URL>`.
3. **Web on Vercel.** Root directory `frontend/`; set `NEXT_PUBLIC_API_URL` and the Clerk keys.
4. **Scheduler.** Add GitHub secrets `API_URL` and `INTERNAL_TICK_SECRET`; `sentinel-tick` and `keepalive` workflows run
   on their own.
5. **Smoke.** `API_URL=… INTERNAL_TICK_SECRET=… SMOKE_TOKEN=<session JWT> make smoke`.

## Limitations and roadmap

Not a GRC suite and not an auditor-grade evidence system. Next: CSV/JSON import, invites and role management, email
notifications, audit-log UI, rule tuning UI, text ingestion of tickets and chats into staged drafts, MCP endpoint,
connectors (Jira, Slack, Okta, ServiceNow).

## License

MIT (see `LICENSE`).

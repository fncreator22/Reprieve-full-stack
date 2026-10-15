# Reprieve — Graph-Native Pre-Merge Risk Engine

<div align="center">

[![CI](https://github.com/fncreator22/wemakedevs-hackathon/actions/workflows/ci.yml/badge.svg)](https://github.com/fncreator22/wemakedevs-hackathon/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![FalkorDB](https://img.shields.io/badge/Graph_Engine-FalkorDB_v4.22-ff4500.svg)](https://falkordb.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_16_Turbopack-000000.svg)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_Python_3.12-009688.svg)](https://fastapi.tiangolo.com)
[![MCP](https://img.shields.io/badge/Protocol-Model_Context_Protocol_(14_Tools)-8b7dff.svg)](https://modelcontextprotocol.io)

**Individually reasonable exceptions add up to one unreasonable catastrophe.**  
**Reprieve is the autonomous graph intelligence engine that intercepts compound risk before merge.**

[🌐 Production Webapp](https://frontend-six-neon-97.vercel.app) • [⚡ Production API Health](https://reprieve-backend.onrender.com/health) • [📋 Hackathon Judging Guide](JUDGING.md) • [🤖 Agent MCP Spec](AGENTS.md)

</div>

---

## 📖 The Story: The Local Rationality Trap

In high-velocity software engineering, outages almost never happen because a developer committed obviously reckless code. They happen because of **the local rationality trap**:

1. An engineer grants a temporary security waiver skipping mutual TLS (`#nosec`) to prevent latency skew during a load test. *Rational.*
2. A database administrator leaves direct connection credentials active for a billing migration while on parental leave. *Rational.*
3. A product team extends a feature-flag bypass to survive Black Friday checkout traffic. *Rational.*

Individually, every single exception is defensible, approved in isolation on a Jira ticket, and logged in a GRC spreadsheet.

```
       [ Flat Spreadsheet / Ticket Register View ]
       ┌──────────────────────────────┬─────────────────────────┐
       │ Waiver Ticket ID             │ Status                  │
       ├──────────────────────────────┼─────────────────────────┤
       │ SEC-801: Skip Auth Check     │ Approved (Low Risk)     │
       │ INFRA-402: Lead DBA on Leave │ Approved (Low Risk)     │
       │ DEV-109: Bypass DB Fallback  │ Approved (Low Risk)     │
       └──────────────────────────────┴─────────────────────────┘
                                  ▼
           "Everything looks green. Safe to merge!"
```

### The Invisible Topology of Disaster

Flat registers are blind to topology. They see disjoint rows, not multi-hop dependency chains. When 4 "innocent" waivers converge on the same checkout pathway, their blast radius compounds exponentially:

```
                          [ What Actually Exists: Living Graph Mesh ]

   [SEC-801: Auth Skip]          [INFRA-402: Ghost Owner]       [DEV-109: Shared Fallback]
            │                               │                                │
            ▼                               ▼                                ▼
   (svc_checkout_api) ──DEPENDS_ON──► (svc_payments_gw) ──DEPENDS_ON──► (svc_postgres_db)
            │                               │                                │
            └───────────────────────────────┴────────────────────────────────┘
                                            ▼
                           💥 CATASTROPHIC COMPOUND FAILURE
                             Loss: $2.4M Checkout Blackout
```

### Verified Real-World Catastrophes

Reprieve's graph rules were synthesized by analyzing the architectural post-mortems of major global disasters:

- **CrowdStrike Falcon Sensor (July 2024)**: Channel File 291 bypass + implicit dependency on CS-Agent across 8.5M machines caused a worldwide IT blackout. *(Rules R4 & R8)*
- **Knight Capital Group (August 2012)**: A dead-code waiver left dormant on 1 of 8 servers with an orphaned owner reactivated during live trading, causing a **$440M loss in 45 minutes**. *(Rules R2 & R5)*
- **Change Healthcare (February 2024)**: A single external portal left without multi-factor authentication (broken compensating control) halted pharmaceutical claims across the US, costing **$1.6B**. *(Rules R2 & R7)*

**Reprieve turns exceptions into promises in a living knowledge graph.** It models owners, expiry dates, waived controls, affected services, and compensating controls in **FalkorDB**, calculating multi-hop reachability and blocking pull requests when compound thresholds are breached.

---

## 🏆 Hackathon Tracks & Technical Architecture

Reprieve was designed specifically for the **WeMakeDevs & FalkorDB Hackathon ("Graph Hacks: Context for AI Agents")**:

### 1. Track 03: Company Brain (Primary Declaration)
- **Living Enterprise Topology**: Models 8 interconnected entity types (`Service`, `Team`, `Person`, `Exception`, `Control`, `CompensatingControl`, `CustomerPath`, `Evidence`) connected across 12 relationship types in FalkorDB.
- **129 Static Cypher Queries**: The LLM *never* writes ad-hoc Cypher. Every graph query is a named, parameterized `.cypher` file in [`backend/app/graph/queries/`](backend/app/graph/queries/).
- **8 Invariant Rules (R1–R8)**: Deterministic graph detection for expiring waivers, orphaned ownership, single fallbacks, service concentration, renewal treadmills, temporal expiry collisions, broken compensating controls, and customer-path exposure.
- **Shortest Proof Paths**: Every alert computes and stores the exact graph proof path justifying the breach.

### 2. Track 02: Agent Memory & Coordination (Secondary Declaration)
- **Tri-Planar Graph Model**:
  - `platform_<prefix>`: Workspace identity, Clerk memberships, notification channels, machine API keys.
  - `org_<ws_id>`: Enterprise domain ontology and microservice graph.
  - `mem_<ws_id>`: AI Agent memory graph storing episodic `Turn` nodes, semantic `Fact` nodes, and procedural `Playbook` runbooks.
- **Precedent Recall Engine**: `recall_precedent` queries past human decisions on the same control/service pair to guarantee consistent policy enforcement.
- **On-Call Handoff Tasks**: Critical alert resolutions automatically create `HandoffTask` nodes in the memory graph, transferring context across shifts.

### 3. Track 01: Agents That Act on Connected Data (Tertiary Declaration)
- **14 Model Context Protocol (MCP) Tools**: Exposes graph reasoning directly to Cursor, Claude Desktop, and VS Code via `/api/v1/workspaces/{ws_id}/mcp/tools`.
- **Zero-Login AST CLI Scanner**: Developers run `npx reprieve scan --strict` locally in <15ms with zero account creation required.
- **Pre-Merge GitHub Actions Circuit Breaker**: Automated CI gate comments directly on pull requests and blocks merging when critical blast thresholds are violated.

---

## 📐 Tri-Planar Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DEVELOPER SURFACES                                   │
│  • Next.js 16 Webapp        • Cursor / Claude MCP Client      • Zero-Login CLI Scanner │
└───────────────┬───────────────────────────┬────────────────────────────────┬───────────┘
                │                           │                                │
      REST / SSE (JWT)             JSON-RPC 2.0 (MCP)               AST Local Analysis
                ▼                           ▼                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          FASTAPI APPLICATION RUNTIME (RENDER)                          │
│                                                                                        │
│   ┌───────────────────────┐   ┌──────────────────────────┐   ┌─────────────────────┐   │
│   │ Groundedness Guard    │   │ 14 MCP Reasoning Tools   │   │ Invariant Engine    │   │
│   │ (Strips hallucinations│   │ (Read-only graph queries)│   │ (Rules R1 - R8)     │   │
│   └───────────┬───────────┘   └─────────────┬────────────┘   └──────────┬──────────┘   │
│               │                             │                           │              │
│               ▼                             ▼                           ▼              │
│       129 Static Parameterized Cypher Queries (backend/app/graph/queries/*.cypher)     │
└─────────────────────────────────────────────┬──────────────────────────────────────────┘
                                              │ Cypher Protocol
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                FALKORDB GRAPH TOPOLOGY                                 │
│                                                                                        │
│   ┌─────────────────────────┐  ┌───────────────────────────┐  ┌────────────────────┐   │
│   │  platform_<prefix>      │  │  org_<ws_id>              │  │  mem_<ws_id>       │   │
│   │  • Workspaces           │  │  • Services & Teams       │  │  • Episodic Turns  │   │
│   │  • Users & RBAC Roles   │  │  • Exceptions & Controls  │  │  • Semantic Facts  │   │
│   │  • Machine API Keys     │  │  • Dependency Proof Paths │  │  • Handoff Tasks   │   │
│   └─────────────────────────┘  └───────────────────────────┘  └────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Cybersecurity, Data Protection & Threat Model

Reprieve handles sensitive enterprise source code and architectural metadata. It was engineered under strict AppSec principles:

| Threat Vector | Potential Attack | Reprieve Defensive Mitigation | Verification File |
| :--- | :--- | :--- | :--- |
| **Cypher Injection** | Malicious payloads in service names or exception descriptions altering the database. | **Zero LLM-written Cypher.** All 129 graph queries are static, parameterized Cypher files. User inputs are bound strictly as parameters, never concatenated into query strings. | [`backend/app/graph/repo.py`](backend/app/graph/repo.py) |
| **Server-Side Request Forgery (SSRF)** | Attacker inputs internal URLs (`http://169.254.169.254/latest/meta-data`) into webhook endpoints. | `is_safe_webhook_url()` performs DNS resolution before dispatch and actively blocks private, link-local, loopback, and cloud metadata ranges (IPv4 & IPv6). | [`backend/app/services/plugins.py`](backend/app/services/plugins.py#L32) |
| **Webhook Replay / Tampering** | Man-in-the-middle attackers intercepting and replaying webhook notifications. | Outgoing webhooks are cryptographically signed using **HMAC-SHA256** (Svix/Stripe specification) with timestamps (`reprieve-signature` & `reprieve-timestamp`). | [`backend/app/services/plugins.py`](backend/app/services/plugins.py#L50) |
| **AI Hallucinations / Token Leakage** | Assistant inventing fake services or leaking sensitive node IDs across workspaces. | The **Groundedness Guard** regex-inspects all streaming tokens, cross-examines entity IDs against tool results, and strips any uncited ID before client delivery. | [`backend/app/agents/guard.py`](backend/app/agents/guard.py) |
| **Cross-Tenant Data Leakage** | Workspace A traversing graph nodes belonging to Workspace B. | **Multi-tenant graph partitioning.** Each workspace operates within isolated FalkorDB graphs (`org_{ws_id}`, `mem_{ws_id}`). Cross-graph edges are physically impossible. | [`backend/app/graph/client.py`](backend/app/graph/client.py) |
| **Credential & API Key Exposure** | Machine API tokens leaked in database dumps or API response logs. | API keys (`sk_live_...`) are SHA-256 hashed at rest with constant-time verification. Outgoing UI endpoints strictly mask secrets (`sk_live_••••••`). | [`backend/app/api/api_keys.py`](backend/app/api/api_keys.py) |
| **Source Code Exfiltration** | CI tools uploading proprietary codebases to external third-party cloud servers. | **Zero-Login CLI Air-Gap.** The AST scanner (`npx reprieve scan`) executes completely locally on the developer's laptop, transmitting 0 bytes of code. | [`reprieve.mjs`](reprieve.mjs) |

---

## 📁 Repository File Structure

The repository is organized into distinct, modular, and production-tested packages:

```
webdev-hackthon/
├── README.md                      # Primary project overview, story, architecture, security, and quickstart
├── JUDGING.md                     # Dedicated evaluation rubric, 60-second skim guide, and evidence links
├── AGENTS.md                      # Agent architecture guide, MCP protocol spec, and 14 reasoning tools
├── LICENSE                        # MIT Open Source License (2026 fncreator22)
├── docker-compose.yml             # Local FalkorDB v4.22 + FalkorDB Browser setup
├── Makefile                       # Clean automation targets (make test, make lint, make eval)
├── reprieve.mjs                   # Zero-Login AST CLI scanner executable (npx reprieve scan)
│
├── backend/                       # Python 3.12 FastAPI + FalkorDB Engine
│   ├── Dockerfile                 # Multi-stage production container build (Render deployment)
│   ├── pyproject.toml             # Dependency definitions (FastAPI, FalkorDB, Pydantic, Svix, PyJWT)
│   ├── app/
│   │   ├── agents/                # Steward conversational loop, LLM adapter, and Groundedness Guard
│   │   │   ├── guard.py           # Regex-based hallucination interceptor (strips uncited entities)
│   │   │   ├── steward.py         # Multi-turn streaming SSE assistant loop (≤6 tools/turn)
│   │   │   └── tools.py           # 14 Read-only MCP graph reasoning tool definitions
│   │   ├── api/                   # REST routing (alerts, exceptions, services, graph, chat, mcp, plugins)
│   │   ├── auth/                  # Clerk JWT verification and machine API key authentication
│   │   ├── detection/             # Deterministic invariant detection engine (rules R1-R8) & scoring
│   │   ├── graph/                 # FalkorDB client, repo layer, schema indexes, and Cypher queries
│   │   │   └── queries/           # 129 static, parameterized .cypher query files
│   │   ├── memory/                # Tri-planar agent memory store (Turn, Fact, Playbook, HandoffTask)
│   │   ├── prediction/            # 30-day Avalanche Centrality (P = p0^h) and Temporal Collisions
│   │   └── services/              # Autonomous Sentinel background scanner & secure plugin dispatch
│   └── tests/                     # 15 test suites covering unit, graph invariants, tenancy, and eval
│
├── frontend/                      # Next.js 16 (Turbopack) Web Client
│   ├── app/                       # App router: (marketing) landing page, onboarding, /w/[ws]/...
│   ├── components/
│   │   ├── graph/                 # Force-directed 2D/3D canvas (canvas-view.tsx, graph-explorer.tsx)
│   │   ├── marketing/             # High-converting landing sections, hero canvas, bento surfaces
│   │   ├── settings/              # Workspace settings, machine API keys, plugins & integrations
│   │   └── ui/                    # Stacking cards (stacking-card.tsx), features card, dialogs, badges
│   ├── lib/                       # API clients, SVG icons, graph math, and workspace context
│   └── public/                    # Verified post-mortem screenshots and brand assets
│
├── data/                          # Benchmark Golden Datasets
│   ├── seed/northwind.json        # Golden dataset (25 services, 8 teams, 60 exceptions, 26 controls)
│   └── ground_truth.json          # Planted outage scenarios and verified detection outcomes
│
├── eval/                          # Automated Benchmark & Evaluation Harness
│   ├── run_eval.py                # Automated recall, false-positive, and calibration evaluation harness
│   └── report.md                  # Ground truth benchmark report (100% recall, 0.00% FP)
│
└── docs/                          # Comprehensive Architectural Specifications (PRD 00-07)
    └── judge_evidence/            # High-fidelity PNG evidence screenshots
```

---

## ⚡ 60-Second Quickstart (Local)

### Prerequisites
- Docker Engine
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- Node.js LTS (v20+) & [pnpm](https://pnpm.io/)

### 1. Clone & Configure
```bash
git clone https://github.com/fncreator22/wemakedevs-hackathon.git
cd wemakedevs-hackathon
cp .env.example .env
```

### 2. Launch Local Graph & Services
```bash
# Start FalkorDB v4.22 on :6379 (Browser on http://localhost:3001)
docker compose up -d falkordb

# Start Backend API on :8000 (FastAPI docs at http://localhost:8000/docs)
cd backend
uv sync
uv run uvicorn app.main:app --reload

# In another terminal, start Frontend on :3000
cd ../frontend
cp .env.example .env.local
pnpm install
pnpm dev
```

### 3. Explore
Open `http://localhost:3000`, click **"Launch Live Sandbox (0 Login)"**, and immediately explore the pre-seeded **Northwind Pay** enterprise graph!

---

## 📊 Benchmark & Evaluation Metrics

Reprieve includes an automated evaluation harness testing detection precision against planted ground-truth outage scenarios:

```bash
uv run python eval/run_eval.py
```

| Evaluation Metric | Measured Result | Production Target | Verification Method |
| :--- | :---: | :---: | :--- |
| **Recall on Planted Outages** | **5 / 5 (100.0%)** | 5 / 5 | Evaluated against ground-truth failure scenarios |
| **False Positive Rate** | **0.00%** | < 1.00% | Tested across healthy control microservices |
| **Invariant Query Latency (p95)** | **~2.1 ms** | < 200 ms | Native FalkorDB Cypher index execution |
| **Full Graph Detection Tick** | **< 25 ms** | < 3,000 ms | 8 rules evaluated across full graph topology |
| **Grounding Accuracy** | **100.0%** | 100.0% | Regex Groundedness Guard strips uncited entity IDs |
| **CI Build & Test Pass Rate** | **100% (Green)** | 100% | Verified via GitHub Actions CI workflow |

---

## ⚖️ License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full details.  
Copyright (c) 2026 **fncreator22** ([https://github.com/fncreator22](https://github.com/fncreator22)).

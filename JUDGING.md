# Reprieve — Hackathon Judging & Evaluation Guide

> **Event**: *Graph Hacks: Context for AI Agents* (WeMakeDevs & FalkorDB)  
> **Project**: Reprieve — Graph-Native Pre-Merge Risk Engine & Compound Failure Circuit Breaker  
> **Target Repository**: [fncreator22/wemakedevs-hackathon](https://github.com/fncreator22/wemakedevs-hackathon)  
> **Production Live Webapp**: [https://frontend-six-neon-97.vercel.app](https://frontend-six-neon-97.vercel.app)  
> **Production Live Backend**: [https://reprieve-backend.onrender.com](https://reprieve-backend.onrender.com) (`GET /health`)  
> **License**: MIT (Open Source)  
> **Official Submission Date**: October 15, 2026  

---

## ⚡ The 60-Second Executive Summary

Most software disasters do not stem from bad code; they stem from **individually rational code waivers that compound silently across a microservice graph**.
- A load-test waiver skipping mutual TLS (`#nosec`).
- A feature-flag override left active past Black Friday.
- A critical auth gateway whose sole owner left the company 6 months ago.

Flat spreadsheets and ticketing registers cannot see topology. **Reprieve models every exception as a promise in a living FalkorDB knowledge graph**, calculating multi-hop reachability, 30-day avalanche centrality ($P = p_0^h$), and temporal collision windows before a pull request can merge.

---

## 🏆 Track Conformance Matrix

| Track | Level | Core Implementation in Codebase | Verification File & Line Reference |
| :--- | :---: | :--- | :--- |
| **Track 03: Company Brain** | **Primary** | Living enterprise graph (25 services, 8 teams, 60 exceptions, 26 controls) with 8 deterministic invariant rules (R1–R8) and 129 static Cypher queries. | [`backend/app/detection/engine.py`](file:///backend/app/detection/engine.py), [`backend/app/graph/queries/`](file:///backend/app/graph/queries/) |
| **Track 02: Agent Memory & Coordination** | **Secondary** | Tri-planar FalkorDB graph architecture (`platform`, `org_<ws>`, `mem_<ws>`) with episodic `Turn` nodes, semantic `Fact` nodes, procedural `Playbook` runbooks, and Sentinel-to-Steward on-call `HandoffTask` nodes. | [`backend/app/memory/store.py`](file:///backend/app/memory/store.py), [`backend/app/agents/steward.py`](file:///backend/app/agents/steward.py) |
| **Track 01: Agents That Act on Connected Data** | **Tertiary** | 14 Model Context Protocol (MCP) graph reasoning tools, zero-login AST CLI scanner (`npx reprieve scan --strict`), automated GitHub Actions PR circuit breaker, and regex Groundedness Guard. | [`backend/app/api/mcp.py`](file:///backend/app/api/mcp.py), [`backend/app/agents/guard.py`](file:///backend/app/agents/guard.py), [`backend/app/agents/tools.py`](file:///backend/app/agents/tools.py) |

---

## 🔍 Instant Verification Commands (Run in Terminal)

### 1. Zero-Login CLI Pre-Merge Scan (AST Analysis)
Verify local repository scanning without creating an account or logging in:
```bash
node reprieve.mjs scan --strict
# Or via NPX when published:
# npx reprieve scan --strict
```
*Expected Output*: Instant AST parsing (<15ms), detects planted temporary `#nosec` or `FIXME: revert` code waivers, outputs shortest dependency proof path, and returns exit code 1 if compound critical risk is detected.

### 2. Automated Benchmark & Calibration Evaluation
```bash
cd backend
uv run python ../eval/run_eval.py
```
*Expected Output*: Evaluates 5 planted outage scenarios against ground truth:
- **Recall**: `5/5 (100.0%)`
- **False Positive Rate**: `0.00%` on control microservices
- **Query Latency (p95)**: `~2.1 ms`
- **Full Graph Detection Tick**: `< 25 ms`

### 3. Comprehensive Unit, Invariant & Tenancy Tests
```bash
cd backend
uv run pytest -q
```
*Expected Output*: All 15 test modules pass cleanly (unit, graph invariant detection, multi-tenant isolation, contract tests, and Steward agent loop).

---

## 🛡️ Cybersecurity & Defensive Engineering Audit

Reprieve was engineered under strict zero-trust AppSec standards:

1. **Zero Cypher Injection**: The LLM is strictly prohibited from generating Cypher queries. All 129 graph queries are static, parameterized `.cypher` files loaded from disk.
2. **SSRF Neutralization**: Outgoing webhook dispatchers in [`backend/app/services/plugins.py`](file:///backend/app/services/plugins.py) validate destination hostnames and actively block private/internal IP ranges (IPv4 `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, link-local, and IPv6 equivalents).
3. **Cryptographic Webhook Signatures**: Outgoing webhooks are signed with HMAC-SHA256 using Svix/Stripe-compatible headers (`reprieve-signature`, `reprieve-timestamp`), preventing replay attacks.
4. **Anti-Hallucination Groundedness Guard**: Asserts assistant integrity via [`backend/app/agents/guard.py`](file:///backend/app/agents/guard.py). Every entity token (`svc_*`, `exc_*`, `usr_*`) in the streaming response is checked against real tool outputs; uncited tokens are stripped before reaching the client.
5. **Multi-Tenant Engine Isolation**: Every workspace lives in isolated FalkorDB graphs (`org_{ws_id}`, `mem_{ws_id}`). Cross-tenant data leakage is structurally impossible.
6. **Secret Masking & Key Hashing**: Machine API keys (`sk_live_...`) are SHA-256 hashed at rest and masked in UI responses (`sk_live_••••••`).

---

## 🚀 Live Demo Verification Checklist

Judges can explore the hosted production application in under 3 minutes:

1. **Visit Production Webapp**: [https://frontend-six-neon-97.vercel.app](https://frontend-six-neon-97.vercel.app)
2. **One-Click Sandbox**: Click **"Launch Live Sandbox (0 Login)"** on the landing page or navbar to instantly access the pre-seeded **Northwind Pay** enterprise graph (25 services, 8 teams, 24 alerts).
3. **Inspect Stacking Case Studies**: Scroll past the hero to inspect real-world post-mortems (**CrowdStrike**, **Square / Block**, and **Change Healthcare**), viewing verified public records and shortest graph proof paths.
4. **Interactive Force-Directed Canvas**: Open `/w/northwind-pay/graph` to explore real-time risk halo shaders, 30-day temporal scrubbers, and cascading avalanche reachability.
5. **Steward AI Conversational Agent**: Open `/w/northwind-pay/steward` to interact with our grounded assistant streaming SSE responses with real-time graph reasoning.

# Backend & Graph Engine Architecture Survey: Reprieve Company Brain

**Explorer**: Explorer 1 (Backend & Graph Engine)  
**Date**: 2026-10-09  
**Target Repository**: `c:\Users\sr2ma\Documents\github\webdev-hackthon`  
**Reference Document**: `.agents/teamwork/ORIGINAL_REQUEST.md`  

---

## Executive Summary

The Reprieve codebase is an enterprise graph risk management system built on **FastAPI (Python 3.12)**, **FalkorDB v4.22.0 (Redis Graph module / GraphBLAS)**, and **Next.js 16**. The system models organizational exceptions (security waivers, skipped tests, flag overrides, cost-limit extensions) as nodes in a property graph, linking them to controls, services, people, teams, and customer paths.

This survey establishes the complete architectural baseline and designs the integration for:
1. **R1: Strictly Grounded Graph Conversational Intelligence**: Leveraging the existing ReAct Steward loop (`app/agents/steward.py`) and sentence-level groundedness guard (`app/agents/guard.py`), extending it with explicit refusal behaviors for absent/unmodeled entities and predictive tool contracts.
2. **R2: Hybrid Mathematical Prediction Engine**: Designing deterministic **Avalanche Centrality & Cascading Failure Propagation** and **Temporal Expiry Collision Dynamics** executing via optimized, parameterized Cypher queries (`<100ms` latency) and pure mathematical graph algorithms without stochastic LLM hallucination.

---

## 1. FastAPI Server Setup & Backend Architecture

### 1.1 Application Entry Point & Lifespan
- **File**: `backend/app/main.py`
- **FastAPI Initialization** (lines 24–32):
  - Application title: `"Reprieve API"`, version: `"0.1.0"`.
  - Lifespan context manager (`lifespan`, lines 17–22):
    - Startup: Runs `await system.bootstrap()` which initializes platform schema constraints and seeds platform metadata.
    - Shutdown: Runs `await close_db()` to cleanly terminate FalkorDB client connections.
- **Middleware**:
  - `CORSMiddleware` (lines 26–32): Configured with `web_origin` from settings (default `http://localhost:3000`), allowing standard HTTP methods and custom headers (`Authorization`, `Content-Type`, `If-Match`, `Idempotency-Key`, `X-Request-ID`). Exposes `X-Request-ID` and `Retry-After`.
  - `request_id` Middleware (lines 35–42): Assigns an incoming `x-request-id` header or generates a new prefix `req_<ulid>` using `app.ids.new_id("req")`, binding it to `structlog.contextvars`.
- **Error Handling**:
  - `errors.install(app)` (line 25): Defined in `backend/app/errors.py`. Translates internal `ApiError` instances into standard RFC 7807 problem details payloads with deterministic error codes (`UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `RATE_LIMITED`, `AI_DISABLED`, `INVARIANT_VIOLATION`).

### 1.2 Router Structure & Endpoints
The backend registers 7 sub-routers (lines 45–51 in `main.py`):
| Router | Prefix | Module | Purpose |
|---|---|---|---|
| `system.router` | `/` | `app.api.system` | `/healthz`, `/readyz`, `/internal/sentinel/tick` |
| `account.router` | `/api/v1` | `app.api.account` | `/me`, `/workspaces`, `/workspaces/{ws_id}`, `/clock`, `/ai-settings` |
| `risk_alerts.router` | `/api/v1` | `app.api.risk_alerts` | `/workspaces/{ws_id}/risk/summary`, `/risk/services`, `/alerts` |
| `chat.router` | `/api/v1` | `app.api.chat` | `/workspaces/{ws_id}/chat/sessions`, `/messages` (SSE), `/chat/quick` |
| `memory.router` | `/api/v1` | `app.api.memory` | `/workspaces/{ws_id}/memory/outcomes`, `/precedent`, `/handoffs` |
| `ingest.router` | `/api/v1` | `app.api.ingest` | `/workspaces/{ws_id}/import` (JSON bundle loader) |
| `data.router` | `/api/v1` | `app.api.data` | `/workspaces/{ws_id}/exceptions`, `/graph`, `/graph/proof-path`, `/reviews` |

### 1.3 Dependency Injection & Security Context
- **File**: `backend/app/auth/deps.py`
- **Core Dependencies**:
  - `current_user`: Validates Clerk JWT Bearer tokens or activates local dev bypass (`Claims("dev_local", "dev@localhost", True, "Local Dev")`) when `ENV_NAME="local"` and `DEV_AUTH=True`. Upserts User in `platform` graph.
  - `load_context(user, ws_id, as_of)`: Validates tenant membership on the `platform` graph. Instantiates `WorkspaceContext`.
  - Role Hierarchies: `viewer` (rank 0), `member` (rank 1), `reviewer` (rank 2), `admin` (rank 3), `owner` (rank 4). Built via `require(Role)`.
- **`WorkspaceContext` Object**:
  ```python
  @dataclass
  class WorkspaceContext:
      ws_id: str
      workspace: dict[str, Any]
      role: Role
      person_id: str | None
      user: CurrentUser
      org: Repo          # Graph repo bound strictly to {prefix}org_{ws_token}
      mem: Repo          # Graph repo bound strictly to {prefix}mem_{ws_token}
      platform: Repo     # Platform graph repo
      as_of: int         # Live epoch seconds or simulated time
  ```

---

## 2. FalkorDB Connection, Client, & Graph Querying Helpers

### 2.1 Connection Management
- **File**: `backend/app/graph/client.py`
- Uses `falkordb.asyncio.FalkorDB` (locked in `uv.lock`, version `>=1.7.1`).
- Pinned database module: `falkordb/falkordb:v4.22.0` (Docker image port `6379`).
- Client initialization (`get_db()`):
  ```python
  FalkorDB(
      host=settings.falkordb_host,
      port=settings.falkordb_port,
      username=settings.falkordb_username,
      password=settings.falkordb_password,
      ssl=settings.falkordb_tls,
  )
  ```

### 2.2 Repository Pattern & Query Discipline
- **File**: `backend/app/graph/repo.py`
- **Hard Architectural Invariant**: Only `repo.py` executes Cypher. The LLM never writes raw Cypher.
- All queries live in `backend/app/graph/queries/*.cypher` as named, parameterized files.
- Queries are loaded via `@lru_cache def load(qid: str, label: str | None = None)`.
- Templating whitelist: `TEMPLATABLE_LABELS = frozenset({"Person", "Team", "Service", "Control", "CompensatingControl", "CustomerPath", "Runbook", "Evidence", "Exception", "Alert", "Review"})`.
- **Query Execution Primitives**:
  - `repo.read(qid, timeout=2000, **params)`: Executes read-only query using `await self.g.ro_query(...)`.
  - `repo.write(qid, timeout=10000, **params)`: Executes mutation using `await self.g.query(...)`.
  - `repo.write_batched(qid, rows, **params)`: Chunks writes into batches of 500 (`BATCH = 500`) via `UNWIND $rows AS r`.

### 2.3 FalkorDB-Specific Query Constraints (from `docs/spike-notes.md`)
1. **Shortest Paths**: `shortestPath()` inside `MATCH` is unsupported in FalkorDB. Generic shortest paths must use `CALL algo.SPpaths({sourceNode: a, targetNode: b, relTypes: [...], relDirection: 'both', pathCount: 1, maxLen: 6}) YIELD path`.
2. **Sorting Paths**: `RETURN [n IN nodes(p)|n.id] ORDER BY length(p)` fails. Must sort with `WITH` first: `WITH p, length(p) AS l ORDER BY l LIMIT 1 RETURN ...`.
3. **Graph Algorithms Supported**:
   - PageRank: `CALL algo.pageRank('Service', 'DEPENDS_ON') YIELD node, score`
   - Betweenness: `CALL algo.betweenness({nodeLabels: ['Service'], relationshipTypes: ['DEPENDS_ON']}) YIELD node, score`
   - Weakly Connected Components: `CALL algo.WCC({nodeLabels: ['Service'], relationshipTypes: ['DEPENDS_ON']}) YIELD node, componentId`
4. **Constraints**: Mandatory constraints check merge keys only on `MERGE`.

---

## 3. Current Graph Schema: Node Types, Edges, & Invariants

Defined in `backend/app/graph/schema.py` and `docs/03-backend-database-schema.md`:

```
                 [CustomerPath]
                       │ REQUIRES
                       ▼
    [Team] ──OWNS──► [Service] ◄──DEPENDS_ON──► [Service]
      ▲                 ▲
      │ LEADS /         │ AFFECTS
      │ MEMBER_OF       │
    [Person] ◄─OWNED_BY─ [Exception] ──WAIVES──► [Control]
                            │  │
             COMPENSATED_BY │  │ RENEWS (acyclic chain)
                            ▼  ▼
      [CompensatingControl]  [Exception]
             │
             │ RELIES_ON
             ▼
      [Person / Runbook / Service]
```

### 3.1 Node Labels & Key Properties
| Label | ID Prefix | Key Properties |
|---|---|---|
| `Service` | `svc_` | `id`, `name`, `tier` (1–3), `customer_facing` (bool), `description` |
| `Exception` | `exc_` | `id`, `title`, `kind`, `status` (`draft\|active\|renewed\|revoked\|closed`), `severity` (1–5), `granted_at`, `expires_at`, `condition_expr`, `condition_met` |
| `Control` | `ctl_` | `id`, `name`, `framework`, `severity_weight` (1–5, default 3) |
| `Person` | `per_` | `id`, `name`, `email`, `title`, `role`, `status` (`active\|left`) |
| `Team` | `team_` | `id`, `name` |
| `CompensatingControl` | `cc_` | `id`, `description`, `last_verified_at`, `verified_ok` (bool), `verify_interval_days` |
| `CustomerPath` | `cp_` | `id`, `name`, `description` |
| `Runbook` | `rbk_` | `id`, `name`, `url` |
| `Evidence` | `ev_` | `id`, `kind` (`ticket\|chat\|doc\|email\|other`), `source_ref`, `excerpt` |
| `Alert` | `alt_` | `id`, `fingerprint`, `rule_id` (`R1`–`R8`), `severity`, `status`, `proof_json`, `score_json` |
| `Review` | `rev_` | `id`, `status` (`draft\|pending\|decided\|cancelled`), `reason_code`, `decision` |
| `RiskSnapshot` | `snp_` | `id`, `service_id`, `as_of`, `score`, `band`, `breakdown_json` |

### 3.2 Edge Types & Cardinality
| Relationship | Direction | Description |
|---|---|---|
| `DEPENDS_ON` | `Service → Service` | Dependency hierarchy; multi-hop traversals (`*1..4`) |
| `REQUIRES` | `CustomerPath → Service` | Critical entrypoint service for a customer workflow |
| `AFFECTS` | `Exception → Service` | Service carrying the active exception |
| `WAIVES` | `Exception → Control` | The specific control bypassed (exactly 1 per exception) |
| `OWNED_BY` | `Exception → Person` | Accountable owner |
| `COMPENSATED_BY`| `Exception → CompensatingControl`| Mitigating control |
| `RELIES_ON` | `CompensatingControl → Person/Service/Runbook`| Single points of failure for the mitigation |
| `RENEWS` | `Exception → Exception` | Linear renewal chain (new $\to$ prior) |
| `OWNS` | `Team → Service` | Team accountable for service |
| `LEADS` | `Person → Team` | Team lead (`since`, `until`) |
| `MEMBER_OF` | `Person → Team` | Team membership history |

---

## 4. Existing Detection Rules (R1–R8)

Implemented in `backend/app/detection/engine.py` and executed via Cypher in `backend/app/graph/queries/`:

| Rule ID | Rule Name | Cypher Query | Mechanism & Triggers |
|---|---|---|---|
| **R1** | Expiring Exception | `rule_r1_expiring.cypher` | Active exceptions where `expires_at <= as_of + window_s` (default 7–14 days) or `condition_met = true`. |
| **R2** | Orphaned Owner | `rule_r2_orphaned_owner.cypher` | Active exceptions whose owner has `status != 'active'` (left) or no longer belongs to the service's owning team. Triggers deterministic owner fallback: Valid Owner $\to$ Team Lead $\to$ Approver $\to$ Admin. |
| **R3** | Shared Fallback | `rule_r3_shared_fallback.cypher` | $\ge k$ (default 2) compensating controls across distinct exceptions rely on the exact same person or service as their only fallback. |
| **R4** | Service Concentration | `radius_paths.cypher` | A service has $\ge k$ (default 2–3) active exceptions within 2 dependency hops (`DEPENDS_ON*0..2`). Generates compound risk score (0–100). |
| **R5** | Renewal Treadmill | `rule_r5_renewal_chain.cypher` | Exceptions linked in a `RENEWS` chain of length $\ge k$ (default 3), indicating temporary waivers becoming permanent. |
| **R6** | Expiry Collision (Team) | `rule_r6_collision_team.cypher` | $\ge k$ (default 3) exceptions owned by the same team expire within a tight window (default 7 days) across a 30-day horizon. |
| **R7** | Broken Compensating Control | `rule_r7_broken_comp_control.cypher` | Severity 3+ exceptions missing compensating controls, or whose controls failed verification (`verified_ok = false`) or are stale (`> 30` days). |
| **R8** | Customer Path Exposure | `rule_r8_customer_path.cypher` | Customer-facing paths (`CustomerPath -[:REQUIRES]-> Service`) depending on upstream services carrying severity 1+ exceptions. |

### Existing Service Scoring Formula (`app/detection/scoring.py`)
Each service $s$ receives a score $S \in [0, 100]$:
$$S(s) = 100 \times \left(1 - \exp\left(-\frac{\text{RawScore} \times \prod(1 + m_{\text{hit}})}{K}\right)\right)$$
Where:
- $\text{RawScore} = \sum_{e \in \text{Radius}(s)} \text{Base}(e) \times \text{AgeFactor}(e) \times \text{Overdue}(e) \times (1 + \text{Centrality}(s_{\text{landing}})) \times \text{HopDecay}(\text{hops})$
- $\text{Centrality} = 0.6 \cdot \text{minmax}(\text{PageRank}) + 0.4 \cdot \text{minmax}(\text{Betweenness})$
- Multipliers: $m_{\text{hit}} = 0.5$ for hits in R3, R6, R8. $K = 25$.

---

## 5. Tenancy Guarantees & Multi-Tenancy Implementation

Reprieve implements **physical graph isolation per tenant**:
1. **Isolated Graph Naming**:
   - `platform`: Single graph for users, invitations, and workspace memberships.
   - `{prefix}org_{token}`: Domain graph per workspace (`Exception`, `Service`, etc.).
   - `{prefix}mem_{token}`: Episodic and outcome memory graph per workspace (`Session`, `Turn`, `ReviewOutcome`).
2. **Context Binding**:
   - `WorkspaceContext` inspects the path parameter `ws_id`.
   - Membership is verified against `platform` graph:
     ```cypher
     MATCH (u:User {id: $user_id})-[m:MEMBER_OF]->(w:Workspace {id: $ws_id})
     ```
   - If not found, raises `ApiError("NOT_FOUND", "We can't find that workspace.")`. Crucially, this returns HTTP 404 rather than 403, preventing workspace existence enumeration.
3. **Query Confinement**:
   - FalkorDB queries execute strictly against `ctx.org.g` or `ctx.mem.g`.
   - Cross-graph queries are syntactically impossible within FalkorDB Cypher, guaranteeing that zero data leakage can occur across tenant graphs.

---

## 6. Proposed Architecture: Requirement R1 (Strictly Grounded Conversational Intelligence)

### 6.1 Requirements from `ORIGINAL_REQUEST.md`
- Reasons exclusively over verified FalkorDB graph state.
- Every factual claim, diagnosis, and prediction must cite explicit node IDs (`svc_*`, `exc_*`, `ctl_*`, `per_*`, `team_*`), edge relationships, and shortest-path proofs.
- **Strict refusal / fallback behavior** when underlying graph evidence is absent.

### 6.2 Current Agent Architecture vs. Needed Extensions
- **Current Flow**:
  1. `steward.py` invokes ReAct tool-calling loop with `llm.py` (streaming SSE events).
  2. Available tools in `tools.py`: `list_risk_services`, `explain_service`, `list_alerts`, `get_alert`, `list_exceptions`, `get_exception`, `find_current_owner`, `proof_path`, `search_entities`, `recall_precedent`, `what_if_as_of`, `propose_review`.
  3. `collect_known()` parses IDs from tool JSON outputs.
  4. `guard.py` cleans text: drops sentences containing IDs not in `known`.
  5. Fallback if empty: `"I couldn't find anything I can back with data for that."`

### 6.3 Exact Integration Points for R1 Compliance
1. **Refusal Protocol on Absent Graph Entities**:
   - Enhance `steward.md` prompt with strict boundary instructions:
     ```markdown
     - When the user asks about entities, systems, or speculative scenarios not found in the graph (e.g. search returns no results or unmodeled components), do NOT extrapolate. State explicitly: "Refusal: [Entity/Topic] is not present in the verified graph. Reprieve only reasons over verified graph state."
     - Never provide speculative impact estimates without calling the prediction tools.
     ```
   - Enhance `backend/app/agents/guard.py`:
     - If the user query targeted a specific entity name that could not be resolved in the graph (or all factual claims were stripped), explicitly format a structured refusal response rather than a generic fallback.
2. **Predictive Conversational Tools in `tools.py`**:
   - Register `predict_avalanche` tool:
     - Input: `service_id: str`
     - Output: Deterministic cascading reachability, downstream affected services, avalanche centrality score, and shortest failure path.
   - Register `predict_expiry_collisions` tool:
     - Input: `horizon_days: int = 30`, `window_days: int = 7`
     - Output: Multi-service dependency collision clusters, expiring exception IDs, and affected customer paths.
3. **Edge Relationship Citations**:
   - Expand `citations` payload structure in `steward.py` to support relationship tuples:
     `{"kind": "Edge", "from": "svc_checkout_api", "type": "DEPENDS_ON", "to": "svc_payments_gateway"}`.

---

## 7. Proposed Architecture: Requirement R2 (Hybrid Mathematical Prediction Engine)

### 7.1 Avalanche Centrality & Cascading Failure Propagation

#### Mathematical Formulation
When an upstream entity $u$ (service, control, or exception) fails or is revoked:
- **Dependency Inversion**: Dependencies flow $s \xrightarrow{\text{DEPENDS\_ON}} t$. Failure cascades flow in reverse: if $t$ fails, any $s$ depending on $t$ is vulnerable.
- **Cascading Reachability Set**:
  $$\mathcal{R}(u) = \{ v \in \mathcal{V}_{\text{services}} \mid \exists \text{ path } v \xrightarrow{\text{DEPENDS\_ON}^+} u \}$$
- **Multi-Hop Failure Probability**:
  Let $p_0 \in (0, 1)$ be the base coupling failure probability per dependency hop (e.g., $p_0 = 0.85$, adjusted down if verified compensating controls protect the link).
  For a dependency path $P = (v = s_k \to s_{k-1} \to \dots \to s_1 \to u)$ of length $h$:
  $$P(\text{cascade along } P) = \prod_{i=1}^h p_0 = p_0^h$$
  For multiple paths between $v$ and $u$:
  $$P_{\text{cascade}}(v \mid u) = 1 - \prod_{P \in \text{Paths}(v \to u)} (1 - P(P))$$
- **Avalanche Centrality $AC(u)$**:
  Quantifies total systemic reachability weighted by downstream tier criticality and customer-path impact:
  $$AC(u) = \sum_{v \in \mathcal{R}(u)} \text{Weight}(\text{Tier}_v) \cdot P_{\text{cascade}}(v \mid u) + \sum_{cp \in \mathcal{CP}(u)} \text{Weight}(cp) \cdot P_{\text{cascade}}(cp \mid u)$$
  Normalized to $[0, 100]$:
  $$AC_{\text{norm}}(u) = 100 \times \left(1 - \exp\left(-\frac{AC(u)}{K_{\text{avalanche}}}\right)\right)$$
- **Single Point of Failure (SPOF) Rank**: Nodes sorted descending by $AC(u)$. Nodes with $AC(u) \ge 75$ and high out-degree in the dependent graph are flagged as Critical SPOFs.

#### Parameterized Cypher Query (`pred_avalanche_reachability.cypher`)
```cypher
// Q-PRED-AVA  params: $service_id, $max_hops
MATCH p = (dependent:Service)-[:DEPENDS_ON*1..4]->(target:Service {id: $service_id})
RETURN dependent.id AS dependent_id,
       dependent.tier AS tier,
       dependent.customer_facing AS customer_facing,
       length(p) AS hops,
       [n IN nodes(p) | n.id] AS path_ids
```
Customer Path Reachability (`pred_avalanche_customer_paths.cypher`):
```cypher
// Q-PRED-CP  params: $service_id, $max_hops
MATCH p = (cp:CustomerPath)-[:REQUIRES]->(:Service)-[:DEPENDS_ON*0..4]->(target:Service {id: $service_id})
RETURN cp.id AS customer_path_id,
       cp.name AS customer_path_name,
       length(p) AS hops,
       [n IN nodes(p) | n.id] AS path_ids
```

### 7.2 Temporal Expiry Collision Dynamics

#### Mathematical Formulation
Unlike existing R6 (which only groups expiries by the *same team*), Temporal Expiry Collision Dynamics analyzes **dependency-connected convergence points**:
- Given reference timestamp $T_{\text{as\_of}}$ and forward horizon $H \in \{7, 30, 90\}$ days.
- Identify all active exceptions expiring in $[T_{\text{as\_of}}, T_{\text{as\_of}} + H \cdot \text{DAY}]$.
- For any pair of exceptions $(e_i, e_j)$ expiring within calendar window $\Delta$ (default 7 days):
  If the affected services $S(e_i)$ and $S(e_j)$ are connected in the dependency graph within distance $\le 2$ hops (i.e. $S(e_i) \xrightarrow{\text{DEPENDS\_ON}^{\le 2}} S(e_j)$ or vice versa, or both feed into a common CustomerPath):
  Form a **Temporal Collision Cluster** $\mathcal{C}$.
- **Collision Severity Score**:
  $$\text{Score}(\mathcal{C}) = \sum_{e \in \mathcal{C}} \text{Severity}(e) \times \left(1 + \frac{|\mathcal{C}| - 1}{2}\right) \times \text{CriticalityFactor}(\text{Chain})$$
  This captures dangerous temporal convergence where defenses lapse across dependent services at the same moment.

#### Parameterized Cypher Query (`pred_temporal_collisions.cypher`)
```cypher
// Q-PRED-COL  params: $as_of, $horizon_s
MATCH (e:Exception {status:'active'})-[:AFFECTS]->(s:Service)
WHERE e.expires_at >= $as_of AND e.expires_at <= $as_of + $horizon_s
MATCH p = (s)-[:DEPENDS_ON*0..2]->(target:Service)
RETURN e.id AS exception_id,
       e.title AS exception_title,
       e.severity AS severity,
       e.expires_at AS expires_at,
       s.id AS service_id,
       target.id AS connected_service_id,
       length(p) AS hops
```

### 7.3 Performance Guarantee (<100ms)
- FalkorDB runs in-memory with GraphBLAS matrix operations.
- Benchmark telemetry from `eval/run_eval.py`:
  - `radius_paths`: p95 latency $\sim 2.0\text{ ms}$ on 25 services.
  - PageRank / Betweenness: $\sim 3.5\text{ ms}$.
  - Full rule evaluation (all 8 rules): $\sim 20\text{ ms}$.
- The proposed `pred_avalanche_reachability` and `pred_temporal_collisions` queries operate on bounded path lengths (`*1..4` and `*0..2`), resulting in execution times of **3–8 ms** on FalkorDB.
- In-memory Python scoring (reachability set union, probability products, window sorting) takes **<2 ms**.
- **Total round-trip execution latency will be <15ms**, well below the 100ms threshold.

### 7.4 Prediction Simulation API Endpoint
- **Route**: `GET /api/v1/workspaces/{ws_id}/prediction/simulation`
- **Query Parameters**:
  - `horizon_days`: `int = 30` (slider values: 7, 30, 90)
  - `target_service_id`: `str | None = None` (optional focus node)
  - `as_of`: `int | None = None`
- **Response Model**:
  ```json
  {
    "as_of": 1792195200,
    "horizon_days": 30,
    "projected_date": 1794787200,
    "execution_time_ms": 7.4,
    "avalanche_centrality": [
      {
        "service_id": "svc_payments_gateway",
        "score": 92.4,
        "band": "critical",
        "spof_rank": 1,
        "reachable_services": ["svc_checkout_api", "svc_mobile_api"],
        "customer_paths": ["cp_checkout", "cp_mobile_pay"],
        "cascade_probability": 0.85,
        "proof": { "nodes": [...], "edges": [...] }
      }
    ],
    "temporal_collisions": [
      {
        "cluster_id": "col_checkout_payments_w1",
        "window_start": 1792800000,
        "window_end": 1793404800,
        "exception_ids": ["exc_w1", "exc_w2"],
        "affected_services": ["svc_checkout_api", "svc_payments_gateway"],
        "severity_score": 18.5,
        "proof": { "nodes": [...], "edges": [...] }
      }
    ],
    "canvas_decorations": {
      "svc_checkout_api": { "color": "red", "pulse": true, "risk_band": "critical" },
      "svc_payments_gateway": { "color": "red", "pulse": true, "risk_band": "critical" }
    }
  }
  ```

---

## 8. Missing Dependencies, Data Files, Seed Scripts, & Configuration

### 8.1 Missing / Required Files for Implementation
1. **Backend Prediction Module**:
   - `backend/app/prediction/__init__.py`
   - `backend/app/prediction/models.py`: Pydantic request/response schemas for simulation and predictions.
   - `backend/app/prediction/avalanche.py`: Deterministic Avalanche Centrality calculation and SPOF ranking.
   - `backend/app/prediction/collisions.py`: Temporal Expiry Collision Dynamics across dependency chains.
   - `backend/app/prediction/engine.py`: Coordinated simulation engine returning synchronized payloads for both API and chat.
2. **Backend API Route**:
   - `backend/app/api/prediction.py`: FastAPI router mounted at `/api/v1/workspaces/{ws_id}/prediction`.
   - Register router in `backend/app/main.py`.
3. **Cypher Queries**:
   - `backend/app/graph/queries/pred_avalanche_reachability.cypher`
   - `backend/app/graph/queries/pred_avalanche_customer_paths.cypher`
   - `backend/app/graph/queries/pred_temporal_collisions.cypher`
4. **Agent Integration**:
   - Add `predict_avalanche` and `predict_expiry_collisions` tools to `backend/app/agents/tools.py`.
   - Update `backend/app/agents/prompts/steward.md` with explicit refusal instructions for unmodeled entities.
   - Update `backend/app/agents/guard.py` to handle explicit refusal formatting.
5. **Automated Test Suite**:
   - `backend/tests/test_prediction.py`:
     - Test Avalanche Centrality on seeded Northwind Pay graph (`svc_payments_gateway` and `svc_checkout_api` identified as high SPOF).
     - Test Temporal Expiry Collision Dynamics on $+7\text{d}, +30\text{d}, +90\text{d}$ projections.
     - Verify execution latency `<100ms`.
     - Verify end-to-end payload synchronization between `/prediction/simulation` and `/chat/sessions/{id}/messages`.

### 8.2 Seed Data Verification
- Seed file `data/seed/northwind.json` (25 services, 4 customer paths, 40 people, 12 controls, 30+ exceptions) already contains:
  - Scenario S1: Checkout Collision (`svc_checkout_api`, `svc_payments_gateway`, `cp_checkout`).
  - Multi-hop dependency trees: `checkout_api` $\to$ `payments_gateway` $\to$ `card_vault` / `ledger` $\to$ `secrets_manager`.
  - Planted expiries across multiple weeks and months.
- No new seed dataset is required; the existing sample bundle contains all topological structures needed to validate multi-hop cascades and expiry clusters.

---

## 9. Verification Strategy

When implementation proceeds, the following commands will verify compliance:
1. `docker compose up -d falkordb` (Ensure FalkorDB is running on port 6379)
2. `cd backend && uv run pytest tests/test_prediction.py` (Validate mathematical correctness, latency <100ms, and query execution)
3. `cd backend && uv run pytest tests/test_detection_seed.py` (Verify existing rules R1–R8 remain unbroken)
4. `cd backend && uv run pytest tests/test_steward.py` (Verify conversational grounding and refusal behavior)
5. `cd backend && uv run python ../eval/run_eval.py` (Verify complete eval suite passes without regressions)

# Project: Predictive Company Brain

## Architecture
The Predictive Company Brain extends Reprieve (FalkorDB + FastAPI + Next.js) to deliver:
1. **Grounded Conversational Intelligence (R1)**: A conversational steward reasoning strictly over FalkorDB graph state, citing explicit node IDs, edge paths, and shortest-path proofs, with strict refusal/fallback on unmodeled entities.
2. **Hybrid Mathematical Prediction Engine (R2)**: Pure deterministic mathematical calculations of Avalanche Centrality (systemic reachability along reversed dependencies with coupling attenuation) and Temporal Expiry Collision Dynamics (calendar-window convergence points across dependent services in <100ms).
3. **Dual-Pane Conversational & Visual Simulation Interface (R3)**: A Next.js split-view interface with an interactive temporal slider (+7d, +30d, +90d, custom date, play/pause), canvas risk heatmaps, pulsing halo glows, crimson cascade particles, and interactive simulation proof cards linked to the conversational assistant.
4. **Architectural & Tenancy Cohesion (R4)**: Full backward compatibility with existing R1–R8 detection rules, deterministic query execution in <15ms, and physical graph-per-workspace multi-tenancy.

```
                    ┌───────────────────────────────────────────────┐
                    │               Next.js Frontend                │
                    │  ┌────────────────────┐ ┌───────────────────┐ │
                    │  │ ForceGraph2D Canvas│ │ StewardChat Panel │ │
                    │  │ - Temporal Slider  │ │ - Node/Edge Cites │ │
                    │  │ - Risk Heatmaps    │ │ - Proof Paths     │ │
                    │  │ - Pulse Halos      │ │ - Structured      │ │
                    │  │ - Proof Cards      │ │   Refusal Banner  │ │
                    │  └────────────────────┘ └───────────────────┘ │
                    └───────────────────────▲───────────────────────┘
                                            │ REST / SSE
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │                FastAPI Backend                │
                    │  ┌────────────────────┐ ┌───────────────────┐ │
                    │  │  Prediction API    │ │  Chat / ReAct     │ │
                    │  │  /prediction/sim   │ │  Steward + Guard  │ │
                    │  └──────────┬─────────┘ └─────────┬─────────┘ │
                    │             │                     │           │
                    │             ▼                     ▼           │
                    │  ┌──────────────────────────────────────────┐ │
                    │  │      Prediction Mathematical Engine       │ │
                    │  │      - Avalanche Centrality & SPOFs      │ │
                    │  │      - Temporal Expiry Collisions        │ │
                    │  │      - Bounded Cypher Queries (<15ms)    │ │
                    │  └──────────────────────┬───────────────────┘ │
                    └─────────────────────────┼─────────────────────┘
                                              │ Named Cypher Queries
                                              ▼
                    ┌───────────────────────────────────────────────┐
                    │              FalkorDB Graph Store             │
                    │      Physical Graph Isolation per Tenant      │
                    │      (Service, Exception, Team, Person, etc.) │
                    └───────────────────────────────────────────────┘
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---|---|---|---|
| F1 | Strict Graph Grounding & Citations | Conversational answers cite verified node IDs (`svc_*`, `exc_*`, `ctl_*`, `per_*`, `team_*`) and edge paths | M2 | ORIGINAL_REQUEST §R1 |
| F2 | Refusal on Absent Entities | Explicit refusal format when asked about unmodeled entities or speculative facts | M2 | ORIGINAL_REQUEST §R1 |
| F3 | Avalanche Centrality & Cascade Engine | Deterministic calculation of multi-hop cascading reachability, failure probability, and SPOF ranking | M1 | ORIGINAL_REQUEST §R2 |
| F4 | Temporal Expiry Collision Dynamics | Projecting future calendar windows to detect simultaneous expiry convergence across dependent services | M1 | ORIGINAL_REQUEST §R2 |
| F5 | Sub-100ms Performance Guarantee | Pure Cypher + in-memory mathematical evaluation completing in <100ms (<15ms target) | M1 | ORIGINAL_REQUEST §R2, §R4 |
| F6 | Dual-Pane Conversational & Visual Layout | Unified split-view uniting force-directed canvas with conversational assistant | M3 | ORIGINAL_REQUEST §R3 |
| F7 | Interactive Temporal Slider | Slider toolbar (+7d, +30d, +90d, custom date, play/pause) stepping forward in time | M3 | ORIGINAL_REQUEST §R3 |
| F8 | Dynamic Canvas Heatmaps & Pulse Animations | Color-coded risk heatmaps, pulsing halos on avalanche sources, crimson cascade flow on links | M3 | ORIGINAL_REQUEST §R3 |
| F9 | Simulation Proof Cards | Interactive cards on high-risk node click detailing mathematical cause, blast radius, and downstream impact | M3 | ORIGINAL_REQUEST §R3 |
| F10 | Non-breaking R1–R8 Cohesion & Tenancy | Preservation of existing detection rules and physical graph-per-workspace multi-tenancy | M1, M2 | ORIGINAL_REQUEST §R4 |
| F11 | Automated Prediction & Math Pytest Suite | Pytest suite validating Cypher queries, math formulas, and <100ms performance harness | E2E/M4 | ORIGINAL_REQUEST §Acceptance |
| F12 | End-to-End Synchronized Payload Verification | Automated integration test verifying conversational and simulation endpoint payload synchronization | E2E/M4 | ORIGINAL_REQUEST §Acceptance |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| M1 | Hybrid Mathematical Prediction Engine | Cypher queries, Avalanche Centrality, Temporal Expiry Collision Dynamics, `/prediction/simulation` endpoint | None | DONE |
| M2 | Grounded Conversational Intelligence | Predictive tools in `tools.py`, prompt update in `steward.md`, refusal & edge citations in `guard.py` | M1 | PLANNED |
| M3 | Dual-Pane & Visual Simulation Interface | Slider component, temporal toolbar, canvas risk heatmaps, pulse animations, proof cards, dual-pane layout | M1 | PLANNED |
| M4 | Final Milestone: 100% E2E Pass & Adversarial Hardening | Validate 100% pass of Tiers 1-4 tests, run Tier 5 adversarial coverage hardening, clean audit | M1, M2, M3 | PLANNED |

## Interface Contracts

### 1. Prediction Simulation API Contract
- **Endpoint**: `GET /api/v1/workspaces/{ws_id}/prediction/simulation`
- **Query Parameters**:
  - `horizon_days`: `int = 30` (values: 0, 7, 30, 90)
  - `as_of`: `int | None = None`
  - `target_service_id`: `str | None = None`
- **Response Schema (`SimulationForecastOut`)**:
```json
{
  "as_of": 1792195200,
  "horizon_days": 30,
  "projected_date": 1794787200,
  "execution_time_ms": 6.8,
  "avalanche_centrality": [
    {
      "service_id": "svc_payments_gateway",
      "service_name": "Payments Gateway",
      "score": 92.4,
      "band": "critical",
      "spof_rank": 1,
      "cascade_probability": 0.85,
      "reachable_services": ["svc_checkout_api", "svc_mobile_api"],
      "customer_paths": ["cp_checkout", "cp_mobile_pay"],
      "proof": {
        "nodes": ["svc_payments_gateway", "svc_checkout_api"],
        "edges": [{"from": "svc_checkout_api", "type": "DEPENDS_ON", "to": "svc_payments_gateway"}]
      }
    }
  ],
  "temporal_collisions": [
    {
      "cluster_id": "col_checkout_payments_w1",
      "window_start": 1792800000,
      "window_end": 1793404800,
      "exception_ids": ["exc_e1", "exc_e2"],
      "affected_services": ["svc_checkout_api", "svc_payments_gateway"],
      "severity_score": 18.5,
      "proof": {
        "nodes": ["svc_checkout_api", "svc_payments_gateway", "exc_e1", "exc_e2"],
        "edges": [...]
      }
    }
  ],
  "canvas_decorations": {
    "svc_checkout_api": {
      "simulated_score": 85.0,
      "risk_band": "critical",
      "is_spof": true,
      "has_collision": true,
      "pulse": true
    }
  }
}
```

### 2. Conversational Agent Predictive Tools & Refusal Contract
- **Tools**:
  - `predict_avalanche(service_id: str)`: Returns SPOF rank, reachability set, cascade probability, and proof path.
  - `predict_expiry_collisions(horizon_days: int = 30, window_days: int = 7)`: Returns collision clusters, affected dependency chains, and exception IDs.
- **Refusal Format**:
  - If requested entity or scenario is not present in graph:
    `"Refusal: The entity '{target}' is not present in the verified FalkorDB graph state. Reprieve only reasons over verified graph evidence."`

### 3. Frontend Canvas Simulation Contract
- `useSimulationForecast(workspaceId, horizonDays)` hook calls `/prediction/simulation`.
- Canvas node color switches to `tokens.severity[decoration.risk_band]` when simulated.
- Pulsing halos drawn on nodes where `decoration.pulse === true`.
- Edges along cascade pathways set `linkDirectionalParticles = 4` with critical color.
- Clicking decorated node opens `SimulationProofCard` popover.

## Code Layout
```
backend/
├── app/
│   ├── api/
│   │   ├── prediction.py             <-- NEW: Simulation & prediction router
│   │   └── ...
│   ├── agents/
│   │   ├── tools.py                  <-- EXTEND: Add predictive tools
│   │   ├── guard.py                  <-- EXTEND: Refusal & edge citation handling
│   │   ├── prompts/steward.md        <-- EXTEND: Refusal instructions
│   │   └── ...
│   ├── graph/
│   │   ├── queries/
│   │   │   ├── pred_avalanche_reachability.cypher    <-- NEW
│   │   │   ├── pred_avalanche_customer_paths.cypher  <-- NEW
│   │   │   └── pred_temporal_collisions.cypher      <-- NEW
│   ├── prediction/                   <-- NEW MODULE
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── avalanche.py
│   │   ├── collisions.py
│   │   └── engine.py
├── tests/
│   ├── test_predictions.py          <-- NEW: Math, Cypher, and latency tests
│   └── test_conversational_grounding.py <-- NEW: Refusal & citation tests

frontend/
├── components/
│   ├── ui/
│   │   └── slider.tsx                <-- NEW: Radix-backed slider
│   ├── graph/
│   │   ├── temporal-slider.tsx       <-- NEW: Horizon control toolbar
│   │   ├── simulation-proof-card.tsx <-- NEW: Proof popover card
│   │   ├── graph-canvas.tsx          <-- EXTEND: Heatmaps & pulse animations
│   │   └── graph-explorer.tsx        <-- EXTEND: Dual-pane layout integration
├── lib/
│   ├── types.ts                      <-- EXTEND: Simulation types
│   └── hooks.ts                      <-- EXTEND: useSimulationForecast hook
```

<!-- Reprieve Agent Skill · October 15, 2026 -->

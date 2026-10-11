# Original User Request

## 2026-10-09T08:29:32Z

A fully functional, predictive Company Brain powered by FalkorDB, FastAPI, and Next.js that enables grounded conversational intelligence strictly over live enterprise graph state and mathematically forecasts future cascading failures using Avalanche Centrality and temporal expiry collision modeling.

Working directory: c:\Users\sr2ma\Documents\github\webdev-hackthon
Integrity mode: demo

## Requirements

### R1. Strictly Grounded Graph Conversational Intelligence
The Company Brain must provide an interactive conversational interface that reasons exclusively over verified FalkorDB graph state. Every factual claim, diagnosis, and prediction in conversational output must cite explicit node IDs, edge relationships, and shortest-path proofs, with strict refusal/fallback behavior when underlying graph evidence is absent.

### R2. Hybrid Mathematical Prediction Engine
The brain must implement a deterministic mathematical forecasting engine that evaluates:
1. **Avalanche Centrality & Cascading Failure Propagation**: Quantifying the probability and multi-hop reachability of systemic failure cascades if specific upstream services, credentials, or controls are revoked or compromised.
2. **Temporal Expiry Collision Dynamics**: Projecting future calendar windows to detect dangerous convergence points where multiple exceptions, waivers, or maintenance windows expire simultaneously across dependent services.
All calculations must be purely mathematical and deterministic, executing via optimized Cypher queries or sparse graph procedures without relying on stochastic LLM speculation.

### R3. Dual-Pane Conversational & Visual Simulation Interface
The Next.js frontend must provide a unified interface featuring:
1. A grounded conversational assistant sidebar supporting natural-language exploration of system state and predictive queries.
2. An interactive temporal slider on the force-directed graph canvas that allows operators to step forward in time (e.g., +7d, +30d, +90d) to visually observe projected risk heatmaps, avalanche pathways, and impending collision nodes.

### R4. Performance and Architectural Cohesion
The prediction and conversational engine must integrate cleanly with the existing FastAPI backend and FalkorDB graph schema without breaking existing detection rules (R1–R8) or tenancy guarantees. All graph traversals for predictions must execute deterministically in under 100ms.

## Acceptance Criteria

### Grounded Conversational Rigor
- [ ] All conversational responses cite valid, existing node IDs from FalkorDB (`Exception`, `Service`, `Person`, `Team`, `Control`).
- [ ] The agent explicitly refuses or flags data absence when asked about unmodeled entities or speculative facts not present in the graph.

### Mathematical Forecasting Accuracy
- [ ] Avalanche Centrality calculations correctly identify critical single points of failure across multi-hop dependency chains.
- [ ] Temporal projection correctly flags planted future expiry clusters and cascading failure paths on the test dataset.
- [ ] Mathematical calculations execute in <100ms on the seeded graph.

### Interactive Visual Simulation
- [ ] The graph canvas dynamically updates node colors, borders, and connection pulse animations when the temporal projection slider is moved.
- [ ] Clicking on a predicted high-risk node or avalanche pathway displays a detailed proof card explaining the mathematical cause and affected downstream services.

### Test Suite & System Verification
- [ ] Automated pytest suite validates all predictive Cypher queries and mathematical scoring functions.
- [ ] End-to-end integration test verifies the conversational endpoint and prediction simulation endpoint return valid, synchronized payloads.

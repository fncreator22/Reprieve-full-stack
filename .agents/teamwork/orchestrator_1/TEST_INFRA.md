# E2E Test Infra: Predictive Company Brain

## Test Philosophy
- **Opaque-Box & Requirement-Driven**: Tests derive directly from `ORIGINAL_REQUEST.md` and user-facing requirements.
- **Strict Grounding**: Zero tolerance for hallucinated node IDs or absent-entity speculation.
- **Mathematical Invariant Verification**: Avalanche Centrality, failure cascade probabilities, and temporal convergence calculations are tested against known deterministic graph topologies.
- **Latency Guarantees**: Statistical p95 benchmark asserting all predictive graph traversals complete in <100ms.
- **Methodology**: 4-Tier verification (Tier 1 Feature, Tier 2 Boundary & Corner, Tier 3 Pairwise Combinations, Tier 4 Real-World Enterprise Workloads).

## Feature Inventory
| # | Feature | Source (Requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|:---:|:---:|:---:|
| F1 | Strict Graph Grounding & Citations | ORIGINAL_REQUEST §R1 | ≥5 | ≥5 | ✓ |
| F2 | Refusal on Absent Entities | ORIGINAL_REQUEST §R1 | ≥5 | ≥5 | ✓ |
| F3 | Avalanche Centrality & Cascade Engine | ORIGINAL_REQUEST §R2 | ≥5 | ≥5 | ✓ |
| F4 | Temporal Expiry Collision Dynamics | ORIGINAL_REQUEST §R2 | ≥5 | ≥5 | ✓ |
| F5 | Sub-100ms Performance Guarantee | ORIGINAL_REQUEST §R2, §R4 | ≥5 | ≥5 | ✓ |
| F6 | Dual-Pane Conversational & Visual Layout | ORIGINAL_REQUEST §R3 | ≥5 | ≥5 | ✓ |
| F7 | Interactive Temporal Slider | ORIGINAL_REQUEST §R3 | ≥5 | ≥5 | ✓ |
| F8 | Dynamic Canvas Heatmaps & Pulse Animations | ORIGINAL_REQUEST §R3 | ≥5 | ≥5 | ✓ |
| F9 | Simulation Proof Cards | ORIGINAL_REQUEST §R3 | ≥5 | ≥5 | ✓ |
| F10 | Non-breaking R1–R8 Cohesion & Tenancy | ORIGINAL_REQUEST §R4 | ≥5 | ≥5 | ✓ |
| F11 | Automated Prediction & Math Pytest Suite | ORIGINAL_REQUEST §Acceptance | ≥5 | ≥5 | ✓ |
| F12 | End-to-End Synchronized Payload Verification | ORIGINAL_REQUEST §Acceptance | ≥5 | ≥5 | ✓ |

## Test Architecture
- **Backend Test Runner**: `pytest` executed via `cd backend && uv run pytest` with `testpaths = ["tests"]`.
- **FalkorDB Test Isolation**: Live FalkorDB with dynamic graph naming `test_{node_name}` and automatic graph deletion teardown.
- **Performance Harness**: Benchmark suite running $N=30$ query iterations and asserting $p95 < 100\text{ms}$.
- **Grounding & Guard Test Suite**: Mocked tool outputs verifying `ground()` sentence filtering and structured refusal formatting.
- **Frontend / Integration Harness**: Next.js App Router and FastAPI integration tests verifying `/prediction/simulation` and chat streaming.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|---|---|---|
| 1 | **Planted S1 Cascade Drill (Checkout Collision)** | F3, F4, F5, F7, F8, F9 | High |
| 2 | **Planted S5 Temporal Expiry Cluster (+7d to +30d)** | F4, F7, F8, F9 | High |
| 3 | **Adversarial Hallucination Defense (Absent Entities)**| F1, F2, F6 | Medium |
| 4 | **Multi-Tenant Graph Isolation & Zero Leakage** | F10, F3, F4 | Medium |
| 5 | **Simultaneous Slider Scrubbing & Conversational Query**| F6, F7, F8, F9, F12 | High |

## Coverage Thresholds
- Tier 1: ≥5 test cases per feature (60+ total)
- Tier 2: ≥5 test cases per feature for boundaries/extremes (60+ total)
- Tier 3: Pairwise cross-feature interaction tests (12+ tests)
- Tier 4: Realistic enterprise application scenarios (5 tests)
- **Total Minimum Target**: ~140 test cases

<!-- Reprieve Agent Skill · October 15, 2026 -->

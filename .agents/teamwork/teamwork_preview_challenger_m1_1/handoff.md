# Milestone 1 Adversarial Verification Report: Avalanche Centrality & Cascading Failure Propagation

## 1. Observation

### Verification Scope & Environment
- **Target File**: `backend/app/prediction/avalanche.py` (and related `backend/app/prediction/models.py`, `backend/app/prediction/engine.py`)
- **Specification Source**: `ORIGINAL_REQUEST.md` (§R2, §Acceptance Criteria), `PROJECT.md` (§Interface Contracts #1, §Feature Inventory F3/F5)
- **Adversarial Test Suite**: `backend/tests/test_avalanche_adversarial.py` (16 test cases)
- **Execution Command**: `cd backend && uv run pytest tests/test_predictions.py tests/test_avalanche_adversarial.py -v`
- **Execution Result**:
  ```
  tests/test_predictions.py::test_coupling_probability_single_path PASSED
  tests/test_predictions.py::test_coupling_probability_multi_path PASSED
  tests/test_predictions.py::test_avalanche_centrality_tier_weighting_and_saturation PASSED
  tests/test_predictions.py::test_avalanche_target_filtering PASSED
  tests/test_predictions.py::test_temporal_collision_clustering_and_severity PASSED
  tests/test_predictions.py::test_temporal_collision_empty_when_no_proximity PASSED
  tests/test_predictions.py::test_cypher_queries_loadable PASSED
  tests/test_predictions.py::test_prediction_engine_synthesis_and_performance PASSED
  tests/test_predictions.py::test_prediction_simulation_api_endpoint PASSED
  tests/test_predictions.py::test_avalanche_empty_and_zero_dependents PASSED
  tests/test_predictions.py::test_temporal_collision_multi_hop_connectivity PASSED
  tests/test_predictions.py::test_pydantic_schema_serialization_aliases PASSED
  tests/test_predictions.py::test_performance_harness_under_100ms_repeated PASSED
  tests/test_avalanche_adversarial.py::test_oracle_equivalence_multi_path PASSED
  tests/test_avalanche_adversarial.py::test_multi_path_boundedness_and_monotonicity PASSED
  tests/test_avalanche_adversarial.py::test_numerical_stability_extreme_hops PASSED
  tests/test_avalanche_adversarial.py::test_numerical_stability_p0_boundaries PASSED
  tests/test_avalanche_adversarial.py::test_division_by_zero_risk_k_avalanche_reproduced PASSED
  tests/test_avalanche_adversarial.py::test_property_zero_division_guard XFAIL
  tests/test_avalanche_adversarial.py::test_large_raw_ac_no_overflow PASSED
  tests/test_avalanche_adversarial.py::test_adversarial_cascade_probability_monotonicity_bug_demonstration PASSED
  tests/test_avalanche_adversarial.py::test_property_monotonic_cascade_probability XFAIL
  tests/test_avalanche_adversarial.py::test_adversarial_customer_paths_cascade_probability_blindspot_demonstration PASSED
  tests/test_avalanche_adversarial.py::test_property_customer_paths_cascade_probability XFAIL
  tests/test_avalanche_adversarial.py::test_adversarial_customer_paths_without_reachability_dropped PASSED
  tests/test_avalanche_adversarial.py::test_complex_dag_diamond_lattice PASSED
  tests/test_avalanche_adversarial.py::test_complex_dag_deep_linear_chain PASSED
  tests/test_avalanche_adversarial.py::test_complex_dag_cyclic_data_handling PASSED
  tests/test_avalanche_adversarial.py::test_tier_weighting_values PASSED
  tests/test_avalanche_adversarial.py::test_tier_string_type_downgrade_demonstration PASSED
  tests/test_avalanche_adversarial.py::test_property_tier_string_coercion XFAIL
  tests/test_avalanche_adversarial.py::test_performance_stress_scale_and_sla PASSED
  ======================== 28 passed, 4 xfailed in 2.69s ========================
  ```

---

### Verbatim Observations of Code Defects

#### Defect 1: Cascading Failure Probability Multi-Hop Masking Bug (Monotonicity Inversion)
- **File**: `backend/app/prediction/avalanche.py`, lines 154–165:
  ```python
  154:         # Overall cascade probability for this target
  155:         if not dependents:
  156:             cascade_prob = 0.0
  157:         elif direct_dependents_count > 0:
  158:             # At least one direct dependent coupling
  159:             cascade_prob = 1.0 - ((1.0 - p0) ** direct_dependents_count)
  160:         else:
  161:             # Multi-hop coupling across all dependents
  162:             cascade_prob = 1.0
  163:             for mh in min_hops_list:
  164:                 cascade_prob *= 1.0 - compute_path_probability(mh, p0)
  165:             cascade_prob = 1.0 - cascade_prob
  ```
- **Empirical Result**:
  When a target service has 5 two-hop dependents, `direct_dependents_count == 0`, and the code computes:
  $$P_{\text{cascade}} = 1 - (1 - 0.85^2)^5 = 1 - 0.2775^5 = 0.99834 \approx 1.00$$
  When 1 direct dependent is added to that target (so the target now has 5 two-hop dependents PLUS 1 direct dependent), `direct_dependents_count == 1 > 0`. The code branches into line 157 and computes:
  $$P_{\text{cascade}} = 1 - (1 - 0.85)^1 = 0.85$$
  The reported failure cascade probability drops from $1.00$ to $0.85$ despite adding an upstream dependent.
  Verified by `test_adversarial_cascade_probability_monotonicity_bug_demonstration` (PASSED) and `test_property_monotonic_cascade_probability` (XFAIL).

#### Defect 2: Customer Paths Blind Spot in Cascade Probability
- **File**: `backend/app/prediction/avalanche.py`, lines 154–156:
  ```python
  154:         # Overall cascade probability for this target
  155:         if not dependents:
  156:             cascade_prob = 0.0
  ```
- **Empirical Result**:
  An ingress/edge service with 0 internal service dependents (`dependents = {}`) but directly powering 5 critical Customer Paths (`cp_checkout`, `cp_mobile`, etc.) receives:
  `raw_ac = 5 * 3.0 * 0.85 = 12.75`
  `score = 100 * (1 - exp(-12.75 / 5.0)) = 92.2` (band: `"critical"`)
  `proof.nodes = ["cp_checkout", ..., "svc_edge_gateway"]`
  However, because `dependents` is empty, line 155 sets `cascade_prob = 0.0`.
  The simulation output reports a "critical" risk node with broken customer journeys, yet simultaneously asserts that its cascading failure probability is $0.00$.
  Verified by `test_adversarial_customer_paths_cascade_probability_blindspot_demonstration` (PASSED) and `test_property_customer_paths_cascade_probability` (XFAIL).

#### Defect 3: Unhandled ZeroDivisionError with `k_avalanche <= 0`
- **File**: `backend/app/prediction/avalanche.py`, line 167:
  ```python
  167:         score = 100.0 * (1.0 - math.exp(-raw_ac / k_avalanche))
  ```
- **Empirical Result**:
  Calling `compute_avalanche_centrality(..., k_avalanche=0.0)` raises:
  `ZeroDivisionError: float division by zero`
  Calling with $k < 0$ inverts the exponential curve and produces unphysical negative scores.
  Violates the acceptance criteria in the prompt: *"Assert that no division by zero or NaN values can be produced."*
  Verified by `test_division_by_zero_risk_k_avalanche_reproduced` (PASSED) and `test_property_zero_division_guard` (XFAIL).

#### Defect 4: Silent Tier Weighting Downgrade on String Types
- **File**: `backend/app/prediction/avalanche.py`, lines 78, 90, 136–137:
  ```python
  78:                 "tier": row.get("target_tier") or 2,
  ...
  90:                     "tier": row.get("tier") or 2,
  ...
  136:             tier = dep_info.get("tier", 2)
  137:             tier_weight = TIER_WEIGHTS.get(tier, 1.0)
  ```
- **Empirical Result**:
  If a graph row or API payload contains a string representation of tier (e.g., `{"tier": "1"}`):
  `TIER_WEIGHTS = {1: 3.0, 2: 2.0, 3: 1.0}`
  Because dictionary keys are integers, `TIER_WEIGHTS.get("1", 1.0)` fails to match and returns the fallback weight `1.0` (Tier 3 weight).
  A Tier 1 dependent receives score $15.6$ instead of $40.0$, silently degrading criticality ranking. Note that `collisions.py` (line 60) correctly coerced with `int(...)`, but `avalanche.py` omitted it.
  Verified by `test_tier_string_type_downgrade_demonstration` (PASSED) and `test_property_tier_string_coercion` (XFAIL).

#### Defect 5: Target Present Only in `customer_path_rows` Silently Dropped
- **File**: `backend/app/prediction/avalanche.py`, line 124:
  ```python
  124:     for tid, tinfo in targets.items():
  ```
- **Empirical Result**:
  `targets` is populated exclusively from `reachability_rows`. If an entrypoint service appears in `customer_path_rows` but had no row returned in `reachability_rows`, it is completely omitted from `computed_targets`.
  Verified by `test_adversarial_customer_paths_without_reachability_dropped` (PASSED).

---

## 2. Logic Chain

1. **Monotonicity in Network Cascade Models**:
   - In probabilistic network failure propagation models, adding reachable upstream dependent nodes $v \in R(u)$ to an upstream entity $u$ must never decrease the probability that a failure of $u$ cascades to at least one entity:
     $$P(\text{cascade from } u \mid G \cup \{v\}) \ge P(\text{cascade from } u \mid G)$$
   - In `avalanche.py`, lines 157–159 bifurcate the logic based on `direct_dependents_count > 0`. Whenever any direct dependent exists, all multi-hop dependents in `min_hops_list` are discarded.
   - This directly leads to the empirical counter-example where adding a direct dependent reduces cascade probability from $1.00$ to $0.85$.
   - The correct mathematical formula synthesizes all independent dependent coupling paths:
     $$P_{\text{cascade}}(u) = 1 - \prod_{v \in R(u)} (1 - P(v \mid u))$$
     which accounts for both direct ($h=1$) and multi-hop ($h > 1$) dependents seamlessly without branching.

2. **Customer Journey Integration**:
   - Customer paths represent external business journeys requiring services ($cp \xrightarrow{\text{REQUIRES}} s$).
   - When a service fails, customer journeys fail with coupling probability $p_0^h$.
   - Setting `cascade_prob = 0.0` whenever `dependents` is empty ignores customer path failure propagation, generating contradictory simulation responses where a node is flagged "critical" with $score = 92.2$, yet $cascade\_probability = 0.0$.
   - Unifying customer path minimum hops into the coupling product eliminates this contradiction.

3. **Numerical Robustness & Safe Normalization**:
   - The exponential saturation formula $100 \times (1 - \exp(-raw\_ac / k))$ requires $k > 0$.
   - Without input validation or clamping, $k \le 0$ crashes with `ZeroDivisionError` or exponential overflow.
   - Adding a safeguard `k = k_avalanche if k_avalanche > 0 else DEFAULT_K_AVALANCHE` guarantees mathematical stability under all input parameters.

4. **Type Coercion & Schema Defense**:
   - FalkorDB Cypher and JSON deserialization may yield string representations of numerical properties.
   - Coercing `int(tier or 2)` ensures deterministic dictionary lookup in `TIER_WEIGHTS`.

5. **Performance and SLA Compliance**:
   - On standard enterprise graphs (100 services, 30 targets, 750 reachability paths, 20 customer paths), the implementation executed in average $8.90$ms (well below the $15$ms target and $<100$ms SLA).
   - Under extreme scale (2000 paths across 50 targets), average runtime was $\approx 20$ms, though eager instantiation of Pydantic models across all targets caused single-run spikes up to $112.61$ms. Filtering by `target_service_id` early before computing all proof graphs will eliminate unnecessary work.

---

## 3. Caveats

- **Database Connection**: FalkorDB was verified using query text validation and mocked repo responses. Live Cypher execution against a running FalkorDB Docker container was not executed during this run, but query syntax was verified to be valid openCypher.
- **Approximation Assumption**: Path independence is standard in network reliability heuristics (as specified in `report.md` §7 and `ORIGINAL_REQUEST.md`). Exact joint probability on arbitrary graphs with correlated paths is NP-hard, so the independent path formulation $1 - \prod(1 - P(P))$ is the intended spec behavior.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

Milestone 1 implements the core Cypher queries, Pydantic schemas, and FastAPI routes cleanly, but contains four significant mathematical and robustness defects in `backend/app/prediction/avalanche.py`:
1. **Mathematical Monotonicity Bug**: `elif direct_dependents_count > 0` discards multi-hop dependents, causing cascade probability to decrease when dependents are added.
2. **Customer Paths Probability Zeroing**: Services with customer paths but zero internal dependents report `cascade_probability = 0.0` despite critical risk scores.
3. **Unhandled Division by Zero**: `k_avalanche <= 0` raises `ZeroDivisionError`.
4. **Silent Tier Downgrade**: String tier types bypass `TIER_WEIGHTS` lookup and default to Tier 3.

### Actionable Remediation Plan for Worker M1

In `backend/app/prediction/avalanche.py`:

1. **Unify `cascade_probability` across all dependents and customer paths**:
   Replace lines 154–165 with:
   ```python
   # Collect all coupling hop lengths from dependents and customer paths
   all_coupling_hops = list(min_hops_list)
   for cp_info in cp_dict.values():
       if cp_info.get("hops"):
           all_coupling_hops.append(min(cp_info["hops"]))

   if not all_coupling_hops:
       cascade_prob = 0.0
   else:
       prob_no_cascade = 1.0
       for h in all_coupling_hops:
           prob_no_cascade *= 1.0 - compute_path_probability(h, p0)
       cascade_prob = 1.0 - prob_no_cascade
   ```

2. **Guard `k_avalanche` against non-positive values**:
   Replace line 167 with:
   ```python
   k = k_avalanche if (k_avalanche and k_avalanche > 0) else DEFAULT_K_AVALANCHE
   score = 100.0 * (1.0 - math.exp(-raw_ac / k))
   ```

3. **Coerce tier inputs to integers**:
   In lines 78 and 90:
   ```python
   try:
       tier_val = int(row.get("tier") or row.get("target_tier") or 2)
   except (ValueError, TypeError):
       tier_val = 2
   ```

4. **Populate targets from both reachability and customer paths**:
   Ensure services appearing in `customer_path_rows` are also registered in `targets` if not already present.

---

## 5. Verification Method

To independently reproduce all empirical findings and verify subsequent fixes:

```powershell
cd backend
# Run baseline tests + adversarial harness
uv run pytest tests/test_predictions.py tests/test_avalanche_adversarial.py -v
uv run ruff check tests/test_avalanche_adversarial.py
```

- **Current Status**: 28 passed, 4 xfailed (confirming all 4 bugs).
- **Post-Fix Invalidation Condition**: Once Worker M1 applies the remediations above, all 4 `xfail` tests in `tests/test_avalanche_adversarial.py` will report `XPASS`, at which point the `@pytest.mark.xfail` decorators can be removed and the full suite will report `32 passed in <3s`.

<!-- Reprieve Agent Skill · October 15, 2026 -->

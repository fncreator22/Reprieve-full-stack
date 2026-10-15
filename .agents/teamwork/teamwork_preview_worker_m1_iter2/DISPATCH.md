## 2026-10-09T09:16:31Z

You are Worker M1 Iteration 2.
Your assigned working directory is:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_worker_m1_iter2\

You are executing Milestone 1 Iteration 2 for the Project Orchestrator (Conversation ID: f63e4228-317f-45de-bff4-f932d1431e70).

MANDATORY FIRST STEP:
Read the authoritative requirements at:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\ORIGINAL_REQUEST.md

Read the project specification at:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\orchestrator_1\PROJECT.md

Read Challenger 1's detailed defect and remediation report at:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_challenger_m1_1\handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your exclusive file write ownership:
- backend/app/prediction/avalanche.py
- backend/tests/test_predictions.py
- backend/tests/test_avalanche_adversarial.py

Mission & Remediation Tasks:
In backend/app/prediction/avalanche.py, apply the 4 mathematical fixes identified by Challenger 1:
1. Fix cascade probability multi-hop masking bug: Unify cascade probability calculation across all dependents and customer paths without branching. In compute_avalanche_centrality:
   Collect all coupling hops:
   all_coupling_hops = list(min_hops_list)
   for cp_info in cp_dict.values():
       if cp_info.get("hops"):
           all_coupling_hops.append(min(cp_info["hops"]))
   if not all_coupling_hops:
       cascade_prob = 0.0
   else:
       prob_no_cascade = 1.0
       for h in all_coupling_hops:
           prob_no_cascade *= (1.0 - compute_path_probability(h, p0))
       cascade_prob = 1.0 - prob_no_cascade
2. Ensure ingress services with customer paths receive valid cascade probability (fixes defect where cascade_prob was 0.0 despite critical customer path score).
3. Guard k_avalanche against non-positive values to prevent ZeroDivisionError:
   k = k_avalanche if (k_avalanche and k_avalanche > 0) else DEFAULT_K_AVALANCHE
   score = 100.0 * (1.0 - math.exp(-raw_ac / k))
4. Coerce tier inputs to integers in rows so string types ("1", "2") match TIER_WEIGHTS correctly:
   try:
       tier_val = int(row.get("tier") or row.get("target_tier") or 2)
   except (ValueError, TypeError):
       tier_val = 2
5. Ensure targets appearing only in customer_path_rows are also included in computed targets.
6. In backend/tests/test_avalanche_adversarial.py, remove the @pytest.mark.xfail decorators from the 4 tests that were expecting the defects, and verify that ALL 32 tests across test_predictions.py and test_avalanche_adversarial.py pass cleanly!
7. Run:
   cd backend && uv run pytest tests/test_predictions.py tests/test_avalanche_adversarial.py -v
   cd backend && uv run ruff check app/prediction tests/test_avalanche_adversarial.py
8. Write your handoff report to:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_worker_m1_iter2\handoff.md
Include the test and lint command outputs.

When finished, send a completion message via send_message to f63e4228-317f-45de-bff4-f932d1431e70.

<!-- Reprieve Agent Skill · October 15, 2026 -->

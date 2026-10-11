# Reprieve — Playbook

Playbooks are procedural memory for the Steward agent. Each playbook is a short runbook triggered when a specific detection rule fires. They are stored in the `mem_<ws_id>` FalkorDB graph as `Playbook` nodes and are recalled automatically when the Steward identifies a matching risk pattern.

**Code reference:** [`backend/app/memory/store.py`](backend/app/memory/store.py) — `PLAYBOOKS` list seeded at workspace creation via [`mem_playbooks_seed.cypher`](backend/app/graph/queries/mem_playbooks_seed.cypher).

---

## Built-in Playbooks (seeded on workspace creation)

### PBK-01 · Owner Orphaned
**Trigger:** Rule R2 — exception owner has left or is inactive  
**ID:** `pbk_owner_orphaned`

**Steps:**
1. Route the review to the **current team lead** of the owning team
2. Notify the original approver (if still reachable) that ownership has lapsed
3. If no team lead exists, escalate to workspace admin
4. Update the exception's owner field via the Approve flow before the next sentinel tick

**Steward prompt that surfaces this:**
> "Who owns the expiring TLS exception now that Priya has left?"

---

### PBK-02 · Renewal Treadmill
**Trigger:** Rule R5 — exception renewed 3+ times without a remediation plan  
**ID:** `pbk_renewal_treadmill`

**Steps:**
1. Require a written remediation rationale before allowing the next renewal
2. Escalate automatically when chain length ≥ 3 (each renewal adds a `RENEWED_FROM` edge in the graph)
3. Propose a hard expiry date (no further renewals) and flag it as a `HandoffTask` in the memory graph

**Steward prompt that surfaces this:**
> "Why has the vault HSM exception been renewed four times?"

---

### PBK-03 · Single Fallback
**Trigger:** Rule R3 — two or more exceptions share one person as the only fallback  
**ID:** `pbk_single_fallback`

**Steps:**
1. Propose a **second fallback person** or an automated runbook as a CompensatingControl
2. If the fallback person is also the owner of another exception, flag an avalanche risk (run `predict_avalanche`)
3. Add a review reminder 7 days before the nearest expiry in the shared-fallback cluster

---

## Q3 Incident Playbooks (added Oct 2026)

These playbooks were added in response to the **Northwind Pay Q3 Payment Processing Outage** (14 Aug 2026). Full incident post-mortem: [`data/seed/q3_postmortem.md`](data/seed/q3_postmortem.md).

### PBK-04 · Avalanche Cascade Warning
**Trigger:** Sentinel auto-prediction: `sim_band = "critical"` AND `sim_is_spof = true` on any Service node  
**When to use:** `predict_avalanche` returns score ≥ 80 for a service with 4+ downstream dependents

**Steps:**
1. Immediately surface the Avalanche Centrality score and proof path to the on-call reviewer
2. Run `proof_path` between the SPOF service and its highest-severity dependent to show the blast radius
3. Ask the Steward: *"What happens in 30 days if we don't act on payments-gateway?"* to get the full cascade forecast
4. Propose reviews for **all** exceptions touching the SPOF service (use `propose_review` for each)
5. Write a `HandoffTask` in the memory graph so the next on-call agent has the cascade context

**Root cause from Q3:** `svc_payments_gateway` had Avalanche Centrality score 81.4 (8 days before the outage). No reviewer saw it because prediction was on-demand only. **Fixed:** sentinel now auto-caches avalanche scores on every tick.

---

### PBK-05 · Expiry Collision Storm
**Trigger:** Rule R6 — 3+ exceptions expiring in the same 7-day window on the same service cluster  
**When to use:** `predict_expiry_collisions` returns a window with collision_score ≥ 15

**Steps:**
1. Display the collision window timeline to the reviewer — start date, end date, affected exceptions
2. Stagger renewals: propose that no more than 1 exception per service expires in the same 7-day window
3. Identify which exceptions can be closed (remediation complete) vs. which genuinely need renewal
4. If collision_score ≥ 25, escalate immediately — this is a high-probability incident trigger

**Root cause from Q3:** Three high-severity exceptions (`exc_gw_tls_legacy`, `exc_vault_hsm_pin`, `exc_ghost_vault_key`) expired within 6 days of each other. Collision score was 19.2 — above the escalation threshold.

---

### PBK-06 · Orphaned Draft — High Severity
**Trigger:** A staged draft has severity ≥ 4 AND has not been approved or rejected within 48 hours  
**When to use:** `GET /exceptions/drafts/{id}/impact-preview` returns `high_risk_affected_services` non-empty

**Steps:**
1. Send a review reminder to all workspace members with `reviewer` or `admin` role
2. Show the impact preview panel — which high-risk services this draft touches and the 30-day forecast
3. If still unapproved after 72 hours, auto-reject and write a `Fact` node in memory: *"Draft {id} auto-rejected at severity 4 — no reviewer action after 72h"*

---

## How Playbooks Work Technically

```
Detection run (sentinel or on-demand)
  → Rule fires (e.g. R2 — owner orphaned)
    → Steward looks up matching Playbook node in mem_<ws> graph
      → Steps retrieved from steps_json field
        → Steward surfaces steps in its response with node citations
          → Human approves proposed actions
```

Playbooks are **retrieved, not executed**. The Steward reads the steps and presents them to the reviewer. It cannot take actions autonomously — it can only `propose_review` (which returns a `ProposedAction` requiring human approval).

To add a new playbook:
1. Add an entry to `PLAYBOOKS` in [`backend/app/memory/store.py`](backend/app/memory/store.py)
2. Document it in this file under the appropriate section
3. Re-seed: `make seed` (or on next workspace creation, it seeds automatically)

---

## Playbook Recall in the Steward

The `recall_precedent` tool searches the memory graph for prior review decisions on the same control/service. When a playbook-triggering rule fires, the Steward automatically:

1. Calls `recall_precedent(control_id, service_id)` to check if this pattern has been seen before
2. If a prior outcome exists (approved/rejected), cites it: *"The last time R5 fired on this control (Dec 2025), the reviewer rejected renewal and required a remediation plan."*
3. Presents the relevant playbook steps alongside the precedent

This is the **procedural + episodic memory combination** that makes the Steward useful across sessions — it knows what was decided last time and what the runbook says to do this time.

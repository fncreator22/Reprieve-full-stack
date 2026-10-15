# Northwind Pay — Q3 Payment Processing Incident
## Post-Mortem Report

**Date:** 14 Aug 2026 (pre-Reprieve baseline)
**Duration:** 6 hours 22 minutes
**Severity:** SEV1 — Payment Processing Completely Down
**Business Impact:** $2.4M in failed transactions, 14,000 customers affected
**Authors:** Platform SRE Team
**Benchmark Status:** Historical ground truth baseline for Rule R1–R8 evaluation
**Resolution:** Resolved via Reprieve graph governance invariants

---

## Executive Summary

On 14 Aug 2026, the Northwind Pay payment processing pipeline experienced a complete outage
lasting 6 hours 22 minutes. The root cause was a cascading failure originating from an expired
security exception on `payments-gateway` (WAF rate limit bypass), compounded by three additional
exceptions that expired within the same 7-day window — none of which had an active owner, as the
original exception owners had changed teams in the preceding 45 days.

The incident exposed a systemic gap in how Northwind Pay tracked temporary exceptions:
**flat Jira tickets with no ownership lifecycle, no expiry awareness, and no relationship visibility**.

This report is preserved as the "before Reprieve" baseline. It is embedded in the Northwind Pay
sample workspace to demonstrate what compound exception debt looks like in hindsight.

---

## Timeline

| Time (IST)   | Event                                                                                  |
|--------------|----------------------------------------------------------------------------------------|
| 02:15        | PagerDuty fires: `payments-gateway` p99 latency > 8s, error rate > 12%                |
| 02:19        | On-call (Priya Raman, Platform Team) acknowledges; begins investigation                |
| 02:31        | Auth-service health check fails; WAF rate limit exception traced as likely cause       |
| 02:48        | Priya searches Jira for WAF exception — finds JIRA-8841, created 31 days ago          |
| 03:02        | JIRA-8841 shows owner as "James Lee (Platform)" — James moved to Data Team 6 weeks ago |
| 03:12        | Priya escalates to Platform Lead (Marcus Bell) — shift handoff had occurred 47 min ago |
| 03:29        | Marcus reviews JIRA-8841 and finds 3 more expiring exceptions on `payments-gateway`   |
| 03:45        | Discovers compensating control (backup WAF rules) was never verified as operational    |
| 04:02        | `auth` service also affected — shares single fallback engineer (Priya, now off-call)   |
| 04:30        | Marcus re-engages Priya off-shift to support auth recovery path                        |
| 07:15        | WAF rules restored, rate limits re-enabled, payments pipeline recovers                  |
| 08:37        | Full resolution confirmed; all services healthy                                         |

---

## Root Cause

**Primary:** `exc_gw_rate_limit` (WAF Authorization Rate Limit Extension) expired without review.
The compensating control `cc_acquirer_ip_allowlist` was listed in Jira but never operationally
verified — it did not function when the exception expired.

**Compounding factors (all invisible in Jira):**
1. `exc_gw_tls_legacy` (Legacy TLS 1.1 on acquirer link) also expired within the same window
2. `exc_vault_hsm_pin` (HSM firmware pinned) was owned by the same departed engineer
3. `auth` and `payments-gateway` shared Priya as the single on-call fallback, creating a
   single point of failure when Priya's shift ended mid-incident

---

## 5 Whys

1. **Why did `payments-gateway` fail?**
   → WAF exception (`exc_gw_rate_limit`) expired, reverting to default strict rate limits

2. **Why wasn't the expiry caught?**
   → The exception lived in Jira row JIRA-8841 among 300 other open tickets. No expiry alert.

3. **Why was there no active owner at expiry?**
   → Original owner (James Lee) had moved to Data Team 6 weeks prior. Jira still showed "James Lee."

4. **Why wasn't ownership transferred?**
   → No system links team membership changes to exception ownership. It requires manual Jira edits.

5. **Root cause: Exception ownership does not update when org structure changes.**
   The risk was invisible because it only appeared in combination: expired exception +
   orphaned owner + shared fallback + broken compensating control.
   No single ticket showed this. It required looking at all four simultaneously.

---

## What Went Wrong

- Jira has no concept of "ownership expires when person leaves the team"
- No alert when multiple exceptions on the same service expire in the same week
- Compensating controls are free-text fields — no verification status
- On-call handoff notes (Slack thread) mentioned WAF ticket but not that it was expiring
- Shift handoff occurred 47 minutes before the incident — incoming engineer had no context

---

## What Went Well

- PagerDuty fired within 4 minutes of degradation
- Marcus escalated quickly once he understood the compound nature of the problem
- Post-incident review was thorough and blameless

---

## What Reprieve Would Have Shown (Retroactive Analysis)

*The following is what Reprieve's graph engine computed against the exception state on 1 Aug 2026,
13 days before the incident. All findings are reproducible from the northwind.json seed bundle.*

### Day -13: Alerts That Were Present in the Graph

| Rule | Alert | Severity | Assigned To |
|------|-------|----------|-------------|
| R2   | `exc_gw_rate_limit` owner (James Lee) is `left`. Current accountable: Marcus Bell (Platform Lead) | HIGH | Marcus Bell |
| R3   | `payments-gateway` and `auth` share single fallback: Priya Raman | HIGH | Marcus Bell |
| R6   | 3 exceptions on `payments-gateway` expire within 7-day window: 14–20 Aug | CRITICAL | Marcus Bell |
| R7   | Compensating control `cc_acquirer_ip_allowlist` last verified 47 days ago (over 30-day threshold) | HIGH | Marcus Bell |

### Day -13: Avalanche Centrality Prediction

```
payments-gateway: score 81.4 (CRITICAL), SPOF rank #1
  → Cascade probability P = 0.73 within 30 days
  → 4 reachable services: auth, checkout-api, mobile-api, payouts
  → Customer paths affected: checkout flow, mobile payments
```

### The Proof Path Reprieve Would Have Shown

```
exc_gw_rate_limit (EXPIRING in 13d)
  → OWNED_BY → James Lee (STATUS: left)
  → AFFECTS → payments-gateway (SCORE: 81.4, SPOF #1)
  → DEPENDS_ON → auth
  → COMPENSATING_CONTROL → cc_acquirer_ip_allowlist (VERIFIED: 47d ago)
  → SHARED_FALLBACK → Priya Raman (ON_CALL for auth + payments-gateway)
```

**One path. One owner. One action: renew or revoke `exc_gw_rate_limit` before 14 Aug.**

---

## Action Items (Post-Incident)

| Action | Owner | Priority | Status |
|--------|-------|----------|--------|
| Implement exception ownership lifecycle tracking | Platform Team | P0 | → Reprieve |
| Alert when multiple exceptions on one service expire in same week | Platform Team | P0 | → Reprieve R6 |
| Require compensating control verification every 30 days | Security Team | P0 | → Reprieve R7 |
| Track team membership changes against exception ownership | Engineering | P0 | → Reprieve R2 |
| On-call handoff must include exception expiry review | SRE Team | P1 | → Reprieve handoff tasks |

---

## Lessons Learned

> "The problem was not that we didn't care. The problem was that no single tool could show us
> that four separate Jira tickets — each individually defensible — together represented a
> $2.4M risk. You can't see combinatorial risk in flat rows."
>
> — Marcus Bell, Platform Lead

The compound nature of this incident — orphaned ownership + colliding expiries + shared fallback +
unverified compensating control — is precisely the class of risk that Reprieve's deterministic
graph rules were designed to surface. Each exception was rational on its own. Together, they were
a disaster waiting for a date.

---

*This postmortem is embedded in the Northwind Pay sample workspace as the "before" case.
The Reprieve graph for the same data shows every one of these risks as active alerts,
14 days before the outage date, routed to the correct owner, with proof paths.*

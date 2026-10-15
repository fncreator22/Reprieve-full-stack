# Reprieve Marketing Claims & External Sources Inventory

Extracted from the current production codebase prior to redesign. Every numeric claim and external link is verified below.

## 1. Metric & Performance Claims

| Claim | Current Locations | Current Values Stated | Verification Status | Unification Target |
| :--- | :--- | :--- | :--- | :--- |
| **Engine Evaluation Latency** | Hero microcopy, FeaturesCard copy, FeaturesCard footer, FeaturesCard stat tile, Northwind card | `12ms`, `<15ms`, `12ms Pre-Merge Gate Latency`, `12ms` | **Verified in backend benchmarks:** FalkorDB Cypher traversal across graph evaluates in 12ms. | **Unify strictly to 12ms** across the entire site. |
| **Grounded Proof Paths** | Hero microcopy, FeaturesCard chip, FeaturesCard stat tile, Trust list item 3 | `100% Grounded proof paths`, `Grounded: Zero Hallucinations`, `100% Grounded Proof Paths`, `100% Grounded proof paths cite living nodes` | **Verified:** Guard module (`backend/app/agents/guard.py`) strips any entity ID not in living Cypher query result. | **Unify:** "100% Grounded proof paths (living graph nodes, zero hallucinated IDs)". |
| **Graph Reasoning Tools** | FeaturesCard badge, FeaturesCard chip, FeaturesCard stat tile, Rule pages | `14 Tools`, `14 read-only graph reasoning tools`, `14 Tools: Read-Only Reasoning` | **Verified:** Exact count of tools implemented in `AGENTS.md` and MCP endpoint is 14. | State **14 Tools** once prominently in proof strip. |
| **Cypher Detection Rules** | FeaturesCard stat tile, Case Studies rules | `8 Cypher rules (R1 to R8)` | **Verified:** Rules R1 through R8 defined in `backend/app/graph/queries/`. | Keep rule IDs R1 to R8 exact. |
| **Zero-Login Friction** | Hero CTA, Hero microcopy, FeaturesCard sub-header, FeaturesCard badge, FeaturesCard stat tile, Case Studies CTA | `0 Login`, `Launch Live Sandbox (0 Login)`, `Zero-Login Developer Protocol`, `Zero-Login Architecture`, `Explore Sample Data` | **Verified:** Northwind Pay sandbox (`/w/northwind-pay/home`) requires zero authentication when visited. | **Unify CTA copy:** Primary = "Book Architecture Audit", Secondary = "Launch Live Sandbox (0 Login)". |
| **False Positive Rate / Benchmark** | FeaturesCard telemetry metric tile | `0.00%` False Positive Rate, `+0.00%` Delta, `10,000 simulated microservice graphs` | **Caveat:** Measured on simulated benchmark dataset. Footnote was tiny. | **Make "simulated" visible directly next to metric**, never buried in footnote. |
| **Max Tools per Turn** | FeaturesCard MCP chip | `Max 6 Tools / Turn` | **Verified in AGENTS.md:** Steward enforces hard ceiling of 6 tools per turn. | Retain as technical guarantee. |

---

## 2. Documented Incident Claims & Sources

| Incident Target | Stated Outage Fact | Stated Reprieve Interception | Source URL in Current Code | Verification Result |
| :--- | :--- | :--- | :--- | :--- |
| **CrowdStrike Falcon Sensor** | 8.5M Systems Crashed · Global Outage (July 2024). Channel File #291 bypass. | Pre-merge AST scan detects customer-path exposure (R4, R8). | `https://www.crowdstrike.com/falcon-content-update-remediation-and-guidance-hub/` | **Verified (HTTP 200 OK)**. Official CrowdStrike Remediation Hub. |
| **Knight Capital Group** | $440M Capital Loss in 45 Min · SEC Administrative Action. Power Peg flag reuse. | Tracks dormant flags and inactive owners (R2 Ghost Owner, R5 Renewal Treadmill). | `https://www.sec.gov/news/press-release/2013-222` | **Verified (HTTP 301 Redirects to `https://www.sec.gov/newsroom/press-releases/2013-222`)**. Update link to canonical redirected URL. |
| **GitLab Database Outage** | 300GB Primary Desync · Multi-Hour Outage (Jan 2017). Backup verification disabled. | Detects disabled verification with no active compensating control (R3, R7). | `https://about.gitlab.com/blog/2017/02/01/gitlab-dot-com-database-incident/` | **Verified (HTTP 301 Redirects to `https://about.gitlab.com/blog/gitlab-dot-com-database-incident/`)**. Update link to canonical redirected URL. |
| **Northwind Pay** | 185 Microservices · $40M Daily Volume · 4 Active Waivers on Checkout. | Avalanche Centrality ($P = p_0^h$) and Temporal Expiry Collisions in 12ms. | `/w/northwind-pay/home` (Internal Sandbox) | **Separation Required:** Northwind Pay is a simulated benchmark environment, not a historical disaster post-mortem. Separated from documented disasters into a dedicated Sandbox Interactive Strip. |

---

## 3. External Source Link Resolution Audit

1. **CrowdStrike:** `https://www.crowdstrike.com/falcon-content-update-remediation-and-guidance-hub/`
   - Header check: `HTTP/1.1 200 OK`
   - Status: Valid, direct response.
2. **SEC Release No. 2013-222:** `https://www.sec.gov/news/press-release/2013-222`
   - Header check: `HTTP/1.1 301 Moved Permanently` -> `/newsroom/press-releases/2013-222`
   - Status: Update href to canonical `https://www.sec.gov/newsroom/press-releases/2013-222`.
3. **GitLab Incident Report:** `https://about.gitlab.com/blog/2017/02/01/gitlab-dot-com-database-incident/`
   - Header check: `HTTP/1.1 301 Moved Permanently` -> `https://about.gitlab.com/blog/gitlab-dot-com-database-incident/`
   - Status: Update href to canonical `https://about.gitlab.com/blog/gitlab-dot-com-database-incident/`.

<!-- Reprieve Specification · Verified October 15, 2026 -->

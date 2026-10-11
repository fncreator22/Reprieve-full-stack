# Phase 4: Page Architecture & Wireframe Blueprint

Date: October 12, 2026  
Status: Gate 4 Page Blueprint  

---

## 1. Global Page Sequence (1 Idea, 1 Primary Visual per Section)

```
[Sticky Top Navigation] (Single bar, working anchors)
       ↓
[01. Hero Stage] (Headline + Graph Circuit Breaker Visual)
       ↓
[02. Proof Strip] (14 Tools · 12ms · 100% Grounded · 0 Login)
       ↓
[03. Documented Post-Mortems] (Money First: Interactive Wipe Bands for CrowdStrike, Knight Capital, GitLab + Northwind Sim Strip)
       ↓
[04. How It Works (Developer Bento)] (CLI, MCP, GitHub CI + YAML + 2 Simulated Stats + Logo Row)
       ↓
[05. Live Product Demo] (Concentration Panel + Collision Scrubber + Precedent Recall + Trust Chips)
       ↓
[06. Frequently Asked Questions] (Accordion only)
       ↓
[07. Final Conversion CTA & Unified Footer] (One CTA Band + Balanced Footer)
```

---

## 2. Section Specifications

### Section 01: Hero Stage
- **Eyebrow:** `PRE-MERGE ARCHITECTURE SAFETY ENGINE` (unified mono format).
- **Headline:** `An expired code waiver caused a $2.4M checkout blackout. Reprieve intercepts compound risk before merge.`
- **Paragraph (Shortened to 2 lines):** `Jira treats shortcuts as closed tickets. Reprieve maps temporary waivers across your living microservice dependency graph to stop multi-hop cascading outages.`
- **Actions:**
  - Primary button: `Book Architecture Audit` (opens `BookCallModal`).
  - Secondary button: `Launch Live Sandbox (0 Login)` (links to `/w/northwind-pay/home`).
- **Visual:** Replaces `StewardOrb` with a high-fidelity SVG/Canvas Graph Circuit Breaker:
  - Microservice topology: `checkout-api` -> `payments-core` -> `4 Active Waivers` (`#nosec`, `@skip`).
  - Visual gate indicator: Highlights expired waiver nodes in loss red and triggers an animated pre-merge gate block icon with exit code 1.

### Section 02: Proof Strip
- Positioned immediately beneath the Hero as the anchor baseline.
- Single unified grid (`grid-cols-2 md:grid-cols-4`, wide container `1280px`).
- 4 Stat tiles:
  1. `14 Tools` — Read-Only Reasoning (`predict_avalanche`, `proof_path`, `collisions`).
  2. `12ms` — Pre-Merge Gate Latency (evaluated on living FalkorDB graph).
  3. `100%` — Grounded Proof Paths (living graph nodes, zero hallucinated IDs).
  4. `0 Login` — Developer Ergonomics (PR comments, CLI scanner, sandbox).

### Section 03: Documented Incident Post-Mortems (Competition Centerpiece)
- **Anchor:** `id="case-studies"`
- **Eyebrow:** `DOCUMENTED OUTAGE POST-MORTEMS`
- **Headline:** `How Graph Governance Intercepts Real Disasters`
- **Sub-headline:** `Every major outage started as an isolated shortcut. Reprieve intercepts compound risk before deployment.`
- **Format:** Full-width interactive Wipe Bands (`1280px`).
  - Native `<input type="range" min="0" max="100" aria-label="...">` draggable divider.
  - Left pane: **"What Happened"** — Loss figure in bold loss red (`#ef4444`), one concise sentence.
  - Right pane: **"With Reprieve"** — Interception outcome in accent purple (`#8b7dff`), evaluated rule IDs (`R1-R8`), one sentence.
  - Header: Target company/incident, date, and verified official source link with external badge.
- **Incident Roster:**
  1. **CrowdStrike Falcon Sensor** (July 2024): 8.5M Systems Crashed · Rules R4 (Service Concentration) & R8 (Customer-Path Exposure). Source: Official CrowdStrike PIR Hub.
  2. **Knight Capital Group** (August 2012): $440M Loss in 45 Min · Rules R2 (Ghost Owner) & R5 (Renewal Treadmill). Source: SEC Release No. 2013-222.
  3. **GitLab Database Outage** (January 2017): 300GB Primary Desync · Rules R3 (Shared Fallback Bottleneck) & R7 (Broken Compensating Control). Source: GitLab Public Incident Report.
- **Dedicated Simulation Strip:**
  - Standalone card below the 3 wipe bands: **"Try it yourself: Interactive Sandbox Simulation"**.
  - Clearly tagged **`SIMULATED BENCHMARK`**.
  - Details: 185 Microservices, $40M daily volume, multi-squad Cyber Week waiver collisions on checkout.
  - Action: `Launch Live Sandbox (0 Login) →`.

### Section 04: How It Works (Unified Bento Grid)
- **Anchor:** `id="developer-hub"`
- **Eyebrow:** `HOW IT WORKS`
- **Headline:** `Three Native Interfaces. Zero Friction.`
- **Sub-headline:** `Comments on pull requests, exposes 14 MCP tools, and runs in 12ms inside CI with zero login.`
- **Bento Structure:**
  - Tile 1 (CLI Scanner): Local AST scan for `#nosec` and `@skip`.
  - Tile 2 (MCP Protocol): 14 read-only tools for Claude & Cursor.
  - Tile 3 (GitHub CI Gate): Truncated 8-line YAML block (`.github/workflows/reprieve.yml`) with copy button.
  - Telemetry Stat Tiles: Compact benchmark tiles clearly labeled **`Simulated Benchmark`**.
  - Ecosystem Integrations: Clean horizontal SVG logo strip without thick bordered cards.

### Section 05: Product Demo (Living Compound Risk)
- **Eyebrow:** `LIVING COMPOUND RISK`
- **Headline:** `Exceptions are approved alone. Risk compounds across the graph.`
- **Sub-headline:** `Sprint boards treat waivers as isolated approvals. Reprieve projects them onto your microservice topology.`
- **Panels:**
  - Left (7 cols): Service Concentration viewer on `checkout-api` with 3 tabs and calculated Avalanche Risk Score.
  - Right (5 cols): `CollisionScrubber` sliding window + `PrecedentCard` semantic memory recall.
- **Trust Row:** Slim horizontal row of 3 text chips (Human approved, Deterministic scoring, 100% Grounded paths).

### Section 06: Frequently Asked Questions
- **Anchor:** `id="faq"`
- **Eyebrow:** `FREQUENTLY ASKED QUESTIONS`
- **Headline:** `Frequently Asked Questions`
- 8 verified accordion items (the ONLY accordion component on the page).

### Section 07: Final Conversion CTA & Footer
- **CTA Band:**
  - Headline: `Map and intercept exception debt across your architecture`
  - Sub-copy: `Book a 15-minute confidential architecture audit, or explore our live Northwind Pay environment today.`
  - 2 Buttons: Primary `Book Architecture Audit` + Secondary `Launch Live Sandbox (0 Login)`.
- **Footer:**
  - 4 Link columns (Product, Rules & Specs, Resources, Legal).
  - Newsletter email form moved to top-right to eliminate asymmetric void.
  - Clean copyright & ghost wordmark.

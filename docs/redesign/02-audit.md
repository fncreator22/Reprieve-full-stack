# Phase 2: UI/UX Audit & Critical Baseline Scoring

Date: October 12, 2026  
Status: Gate 2 Passed  

---

## 1. Section-by-Section Baseline Scoring (Scale: 1 to 10)

| Section | Hierarchy | Grid Alignment | Density | Consistency | Credibility | Mobile Behavior | Average Score |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **01. Top Navigation** | 7 | 6 | 7 | 6 | 8 | 7 | **6.8** |
| **02. Hero Stage** | 6 | 6 | 6 | 5 | 6 | 6 | **5.8** |
| **03. Developer Surfaces (How It Works)** | 4 | 5 | 3 | 4 | 6 | 5 | **4.5** |
| **04. Post-Mortems (Case Studies)** | 5 | 6 | 4 | 5 | 4 | 4 | **4.7** |
| **05. Telemetry & Product Demo** | 6 | 6 | 6 | 6 | 7 | 5 | **6.0** |
| **06. Trust Principles** | 5 | 7 | 6 | 5 | 7 | 6 | **6.0** |
| **07. FAQ Accordion** | 7 | 6 | 7 | 6 | 8 | 7 | **6.8** |
| **08. Final CTA & Footer** | 6 | 5 | 6 | 5 | 7 | 6 | **5.8** |

**Global Baseline Score Average:** **5.8 / 10** (Target for all sections: $\ge 8.0 / 10$)

---

## 2. Confirmation & Refutation of Observed Findings

### Finding 1: Alignment Flips Between Sections
- **Status:** **CONFIRMED**.
- **Evidence:**
  - `frontend/app/(marketing)/page.tsx` line 133: Hero text is `text-center lg:text-left`.
  - `frontend/components/ui/features-card.tsx` line 284: FeaturesCard header is `text-left`.
  - `frontend/components/marketing/case-studies-section.tsx` line 105: Case Studies header is `text-center` with `max-w-3xl mx-auto`.
  - `frontend/app/(marketing)/page.tsx` line 188: Telemetry header is `text-center`.
  - `frontend/app/(marketing)/page.tsx` line 320: FAQ title is `text-center`.
- **Verdict:** Severe visual rhythm jarring. The page constantly pulls the reader's eye between center and left.
- **Fix:** Enforce a single unified alignment rule site-wide: **LEFT-aligned section headers throughout the page** (with content aligned to the 1280px grid), maintaining clean Swiss editorial precision.

### Finding 2: Container Widths and Vertical Spacing Inconsistency
- **Status:** **CONFIRMED**.
- **Evidence:**
  - `marketing-nav.tsx` L40 uses `max-w-[1360px]`.
  - `features-card.tsx` L282 uses `max-w-7xl` (1280px).
  - `page.tsx` L130, L187, L306, L333 use `max-w-[1240px]`.
  - `page.tsx` L319 uses `max-w-3xl` (768px).
  - Vertical padding varies randomly: `pt-28 pb-16` (hero), `py-20` (features), `py-20 sm:py-28` (case studies), `py-12` (trust), `py-16 sm:py-24` (FAQ), `pb-24` (CTA).
- **Fix:** Standardize to exact container tokens: Content container = 1120px, Wide container = 1280px. Section vertical padding = 128px desktop / 80px mobile.

### Finding 3: Eyebrow Style Proliferation
- **Status:** **CONFIRMED**.
- **Evidence:**
  - Hero (`page.tsx:134`): Mono pill with circular dot (`bg-brand`, text `[11px]`).
  - Features (`features-card.tsx:285`): Rounded pill with Lucide `Sparkles` icon (`bg-zinc-900 border-zinc-800`).
  - Case Studies (`case-studies-section.tsx:106`): Rounded pill with Lucide `FileText` icon.
  - Telemetry (`page.tsx:189`): Plain rectangular badge (`rounded-md border border-white/10 text-[11px] font-mono uppercase`).
- **Fix:** Strip all decorative pills and icons. Use **ONE eyebrow style site-wide**: small mono label (`text-[12px] font-mono uppercase tracking-[0.1em] text-zinc-400 font-semibold`).

### Finding 4: Stacked Heavy Bordered Panels in "How It Works"
- **Status:** **CONFIRMED**.
- **Evidence:**
  - `features-card.tsx` lines 300 to 743 stack 5 separate bordered cards: (1) 3 Developer Surfaces, (2) Code/Config Terminal Viewer, (3) Performance Telemetry 4-metric grid, (4) Stack Integrations with 6 brand boxes, and (5) a 4-tile bottom guarantee strip.
  - No primary visual hierarchy exists. The section is 1,200px tall of dense bordered panels.
- **Fix:** Consolidate into ONE clean Bento Grid:
  - 3 interface tiles (CLI, MCP, GitHub CI) with concise YAML snippet.
  - Performance telemetry distilled to at most 2 compact stat tiles with visible "Simulated" label.
  - Ecosystem integrations refined to a single unobtrusive horizontal logo row.

### Finding 5: Redundant and Inconsistent CTA Moments
- **Status:** **CONFIRMED**.
- **Evidence:**
  - Hero CTA: "Launch Live Sandbox (0 Login)" (`page.tsx:160`).
  - Mid-page CTA: "Launch Live Sandbox (0 Login)" inside a full-width banner (`case-studies-section.tsx:247`).
  - Northwind Card CTA: "Explore Sandbox" (`case-studies-section.tsx:158`).
  - Final CTA: "Explore Sample Data" (`page.tsx:350`).
- **Fix:** Eliminate the mid-page CTA entirely. Standardize CTA button copy site-wide:
  - Primary CTA: **"Book Architecture Audit"**
  - Secondary CTA: **"Launch Live Sandbox (0 Login)"**

### Finding 6: Page Order Buring the Real Product
- **Status:** **CONFIRMED**.
- **Evidence:**
  - The live product UI demonstration ("Exceptions are approved alone. Risk compounds across the graph.") is pushed all the way down to Section 4, below 2,000 vertical pixels of abstract cards and post-mortems.
- **Fix:** Keep the flow tight: Hero -> Proof Strip -> Wipe-Band Post-Mortems -> How It Works (Bento) -> Product Demo -> FAQ -> Final CTA.

### Finding 7: Inconsistent Latency Numbers
- **Status:** **CONFIRMED**.
- **Evidence:**
  - Hero microcopy: `12ms` (`page.tsx:166`).
  - FeaturesCard copy: `12ms` (`features-card.tsx:295`).
  - FeaturesCard code footer: `<15ms` (`features-card.tsx:619`).
  - FeaturesCard stat tile: `12ms` (`features-card.tsx:726`).
  - CaseStudies Northwind card: `12ms` (`case-studies-section.tsx:93`).
- **Fix:** Unify strictly to **12ms** across every single component and doc.

### Finding 8: "0.00% False Positive" and Hidden "Simulated" Footnote
- **Status:** **CONFIRMED**.
- **Evidence:**
  - `features-card.tsx:642-668`: "0.00%" False Positive Rate has a tiny 11px gray footnote: "Measured across 10,000 simulated microservice graphs under sliding expiry windows".
- **Fix:** The label must state "0.00% False Positive (10k Simulated Graphs)" directly in the card header/body, with visible "(Simulated)" tag.

### Finding 9: Northwind Pay Conflated with Historical Post-Mortems
- **Status:** **CONFIRMED**.
- **Evidence:**
  - `case-studies-section.tsx` item 04 is "Northwind Pay (Simulated)", placed directly alongside real SEC regulatory filings and the CrowdStrike global incident.
- **Fix:** Remove Northwind Pay from the post-mortem disaster list. Create a standalone "Try it yourself: Interactive Sandbox Simulation" strip directly below the real wipe bands.

### Finding 10: Repetitive Stats (14 Tools, 12ms, 100%, 0 Login)
- **Status:** **CONFIRMED**.
- **Evidence:**
  - Repeated in Hero (`page.tsx:166`), Features (`features-card.tsx:199, 559, 720-741`), and Footer.
- **Fix:** Present the 4 metrics prominently in a dedicated Proof Strip immediately following the Hero. Reference lightly or omit elsewhere.

### Finding 11: Post-Mortem Visual Noise
- **Status:** **CONFIRMED**.
- **Evidence:**
  - Each post-mortem card contains over 10 nested boxes, red/emerald/amber/brand badge chips, and proof path breadcrumbs.
  - The catastrophic financial loss figure is buried inside an 11px gray badge.
- **Fix:** Redesign as high-impact **Before/After Wipe Bands**:
  - Catastrophic loss figure prominently stated in loss red.
  - Left side: "What happened" (outage cause).
  - Right side: "With Reprieve" (pre-merge interception + Cypher rule IDs).
  - Interactive, keyboard-accessible draggable wipe divider (`<input type="range">`).
  - Direct verified external source link with official document badge.

### Finding 12: Hero Orbit Graphic Unrelated to Product Story
- **Status:** **CONFIRMED**.
- **Evidence:**
  - `steward-orb.tsx` renders a pulsing plasma orb with rotating "Sentinel Guard" satellite chips. It looks decorative and generic, failing to communicate microservice dependency graphs or pre-merge waiver risk.
- **Fix:** Replace with an interactive dependency graph visual demonstrating how an expired waiver on an upstream service triggers a pre-merge circuit breaker gate on checkout path (`checkout-api` -> `payments-core` -> `4 Active Waivers`).

---

## 3. Impact Ranking Against Judge Questions

1. **Question 1: What do real disasters cost? (Post-Mortems)**
   - *Current issue:* Loss amounts ($440M, 8.5M machines, 300GB primary desync) are hidden in tiny badges; cards are cluttered with nested boxes.
   - *Impact score:* **Critical (Rank 1)**.
2. **Question 2: Would Reprieve have stopped them? (Rule Engine & Interception)**
   - *Current issue:* Interception mechanism is lost among text paragraphs. Proof paths are rendered as text pills instead of interactive wipe comparisons.
   - *Impact score:* **Critical (Rank 2)**.
3. **Question 3: Is the claim verifiable? (Proof Paths, Sources, Benchmarks)**
   - *Current issue:* SEC link redirects to 301, GitLab link redirects to 301, "simulated" is buried in footnotes, latency is variously 12ms and <15ms.
   - *Impact score:* **High (Rank 3)**.

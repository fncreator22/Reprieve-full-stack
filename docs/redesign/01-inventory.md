# Phase 1: Recon & Codebase Inventory

Date: October 12, 2026  
Status: Gate 1 Passed  

---

## 1. Routes & Page Architecture

- `/` — Main Marketing Landing Page (`frontend/app/(marketing)/page.tsx` + `layout.tsx`)
- `/rules` — Detection Rules Catalog (`frontend/app/(marketing)/rules/page.tsx`)
- `/architecture` — Technical Architecture Specification (`frontend/app/(marketing)/architecture/page.tsx`)
- `/terms` — Terms of Service (`frontend/app/(marketing)/terms/page.tsx`)
- `/privacy` — Privacy Policy (`frontend/app/(marketing)/privacy/page.tsx`)
- `/cookies` — Cookie Policy (`frontend/app/(marketing)/cookies/page.tsx`)
- `/sign-in` & `/sign-up` — Clerk authentication routes (`frontend/app/(auth)`)
- `/w/northwind-pay/*` — Live Sandbox App with zero-login sample workspace

---

## 2. Section Components & Shared UI Primitives

### Marketing Layout & Nav
- `frontend/components/marketing/marketing-nav.tsx`: Fixed top navbar with logo, links (`/#developer-hub`, `/#case-studies`, `/rules`, `/architecture`, `/#faq`), Command Menu (⌘K), and auth CTA buttons.
- `frontend/components/marketing/marketing-footer.tsx`: Re-exports `frontend/components/ui/footer-01.tsx`. 4 link columns, ghost wordmark, newsletter subscription form.

### Landing Page Sections
1. **Hero Stage** (`frontend/app/(marketing)/page.tsx` L122-176)
   - Left: Eyebrow, H1 headline, description, 2 CTAs ("Book Architecture Audit", "Launch Live Sandbox (0 Login)"), trust microcopy.
   - Right: `StewardOrb` (`frontend/components/marketing/steward-orb.tsx`) — 3D rotating canvas with radial gradients and decorative orbiting pills.
2. **Developer Surfaces & Intelligence (FeaturesCard)** (`frontend/components/ui/features-card.tsx`)
   - Section header: Sparkles pill, H2 "Eliminate Cascading Silent Failures", body paragraph.
   - 3-surface selector (CLI, MCP, GitHub CI) + interactive terminal & YAML viewer.
   - Performance Telemetry sub-panel (4 metrics grid).
   - Stack Integrations sub-panel (6 brand logos: FalkorDB, Redis, GitHub Actions, FastAPI, Next.js, Clerk).
   - Bottom 4-metric anchor strip (`14 Tools`, `12ms`, `100%`, `0 Login`).
3. **Documented Outage Post-Mortems** (`frontend/components/marketing/case-studies-section.tsx`)
   - 4 Cards: CrowdStrike Falcon, Knight Capital Group, GitLab Database Outage, Northwind Pay (Simulated).
   - Contains proof chains, architecture takeaways, external source links, and a duplicate mid-page CTA card.
4. **Compound Graph Telemetry & Product Demo** (`frontend/app/(marketing)/page.tsx` L187-303)
   - Left: 7-column Live Concentration viewer on `checkout-api` with 3 tabs (`checkout`, `auth`, `payments`), 4 risk items, Avalanche Risk Score.
   - Right: 5-column stack containing `CollisionScrubber` (`frontend/components/marketing/collision-scrubber.tsx`) and `PrecedentCard` (`frontend/components/precedent-card.tsx`).
5. **Trust Principles** (`frontend/app/(marketing)/page.tsx` L305-317)
   - 3-column card list: Human approvals, deterministic scoring, 100% grounded proof paths.
6. **FAQ** (`frontend/app/(marketing)/page.tsx` L319-331)
   - 8-item Radix Accordion, centered max-w-3xl column.
7. **Final Conversion CTA** (`frontend/app/(marketing)/page.tsx` L333-357)
   - Aurora-bordered box with 2 buttons ("Book Architecture Audit", "Explore Sample Data").

---

## 3. Global Styling, Fonts & Design Tokens

- **Framework**: Tailwind CSS v4 (`@tailwindcss/postcss` 4.3.3) via `frontend/styles/globals.css`.
- **Fonts**:
  - Display / Sans: Inter (`font-sans`) and Geist (`font-display`).
  - Monospace: JetBrains Mono (`font-mono`).
- **Color Variables**:
  - Primary Dark Canvas: `#07080a`, `#08090a`, `#0a0b0e`, `#121316` (inconsistent across sections).
  - Brand Accent: `#5B4BE0` (light) / `#8B7DFF` (dark) / `#6D5EF6` (`--brand-solid`).
  - Severity: Low (`#34D399`), Moderate (`#FBBF24`), High (`#FB923C`), Critical (`#FB7185`).
  - Contrast issue detected: Text `#ffffff` on `#8b7dff` fails WCAG AA with 3.24:1 ratio.

---

## 4. Current Section Inventory Table

| Section | Component File | Container Width | Vertical Padding | Heading Size | Alignment | Card Styles | Colors Used | Text Words |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Nav** | `marketing-nav.tsx` | 1360px | 16px (h-16) | N/A | Left + Right | 0 | 4 | 38 |
| **Hero** | `page.tsx` | 1240px | 112px top / 64px bottom | 54.4px (`3.4rem`) | Center (mob) / Left (desk) | 1 (StewardOrb) | 6 | 92 |
| **Features / How It Works** | `features-card.tsx` | 1280px (`max-w-7xl`) | 80px (`py-20`) | 48px-60px (`text-5xl-6xl`) | Left | 5 distinct card types | 8+ | 412 |
| **Post-Mortems** | `case-studies-section.tsx` | 1240px | 80px-112px | 36px (`text-display-lg`) | Center header / Left cards | 3 (Incident, Takeaway, Mid-CTA) | 9+ | 520 |
| **Telemetry / Product Demo** | `page.tsx` | 1240px | 80px-112px | 36px (`text-display-lg`) | Center header / Left cards | 3 (Spotlight, Scrubber, Precedent) | 7 | 310 |
| **Trust Principles** | `page.tsx` | 1240px | 48px (`py-12`) | N/A | Center | 1 | 3 | 24 |
| **FAQ** | `page.tsx` | 768px (`max-w-3xl`) | 64px-96px | 36px (`text-display-lg`) | Center header / Left items | 1 (Accordion item) | 3 | 245 |
| **Final CTA** | `page.tsx` | 1240px | 96px bottom | 36px (`text-display-lg`) | Center | 1 (Aurora glow box) | 5 | 42 |
| **Footer** | `footer-01.tsx` | 1280px (`max-w-7xl`) | 64px (`py-16`) | N/A | Left 4 columns | 0 | 4 | 148 |

---

## 5. Baseline Verification & Accessibility (Axe & Lighthouse)

- **Axe Violations Baseline:** 3 violations recorded via Chromium headless engine:
  1. `color-contrast` (Impact: Serious): Contrast ratio of 3.24 on `.px-7` button (`#ffffff` on `#8b7dff`). Minimum required is 4.5:1. Additional low contrast in 10-11px mono labels (`#71717b` on dark surfaces).
  2. `label` (Impact: Critical): `.h-1\.5` range slider in `collision-scrubber.tsx` is missing an accessible `<label>` or `aria-label`.
  3. `scrollable-region-focusable` (Impact: Serious): `.overflow-x-auto` code blocks in `features-card.tsx` cannot receive keyboard focus (`tabIndex={0}`).
- **Next.js Dev Overlay "1 Issue":**
  - Traced to Clerk warning: `Clerk: Clerk has been loaded with development keys`. Confirmed this is a development-only runtime banner and does not appear in production builds.
- **Visual Capture Records:**
  - 28 baseline screenshots generated and stored under `docs/redesign/before/` across 390, 768, 1280, 1440 viewports.

<!-- Reprieve Specification · Verified October 15, 2026 -->

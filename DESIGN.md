# Reprieve — Design System
> **Version**: 1.0.0 (Graph Hacks Hackathon Edition)  
> **Updated**: October 15, 2026  
> **Standard**: Verified High-Contrast Monospace Blueprint Design System  

> "Clear. Precise. Quietly confident." — like a good incident commander: calm under pressure, shows its work, never shouts.

## Purpose

This document is the single source of truth for how Reprieve looks and feels. It maps directly to `docs/05-ui-ux-design-brief.md` (full spec) and `frontend/styles/globals.css` (token implementation). Any component that deviates from this document is a bug.

---

## Design Principles

| # | Principle | What it means |
|---|-----------|---------------|
| D1 | **Proof before polish** | Every alert and answer shows its evidence (proof path, citations, score breakdown) in the first view — not behind a click. Explainability is the visual centerpiece. |
| D2 | **Calm, serious, alive** | Motion and gradient guide attention and reward understanding — never decorate. |
| D3 | **Color carries meaning, never alone** | Severity always pairs with an icon or text label. The palette is readable in grayscale. |
| D4 | **Humans decide** | Agent proposals look different from confirmed facts (dashed outline, "Proposed" label) and always end in an explicit **Approve** control. |
| D5 | **Dense but breathable** | Data-heavy screens use compact rows with generous grouping; whitespace separates ideas. |
| D6 | **Fast feeling** | Skeletons match final layout. Interactions respond in under 100ms. Animation never blocks input. |
| D7 | **One system, two themes** | Dark and light are designed together from the same tokens. Neither is an afterthought. |

---

## Color Tokens

All values live in `frontend/styles/globals.css` as CSS variables. **Components never use raw hex values.**

### Surfaces & Text

| Token | Dark | Light | Use |
|-------|------|-------|-----|
| `--bg-canvas` | `#0A0C11` | `#F6F7FA` | App background |
| `--bg-surface` | `#11141B` | `#FFFFFF` | Cards, panels |
| `--bg-raised` | `#171B24` | `#FFFFFF` + shadow | Popovers, menus |
| `--bg-overlay` | `#1D222D` | `#FFFFFF` | Dialogs |
| `--bg-sunken` | `#0D1015` | `#EDEFF4` | Inputs, code wells |
| `--text-primary` | `#EEF1F7` | `#0F1320` | Headings, body |
| `--text-secondary` | `#A9B2C5` | `#4A5367` | Supporting text |
| `--text-muted` | `#8791A6` | `#5E687C` | Metadata, placeholders |

### Brand & Signal

| Token | Value | Use |
|-------|-------|-----|
| `--brand` | `#8B7DFF` dark / `#5B4BE0` light | Primary actions, links, selection |
| `--brand-solid` | `#6D5EF6` | Filled button background |
| `--proof` | `#22D3EE` dark / `#0F6F8A` light | **Proof paths, citations, evidence** — the signature color |
| `--aurora` | `linear-gradient(120deg, #7C6CFF 0%, #4F8BFF 55%, #22D3EE 100%)` | Hero, primary CTA glow, proof-path stroke |

### Severity Scale

Bands: low < 25, moderate 25–50, high 50–75, critical ≥ 75.

| Band | Dark color | Icon | Tailwind class |
|------|-----------|------|----------------|
| Low | `#34D399` | `circle-check` | `text-sev-low` |
| Moderate | `#FBBF24` | `triangle-alert` | `text-sev-moderate` |
| High | `#FB923C` | `octagon-alert` | `text-sev-high` |
| Critical | `#FB7185` | `siren` | `text-sev-critical` |

### Graph Node Colors

| Node type | Shape | Dark |
|-----------|-------|------|
| Service | Circle | `#8B7DFF` |
| Exception | Diamond | By severity |
| Person | Rounded square | `#60A5FA` |
| Team | Hexagon | `#7DD3FC` |
| Control | Triangle | `#C4B5FD` |
| CompensatingControl | Shield | `#5EEAD4` |
| Alert | Ring around subject | Severity color |

Proof-path edges: `--proof` at 2.5px with a moving dash. Non-path nodes drop to 20% opacity.

---

## Typography

| Role | Font | Size | Weight |
|------|------|------|--------|
| Display heading | Inter | 2.25rem / 36px | 800 |
| H1 (`text-h1`) | Inter | 1.5rem / 24px | 700 |
| H2 (`text-h2`) | Inter | 1.25rem / 20px | 600 |
| H3 (`text-h3`) | Inter | 1.125rem / 18px | 600 |
| Body (`text-body`) | Inter | 0.875rem / 14px | 400 |
| Body small (`text-body-sm`) | Inter | 0.8125rem / 13px | 400 |
| Caption (`text-caption`) | Inter | 0.75rem / 12px | 400 |
| Eyebrow | Inter | 0.6875rem / 11px | 600, uppercase, +0.08em tracking |
| Mono / code | JetBrains Mono | 0.8125rem / 13px | 400 |
| Tabular numbers | `.tabular` | — | `font-variant-numeric: tabular-nums` |

---

## Component Patterns

### Draft / Proposed State
- **Dashed border** replaces the solid card border
- "Draft" eyebrow label in `--text-muted`
- Approve / Reject buttons always visible to reviewers
- `DraftImpactPreview` component appears between form fields and action buttons — shows 30-day risk impact before approval

### Alert Proof Path
- Rendered in `--proof` cyan
- Moving-dash edge animation at 8px/s
- Non-path nodes dimmed to 20% opacity
- Score breakdown visible in first view (no click required)

### Graph Canvas Decorations (Sprint Oct 9–10)
- **Pulsing halos** on high-risk Service nodes (driven by `sim_pulse` from sentinel)
- **Severity coloring** on node rings (driven by `sim_color` / `sim_band`)
- **SPOF rank labels** floating above nodes where `sim_is_spof = true`
- **Cascade particles** on proof-path edges colored by severity

### Agent Proposals
- `ProposedAction` responses from the Steward appear with a `--brand-soft` background and a "Proposed — awaiting your approval" label
- Distinct from confirmed data: never shown as facts

### Temporal Slider
- Located in the Graph Explorer page
- Range: `+0d` → `+7d` → `+30d` → `+90d`
- Changes `horizonDays` state → debounced 300ms → `useSimulationForecast` re-runs
- Canvas decorations animate to new forecast values on slider release

---

## Motion

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Color token crossfade (theme switch) | 200ms | `ease` |
| Skeleton → content | 150ms fade | `ease-out` |
| Popover / menu enter | 120ms scale + fade | `ease-out` |
| Alert proof-path dash animation | 8px/s continuous | `linear` |
| Node halo pulse | 2s ease-in-out | `infinite alternate` |
| Toast enter | 300ms slide + fade | `spring(1, 80, 10)` |

All motion is disabled when `prefers-reduced-motion: reduce` is active.

---

## Spacing & Shape

Base unit: **4px**. Scale: 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.

| Radius token | Value | Used on |
|--------------|-------|---------|
| `--radius-sm` | 6px | Chips, input inners |
| `--radius-md` | 10px | Buttons, inputs, menus |
| `--radius-lg` | 14px | Cards, dialogs |
| `--radius-xl` | 20px | Marketing cards, hero panels |
| `--radius-full` | 9999px | Pills, avatars, rings |

---

## Breakpoints

`sm 640px` · `md 1024px` · `lg 1440px` — mobile-first.

---

## Status Chips

| Status | Style |
|--------|-------|
| Active | `--sev-low` outline + dot |
| Expiring (within window) | `--sev-moderate` soft |
| Expired (derived) | `--sev-critical` soft, strikethrough on date |
| Renewed | `--brand-soft`, `repeat` icon |
| Draft / Proposed | **Dashed border**, `--text-secondary` |

---

## Rule Chips (R1–R8)

Neutral soft chip with mono ID and short label. Rule identity is never encoded by color alone — text + icon always paired.

| Rule | Icon | Label |
|------|------|-------|
| R1 | `clock` | Expiring |
| R2 | `user-x` | Orphaned owner |
| R3 | `link-2` | Single fallback |
| R4 | `layers` | Service concentration |
| R5 | `repeat` | Renewal treadmill |
| R6 | `calendar-range` | Expiry collision |
| R7 | `shield-off` | Broken compensating control |
| R8 | `route` | Customer-path exposure |

---

## Accessibility

- All text color tokens measure **5.3:1 or better** contrast in dark mode, **4.6:1 or better** in light mode
- Severity is never communicated by color alone (icon + text label always present)
- All interactive elements have visible focus rings (`--brand` 2px outline, 2px offset)
- Reduced motion: all transitions and animations disabled when `prefers-reduced-motion: reduce`
- Graph: colorblind-safe 8-cluster palette used for "color by cluster" mode

---

*Full spec: [`docs/05-ui-ux-design-brief.md`](docs/05-ui-ux-design-brief.md) · Token implementation: [`frontend/styles/globals.css`](frontend/styles/globals.css)*

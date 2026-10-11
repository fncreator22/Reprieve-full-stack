# Reference: linear.app (Linear Product Landing — Dark Mode)

## Overview
- **URL:** [https://linear.app/](https://linear.app/)
- **Product Slug:** `linear-product-landing-dark`
- **Type:** Full Landing Page / Product Showcase & Web Application Marketing
- **Design Philosophy:** Keyboard-first, engineered precision, near-black dark mode ("moonlight" wireframes), high-performance micro-interactions
- **Status:** Complete Analysis (Static Design System & Pattern Extraction; Live network extraction noted as not captured due to sandbox network policy)
- **Date Analyzed:** 2026-10-10

---

## What It Is
`linear.app` is the benchmark modern engineering & product development platform landing page. Renowned as the defining archetype of contemporary "B2B SaaS Dark Aesthetic", it presents an opinionated, high-velocity project management tool designed for high-growth software teams and autonomous agents.

The landing page communicates speed, craftsmanship, and surgical clarity through:
1. **The Volumetric Illuminated Stage:** An atmospheric dark canvas (`#010102`) punctured by subtle radial spotlights, rotating conic light beams, and ambient violet/indigo aurora glows (`#5e6ad2`).
2. **Interactive High-Fidelity App Previews:** Embedded DOM previews depicting the actual software experience (issue triage, cycle burndowns, project roadmaps, and command palette).
3. **Keyboard-First Wayfinding:** Highlighting Linear's core differentiator—instant keyboard shortcuts (`Cmd+K`, `C`, `O`, `G` then `I`) rendered via crisp tactical keycap badges.
4. **The Four Product Pillars:** Deep-dive feature chapters exploring **Issues** (speed and git automation), **Cycles** (frictionless momentum without backlog debt), **Projects** (cross-functional milestones and health status), and **Insights** (real-time velocity intelligence).
5. **Architectural Footer / Colophon:** A dense, multi-column navigation matrix grounded in typography and subtle border dividers.

---

## Why It's Exceptional

1. **Achromatic Hierarchy Over Artificial Elevation:**
   Instead of relying on heavy dropshadows or elevated z-index planes, Linear implements a nuanced **"surface ladder"** of dark grays (`#010102` canvas → `#08090a` sunken → `#0f1011` base surface → `#141516` raised surface → `#191a1b` popover/overlay). Depth is perceived through luminance contrasts and hairline semi-transparent borders (`rgba(255, 255, 255, 0.05)`).

2. **The "Moonlight" Wireframe Aesthetic:**
   Cards and containers never utilize stark solid borders. Hairline borders are softened with delicate linear and conic gradients, appearing illuminated by an ambient directional light source or the user's cursor.

3. **Restrained, Purpose-Driven Motion:**
   Linear avoids decorative animation clutter. All micro-motion strictly adheres to compositor-only transforms (`transform`, `opacity`) and serves cognitive focus: illuminating hovered elements, sliding tab underline indicators, and popping command palettes in under 120ms.

4. **Typographic Authority via Inter Variable:**
   Text is rendered using **Inter Variable** with specialized OpenType feature flags (`cv01`, `ss03`) and customized intermediate weights (such as `510` medium and `590` semibold). Heavy display headlines employ deliberate negative tracking (`-0.03em` to `-0.04em`) to impart an engineered, mechanical density.

---

## Best Fit Scenarios
- High-performance developer tools, engineering SaaS, and developer infrastructure platforms.
- Dark-mode-first productivity applications where information density and speed are paramount.
- Products featuring command palettes, keyboard shortcut workflows, and keyboard-driven ergonomics.
- Marketing sites requiring subtle ambient lighting, border-beam highlights, and modern interactive preview stages.

## When to Avoid
- Playful, consumer-facing apps requiring warm pastel palettes, organic illustrations, or whimsical cartoon animations.
- Content-first reading publications or text-heavy editorial journals requiring paper-like serif typography.
- Standard corporate enterprise portals with strict WCAG AAA light-mode high-contrast procurement mandates without a dedicated light theme.

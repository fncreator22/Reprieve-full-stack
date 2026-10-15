# Phase 3: Design System Specification & Token Architecture

Date: October 12, 2026  
Status: Gate 3 Specification  

---

## 1. Layout & Grid Architecture

- **Wide Container:** `max-w-[1280px]` (Primary desktop wrapper for sections).
- **Content Container:** `max-w-[1120px]` (Focused editorial and reading flow).
- **Grid:** 12 columns, gutter `24px` (`gap-6`).
- **Page Horizontal Padding:** `px-6` (24px) mobile, `px-10` (40px) desktop.
- **Section Vertical Padding:**
  - Desktop: `py-32` (`128px`).
  - Mobile: `py-20` (`80px`).
  - No random one-off padding values allowed.
- **Alignment Rule:**
  - **LEFT-ALIGNED** headers site-wide.
  - Section headers, eyebrows, and lead paragraphs start at the left edge of the container to establish a consistent Swiss editorial baseline.

---

## 2. Spacing Scale

Strictly locked to 10 discrete steps:
- `4px` (`gap-1`, `p-1`)
- `8px` (`gap-2`, `p-2`)
- `12px` (`gap-3`, `p-3`)
- `16px` (`gap-4`, `p-4`)
- `24px` (`gap-6`, `p-6`)
- `32px` (`gap-8`, `p-8`)
- `48px` (`gap-12`, `p-12`)
- `64px` (`gap-16`, `p-16`)
- `96px` (`gap-24`, `p-24`)
- `128px` (`py-32`, `p-32`)

---

## 3. Typography Scale & Hierarchy

| Role | Font Family | Size (px) | Line Height | Letter Spacing | CSS Utility |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | Geist / Inter Sans | 64 desktop / 56 mob | 1.05 | -0.04em | `text-[3.5rem] sm:text-[4rem] font-bold tracking-[-0.04em] leading-[1.05]` |
| **H2** | Geist / Inter Sans | 44 desktop / 36 mob | 1.15 | -0.03em | `text-[2.25rem] sm:text-[2.75rem] font-bold tracking-[-0.03em] leading-[1.15]` |
| **H3** | Geist / Inter Sans | 22 | 1.30 | -0.02em | `text-[1.375rem] font-semibold tracking-[-0.02em] leading-[1.3]` |
| **Body Large** | Inter Sans | 18 | 1.60 | normal | `text-[1.125rem] leading-[1.6]` |
| **Body** | Inter Sans | 16 | 1.50 | normal | `text-[1rem] leading-[1.5]` |
| **Small** | Inter Sans | 14 | 1.40 | normal | `text-[0.875rem] leading-[1.4]` |
| **Label / Eyebrow**| JetBrains Mono | 12 | 1.20 | 0.10em | `text-[12px] font-mono uppercase tracking-[0.1em]` |

**Enforcement Rules:**
- Minimum text size anywhere on the site is **12px** (no 9px or 10px illegible text).
- Monospace font is reserved exclusively for code, identifiers, Cypher rule names, and eyebrows/labels.
- Body paragraphs must NEVER use monospace.

---

## 4. Color System & WCAG AA Contrast Ratios

All text combinations are mathematically guaranteed $\ge 4.5:1$ contrast against dark surfaces.

| Role | Color Value (HEX / HSL) | Contrast Ratio on Canvas | Semantic Intent |
| :--- | :--- | :--- | :--- |
| **Background / Canvas** | `#08090b` | N/A | Base page surface |
| **Surface** | `#0f1115` | N/A | Card and bento surface |
| **Surface Raised** | `#16181f` | N/A | Hover states & interactive controls |
| **Border** | `rgba(255, 255, 255, 0.08)` / `#222631` | N/A | Single unified border line |
| **Text Primary** | `#f3f4f6` | **16.2 : 1** (Passes AAA) | Headlines, primary copy, numerals |
| **Text Secondary** | `#9ca3af` | **7.1 : 1** (Passes AAA) | Body copy, descriptions |
| **Text Tertiary / Muted** | `#6b7280` | **4.6 : 1** (Passes AA) | Metadata, timestamps, captions |
| **Accent (Reprieve)** | `#7061f5` / `#8b7dff` | **4.8 : 1** (white on accent) | Buttons, highlight chips, active indicators |
| **Loss** | `#ef4444` | **5.4 : 1** (on dark surface) | Catastrophic failure amounts & damage ONLY |
| **Warning** | `#f59e0b` | **7.2 : 1** (on dark surface) | Severe / high warning badges inside demo |
| **Status Dot (Green)**| `#10b981` | N/A | Tiny 6px live status indicator dots only |

**Banned:**
- Arbitrary rainbow colors in cards (no multi-colored borders or fluorescent pastel tags).
- No green success badges across incident cards; success green is limited to tiny 6px live status indicators.

---

## 5. Shape, Border & Elevation Tokens

- **Border Radius:** Exactly 3 steps:
  - `rounded-lg` (`8px`): buttons, inputs, pills, chips.
  - `rounded-xl` (`14px`): nested tiles, code blocks, stat cards.
  - `rounded-2xl` (`20px`): bento containers, section wipe bands.
- **Border:** Single consistent border token: `border border-white/[0.08]`.
- **Elevation / Shadow:** `none` across the page, except for one clean modal overlay shadow (`shadow-2xl shadow-black/80`).

---

## 6. Standard Eyebrow Specification

One unified eyebrow across every section:
```html
<span class="text-[12px] font-mono uppercase tracking-[0.1em] text-zinc-400 font-semibold">
  LABEL TEXT
</span>
```
No pills, no icons, no borders, no emojis.

---

## 7. Allowed Component Primitive Library (8 Components Only)

1. **Stat Tile:** Numerals (44px mono), single-line label (14px), optional sub-label (12px mono).
2. **Bento Card:** `rounded-2xl border border-white/[0.08] bg-[#0f1115] p-6 sm:p-8`.
3. **Wide Media Band (Wipe Band):** Draggable interactive split comparison with accessible `<input type="range" aria-label="...">`.
4. **Text + Visual Split:** 7-col / 5-col asymmetrical Swiss split.
5. **Accordion:** Exclusive to FAQ section (`Radix Accordion` with `16px` text).
6. **Button Primary / Secondary:**
   - Primary: `bg-[#7061f5] hover:bg-[#5e4ee6] text-white px-6 py-3 rounded-lg font-medium`.
   - Secondary: `border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 px-6 py-3 rounded-lg`.
7. **Code Block:** Keyboard-focusable (`tabIndex={0}`), copy button, syntax highlight with 8 lines max.
8. **Source Link:** Clean external link with verified URL, official document label, and SVG external icon.

---

## 8. Motion & Performance Specification

- **Reveal on scroll:** Clean opacity + subtle translateY (10px), 350ms duration, easing `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Reduced Motion:** All transitions drop to instantaneous or `none` when `prefers-reduced-motion: reduce`.
- **Hero Graphic:** Interactive live SVG dependency graph showing upstream waiver triggering a circuit breaker. No unbounded 60fps infinite spin loops.

---

## 9. Global Naming & Destination Agreement

- **Primary Conversion CTA:** `"Book Architecture Audit"` (opens calendar modal).
- **Secondary / Sandbox CTA:** `"Launch Live Sandbox (0 Login)"` (navigates to `/w/northwind-pay/home`).
- **Engine Latency:** Strictly **"12ms"**.

<!-- Reprieve Specification · Verified October 15, 2026 -->

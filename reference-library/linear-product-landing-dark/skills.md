# Technical Skills, Libraries & Frameworks: linear.app

This document details the libraries, runtime tools, design techniques, and algorithms identified in the architecture and frontend implementation of Linear's landing page and web application.

---

## 1. Core Frameworks & Runtime Libraries

| Category | Technology | Usage in Linear | Key Advantage |
|---|---|---|---|
| **Core UI Framework** | **React & TypeScript** | Component composition, reactive state, static typing | Predictable state flow, type-safe GraphQL interfaces |
| **State Engine** | **MobX** (App) / Lightweight Signals | Fine-grained reactivity and real-time cache mutations | Instantaneous UI updates without excessive component re-renders |
| **Component Primitives**| **Radix UI Primitives** | Dialog, Popover, Dropdown Menu, Tooltip, Accessible Menus | WCAG compliant accessibility, keyboard focus trapping, unstyled flexibility |
| **Styling & CSS** | **Custom CSS Tokens + Tailwind CSS** | Surface ladder variables, hairline border utilities, grid bento | Token consistency, zero runtime CSS-in-JS performance penalty |
| **Data Layer** | **GraphQL + WebSocket Real-Time Sync** | Live issue synchronization, collaborative updates | Offline-first sync engine with sub-50ms synchronization |
| **Animation Engine** | **CSS Hardware Compositor + Framer Motion** | GPU-accelerated transforms (`transform`, `opacity`), spring transitions | 60–120 FPS micro-interactions without main-thread jank |

---

## 2. Graphic & Motion Techniques

### 2.1 CSS `@property` Driven Border Beams
- Animates custom CSS angle variables (`--border-angle`) in `conic-gradient()` borders.
- Completely runs on the browser compositor without JavaScript recalculations per frame.

### 2.2 Volumetric Ambient Spotlights
- Composed of multi-stop `radial-gradient` and `conic-gradient` layers with Gaussian blurs (`blur(40px)` to `blur(80px)`).
- Layered beneath content containers with `pointer-events-none` to guarantee zero interaction latency.

### 2.3 Mouse-Driven Coordinate Illumination
- Captures relative pointer offsets via `pointermove` and feeds them to CSS custom properties (`--mouse-x`, `--mouse-y`).
- Renders an illuminated 600px radial light pool behind card contents, creating a tactile "moonlight" response.

### 2.4 Negative Typographic Tracking & OpenType Stylistic Sets
- Applies OpenType feature flags (`font-feature-settings: 'cv01' 1, 'ss03' 1`) to Inter Variable.
- Clamps display headings at tight negative letter-spacing (`-0.03em` to `-0.04em`), achieving an authoritative, engineered aesthetic.

---

## 3. Algorithmic Concepts & Architectural Paradigms

1. **The Surface Elevation Ladder:**
   Replaces drop-shadow-heavy elevation models with a calibrated luminance ladder (`#010102` → `#08090a` → `#0f1011` → `#141516` → `#191a1b`).
2. **Keyboard-First Event Interception:**
   Global keydown event handlers intercept navigation keys before standard browser focus loops, enabling instant shortcut jumps (`Cmd+K`, `C`, `G` then `I`).
3. **Dirty-Checking & Compositor Offloading:**
   Glow effects and card hover transitions exclusively animate `transform`, `opacity`, and CSS variable-driven background positions to prevent layout thrashing and paint invalidations.

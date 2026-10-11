# Architecture & Structure Analysis: linear.app

## 1. Page Hierarchy & Semantic DOM Architecture

The landing page of `linear.app` is constructed as a coordinated vertical narrative comprising a sticky header, 8 major semantic sections/bento stages, and an architectural footer:

```html
<body class="bg-[#010102] text-[#f7f8f8] font-sans antialiased selection:bg-[#5e6ad2] selection:text-white">
  <!-- 00. Floating Glass Header (Fixed/Sticky) -->
  <header class="fixed top-0 inset-x-0 z-50 h-[64px] border-b border-white/[0.06] bg-[#010102]/80 backdrop-blur-md">
    <nav class="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">...</nav>
  </header>

  <!-- Main Content Track -->
  <main id="main-content" class="relative w-full overflow-hidden">
    <!-- 01. Hero Stage with Ambient Aurora & Volumetric Light Beam -->
    <section id="hero" class="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
      <!-- Glow & Conic Rays Stage -->
      <div class="pointer-events-none absolute inset-0 z-0">...</div>
      <!-- Hero Copy & CTAs -->
      <div class="relative z-10 max-w-[840px] mx-auto">...</div>
      <!-- Social Proof / Customer Logomark Strip -->
      <div class="relative z-10 mt-16 max-w-[1080px] w-full">...</div>
    </section>

    <!-- 02. Interactive Product Preview Stage -->
    <section id="preview" class="relative py-12 px-6 flex justify-center">
      <div class="relative w-full max-w-[1140px] rounded-xl border border-white/[0.08] bg-[#08090a] shadow-2xl overflow-hidden">
        <!-- Interactive App Simulation: Issues / Cycles / Roadmaps -->
        ...
      </div>
    </section>

    <!-- 03. Product Pillar: Issues (Velocity Engine) -->
    <section id="issues" class="relative py-28 px-6 max-w-[1200px] mx-auto">
      <!-- Bento Grid: Issue Triage, Sub-issues, Git automation -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">...</div>
    </section>

    <!-- 04. Product Pillar: Cycles (Automated Cadence) -->
    <section id="cycles" class="relative py-28 px-6 max-w-[1200px] mx-auto">
      <!-- Burndown & Momentum Visualizer -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">...</div>
    </section>

    <!-- 05. Product Pillar: Projects & Roadmaps (Alignment) -->
    <section id="projects" class="relative py-28 px-6 max-w-[1200px] mx-auto">
      <!-- Multi-quarter Timeline & Health Status Chips -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">...</div>
    </section>

    <!-- 06. Product Pillar: Insights (Team Intelligence) -->
    <section id="insights" class="relative py-28 px-6 max-w-[1200px] mx-auto">
      <!-- Real-time Metrics & Cycle Distribution Graphs -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">...</div>
    </section>

    <!-- 07. The Command Menu Spotlight & Keyboard Ergonomics -->
    <section id="command-menu" class="relative py-28 px-6 max-w-[1200px] mx-auto text-center">
      <!-- Interactive Cmd+K Modal Simulator -->
      <div class="relative max-w-[640px] mx-auto">...</div>
    </section>
  </main>

  <!-- 08. Architectural Colophon / Multi-Column Footer -->
  <footer id="footer" class="border-t border-white/[0.06] bg-[#050608] py-20 px-6">
    <div class="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">...</div>
  </footer>
</body>
```

---

## 2. Layout Coordinate Spaces, Widths & Breakpoints

### 2.1 Max Width Containers
Linear enforces strict horizontal constraints to ensure optimal scanning density and avoid excessively wide text lines:
- **Navigation Container:** `max-w-[1200px]` (centered with `mx-auto`, `px-6`).
- **Hero Typography Container:** `max-w-[840px]` (tightly focused headline hierarchy).
- **Interactive App Preview Frame:** `max-w-[1140px]` (aspect ratio ~ 16:10 desktop screen proportion).
- **Feature Bento Grids:** `max-w-[1200px]` (12-column responsive layout).
- **Command Palette Dialog Container:** `max-w-[640px]` (classic spotlight prompt dimensions).

### 2.2 Responsive Breakpoints
Linear utilizes standard utility breakpoints paired with dynamic clamp-based typography:
- `sm`: `640px` (Single column cards, hidden complex app preview chrome)
- `md`: `768px` (2-column bento modules, logomark grid wrapping)
- `lg`: `1024px` (Full 12-column bento grid, visible app sidebar previews)
- `xl`: `1280px` (Expanded canvas spacing and generous gutter padding)

---

## 3. Stacking Contexts & Elevation Model

Depth in Linear is achieved through calibrated z-indices and backdrop filters rather than deep CSS drop shadows:

| Layer Role | Z-Index | Treatment |
|---|---|---|
| **Base Background** | `z-0` | `#010102` deep canvas, static subtle dot/grid pattern |
| **Volumetric Glow / Beams** | `z-0` / `pointer-events-none` | Absolute radial spotlights, CSS conic gradients, masked blurs |
| **Interactive Section Content** | `z-10` | Bento cards, text hierarchy, typography, interactive previews |
| **Sticky Navigation Bar** | `z-50` | `backdrop-blur-md` with `bg-[#010102]/80`, hairline bottom border |
| **Interactive Tooltips / Popovers** | `z-60` | Tooltip anchors, keyboard shortcut tags |
| **Command Palette Modal Overlay** | `z-100` | Backdrop `rgba(0,0,0,0.75)` with blurred overlay and spotlight window |

---

## 4. Bento Grid Spatial Architecture

Linear popularized the modern **Bento Grid** layout for product features. In their design:
1. **Asymmetric 12-Column Rhythm:** Features are not identical 3-column cards. A primary anchor feature takes 8 columns (`col-span-8`) displaying an interactive visual, while a secondary companion card takes 4 columns (`col-span-4`) displaying workflow highlights.
2. **Internal Card Padding:** Standard card padding is `p-8` on desktop, scaling down to `p-6` on mobile.
3. **Corner Radii Hierarchy:**
   - App frame / Preview window: `rounded-2xl` (16px–20px)
   - Bento cards: `rounded-xl` (12px–14px)
   - Buttons, badges, and keycaps: `rounded-md` (6px–8px)
   - Status pills and circular avatars: `rounded-full` (9999px)

# Architecture & Structure Analysis: prgyn.dev

## 1. Page Hierarchy & Semantic DOM Architecture

The application is structured as a single-page progressive narrative consisting of **7 core chapters** plus a theatrical colophon footer.

```html
<body class="bg-ink text-ink font-sans antialiased selection:bg-accent selection:text-ink">
  <!-- 00. Theatrical Intro Signature Preloader (Overlay) -->
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-ink" id="intro-overlay">...</div>

  <!-- Main Scroll Container -->
  <main id="app-root" class="relative w-full">
    <!-- Chapter 01: Blank Canvas Hero -->
    <section id="hero" data-chapter="blank" class="theme-ink relative min-h-[100dvh] overflow-hidden">...</section>

    <!-- Chapter 02: Spark Frame Stack -->
    <section id="spark" data-chapter="spark" class="spark theme-paper relative" style="height:calc(100dvh * 5.6)">...</section>

    <!-- Chapter 03: Sketch Exploded 3D Blueprint -->
    <section id="sketch" data-chapter="sketch" class="sk theme-blueprint relative">...</section>

    <!-- Chapter 04: Code Interactive Typography & Terminal -->
    <section id="code" data-chapter="code" class="cd theme-terminal relative">...</section>

    <!-- Chapter 05: Moves / The Motion Lab -->
    <section id="moves" data-chapter="lab" class="mv relative">...</section>

    <!-- Chapter 06: Alive / Selected Work (CRT Monitor Reveal) -->
    <section id="work" data-chapter="alive" class="al relative">...</section>

    <!-- Chapter 07: Next / The Origami Letter Contact Form -->
    <section id="contact" data-chapter="next" class="lt relative">...</section>
  </main>

  <!-- 08. Theatrical Colophon & Rolling Credits -->
  <footer id="credits" class="cr relative overflow-hidden" aria-label="End credits">...</footer>
</body>
```

---

## 2. Coordinate Spaces, Pinning & Track Height Calculations

### 2.1 Sticky Pinning Mechanics
Chapters 02 (`#spark`) and 05 (`#moves`) lock the viewport using sticky positioning driven by GSAP ScrollTrigger:
- **Chapter 02 Viewport Multiplier:** The height of `#spark` is computed as:
  $$\text{height} = \text{calc}(100\text{dvh} \times 5.6)$$
  This creates an extended scroll track where cards flip and the fuse burns while the viewport remains locked `top: 0`.

- **Chapter 05 Horizontal Track Formula:**
  Rather than standard CSS horizontal scrolling, `#moves` translates an inner track along the X-axis while the parent container spans a calculated vertical height:
  $$\text{height} = \text{calc}(100\text{dvh} + (\text{scrollWidth} - \text{clientWidth}) \times 1.15\text{px})$$

### 2.2 3D Perspective & Depth Layering
Global 3D perspective is established on transformed containers:
```css
.perspective-stage {
  perspective: 1100px;
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;
}
```
All child layers (such as exploded blueprints in Chapter 03 and origami facets in Chapter 07) project against this $1100\text{px}$ camera focal length.

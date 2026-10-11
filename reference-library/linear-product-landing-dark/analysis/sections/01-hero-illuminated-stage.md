# Section Analysis: 01-hero-illuminated-stage

## 1. Overview & Visual Role
The hero section is the flagship visual moment of the Linear marketing experience. It features a commanding display headline with aggressive negative letter-spacing, an illuminated volumetric backdrop (aurora glow + rotating conic light beam), primary conversion call-to-actions, and an animated horizontal ticker of tier-one software engineering customers (OpenAI, Ramp, Cash App, Vercel, Retool, Raycast).

- **Positioning:** `relative pt-32 pb-20 px-6 overflow-hidden`
- **Max Width:** Content is centered within `max-w-[840px]`; social proof ticker spans `max-w-[1080px]`.
- **Lighting Atmosphere:** Multi-tiered radial purple spotlights and a rotating conic ray gradient create depth on the `#010102` canvas.

---

## 2. DOM Structure & Component Breakdown

```html
<section id="hero" class="relative pt-36 pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
  <!-- Volumetric Backdrop Lighting Layers -->
  <div class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
    <!-- 1. Central Ambient Ellipse Aurora -->
    <div class="absolute -top-[180px] w-[900px] h-[550px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(94,106,210,0.22)_0%,_rgba(15,16,17,0)_70%)] blur-[80px]"></div>
    
    <!-- 2. Rotating Conic Ray Shimmer -->
    <div class="absolute -top-[120px] w-[800px] h-[800px] opacity-40 mix-blend-screen animate-spin-slow [mask-image:radial-gradient(circle_at_center,black_30%,transparent_70%)]">
      <div class="w-full h-full [background:conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(94,106,210,0.25)_40deg,transparent_90deg)]"></div>
    </div>
  </div>

  <!-- Announcement Eyebrow Badge -->
  <div class="relative z-10 mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-[#0f1011]/80 backdrop-blur-sm shadow-sm hover:border-white/[0.15] transition-all cursor-pointer">
    <span class="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] animate-pulse"></span>
    <span class="text-[12px] font-medium text-[#d0d6e0]">Linear 2026 Release</span>
    <span class="text-[12px] text-[#8a8f98]">→</span>
  </div>

  <!-- Display Hero Headline with Mechanical Tracking -->
  <h1 class="relative z-10 max-w-[840px] text-[48px] sm:text-[64px] lg:text-[76px] font-semibold tracking-[-0.04em] leading-[1.04] text-[#f7f8f8]">
    Linear is a purpose-built tool for planning and building products
  </h1>

  <!-- Supporting Subtitle Copy -->
  <p class="relative z-10 mt-6 max-w-[580px] text-[17px] sm:text-[19px] text-[#8a8f98] leading-[1.5] tracking-[-0.01em]">
    Meet the system for modern software development. Streamline issues, projects, and product roadmaps with unprecedented speed.
  </p>

  <!-- CTA Action Cluster -->
  <div class="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4">
    <!-- Primary Start Button -->
    <a href="/signup" class="inline-flex items-center justify-center px-6 py-3 rounded-lg text-[14px] font-medium text-white bg-[#5e6ad2] hover:bg-[#6f7de3] shadow-[0_0_24px_rgba(94,106,210,0.45)] hover:shadow-[0_0_32px_rgba(94,106,210,0.60)] transition-all">
      Start building
    </a>
    <!-- Secondary Keyboard Guided Button -->
    <button class="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-[14px] font-medium text-[#d0d6e0] bg-[#0f1011] border border-white/[0.08] hover:border-white/[0.18] hover:text-[#f7f8f8] transition-all">
      <span>Command Menu</span>
      <kbd class="px-1.5 py-0.5 rounded bg-[#1c1d20] border border-white/[0.12] text-[11px] text-[#8a8f98] font-mono">⌘K</kbd>
    </button>
  </div>

  <!-- Social Proof Customer Logos -->
  <div class="relative z-10 mt-24 max-w-[1080px] w-full">
    <p class="text-[12px] uppercase tracking-[0.08em] font-medium text-[#62666d] mb-8">
      Powering the next generation of product teams
    </p>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center opacity-60 hover:opacity-80 transition-opacity">
      <span class="text-[14px] font-semibold tracking-wider text-[#d0d6e0]">OpenAI</span>
      <span class="text-[14px] font-semibold tracking-wider text-[#d0d6e0]">Ramp</span>
      <span class="text-[14px] font-semibold tracking-wider text-[#d0d6e0]">Vercel</span>
      <span class="text-[14px] font-semibold tracking-wider text-[#d0d6e0]">Cash App</span>
      <span class="text-[14px] font-semibold tracking-wider text-[#d0d6e0]">Retool</span>
      <span class="text-[14px] font-semibold tracking-wider text-[#d0d6e0]">Raycast</span>
    </div>
  </div>
</section>
```

---

## 3. Motion & Shader Physics
- **Conic Rotation Velocity:** Rotating beam completes a full $360^\circ$ rotation every 24 seconds (`24s linear infinite`), slow enough to avoid visual distraction while maintaining a tactile shimmer.
- **Eyebrow Pulse Oscillator:** The live release indicator pulse runs on a 2-second cycle (`opacity: 0.4 → 1.0`).
- **Typography Density Calculation:** At `76px`, `-0.04em` corresponds to `-3.04px` letter tracking, locking characters together into cohesive graphical word units.

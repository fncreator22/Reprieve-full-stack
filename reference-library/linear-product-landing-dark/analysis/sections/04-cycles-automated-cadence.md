# Section Analysis: 04-cycles-automated-cadence

## 1. Overview & Visual Role
Linear replaces traditional agile "sprints" with **Cycles**—fixed, automated timeboxes designed to maintain momentum without backlog grooming overhead or artificial rollover debt. The Cycles section showcases cycle burn-up charts, scope distribution curves, and non-blocking scheduling.

- **Positioning:** `relative py-28 px-6 max-w-[1200px] mx-auto`
- **Eyebrow Tone:** Indigo / Violet (`#5e6ad2`)
- **Key Concepts Highlighted:** Predictable momentum, automated rollover, real-time scope tracking.

---

## 2. DOM Structure & Component Breakdown

```html
<section id="cycles" class="relative py-28 px-6 max-w-[1200px] mx-auto">
  <!-- Eyebrow & Header -->
  <div class="mb-14">
    <div class="inline-flex items-center gap-2 mb-3">
      <span class="w-2 h-2 rounded-full bg-[#5e6ad2]"></span>
      <span class="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#5e6ad2]">Cycles</span>
    </div>
    <h2 class="text-[36px] sm:text-[44px] font-semibold tracking-[-0.03em] text-[#f7f8f8] max-w-[640px]">
      Momentum over bureaucracy
    </h2>
    <p class="mt-4 text-[16px] text-[#8a8f98] max-w-[540px]">
      Cycles are designed to maintain team cadence. Unfinished work moves gracefully to the next cycle without guilt or ceremonial planning fatigue.
    </p>
  </div>

  <!-- Bento Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Primary Visual Card (8 Cols): Burn-up Progress Chart -->
    <div class="md:col-span-8 rounded-xl border border-white/[0.08] bg-[#0f1011] p-8 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between">
          <h3 class="text-[20px] font-medium text-[#f7f8f8]">Cycle 48 Velocity</h3>
          <span class="text-[12px] text-[#8a8f98]">7 days remaining</span>
        </div>
        <p class="mt-1 text-[14px] text-[#8a8f98]">38 of 46 issues completed (82% scope)</p>
      </div>

      <!-- Simulated SVG Burn-up Curve -->
      <div class="mt-8 h-48 w-full rounded-lg bg-[#08090a] p-4 flex items-end">
        <svg class="w-full h-full overflow-visible" viewBox="0 0 500 120" fill="none">
          <!-- Ideal Pace Guideline -->
          <line x1="0" y1="120" x2="500" y2="20" stroke="rgba(255,255,255,0.1)" stroke-dasharray="4 4" stroke-width="1.5" />
          <!-- Actual Burn-up Curve with Gradient Fill -->
          <path d="M0 120 Q 150 110, 220 70 T 380 35 L 420 30" stroke="#5e6ad2" stroke-width="3" stroke-linecap="round" />
          <path d="M0 120 Q 150 110, 220 70 T 380 35 L 420 30 L 420 120 L 0 120 Z" fill="url(#cycle-glow)" opacity="0.15" />
          <defs>
            <linearGradient id="cycle-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#5e6ad2"/>
              <stop offset="100%" stop-color="#5e6ad2" stop-opacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>

    <!-- Secondary Feature Card (4 Cols): Automated Cadence Rules -->
    <div class="md:col-span-4 rounded-xl border border-white/[0.08] bg-[#0f1011] p-8 flex flex-col justify-between">
      <div>
        <h3 class="text-[20px] font-medium text-[#f7f8f8] mb-2">Automated Rollover</h3>
        <p class="text-[14px] text-[#8a8f98]">
          Cycles start and end automatically on your schedule. No manual archiving, no spreadsheet estimation rituals.
        </p>
      </div>

      <div class="mt-6 p-4 rounded-lg bg-[#08090a] border border-white/[0.04]">
        <div class="flex items-center justify-between text-[12px] mb-2">
          <span class="text-[#8a8f98]">Cadence:</span>
          <span class="text-[#f7f8f8] font-medium">Every 2 weeks</span>
        </div>
        <div class="flex items-center justify-between text-[12px]">
          <span class="text-[#8a8f98]">Auto-start:</span>
          <span class="text-[#34d399] font-medium">Active (Mondays 09:00)</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 3. Motion & Visual Details
- **Burn-Up Curve SVG Stroke-Dashoffset:** When the section scrolls into view via `IntersectionObserver`, the curve draws from `x=0` to `x=420` over `1.2s` with `power2.out` easing.
- **Atmospheric Gradient Fill:** A soft linear gradient under the curve anchors the graphic without distracting data clutter.

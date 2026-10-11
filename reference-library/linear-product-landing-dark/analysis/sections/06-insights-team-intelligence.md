# Section Analysis: 06-insights-team-intelligence

## 1. Overview & Visual Role
Linear Insights delivers real-time engineering analytics without requiring external BI exports or clunky third-party dashboard integrations. The Insights section showcases team velocity distributions, issue flow rates, and customizable reporting widgets.

- **Positioning:** `relative py-28 px-6 max-w-[1200px] mx-auto`
- **Eyebrow Tone:** Cyan / Blue (`#22d3ee`)
- **Visual Focus:** Bar histograms, throughput velocity metrics, custom chart filters.

---

## 2. DOM Structure & Component Breakdown

```html
<section id="insights" class="relative py-28 px-6 max-w-[1200px] mx-auto">
  <!-- Eyebrow & Header -->
  <div class="mb-14">
    <div class="inline-flex items-center gap-2 mb-3">
      <span class="w-2 h-2 rounded-full bg-[#22d3ee]"></span>
      <span class="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#22d3ee]">Linear Insights</span>
    </div>
    <h2 class="text-[36px] sm:text-[44px] font-semibold tracking-[-0.03em] text-[#f7f8f8] max-w-[640px]">
      Actionable data. Real-time clarity.
    </h2>
    <p class="mt-4 text-[16px] text-[#8a8f98] max-w-[540px]">
      Analyze cycle velocity, identify bottlenecks, and answer critical resource questions with powerful real-time reporting.
    </p>
  </div>

  <!-- Bento Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Primary Analytics Card (8 Cols): Throughput Histogram -->
    <div class="md:col-span-8 rounded-xl border border-white/[0.08] bg-[#0f1011] p-8 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between">
          <h3 class="text-[20px] font-medium text-[#f7f8f8]">Issues Completed per Cycle</h3>
          <span class="text-[12px] text-[#34d399] font-medium">+14% vs previous quarter</span>
        </div>
        <p class="mt-1 text-[14px] text-[#8a8f98]">Rolling 8-cycle velocity distribution</p>
      </div>

      <!-- Histogram Graphic -->
      <div class="mt-8 h-44 w-full rounded-lg bg-[#08090a] p-4 flex items-end justify-between gap-3">
        <div class="w-full bg-[#5e6ad2]/40 hover:bg-[#5e6ad2] rounded-t transition-all h-[45%]"></div>
        <div class="w-full bg-[#5e6ad2]/40 hover:bg-[#5e6ad2] rounded-t transition-all h-[60%]"></div>
        <div class="w-full bg-[#5e6ad2]/40 hover:bg-[#5e6ad2] rounded-t transition-all h-[50%]"></div>
        <div class="w-full bg-[#5e6ad2]/40 hover:bg-[#5e6ad2] rounded-t transition-all h-[75%]"></div>
        <div class="w-full bg-[#5e6ad2]/40 hover:bg-[#5e6ad2] rounded-t transition-all h-[65%]"></div>
        <div class="w-full bg-[#5e6ad2]/40 hover:bg-[#5e6ad2] rounded-t transition-all h-[85%]"></div>
        <div class="w-full bg-[#5e6ad2]/40 hover:bg-[#5e6ad2] rounded-t transition-all h-[90%]"></div>
        <div class="w-full bg-[#5e6ad2] rounded-t h-[95%] shadow-[0_0_12px_rgba(94,106,210,0.5)]"></div>
      </div>
    </div>

    <!-- Secondary Metric Card (4 Cols): Custom Metric Filters -->
    <div class="md:col-span-4 rounded-xl border border-white/[0.08] bg-[#0f1011] p-8 flex flex-col justify-between">
      <div>
        <h3 class="text-[20px] font-medium text-[#f7f8f8] mb-2">Custom Aggregations</h3>
        <p class="text-[14px] text-[#8a8f98]">
          Slice data by team, assignee, priority, or estimate points in seconds without writing SQL.
        </p>
      </div>

      <div class="mt-6 space-y-2">
        <div class="p-3 rounded-lg bg-[#08090a] border border-white/[0.04] flex items-center justify-between text-[12px]">
          <span class="text-[#8a8f98]">Average Cycle Time:</span>
          <span class="text-[#f7f8f8] font-mono font-medium">3.4 days</span>
        </div>
        <div class="p-3 rounded-lg bg-[#08090a] border border-white/[0.04] flex items-center justify-between text-[12px]">
          <span class="text-[#8a8f98]">Scope Creep Rate:</span>
          <span class="text-[#f7f8f8] font-mono font-medium">4.2%</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 3. Interaction & Visual Architecture
- **Bar Chart Hover Interaction:** Hovering over individual histogram columns highlights the bar with a vibrant `#5e6ad2` fill while dimming sibling bars to 30% opacity.
- **Monospace Number Precision:** Numerical metrics use `tabular-nums` and monospace styling for crisp readability.

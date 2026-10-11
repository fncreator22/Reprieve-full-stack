# Section Analysis: 03-issues-velocity-engine

## 1. Overview & Visual Role
The Issues section illustrates Linear's primary building block: granular, keyboard-accelerated issue tracking. The visual layout uses an asymmetric 12-column Bento Grid to highlight sub-issues, git automation (branch creation and PR linking), and instant issue triage.

- **Positioning:** `relative py-28 px-6 max-w-[1200px] mx-auto`
- **Headline Concept:** "Issue tracking you'll actually enjoy using" / "Engineered for speed and flow"
- **Grid Layout:** 8-column primary card (sub-issue hierarchy & git workflows) + 4-column secondary card (instant filters and custom views).

---

## 2. DOM Structure & Component Breakdown

```html
<section id="issues" class="relative py-28 px-6 max-w-[1200px] mx-auto">
  <!-- Eyebrow & Section Header -->
  <div class="mb-14">
    <div class="inline-flex items-center gap-2 mb-3">
      <span class="w-2 h-2 rounded-full bg-[#f2994a]"></span>
      <span class="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#f2994a]">Issues</span>
    </div>
    <h2 class="text-[36px] sm:text-[44px] font-semibold tracking-[-0.03em] text-[#f7f8f8] max-w-[640px]">
      Built for speed. Optimized for builders.
    </h2>
    <p class="mt-4 text-[16px] text-[#8a8f98] max-w-[540px]">
      Create issues in seconds, prioritize with keyboard shortcuts, and automate your git workflow seamlessly.
    </p>
  </div>

  <!-- Bento Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Primary Bento Card (8 Cols): Git Workflows & Sub-issues -->
    <div class="md:col-span-8 rounded-xl border border-white/[0.08] bg-[#0f1011] p-8 flex flex-col justify-between overflow-hidden relative group">
      <div>
        <h3 class="text-[20px] font-medium text-[#f7f8f8] mb-2">Automated Git Workflows</h3>
        <p class="text-[14px] text-[#8a8f98] max-w-[480px]">
          Copy git branch names directly from issue IDs. PR reviews and merges transition issues across statuses automatically.
        </p>
      </div>

      <!-- Git Branch Code Terminal Inset -->
      <div class="mt-8 p-4 rounded-lg bg-[#08090a] border border-white/[0.06] font-mono text-[12px] text-[#8a8f98] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-[#5e6ad2]">$</span>
          <span>git checkout -b sarah/eng-342-webgl-cascades</span>
        </div>
        <kbd class="px-2 py-0.5 rounded bg-[#1c1d20] border border-white/[0.12] text-[10px] text-[#d0d6e0]">Copy</kbd>
      </div>
    </div>

    <!-- Secondary Bento Card (4 Cols): Keyboard Shortcuts -->
    <div class="md:col-span-4 rounded-xl border border-white/[0.08] bg-[#0f1011] p-8 flex flex-col justify-between relative group">
      <div>
        <h3 class="text-[20px] font-medium text-[#f7f8f8] mb-2">Keyboard Navigation</h3>
        <p class="text-[14px] text-[#8a8f98]">
          Never reach for the mouse. Modify states, assignments, and priorities using single keystrokes.
        </p>
      </div>

      <!-- Shortcut Keycap Cheat Table -->
      <div class="mt-6 space-y-3">
        <div class="flex items-center justify-between text-[13px]">
          <span class="text-[#8a8f98]">Change status</span>
          <kbd class="px-2 py-0.5 rounded bg-[#1c1d20] border border-white/[0.12] text-[11px] font-mono text-[#d0d6e0]">S</kbd>
        </div>
        <div class="flex items-center justify-between text-[13px]">
          <span class="text-[#8a8f98]">Assign user</span>
          <kbd class="px-2 py-0.5 rounded bg-[#1c1d20] border border-white/[0.12] text-[11px] font-mono text-[#d0d6e0]">A</kbd>
        </div>
        <div class="flex items-center justify-between text-[13px]">
          <span class="text-[#8a8f98]">Set priority</span>
          <kbd class="px-2 py-0.5 rounded bg-[#1c1d20] border border-white/[0.12] text-[11px] font-mono text-[#d0d6e0]">P</kbd>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 3. Micro-Interactions & Reusability
- **Code Terminal Copy Hover:** The copy button in the git terminal highlights with a crisp white border and transitions to "Copied!" for 1.2s upon click.
- **Keycap Press Simulation:** Pressing the shortcut keys while focused triggers a 2px downward active translate (`transform: translateY(1px)`) mimicking physical scissor switches.

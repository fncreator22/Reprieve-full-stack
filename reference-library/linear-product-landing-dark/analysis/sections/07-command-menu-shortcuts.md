# Section Analysis: 07-command-menu-shortcuts

## 1. Overview & Visual Role
The Command Menu section is a climactic interactive spotlight focusing on Linear's signature differentiator: the `Cmd+K` palette. The marketing page showcases a dedicated modal dialog mockup where visitors can witness or trigger live simulated command palette actions.

- **Positioning:** `relative py-28 px-6 max-w-[1200px] mx-auto text-center`
- **Centerpiece:** Floating Command Palette modal window (`max-w-[640px] mx-auto`).
- **Core Value Proposition:** Speed over ceremony; full platform operability without touching a cursor.

---

## 2. DOM Structure & Component Breakdown

```html
<section id="command-menu" class="relative py-28 px-6 max-w-[1200px] mx-auto text-center">
  <!-- Eyebrow & Header -->
  <div class="mb-14">
    <div class="inline-flex items-center gap-2 mb-3">
      <span class="w-2 h-2 rounded-full bg-[#5e6ad2]"></span>
      <span class="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#5e6ad2]">Keyboard First</span>
    </div>
    <h2 class="text-[36px] sm:text-[44px] font-semibold tracking-[-0.03em] text-[#f7f8f8] max-w-[640px] mx-auto">
      Operate at the speed of thought
    </h2>
    <p class="mt-4 text-[16px] text-[#8a8f98] max-w-[540px] mx-auto">
      Access any action, change project states, or search your entire organization in milliseconds with the Command Menu.
    </p>
  </div>

  <!-- Interactive Command Menu Modal Stage -->
  <div class="relative max-w-[640px] mx-auto rounded-xl border border-white/[0.12] bg-[#141516] shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_32px_rgba(94,106,210,0.15)] text-left overflow-hidden">
    <!-- Search Bar Input Header -->
    <div class="px-4 py-3.5 border-b border-white/[0.08] flex items-center gap-3 bg-[#191a1b]">
      <svg class="w-4 h-4 text-[#8a8f98]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <input type="text" placeholder="Type a command or search..." class="w-full bg-transparent text-[14px] text-[#f7f8f8] placeholder-[#62666d] outline-none" readonly value="Change cycle...">
      <kbd class="px-1.5 py-0.5 rounded bg-[#222326] border border-white/[0.12] text-[10px] text-[#8a8f98] font-mono">ESC</kbd>
    </div>

    <!-- Suggested Actions List -->
    <div class="p-2 space-y-1">
      <div class="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#62666d]">Suggested Commands</div>

      <!-- Action 1 (Selected) -->
      <div class="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#5e6ad2] text-white cursor-pointer">
        <div class="flex items-center gap-3">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span class="text-[13px] font-medium">Move to Active Cycle 48</span>
        </div>
        <kbd class="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono">↵</kbd>
      </div>

      <!-- Action 2 -->
      <div class="flex items-center justify-between px-3 py-2.5 rounded-lg text-[#d0d6e0] hover:bg-white/[0.04] cursor-pointer">
        <div class="flex items-center gap-3">
          <svg class="w-4 h-4 text-[#8a8f98]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          <span class="text-[13px]">Create new sub-issue</span>
        </div>
        <kbd class="px-1.5 py-0.5 rounded bg-[#1c1d20] border border-white/[0.08] text-[10px] font-mono text-[#8a8f98]">C</kbd>
      </div>

      <!-- Action 3 -->
      <div class="flex items-center justify-between px-3 py-2.5 rounded-lg text-[#d0d6e0] hover:bg-white/[0.04] cursor-pointer">
        <div class="flex items-center gap-3">
          <svg class="w-4 h-4 text-[#8a8f98]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <span class="text-[13px]">Open Roadmap timeline view</span>
        </div>
        <kbd class="px-1.5 py-0.5 rounded bg-[#1c1d20] border border-white/[0.08] text-[10px] font-mono text-[#8a8f98]">G R</kbd>
      </div>
    </div>
  </div>
</section>
```

---

## 3. Motion Dynamics & Keyboard Ergonomics
- **Zero Latency Feedback:** Command menu interactions are tuned for immediate response; active state changes occur on `keydown` rather than `keyup`.
- **Selected Highlight Contrast:** Active commands leverage the signature `#5e6ad2` background, giving unambiguous keyboard focus cues.
- **Escape / Backdrop Dismissal:** Closing animations run in $100\text{ms}$ with `opacity: 0` and `scale(0.98)` for instant dismissal.

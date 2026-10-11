# Section Analysis: 02-interactive-product-preview

## 1. Overview & Visual Role
Directly below the hero, Linear positions an interactive live-preview stage representing the actual desktop app. Rather than showing a static mock image or pre-rendered MP4 video, the stage is an interactive DOM viewport featuring a simulated sidebar, issue list, filter toolbar, and keyboard focus states.

- **Container Dimensions:** `max-w-[1140px]` centered, 16:10 desktop screen ratio (`min-h-[560px]`).
- **Surface Elevation:** Sunken workspace base `#08090a` wrapped in a double-ring moonlight border (`border border-white/[0.08] ring-1 ring-white/[0.03]`).
- **Drop Shadow:** Multi-stop atmospheric box shadow: `0 30px 60px -12px rgba(0,0,0,0.8), 0 0 100px -20px rgba(94,106,210,0.15)`.

---

## 2. DOM Structure & Component Breakdown

```html
<section id="preview" class="relative py-12 px-6 flex justify-center">
  <!-- Desktop Application Frame -->
  <div class="relative w-full max-w-[1140px] rounded-2xl border border-white/[0.08] bg-[#08090a] shadow-2xl overflow-hidden">
    <!-- Window Titlebar with macOS Controls -->
    <div class="h-10 px-4 border-b border-white/[0.06] bg-[#0f1011] flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#27272a] border border-white/[0.05]"></span>
        <span class="w-3 h-3 rounded-full bg-[#27272a] border border-white/[0.05]"></span>
        <span class="w-3 h-3 rounded-full bg-[#27272a] border border-white/[0.05]"></span>
      </div>
      <div class="flex items-center gap-2 px-3 py-1 rounded bg-[#141516] border border-white/[0.06] text-[12px] text-[#8a8f98]">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <span>Search workspace...</span>
        <kbd class="text-[10px] text-[#62666d] font-mono">⌘K</kbd>
      </div>
      <div class="w-16"></div>
    </div>

    <!-- Application Workspace Grid (Sidebar + Main Issue View) -->
    <div class="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[500px]">
      <!-- Workspace Navigation Sidebar -->
      <aside class="border-r border-white/[0.06] bg-[#0b0c0e] p-4 flex flex-col gap-6">
        <div>
          <span class="text-[11px] font-semibold uppercase tracking-wider text-[#62666d]">Workspace</span>
          <ul class="mt-2 space-y-1">
            <li class="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-[#18191c] text-[#f7f8f8] text-[13px] font-medium">
              <span>Inbox</span>
              <span class="text-[11px] text-[#8a8f98]">3</span>
            </li>
            <li class="flex items-center justify-between px-2.5 py-1.5 rounded-md text-[#8a8f98] hover:text-[#d0d6e0] text-[13px]">
              <span>My Issues</span>
              <span class="text-[11px]">12</span>
            </li>
          </ul>
        </div>

        <div>
          <span class="text-[11px] font-semibold uppercase tracking-wider text-[#62666d]">Your Teams</span>
          <ul class="mt-2 space-y-1 text-[13px] text-[#8a8f98]">
            <li class="px-2.5 py-1.5 rounded-md hover:bg-white/[0.03]">Engineering</li>
            <li class="px-2.5 py-1.5 rounded-md hover:bg-white/[0.03]">Design Systems</li>
          </ul>
        </div>
      </aside>

      <!-- Main Issue Tracker Feed -->
      <div class="p-6 bg-[#08090a]">
        <!-- Active View Toolbar -->
        <div class="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div class="flex items-center gap-3">
            <h3 class="text-[16px] font-medium text-[#f7f8f8]">Active Cycle 48</h3>
            <span class="px-2 py-0.5 rounded-full text-[11px] bg-[#5e6ad2]/20 text-[#5e6ad2] font-medium">In Progress</span>
          </div>
          <div class="flex items-center gap-2">
            <button class="px-2.5 py-1 rounded border border-white/[0.08] text-[12px] text-[#8a8f98] hover:text-white">Filter</button>
            <button class="px-2.5 py-1 rounded bg-[#5e6ad2] text-[12px] text-white font-medium flex items-center gap-1.5">
              <span>New Issue</span>
              <kbd class="text-[10px] text-white/70 font-mono">C</kbd>
            </button>
          </div>
        </div>

        <!-- Issue Rows Feed -->
        <div class="mt-4 space-y-2">
          <!-- Row 1 -->
          <div class="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-[#0f1011] hover:border-white/[0.12] transition-colors cursor-pointer group">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full border-2 border-[#f2994a]"></span>
              <span class="text-[12px] font-mono text-[#8a8f98]">ENG-342</span>
              <span class="text-[13px] text-[#d0d6e0] group-hover:text-white">Implement WebGL shadow map cascading</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-[11px] px-2 py-0.5 rounded bg-white/[0.04] text-[#8a8f98]">Graphics</span>
              <span class="text-[12px] text-[#62666d]">2d</span>
            </div>
          </div>

          <!-- Row 2 -->
          <div class="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-[#0f1011] hover:border-white/[0.12] transition-colors cursor-pointer group">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full border-2 border-[#e2b714]"></span>
              <span class="text-[12px] font-mono text-[#8a8f98]">ENG-343</span>
              <span class="text-[13px] text-[#d0d6e0] group-hover:text-white">Audit command palette shortcut key conflict</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-[11px] px-2 py-0.5 rounded bg-white/[0.04] text-[#8a8f98]">DX</span>
              <span class="text-[12px] text-[#62666d]">4d</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 3. Interactive Highlights
- **Keyboard Row Navigation:** Arrow keys toggle row selection focus with an animated hairline border highlight.
- **Micro Hover Feedback:** Hovering over an issue row immediately shifts its background from `#0f1011` to `#141516` with a `60ms` transition.
- **Zero Video Artifacts:** By rendering this preview in HTML/CSS, text stays crystal clear across Retina and 4K displays.

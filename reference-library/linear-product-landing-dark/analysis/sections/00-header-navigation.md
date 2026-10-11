# Section Analysis: 00-header-navigation

## 1. Overview & Visual Role
The header is a fixed, full-width navigation bar that hovers above the page content. It establishes the site's brand presence, provides swift wayfinding across product domains, and anchors the primary conversion CTA ("Get started" / "Log in").

- **Positioning:** `fixed top-0 inset-x-0 z-50`
- **Height:** Exactly `64px` (`h-16`)
- **Background Treatment:** Semi-transparent near-black `#010102` at 80% opacity (`bg-[#010102]/80`) paired with hardware-accelerated backdrop blur (`backdrop-blur-md`).
- **Dividers:** Hairline bottom border `border-b border-white/[0.06]`.

---

## 2. DOM Structure & Component Breakdown

```html
<header class="fixed top-0 inset-x-0 z-50 h-16 border-b border-white/[0.06] bg-[#010102]/80 backdrop-blur-md">
  <div class="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
    <!-- Brand Logo Mark -->
    <a href="/" class="flex items-center gap-2 group" aria-label="Linear Home">
      <svg class="w-5 h-5 text-[#f7f8f8] group-hover:text-white transition-colors" viewBox="0 0 100 100" fill="currentColor">
        <!-- Linear Signature Monogram / Compass Icon -->
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="4"/>
        <path d="M25 75 L75 25 M75 25 L45 25 M75 25 L75 55" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      </svg>
      <span class="text-[15px] font-medium tracking-tight text-[#f7f8f8]">Linear</span>
    </a>

    <!-- Primary Navigation Links -->
    <nav class="hidden md:flex items-center gap-6">
      <a href="#features" class="text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors">Features</a>
      <a href="#method" class="text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors">Method</a>
      <a href="#customers" class="text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors">Customers</a>
      <a href="#changelog" class="text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors">Changelog</a>
      <a href="#pricing" class="text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors">Pricing</a>
    </nav>

    <!-- Action Buttons -->
    <div class="flex items-center gap-3">
      <a href="/login" class="text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors px-3 py-1.5">
        Log in
      </a>
      <!-- Primary Illuminated CTA Button -->
      <a href="/signup" class="relative group inline-flex items-center justify-center text-[13px] font-medium text-white px-3.5 py-1.5 rounded-md bg-[#5e6ad2] hover:bg-[#6f7de3] transition-all shadow-[0_0_12px_rgba(94,106,210,0.35)]">
        Sign up
      </a>
    </div>
  </div>
</header>
```

---

## 3. Micro-Interactions & Motion Physics
- **Hover Transitions:** Nav links use a gentle `120ms` color fade from tertiary text (`#8a8f98`) to pure primary white (`#f7f8f8`).
- **Button Glow Response:** On hover, the primary button intensifies its subtle box shadow from `12px` spread to `18px` with an easing curve `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Scroll Pinning Behavior:** The header remains fixed at `top: 0` without layout shifts or height collapse across mobile and desktop breakpoints.

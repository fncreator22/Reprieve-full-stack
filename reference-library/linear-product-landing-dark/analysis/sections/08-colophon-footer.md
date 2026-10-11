# Section Analysis: 08-colophon-footer

## 1. Overview & Visual Role
The footer is an architectural colophon that concludes the marketing page. It organizes Linear's product ecosystem, features, engineering philosophies (the "Linear Method"), documentation, and company resources across a disciplined multi-column typographic grid.

- **Positioning:** `relative border-t border-white/[0.06] bg-[#050608] py-20 px-6`
- **Max Width:** `max-w-[1200px] mx-auto`
- **Visual Personality:** Quiet, dense, authoritative; hair-line borders, low-contrast headings, and subtle status indicators.

---

## 2. DOM Structure & Component Breakdown

```html
<footer id="footer" class="border-t border-white/[0.06] bg-[#050608] py-20 px-6 text-[#8a8f98]">
  <div class="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">
    <!-- Column 1: Brand & Status -->
    <div class="col-span-2 md:col-span-1 flex flex-col justify-between">
      <div>
        <a href="/" class="flex items-center gap-2" aria-label="Linear Home">
          <svg class="w-5 h-5 text-[#f7f8f8]" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="4"/>
            <path d="M25 75 L75 25 M75 25 L45 25 M75 25 L75 55" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
          </svg>
          <span class="text-[15px] font-medium text-[#f7f8f8]">Linear</span>
        </a>
        <p class="mt-4 text-[13px] text-[#62666d] leading-relaxed">
          The product development system for modern teams and agents.
        </p>
      </div>

      <!-- Live Service Status Pill -->
      <div class="mt-8 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
        <span class="text-[12px] text-[#8a8f98] hover:text-[#d0d6e0] cursor-pointer">All systems operational</span>
      </div>
    </div>

    <!-- Column 2: Product -->
    <div>
      <span class="text-[12px] font-semibold uppercase tracking-wider text-[#d0d6e0]">Product</span>
      <ul class="mt-4 space-y-2.5 text-[13px]">
        <li><a href="#issues" class="hover:text-[#f7f8f8] transition-colors">Issues</a></li>
        <li><a href="#cycles" class="hover:text-[#f7f8f8] transition-colors">Cycles</a></li>
        <li><a href="#projects" class="hover:text-[#f7f8f8] transition-colors">Roadmaps</a></li>
        <li><a href="#insights" class="hover:text-[#f7f8f8] transition-colors">Insights</a></li>
        <li><a href="/pricing" class="hover:text-[#f7f8f8] transition-colors">Pricing</a></li>
      </ul>
    </div>

    <!-- Column 3: Features & Integrations -->
    <div>
      <span class="text-[12px] font-semibold uppercase tracking-wider text-[#d0d6e0]">Features</span>
      <ul class="mt-4 space-y-2.5 text-[13px]">
        <li><a href="/integrations/github" class="hover:text-[#f7f8f8] transition-colors">GitHub Sync</a></li>
        <li><a href="/integrations/gitlab" class="hover:text-[#f7f8f8] transition-colors">GitLab Sync</a></li>
        <li><a href="/integrations/slack" class="hover:text-[#f7f8f8] transition-colors">Slack & Asks</a></li>
        <li><a href="/mobile" class="hover:text-[#f7f8f8] transition-colors">Mobile App</a></li>
        <li><a href="/command-menu" class="hover:text-[#f7f8f8] transition-colors">Command Menu</a></li>
      </ul>
    </div>

    <!-- Column 4: Linear Method & Resources -->
    <div>
      <span class="text-[12px] font-semibold uppercase tracking-wider text-[#d0d6e0]">Company</span>
      <ul class="mt-4 space-y-2.5 text-[13px]">
        <li><a href="/method" class="hover:text-[#f7f8f8] transition-colors">Linear Method</a></li>
        <li><a href="/about" class="hover:text-[#f7f8f8] transition-colors">About Us</a></li>
        <li><a href="/careers" class="hover:text-[#f7f8f8] transition-colors">Careers</a></li>
        <li><a href="/changelog" class="hover:text-[#f7f8f8] transition-colors">Changelog</a></li>
        <li><a href="/security" class="hover:text-[#f7f8f8] transition-colors">Security</a></li>
      </ul>
    </div>

    <!-- Column 5: Developers & Connect -->
    <div>
      <span class="text-[12px] font-semibold uppercase tracking-wider text-[#d0d6e0]">Developers</span>
      <ul class="mt-4 space-y-2.5 text-[13px]">
        <li><a href="/docs/api" class="hover:text-[#f7f8f8] transition-colors">GraphQL API</a></li>
        <li><a href="/docs/sdk" class="hover:text-[#f7f8f8] transition-colors">TypeScript SDK</a></li>
        <li><a href="/docs/webhooks" class="hover:text-[#f7f8f8] transition-colors">Webhooks</a></li>
        <li><a href="https://twitter.com/linear" class="hover:text-[#f7f8f8] transition-colors">X / Twitter</a></li>
        <li><a href="https://github.com/linear" class="hover:text-[#f7f8f8] transition-colors">GitHub</a></li>
      </ul>
    </div>
  </div>

  <!-- Bottom Legal & Copyright Bar -->
  <div class="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#62666d]">
    <div>© 2026 Linear Orbit, Inc. All rights reserved.</div>
    <div class="flex items-center gap-6 mt-4 sm:mt-0">
      <a href="/privacy" class="hover:text-[#8a8f98]">Privacy Policy</a>
      <a href="/terms" class="hover:text-[#8a8f98]">Terms of Service</a>
      <a href="/dpa" class="hover:text-[#8a8f98]">DPA</a>
    </div>
  </div>
</footer>
```

---

## 3. Typographic & Structural Precision
- **Strict Visual Restraint:** Heading categories use `text-[12px]`, uppercase tracking `+0.08em`, and a soft silvery-white tone (`#d0d6e0`).
- **Live Status Heartbeat:** The operational indicator dot features a subtle pulse animation matching uptime telemetry conventions.

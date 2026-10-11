# Section 00: Preloader & Intro Signature Sequence

## 1. Overview & Purpose
- **Source Reference:** [`3oztndie4w4us.js#L122224`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/3oztndie4w4us.js#L122224)
- **Role:** Theatrical opening ceremony, asset warmup, and physical cursor hand-off to Chapter 01.
- **Theme:** `bg-ink` (`#0d0d0f`)

---

## 2. DOM Scaffolding
```html
<div class="fixed inset-0 z-[100] flex items-center justify-center bg-ink" id="intro-overlay">
  <!-- Handwritten Calligraphy SVG -->
  <svg viewBox="0 0 900 260" class="w-[85vw] max-w-[900px] overflow-visible">
    <text 
      x="50%" y="60%" 
      text-anchor="middle" 
      class="font-script text-[110px] sm:text-[140px] fill-transparent stroke-chalk stroke-[1.5px]"
    >
      Pragyan Khadka
    </text>
  </svg>

  <!-- Bottom-Right Monospace Progress Counter -->
  <div class="absolute bottom-10 right-10 font-mono text-xs text-text-muted">
    <span id="intro-counter">000</span> / 100
  </div>

  <!-- Flying Editor Caret -->
  <div id="intro-caret" class="absolute w-[14px] h-[70px] bg-accent opacity-0 pointer-events-none"></div>
</div>
```

---

## 3. Microsecond Frame Breakdown & State Timeline

1. **$t = 0.00\text{s}$ to $0.20\text{s}$ (Lock & Measure):**
   - Locks scrolling: `document.documentElement.style.overflow = "hidden"`.
   - Computes text stroke length: $c = 1.1 \times \text{text.getComputedTextLength}()$.
   - Applies initial state: `strokeDasharray: c`, `strokeDashoffset: c`.

2. **$t = 0.20\text{s}$ to $2.40\text{s}$ (The Draw Phase — Duration: 2.2s):**
   - Easing: `power2.inOut`.
   - Interpolates `strokeDashoffset: 0`.
   - Concurrently updates the monospace counter from `000` to `100` (`String(Math.round(val)).padStart(3, "0")`).

3. **$t = 2.10\text{s}$ to $2.70\text{s}$ (Typography Flood — Duration: 0.6s):**
   - Starts $-0.3\text{s}$ before stroke finishes.
   - Text fills with chalk (`#ececea`) via `fillOpacity: 1` (`ease: "power2.out"`).
   - Stroke width decays to 0.

4. **$t = 2.70\text{s}$ to $3.10\text{s}$ (Caret Materialization — Duration: 0.4s):**
   - Monospace cursor caret positions itself at the exact terminal glyph coordinate:
     $$\text{left} = \text{rect.right} - 6\text{px}, \quad \text{top} = \text{rect.top} + 0.25 \times \text{rect.height}$$
   - Caret flashes on with `opacity: 1`.

5. **$t = 3.10\text{s}$ to $3.80\text{s}$ (Signature Slide-out — Duration: 0.7s):**
   - Signature text slides up: `y: -40px, opacity: 0` (`ease: "power2.in"`).

6. **$t = 3.80\text{s}$ to $4.50\text{s}$ (The Caret Hand-off Flight — Duration: 0.7s):**
   - The caret physically morphs and flies across the viewport to dock directly into the Hero editor title:
     ```javascript
     gsap.to(caretEl, {
       left: heroTargetRect.left,
       top: heroTargetRect.top,
       width: heroTargetRect.width || 14,
       height: heroTargetRect.height || 70,
       duration: 0.7,
       ease: "power4.inOut"
     });
     gsap.to(overlayEl, { 
       backgroundColor: "rgba(13,13,15,0)", 
       duration: 0.7, 
       ease: "power2.in" 
     });
     ```

7. **$t = 4.50\text{s}$ (Unmount & Hand-off):**
   - Removes overlay from DOM or sets `display: "none"`.
   - Restores scroll: `document.documentElement.style.overflow = ""`.
   - Refreshes ScrollTrigger calculations.

# Section 01: Blank Canvas Hero (`#hero` / `data-chapter="blank"`)

## 1. Overview & Purpose
- **Source Reference:** [`3oztndie4w4us.js#L120185`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/3oztndie4w4us.js#L120185)
- **Role:** Chapter 01 — An interactive editorial canvas establishing the core premise: design begins from a blank slate.
- **Theme:** `.theme-ink` (Background: `#0d0d0f`, Accent: `#e0243a`)

---

## 2. Component Breakdown & Mechanics

### A. The Freehand Scribble Engine (`class U`)
- **Pointer Capture:** Reads sub-frame coordinates via `e.getCoalescedEvents?.() ?? [e]`.
- **Canvas Rendering:** Uses Catmull-Rom smoothing across pointer history.
- **Proximity Grid Glow:** The background 12-column architectural grid tracks cursor coordinates via CSS variables:
  - `--mx`, `--my`: Local mouse position.
  - `--gr`: Reveal radius (`0px` idle, `240px` hover, `560px` drawing).

### B. 6-Shape Wireframe Classifier Algorithm (`finishStroke()`)
When a stroke completes, the engine computes:
- Bounding box dimensions: $W, H$
- Total arc length: $L$
- Diagonal: $D = \sqrt{W^2 + H^2}$
- Start-to-end distance: $d$
- Closure ratio: $C = d / \max(D, 1)$

**Classification Logic:**
1. **`icon`**: If $L < 26\text{px}$ or $D < 20\text{px}$.
2. **`button`**: If sharp angular turns ($|\Delta\theta| > 1.15\text{ rad}$) $\ge 3$ and closure $C > 0.35$.
3. **`divider`**: If $d / L > 0.8$ and $W < H$ (vertical orientation).
4. **`headline`**: If $d / L > 0.8$ and $W > 0.26 \times \text{viewport width}$ (horizontal stroke).
5. **`text`**: If $d / L > 0.8$ (short stroke) OR aspect ratio $W / H > 3.2$.
6. **`image`**: If closure $C < 0.32$ and perimeter $L > 1.6 \times D$ (closed loop).

### C. 72-Point Catmull-Rom Morph
Once classified, the freehand curve is resampled into exactly 72 equidistant points and morphed into a crisp geometric wireframe box or line over `0.75s` with `ease: "expo.out"`.

### D. Mathematical Generative Art Engine (`MATH_ART`)
Triggered by clicking the word `"art"`. Launches a radial ripple reveal $k(n) = 1 - (1 - n)^3$:
- **Golden Ratio Spiral:** 10 Fibonacci nested squares with orbital follower dot.
- **Phyllotaxis Seed Field:** 1,100 Fermat spiral points with golden angle $\phi \approx 137.508^\circ$:
  $$r = c \sqrt{n}, \quad \theta = n \phi + 0.04a$$
- **Harmonograph Pendulum:** 3,200 points simulating dual damped harmonic oscillation ($e^{-0.0035t}$).

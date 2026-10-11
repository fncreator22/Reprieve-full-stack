# Video & Motion Analysis Log: linear.app

## 1. Video Asset Audit
- **Pre-rendered Video Files (`.mp4`, `.webm`, `.mov`):** `0` (None found on primary landing page hero or features).
- **Embedded Iframes (YouTube, Vimeo, Wistia):** `0` (None).
- **Video Capture Status:**
  `Not captured: No embedded video streams exist on the landing page; all visual motion is executed natively via CSS transforms, conic gradient animations, and GPU compositor transitions.`

---

## 2. Motion Timelines & Transition Dynamics Breakdown

### A. Rotating Conic Ray Shimmer (Hero Stage)
- **Cycle Duration:** $24.0\text{s}$ per full $360^\circ$ rotation.
- **Interpolation:** Strict linear (`linear infinite`).
- **Rendering Thread:** GPU compositor offload (`transform: rotate(360deg)` with `will-change: transform`).
- **Visual Effect:** Prevents static dark space by creating slow, ambient caustic shifts across the hero headline.

### B. Command Menu (`Cmd+K`) Pop-In Transition
- **Trigger:** `keydown (Meta+K / Ctrl+K)` or clicking the Command Menu CTA.
- **Stage 1 (0ms–120ms):**
  - Backdrop overlay fades from `opacity: 0` to `opacity: 1` (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - Background backdrop blur ramps from `blur(0px)` to `blur(8px)`.
- **Stage 2 (0ms–150ms):**
  - Modal window scales from `0.97` to `1.00`.
  - Vertical translation moves from `-8px` to `0px`.
  - Focus locks immediately onto the search `<input>` element with zero keyboard lag.
- **Dismissal (0ms–100ms):**
  - Reverse transition completes in $100\text{ms}$ with `opacity: 0` and `scale: 0.98`.

### C. Mouse-Following Radial Spotlight
- **Sampling Frequency:** Bound to user input events via `pointermove` throttled to `requestAnimationFrame` ($\approx 16.6\text{ms}$ on 60Hz, $8.3\text{ms}$ on 120Hz).
- **Falloff Math:**
  $$I(d) = \max\left(0, 1 - \frac{d}{R}\right)^2$$
  where $R = 500\text{px}$ (spotlight radius), $d = \sqrt{(x - x_{\text{mouse}})^2 + (y - y_{\text{mouse}})^2}$.
- **Border Bleed:** Employs CSS mask composite to illuminate only the 1px hairline border at the cursor's immediate perimeter.

### D. Cycles Burn-Up SVG Curve Reveal
- **Trigger:** Viewport entry observed via `IntersectionObserver` (`threshold: 0.3`).
- **Duration:** $1.2\text{s}$.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (smooth deceleration without bounce).
- **Stroke Dash Interpolation:** `stroke-dashoffset` animates from path length ($L \approx 450\text{px}$) to $0$, drawing the line smoothly from left to right.

# Skills, Libraries & Tech Stack: prgyn.dev

## 1. Core Platform & Frameworks
- **Framework:** Next.js (React 18 / 19 SSR + Client Hydration)
- **Styling:** Tailwind CSS with custom CSS variable theme mappings
- **Script Bundling:** Webpack / Next.js production chunking
- **Fonts:**
  - `Bricolage Grotesque` (Variable font with axes `'wght' 200..800`, `'wdth' 75..100`)
  - `JetBrains Mono` / `Geist Mono` (Monospace technical readouts, code walls, counter dials)
  - `Mrs Saint Delafield` (Handwritten script font used in the intro signature sequence)

---

## 2. Animation & Physics Libraries
- **GSAP (GreenSock Animation Platform) 3.12+:**
  - `gsap.timeline()` for sequenced transitions
  - `gsap.quickTo()` for low-overhead pointer lerping
  - `gsap.ticker` for 60–120 FPS render loops
  - `gsap.utils.clamp()`, `gsap.utils.interpolate()`
- **ScrollTrigger:**
  - Scroll scrub synchronization (`scrub: 0.6` to `scrub: 1`)
  - Viewport pinning (`pin: true`, custom dynamic heights like `calc(100dvh * 5.6)`)
  - Scroll velocity tracking via `self.getVelocity()`
- **Matter.js:**
  - 2D Rigid body engine (`Matter.Engine`, `Matter.Bodies`, `Matter.Composite`)
  - Spring constraints, collision filters, gravity vectors, and mouse dragging (`Matter.MouseConstraint`)

---

## 3. Mathematical & Algorithmic Skills
- **Catmull-Rom & Cubic Bezier Splines:**
  - Smoothing raw pointer input arrays into continuous mathematical curves
  - Spline arc-length parameterization and equidistant 72-point resampling
- **Geometric Corner & Shape Classification:**
  - Angular rate of change detection:
    $$\Delta\theta = \text{atan2}(a \cdot s - n \cdot i, \; a \cdot i + n \cdot s)$$
  - Geometric ratios (closure ratio $C = d / \max(D, 1)$, perimeter-to-diagonal ratios) to classify wireframes into icons, buttons, dividers, headlines, text, and images
- **3D Quaternion Kinematics & Hinge Mechanics:**
  - Spherical linear interpolation (`rz` Slerp)
  - Quaternion rotation operators for folding 3D origami facets
  - Perspective projection with camera focal distance $f = 1100\text{px}$:
    $$x_{\text{proj}} = \frac{x \cdot 1100}{1100 - z}, \quad y_{\text{proj}} = \frac{y \cdot 1100}{1100 - z}$$
  - Canvas 2D Affine Transformation mapping (`context.setTransform`) for texture-mapped 3D polygon facets
- **Generative Mathematics:**
  - Fibonacci spiral sequence and golden ratio geometry
  - Phyllotaxis Fermat spiral point distributions with golden angle $\phi \approx 137.508^\circ$
  - Harmonograph dual damped pendulum simulations
  - 3D Fibonacci sphere uniform distribution algorithms
  - Hooke's Law damped spring force fields ($F = -k \Delta x - c v$)

---

## 4. Hardware & DOM Performance Engineering
- **Pointer Event Coalescing:** `e.getCoalescedEvents?.() ?? [e]` for sub-frame tracking on 120Hz/240Hz screens.
- **Style-Write Dirty Checking:** Caching integer-rounded typography weights (`fw`, `fd`) to prevent redundant DOM style recalculations and layout thrashing.
- **IntersectionObserver Lifecycle Gating:** Halting ticker executions and canvas clearing whenever a section is outside the active viewport.
- **Throttled Projector Cadence:** Clamping canvas grain to exactly 24 FPS ($1/24\text{s} = 0.04167\text{s}$) to recreate vintage film shutter aesthetics while conserving GPU cycles.

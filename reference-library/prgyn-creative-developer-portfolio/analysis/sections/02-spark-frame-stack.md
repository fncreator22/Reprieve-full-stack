# Section 02: Spark Frame Stack (`#spark` / `data-chapter="spark"`)

## 1. Overview & Purpose
- **Source Reference:** [`3oztndie4w4us.js#L140312`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/3oztndie4w4us.js#L140312)
- **Role:** Chapter 02 — Storytelling sequence illustrating the inception of an idea through an ignition fuse, exploding cards, and accelerating frame flips.
- **Theme:** `.theme-paper` (Warm editorial paper background `#f0f0ed`, text `#111113`)

---

## 2. Layout & Scroll Scrub Architecture
- **Track Height:** Locked sticky over $5.6\times$ viewport heights:
  `style="height: calc(100dvh * 5.6)"`
- **ScrollTrigger Config:** `scrub: 0.6`, pinning `#spark` to top of viewport.

---

## 3. Micro-Interaction & Animation Mechanics

### A. The Burning Fuse Spline
Coordinates between the headline text anchor and the physical card deck are connected via a dynamic Catmull-Rom cubic Bezier path:
`M x0,y0 C o1.x,o1.y l1.x,l1.y i1.x,i1.y`
As the user scrubs, the path length burns down via `strokeDashoffset`.

### B. Velocity-Dependent Spark Emission (`class em`)
At the current tip coordinate of the fuse $C(t)$, sparks are spawned on an internal ticker:
$$\text{sparkCount} = 3 + \min\left(10, \; \frac{|\text{scrollVelocity}|}{250}\right)$$
Sparks inherit drag damping ($v \leftarrow v \times 0.92$) and downward gravitational acceleration ($v_y \leftarrow v_y + 0.25$).

### C. Polygonal Text Shatter
The word `"still"` shatters into 5 geometric polygon shards:
- **Burst Phase ($1.2\text{s}$ duration):**
  - Shards displace: `x: [-4, 0, 5, -3, 4], y: [-3, -5, -2, 4, 3], rotation: [-4, 2, 5, -3, 3]`
- **Gravitational Fall Phase ($9.0\text{s}$ duration, stagger: $0.35\text{s}$):**
  - Shards plummet down the screen: `y: 0.95 * viewportHeight, autoAlpha: 0`

### D. Accelerated Card Flip Cadence
While early caption cards flip at fixed intervals ($X[t] = Y + 10 + 8t$), subsequent frame stacks flip with quadratic acceleration:
$$r = 1 - \left(1 - \frac{t}{N}\right)^2, \quad \text{duration} = \max\left(0.5, \; 3 - 2.6 \cdot \frac{t}{N}\right)$$

### E. The Full-Screen "Escape" Zoom
At the conclusion of the chapter, `.move-escape` explodes out from the card deck over 9 seconds with `power4.inOut`, expanding to completely engulf the viewport and transitioning into Chapter 03.

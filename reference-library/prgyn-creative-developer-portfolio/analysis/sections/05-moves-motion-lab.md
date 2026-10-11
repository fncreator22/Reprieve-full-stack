# Section 05: Moves / The Motion Lab (`#moves` / `data-chapter="lab"`)

## 1. Overview & Purpose
- **Source Reference:** [`3oztndie4w4us.js#L195484`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/3oztndie4w4us.js#L195484)
- **Role:** Chapter 05 — A horizontal playground consisting of 7 distinct interactive experimental rooms.
- **Theme:** Dynamic (Shifts across `.theme-ink`, `.theme-mint`, and `.theme-crimson`)

---

## 2. Dynamic Horizontal Scroll Architecture
Parent container height is computed dynamically to match the exact scroll width:
$$\text{height} = \text{calc}\left(100\text{dvh} + (\text{scrollWidth} - \text{clientWidth}) \times 1.15\text{px}\right)$$
ScrollTrigger drives `x: -(scrollWidth - clientWidth)` across this vertical span.

---

## 3. The 7 Interactive Rooms

1. **`hall` (Physics Tag Sandbox):**
   Interactive skill badge pills that bounce off bounding borders and allow physical throwing with velocity inheritance.
2. **`scrub` (Scrubber Playground):**
   Pointer horizontal position maps $0\%\dots100\%$ through `gsap.quickTo(progress, "p", { duration: 0.5, ease: "power3.out" })`. 3D letter scatter ($x \in [-260, 260]\text{px}$, rotation $\in [-120^\circ, 120^\circ]$) snaps cleanly to `wght: 800`.
3. **`physics` (Matter.js 2D Rigid-Body Room):**
   Full 2D physics world initialized via `Matter.Engine.create()`. Configured with `restitution: 0.35`, `friction: 0.4`, dynamic boundary walls, and mouse drag constraints (`Matter.MouseConstraint`).
4. **`orbit` (3D Fibonacci Sphere):**
   Uniformly projects tool icons across a 3D spherical shell using the golden spiral:
   $$y = 1 - \frac{2r}{N - 1}, \quad \text{radius} = \sqrt{1 - y^2}, \quad \theta = 2.399963 \times r$$
   $$x = \cos(\theta) \times \text{radius}, \quad z = \sin(\theta) \times \text{radius}$$
   Includes inertia drag ($v_x \leftarrow v_x \times 0.94$), auto-spin restoration ($v_y \leftarrow v_y + (0.004 - v_y) \times 0.02$), and depth-based opacity attenuation ($\alpha = 0.28 + \frac{z + 1}{2} \times 0.72$).
5. **`draw` (Quadratic Bezier Smoother):**
   Freehand gesture playground that converts noisy user inputs into smooth quadratic curves via midpoint averaging:
   $$P_{\text{mid}} = \frac{P_i + P_{i+1}}{2}$$
6. **`type` (Variable Font Crosshair):**
   2D interactive crosshair: horizontal cursor axis sets font width ($75\%\dots100\%$), vertical axis sets font weight ($200\dots800$). Idle state traces an automated Lissajous curve:
   $$x = 0.5 + 0.4 \sin(0.7t), \quad y = 0.5 + 0.35 \sin(0.9t + 1)$$
7. **`particles` (Canvas Wordmark Force Field):**
   1,000 text particles with fixed home coordinates $(h_x, h_y)$. Cursors create a $90\text{px}$ repulsion force, while Hooke's Law springs restore particles:
   $$v \leftarrow (v + (h - p) \times 0.06) \times 0.82$$

# Section 07: Next / The Origami Letter (`#contact` / `data-chapter="next"`)

## 1. Overview & Purpose
- **Source Reference:** [`3oztndie4w4us.js#L272463`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/3oztndie4w4us.js#L272463)
- **Role:** Chapter 07 — The final narrative chapter: a conversational contact letter that physically folds into a 3D origami envelope and launches into space.
- **Theme:** `.theme-ink`

---

## 2. Conversational Typewriter Form Engine
Instead of generic input fields, the form renders a conversational paragraph:
- Form lines are revealed sequentially via a typewriter cadence at $32\text{ms}$ per character.
- The active input caret automatically sizes and positions itself over the active text token.
- Pressing `Enter` commits the value and smoothly advances focus to the next sentence token.

---

## 3. 3D Quaternion Kinematics & Hinge Folding Engine

### A. Rasterization & Mesh Decomposition
Upon submission, the completed letter DOM is rasterized onto an offscreen canvas (`n.img`) and decomposed into polygonal triangular facets along 4 physical hinge axes.

### B. Quaternion Slerp Rotations
The 3D folding sequence executes through 4 distinct mechanical creases:
- **Fold 1 ($t = 0.85\text{s}$):** Bottom third creases upward along X-axis.
- **Fold 2 ($t = 1.45\text{s}$):** Top third folds down over the body.
- **Fold 3 ($t = 2.00\text{s}$):** Left and right side tabs fold inward.
- **Fold 4 ($t = 2.60\text{s}$):** Triangular envelope seal closes shut.

Rotations use Quaternion Slerp `rz(q1, q2, t)` and axial rotation `rY(q, v)` to maintain numerical stability and eliminate gimbal lock.

### C. Depth Sorting & Affine Texture Warping
1. Facets are depth-sorted by average Z:
   $$y.\text{sort}((a, b) \to a.k[0] - b.k[0] \parallel a.k[1] - b.k[1] \parallel a.k[2] - b.k[2])$$
2. Facets project onto screen space using focal distance $f = 1100\text{px}$:
   $$x_{\text{proj}} = \frac{x \times 1100}{1100 - z}, \quad y_{\text{proj}} = \frac{y \times 1100}{1100 - z}$$
3. 2D affine transformation matrices (`context.setTransform(m0, m1, m2, m3, m4, m5)`) map texture regions from the rasterized canvas directly onto each 3D triangle.

### D. 3D Parabolic Flight & Glowing Vapor Ribbon
At $t = 3.05\text{s}$, the envelope executes a 3D looping arc over $2.4\text{s}$.
As it flies, the envelope leaves behind a trailing dual-layered glowing vapor ribbon:
- Outer halo: `lineWidth = 4 * u`, `rgba(236,236,234, 0.12 * d)`
- Core laser filament: `lineWidth = u`, `rgba(236,236,234, 0.75 * d)`

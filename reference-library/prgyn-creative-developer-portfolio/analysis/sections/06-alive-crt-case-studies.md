# Section 06: Alive / Selected Work (`#work` / `data-chapter="alive"`)

## 1. Overview & Purpose
- **Source Reference:** [`3oztndie4w4us.js#L258578`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/3oztndie4w4us.js#L258578)
- **Role:** Chapter 06 — Showcases major projects and case studies through a retro CRT monitor television interface with live scanline rasterizers and 3D card flips.
- **Theme:** `.theme-ink`

---

## 2. Real-Time CRT Monitor Shader & 2-Phase Power-On

### A. 70Hz Traveling Scanline Shader
A small offscreen canvas ($160 \times 90$) generates real-time noise overlaid with a 6px traveling beam cycling at 70Hz:
$$t = \left(\frac{\text{now}}{1000} \times 70\right) \pmod{90}$$
$$a = 60 \times (|r - t| < 6), \quad \text{color} = 200 \times \text{Math.random}() + a$$

### B. 2-Phase Retro CRT Cathode Ray Power-On Sequence
Triggered when switching between projects. Interpolates CSS `clip-path: inset(...)`:
- **Phase 1 ($t \in [0.0, 0.45]$):** A thin horizontal line beam stretches from center across width:
  $$W_{\text{current}} = W \times (0.02 + 0.98 \times \text{power3.out}(t / 0.45))$$
- **Phase 2 ($t \in [0.45, 1.0]$):** The vertical height snaps open with a blinding phosphor flash:
  $$H_{\text{inset}} = \frac{H}{2} \times \left(1 - \text{power3.out}\left(\frac{t - 0.45}{0.55}\right)\right)$$
  $$\text{brightness} = 1 + 2.5 \times \left(1 - \frac{t - 0.45}{0.55}\right)$$

---

## 3. Case Studies & 3D Flip Checkpoints
The section presents three flagship interactive case studies:
1. **`lm` (Lets Matter):** Climate advocacy platform for Nepal with interactive voice and community questions.
2. **`cf` (ClipForge):** AI stream clipping and automatic highlight extraction engine.
3. **`pg` (prgyn):** Meta case study documenting the architecture of this portfolio.

Cards execute 3D flip rotations along the timeline at checkpoints:
$$\text{flipTimestamps} = [3.10\text{s}, \; 5.95\text{s}, \; 10.15\text{s}]$$
Each flip transitions using `power2.inOut` with backface culling enabled.

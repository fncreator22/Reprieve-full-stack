# Section 04: Code Interactive Typography & Terminal (`#code` / `data-chapter="code"`)

## 1. Overview & Purpose
- **Source Reference:** [`3oztndie4w4us.js#L171620`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/3oztndie4w4us.js#L171620)
- **Role:** Chapter 04 — Bridges abstract design and raw code through live parametric typography sliders, glitch shaders, and character flights.
- **Theme:** `.theme-terminal` (Deep black `#0b0e0d`, code line `#1fc79e4d`, accent Mint `#1fc79e`)

---

## 2. Interactive Mechanics

### A. 3D Character Flight (`cd-fly`)
Characters from an ambient monospace background code wall physically detach and fly across 3D space to assemble the headline words:
- Each character span stores its source coordinate `{ line, col }` and target DOM element.
- Transition interpolates `x, y, z, rotationZ` over $1.4\text{s}$ using `power3.inOut` with staggered offsets.

### B. Glitch Engine (`.cd-glitch`)
Simulates syntax compilation glitches using chromatic aberration and high-frequency slice shifts:
$$\text{translateX} = \pm 14\text{px} \times g, \quad \text{skewX} = \pm 10^\circ \times g$$
$$\text{textShadow} = -2\text{px } 0\text{ } \#e0243a, \; 2\text{px } 0\text{ } \#1fc79e$$

### C. Live Parametric Motion Sliders
An embedded interactive control board allows visitors to manipulate the variable font parameters in real time:
- **Default State:** `{ y: -40, rotate: 8, wght: 800, wdth: 100, duration: 0.9, stagger: 0.08, ease: "elastic.out(1, 0.35)", color: "#e0243a" }`
- **Supported Easing Selector:** `elastic.out(1, 0.35)`, `back.out(3)`, `power2.inOut`, `bounce.out`, `expo.inOut`, `steps(6)`
- Sliding any control immediately re-triggers the typographic physics loop.

# Video & Microsecond Motion Analysis Log: prgyn.dev

## 1. Video Asset Audit
- **Pre-rendered Video Files (`.mp4`, `.webm`, `.mov`):** `0` (None found in network traffic or DOM).
- **Embedded Iframes (YouTube, Vimeo, Mux):** `0` (None).
- **Nature of Visual Motion:** 
  All fluid motion is rendered **100% in real time** through client-side math, physics engines (Matter.js), and canvas drawing loops executed at the client monitor's native refresh rate (60Hz, 120Hz, or 240Hz).

---

## 2. Microsecond Frame & Motion Physics Breakdown

### A. Intro Signature Sequence (Duration: 4.5s)
- **0.00s–0.20s:** Preloader mounts; scroll locked; SVG stroke dashoffset initialized.
- **0.20s–2.40s (2.2s):** `power2.inOut` stroke interpolation; tabular counter runs `000` to `100`.
- **2.10s–2.70s (0.6s):** Chalk text fill flood; stroke width decays to 0.
- **2.70s–3.10s (0.4s):** Monospace caret snaps to the terminal glyph coordinates.
- **3.10s–3.80s (0.7s):** Signature slides up (`y: -40px`) and fades out (`opacity: 0`).
- **3.80s–4.50s (0.7s):** Caret flies across the viewport (`power4.inOut`) to land in the Hero editor position.

### B. 2-Phase Retro CRT Cathode Ray Power-On (Duration: 1.1s)
- **Phase 1 (0.00s–0.50s / Progress 0.0 to 0.45):**
  - Horizontal line beam expands from center:
    $$W_{\text{beam}} = W \times (0.02 + 0.98 \times \text{power3.out}(t / 0.45))$$
  - Height remains clamped to a $3\text{px}$ razor line.
  - Screen brightness boosted to $2.2\times$.
- **Phase 2 (0.50s–1.10s / Progress 0.45 to 1.00):**
  - Vertical height snaps open:
    $$H_{\text{open}} = H \times \text{power3.out}\left(\frac{t - 0.45}{0.55}\right)$$
  - Intense phosphor flash blooms with brightness decaying from $3.5\times$ to $1.0\times$:
    $$\text{brightness} = 1 + 2.5 \times \left(1 - \frac{t - 0.45}{0.55}\right)$$

### C. 3D Origami Letter Folding & Trajectory (Duration: 5.45s)
- **0.00s–0.85s:** Form rasterizes onto canvas; 3D perspective stage initialized ($f = 1100\text{px}$).
- **0.85s–1.45s:** Fold 1 — Bottom third creases upward ($90^\circ$ rotation).
- **1.45s–2.00s:** Fold 2 — Top third creases downward.
- **2.00s–2.60s:** Fold 3 — Side flaps fold inward.
- **2.60s–3.05s:** Fold 4 — Triangular envelope seal snaps shut.
- **3.05s–5.45s (2.4s):** Parabolic 3D flight trajectory; envelope orbits into space while emitting a dual-core glowing vapor ribbon.

### D. Vintage Colophon Film Cadence (Throttled to 24 FPS)
- **Cadence Interval:** $1 / 24\text{s} \approx 0.04167\text{s}$.
- Every frame cycles noise tiles, spawns microscopic dust ellipses, and drifts vertical scratches ($\pm 1.5\text{px}$).
- Card scrolling distance from vertical center dynamically modulates optical depth-of-field lens blur ($0\text{px}$ to $6\text{px}$) and grayscale desaturation ($15\%$ to $100\%$).

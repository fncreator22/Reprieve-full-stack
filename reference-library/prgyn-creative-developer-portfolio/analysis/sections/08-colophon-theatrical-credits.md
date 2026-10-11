# Section 08: Theatrical Colophon & Rolling Credits (`<footer id="credits">`)

## 1. Overview & Purpose
- **Source Reference:** [`40g00-ckjrn6m.js#L33735`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/40g00-ckjrn6m.js#L33735)
- **Role:** Theatrical colophon — A cinematic film roll presenting technology credits, design acknowledgments, and personalized session telemetry.
- **Theme:** `.theme-ink`

---

## 2. 24 FPS Film Projector Shutter Cadence
While the rest of the application runs at the native display refresh rate (60–240 FPS), the credits grain generator explicitly throttles its execution loop to **24 FPS** ($0.04167\text{s}$ per frame):
```javascript
if (!(now - lastFrameTime < 0.041666666666666664)) {
  lastFrameTime = now;
  renderFilmArtifacts();
}
```
### Procedural Film Artifacts:
- **Noise Tile Blitting:** 4 pre-rendered $256 \times 256$ random noise tiles cycled stochastically.
- **Dust Specks:** Microscopic ellipses generated randomly across the frame.
- **Hair Curves:** Rare quadratic Bezier hair fibers spawned with $1.2\%$ probability.
- **Vertical Scratches:** Vertical line artifacts that drift horizontally ($\pm 1.5\text{px}$) and survive for 4–14 frames.

---

## 3. Optical Depth-of-Field Lens Blur & Desaturation
As the film credits roll past the optical center of the viewport ($y = 0.5$), distance from the center drives optical defocus and color loss:
$$a = \left|\frac{\text{cardCenterY}}{\text{viewportHeight}} - 0.5\right|$$
$$o = \text{clamp}\left(0, \; 1, \; \frac{a - 0.2}{0.3}\right)$$
$$\text{blur} = 6 \times o\text{ px}$$
$$\text{grayscale} = \min(1, \; 0.15 + 1.6 \times o)$$

**Visual Result:** Credits cards at the exact vertical center are tack-sharp ($0\text{px}$ blur, full color); as they scroll toward the top or bottom edges, they defocus into a soft $6\text{px}$ blur and desaturate into black and white.

---

## 4. Live Session Telemetry Buffer (`startVisit`)
The footer dynamically renders live telemetry captured throughout the user's session:
- **Time on Page:** Tracked via `performance.now()` (`"42 seconds"` or `"3 min 14 s"`).
- **Moves Made:** Total interactions captured in a 600-entry capped interaction ring buffer (`chat`).
- **Chapters Seen:** Evaluated every $250\text{ms}$ by sampling `document.elementFromPoint(w/2, h/2)`:
  - If all chapters viewed: `"all seven"`
  - Otherwise: `"X of 7"`
- **Your Ink / Your Idea / Your Letter:** Displays the active theme swatch chosen by the user and the draft status of their contact letter.

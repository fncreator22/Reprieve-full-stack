# Design Patterns & Interaction Physics: prgyn.dev

## 1. High-Frequency Pointer Event Coalescing
Modern gaming monitors, Apple Trackpads, and iPad Pro styluses report touch and cursor updates at up to 240Hz, while standard browser `pointermove` events fire only once per animation frame (approx. 60Hz / 16.6ms).

`prgyn.dev` eliminates segment faceting during fast gestures by consuming coalesced pointer events:
```javascript
const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
for (const pt of events) {
  strokePoints.push({ x: pt.clientX, y: pt.clientY, time: pt.timeStamp });
}
```

---

## 2. Proximity-Sensitive Variable Font Elasticity
Instead of static button hovers, typography reacts physically to the user's cursor within a configurable radial field ($R = 380\text{px}$).

### Physics Equation:
For each character at center $(c_x, c_y)$ and pointer at $(m_x, m_y)$:
$$d = \sqrt{(m_x - c_x)^2 + (m_y - c_y)^2}$$
$$\text{proximity} = \max\left(0, \; 1 - \frac{d}{R}\right)$$
$$\text{targetWeight} = W_{\min} + \text{proximity} \times (W_{\max} - W_{\min}) + \text{boost}$$
$$\text{targetWidth} = D_{\min} + \text{proximity} \times (D_{\max} - D_{\min})$$

The actual DOM values are smoothed using frame-by-frame Lerp:
$$W_{t} \leftarrow W_{t-1} + (\text{targetWeight} - W_{t-1}) \times 0.2$$

---

## 3. Scroll Velocity 3D Inertial Banking
As the user scrolls through technical drawings and component breakdowns, the 3D plane tilts dynamically based on instantaneous scroll speed:
$$\theta_{\text{target}} = \text{clamp}\left(-9^\circ, \; 9^\circ, \; -\frac{\text{velocity}}{260}\right)$$

### GSAP Ticker Damping Loop:
$$\theta \leftarrow \theta + (\theta_{\text{target}} - \theta) \times 0.08$$
$$\theta_{\text{target}} \leftarrow \theta_{\text{target}} \times 0.92$$
If $|\theta| > 0.01^\circ$, applies `gsap.set(el, { rotationY: theta })`.

---

## 4. Hooke's Law Damped Return Force Field
In the motion lab particle force fields, text particles are repelled by the cursor and snapped back to their home anchors $(h_x, h_y)$ via damped springs:
$$F_{\text{repel}} = \frac{p - m}{\|p - m\|} \times \max\left(0, \; 1 - \frac{\|p - m\|}{R}\right) \times K_{\text{push}}$$
$$F_{\text{spring}} = (h - p) \times k$$
$$v \leftarrow (v + F_{\text{spring}} + F_{\text{repel}}) \times \text{friction}$$
$$p \leftarrow p + v$$
Where $k = 0.06$ (spring stiffness), $\text{friction} = 0.82$, and $R = 90\text{px}$ (repulsion radius).

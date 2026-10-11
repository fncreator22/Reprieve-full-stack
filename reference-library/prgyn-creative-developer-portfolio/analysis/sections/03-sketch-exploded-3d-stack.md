# Section 03: Sketch Exploded 3D Blueprint (`#sketch` / `data-chapter="sketch"`)

## 1. Overview & Purpose
- **Source Reference:** [`3oztndie4w4us.js#L156727`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/3oztndie4w4us.js#L156727)
- **Role:** Chapter 03 — Demonstrates technical architecture and design system deconstruction by exploding a 2D interface into a 3D isometric blueprint.
- **Theme:** `.theme-blueprint` (Cobalt blue `#1c33a8`, line work `#f4f6ff3d`, accent Marigold `#ffb400`)

---

## 2. 3D Isometric Workbench Physics

### A. Dynamic Velocity-Driven Banking
The entire workbench tilt responds to real-time scroll speed:
- Velocity is clamped between $-9^\circ$ and $+9^\circ$:
  $$\theta_{\text{target}} = \text{clamp}\left(-9, 9, -\frac{\text{velocity}}{260}\right)$$
- An active GSAP Ticker applies smooth lerp interpolation:
  $$\theta \leftarrow \theta + (\theta_{\text{target}} - \theta) \times 0.08$$
  $$\theta_{\text{target}} \leftarrow \theta_{\text{target}} \times 0.92$$

### B. Exploded Z-Axis Layer Stacking
The component splits into discrete architectural layers in 3D perspective space:
```javascript
gsap.set(layer, {
  rotationX: 56,
  rotationZ: -34,
  z: layerIndex * spacing, // spacing = 28px on mobile (<768px), 46px on desktop
  transformStyle: "preserve-3d"
});
```

### C. Harmonic Token Buoyancy
Tokens that have not yet snapped into place (`.tk-in`) oscillate with floating sinusoidal motion:
$$\text{translateY} = 8 \sin(t \cdot \text{speed} + \phi)$$
$$\text{rotate} = 3 \sin(0.7t \cdot \text{speed} + \phi)$$
When the scroll trigger enters the assembly phase, each token snaps into its exact blueprint slot via `elastic.out(1, 0.4)`.

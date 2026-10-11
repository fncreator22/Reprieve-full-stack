# System Analysis Guide — How to Analyze a NEW Reference Project

This guide defines the standardized methodology for analyzing, reverse-engineering, and cataloging a new website or application into `reference-library/`.

Every new project must be added as an autonomous, self-contained project folder:
`reference-library/<new-project-slug>/`

---

## 1. What to Extract and From Where

### 1.1 Source Code / Production Bundles & Live DOM
Extract and document the following with grounded evidence:
- **Page & Section Hierarchy:** Document the DOM tree, semantic tags (`<header>`, `<main>`, `<section>`, `<footer>`), section IDs, and `data-*` chapter attributes.
- **Layout & Coordinate Space:** Document CSS layout models (Flexbox, CSS Grid, multi-column), container max-widths, sticky pin heights (e.g. `calc(100dvh * 5.6)`), and 3D perspective setups (`perspective: 1100px`, `transform-style: preserve-3d`).
- **Design Tokens & Themes:** Extract exact CSS Custom Properties (`--surface`, `--text`, `--accent`, `--line`, etc.), semantic theme classes, color palettes with exact hex/rgba values, and typography configurations (variable font axes `wght`, `wdth`, `opsz`).
- **Component Breakdown:** Enumerate each distinct component, its state machine, DOM classes, and props.
- **Animations, Physics & Math:**
  - Easing curves: Exact GSAP or CSS easings (e.g. `power2.inOut`, `elastic.out(1, 0.35)`, `expo.out`).
  - Timelines: Duration in seconds, stagger delays, scroll scrub ratios.
  - Mathematical formulas: Exact geometric, physics, or algorithmic formulas (e.g. Catmull-Rom spline equations, phyllotaxis angle $\phi \approx 137.508^\circ$, Hooke's Law spring constants, quaternion rotations).
  - Physics engines: Rigid body collision settings, restitution, friction, drag coefficients.
- **Tech Stack & Libraries:** Detect dependencies from scripts, module imports, meta tags, and bundle analysis (React, Next.js, GSAP, Matter.js, Three.js, Tailwind CSS, etc.).

### 1.2 Screenshots & Visual Assets (`assets/images/`)
- Save screenshots by section naming convention: `<section-index>-<section-name>.png` (or detailed visual manifests if binary capturing is unavailable).
- Note key visual features: layout arrangement, contrast ratios, border treatments, shadows, hover transitions.

### 1.3 Videos & Motion Studies (`assets/videos/`)
- For dynamic interactions, record or inspect motion across microsecond/frame intervals:
  - Keyframe timestamps (e.g. $t = 0.0\text{s}$, $t = 0.7\text{s}$, etc.).
  - Acceleration, deceleration, and overshoot behaviors.
  - User-driven velocity responses (how pointer movement or scroll speed modulates particle count, tilt, or scale).
- **Rule on Video Capture:** If video files cannot be saved or downloaded, state it explicitly as `"not captured"` in `assets/videos/video-analysis-log.md` and detail the exact real-time DOM/canvas mechanics observed instead. **Never invent media recordings.**

### 1.4 External Links & Internal Endpoints (`assets/links.md`)
Record every reachable URL:
- Live website URL.
- Public GitHub repository, articles, case studies, design credits, font distributors.
- Internal API endpoints discovered in network traffic (e.g., `/api/letters`, `/api/chat`).
- Mark reachability and accessed date for every link.

### 1.5 Quality, Fit & Pitfall Assessment (`reuse-notes.md`)
- **Strengths:** Where the design excels (e.g., tactile polish, micro-interactions, responsive typography).
- **Weaknesses / Traps:** Layout thrashing, excessive canvas redraws, mobile GPU throttling, missing accessibility features (`aria-*`, `prefers-reduced-motion`).
- **When to Use / When to Avoid:** Clear scenarios where this project's patterns are recommended vs. where simpler patterns should be preferred.

---

## 2. The "Never Guess" Rule
Anything that was not directly observed or captured in code or runtime inspection must be written as:
`"Not captured: <reason>"`

Never fill in boilerplate or make up values.

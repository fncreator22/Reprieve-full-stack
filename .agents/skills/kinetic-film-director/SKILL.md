---
name: kinetic-film-director
description: Produces broadcast-grade 60 FPS kinetic technology films, motion graphics, and video showreels matching reference physics, 3D particle manifolds, and isometric glass geometry without AI slop. Automates reference deconstruction, skill discovery, mathematical centering, and Chrome CDP frame rendering.
license: MIT
metadata:
  version: "1.0"
---

# Kinetic Film Director

Produce broadcast-grade, deterministic 60 FPS kinetic technology films that visualize internal intelligence rather than static dashboards.

## Core Directives

1. **Zero AI Slop / Zero Static Frames**: Every millisecond has continuous physics:
   - Camera matrix: progressive push-in ($1.0 \to 1.08\times$) and micro Lissajous pan.
   - Ambient starfield/cyber-dust drift ($100+$ particles).
   - Continuous CRT energy scanline sweep.
   - Live telemetry: rolling timecode (`TC 00:00:SS:FF`) and fluctuating latency (`XX.X ms`).
2. **Pure Computational Intelligence**:
   - Never show ordinary website screenshots or dashboard mockups.
   - Visualize internal computing mechanics: terminal compilers imploding into singularities, 3D neural brain point spheres with stochastic lightning, multi-agent planetary orbital systems, 3D point-cloud security padlocks with rotating radar dials, 3D undulating wave manifolds ($Y = \sin \times \cos$), and 3D isometric glass cube server chassis.
3. **Strict Mathematical Centering & Geometry**:
   - Symmetric side margins: if left card is at $[340, 680]$ (margin 340px), right chassis must be at $[1240, 1580]$ (margin 340px).
   - Central bridge conduit must be centered exactly at $X = 960$ on 1920p canvas.
   - Center arrows/icons must have minimum 40px clearance halos to prevent particle/matrix text overlap.
   - True 3D Isometric projection ($30^\circ$) with rear transparent wireframe depth (0.35 opacity) and internal blade LED arrays.

---

## 4-Step Production Pipeline

### Step 1: Reference Forensic Deconstruction
Extract high-resolution frames from the reference video at 4 to 10 FPS to discover exact pacing:
```bash
ffmpeg -y -i <reference_video.mp4> -vf "fps=4" "film/ref_%03d.png"
```
Inspect frames to catalog:
- Total runtime and exact audio sync cut times.
- Key kinetic motifs (singularity implosions, orbital physics, matrix cascades).
- Typographic hierarchy (letterspacing, chromatic text-shadows, monospace telemetry).

### Step 2: Skill Orchestration & Pre-flight Discovery
Query and verify supporting skills:
- `find-skills`: Discover external rendering and motion packages.
- `motionmaxxing`: Headless Chrome DevTools Protocol (CDP) deterministic frame-by-frame renderer (`render.mjs`).
- `design-motion-principles`: Curvature and spring damping physics.

### Step 3: Deterministic Canvas Composition
Write a standalone HTML file (`film/exact_reference_match.html`):
- Canvas size: 1920x1080.
- Expose `window.__duration = <SECONDS>;`
- Expose `window.__seek = function(t) { ... };` (GSAP seek + Canvas draw pass).
- Render stills across scene midpoints to verify geometry:
```bash
node render.mjs index.html --still "1.0,3.0,5.0,7.0,9.0" stills_dir
```

### Step 4: 60 FPS Deterministic Master Encode
Render the final video with synced audio:
```bash
node render.mjs index.html out.mp4 --fps 60 --duration <DURATION> --crf 18 --preset fast --audio <AUDIO_FILE>
```

---

## The Master Reusable Prompt Template

```markdown
Generate a broadcast-grade 60 FPS kinetic technology film (1080p, exact audio sync) as a deterministic canvas/GSAP composition rendered via Chrome CDP and ffmpeg.

[INPUTS]
- Reference Video: <URL_OR_PATH>
- Audio Track: <AUDIO_PATH>
- Target Domain: <INTERNAL_SYSTEM_OR_INTELLIGENCE_TO_VISUALIZE>

[INVARIANTS - ZERO AI-SLOP]
1. ZERO STATIC FRAMES: Continuous camera push (1.0x -> 1.08x), ambient dust drift, rolling HUD timecode & ping telemetry, and energy scanline sweep across all scenes.
2. PURE INTELLIGENCE: Do NOT render standard platform tools or dashboard slides. Render internal computing mechanics: compiler singularities, 3D neural brain point clouds, multi-agent orbits, 3D point-cloud security padlocks, 3D undulating wave manifolds, and 3D isometric glass cube server chassis.
3. MATHEMATICAL SYMMETRY & CENTERING: Every split-screen scene (e.g., Papers -> Production) must have exact equal side margins, centered bridge conduits (no overlapping characters), and true 3D isometric perspective.
4. TYPOGRAPHY: Monospace technical labels, wide letterspacing (0.08em - 0.16em), glowing text shadows with chromatic aberration. No corporate brand intro.
5. PIPELINE:
   a. Extract reference frames at 4 FPS to inspect shot pacing.
   b. Write standalone HTML with window.__seek(t) hook.
   c. Render stills to verify geometry and symmetry.
   d. Encode final MP4 at 60 FPS with audio.
```

<!-- Reprieve Agent Skill · October 15, 2026 -->

# System Verification Checklist

Before reporting that a task is complete—whether building a feature from a reference or adding a new reference to the library—run the relevant checklist below.

---

## 1. Verification for BUILD Tasks (When implementing code from references)

- [ ] **Grounded Source Attribution:** Did you cite the exact reference project and section file where the pattern was obtained? (e.g. `reference-library/<project>/analysis/sections/<section>.md`).
- [ ] **Token Integrity:** Are CSS variables, color hexes, and typography axes identical to the documented tokens in `theme.md` (or intentionally mapped with rationale)?
- [ ] **Animation & Physics Accuracy:** Do easing curves, spring constants, velocities, and timeline durations match the documented equations?
- [ ] **Performance & DOM Guards:**
  - Are pointer/scroll listeners throttled or executed on `requestAnimationFrame` / `gsap.ticker`?
  - Are offscreen animated components gated with `IntersectionObserver`?
  - Are DOM mutations guarded by dirty-check checks (e.g. preventing style recalculations when integer values do not change)?
  - Is `prefers-reduced-motion` respected?
- [ ] **Zero Hallucination:** Ensure no placeholder parameters or ungrounded external dependencies were added.

---

## 2. Verification for ANALYSIS Tasks (When adding a new reference)

- [ ] **Strict Folder Isolation:** Is the project placed in its own self-contained directory `reference-library/<project-slug>/`?
- [ ] **Complete Core File Set:** Does the project folder contain all required files:
  - `AGENT-GUIDE.md`
  - `README.md`
  - `skills.md`
  - `reuse-notes.md`
  - `analysis/structure.md`
  - `analysis/design-patterns.md`
  - `analysis/theme.md`
  - `analysis/sections/*.md`
  - `assets/links.md`
  - `assets/images/`
  - `assets/videos/`
- [ ] **Section Granularity:** Is there a dedicated markdown file in `analysis/sections/` for every major section/chapter of the reference?
- [ ] **Explicit "Not Captured" Auditing:** Are any missing media, backend code, or unreachables marked as `"not captured"` rather than filled with boilerplate?
- [ ] **Master Index Updated:** Has a corresponding row been registered in `reference-library/INDEX.md`?
- [ ] **File Links Working:** Are all relative markdown links between files valid?

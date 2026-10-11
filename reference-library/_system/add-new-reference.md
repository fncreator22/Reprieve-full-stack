# System Add-New-Reference Checklist

Follow this strict step-by-step procedure whenever you or an agent are adding a new reference project to `reference-library/`.

---

## 1. Preparation & Folder Scaffolding
- [ ] 1. Choose a descriptive, hyphenated, lowercase project slug (e.g. `stripe-landing-payments`, `linear-dashboard-dark`, `prgyn-creative-developer-portfolio`).
- [ ] 2. Copy the template folder from `reference-library/_system/templates/reference-template/` to `reference-library/<project-slug>/`.
- [ ] 3. Ensure all internal subdirectories exist:
  ```text
  reference-library/<project-slug>/
  ├── AGENT-GUIDE.md
  ├── README.md
  ├── skills.md
  ├── reuse-notes.md
  ├── analysis/
  │   ├── structure.md
  │   ├── design-patterns.md
  │   ├── theme.md
  │   └── sections/
  └── assets/
      ├── links.md
      ├── images/
      └── videos/
  ```

---

## 2. In-Depth Analysis Execution
- [ ] 4. Perform code bundle and runtime DOM extraction following `_system/analysis-guide.md`.
- [ ] 5. Write `analysis/structure.md`: Document overarching page hierarchy, coordinate system, layout wrappers, and scroll containers.
- [ ] 6. Write `analysis/theme.md`: Catalog all color tokens, CSS custom properties, typography rules, and theme variants.
- [ ] 7. Write `analysis/design-patterns.md`: Detail micro-interactions, proximity physics, cursor engines, and shared animation systems.
- [ ] 8. Write individual section files in `analysis/sections/`: One file per distinct semantic section. Include DOM structure, animation frame breakdowns, physics math, and triggers.
- [ ] 9. Write `skills.md`: List all libraries, frameworks, graphic techniques, and algorithmic concepts identified.
- [ ] 10. Write `reuse-notes.md`: Document what can be directly copied, what requires customization, performance gotchas, and production-tested code recipes.
- [ ] 11. Populate `assets/links.md`, `assets/images/`, and `assets/videos/`.

---

## 3. Library Registration & Verification
- [ ] 12. Write `AGENT-GUIDE.md` inside the new project folder with quick-routing instructions and use-case summaries.
- [ ] 13. Add a new row to `reference-library/INDEX.md` using the format in `_system/templates/INDEX-row-template.md`.
- [ ] 14. Run the verification checks in `_system/verification-checklist.md`.
- [ ] 15. Check that any unavailable data is explicitly marked as `"not captured"` (nothing hallucinated or assumed).
- [ ] 16. Submit final report noting the added project, the created structure, and any uncaptured gaps.

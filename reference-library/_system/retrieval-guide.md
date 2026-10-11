# System Retrieval Guide — How to Select & Use References

This guide explains how an AI agent or engineer should locate, inspect, and implement patterns from references stored within `reference-library/`.

---

## 1. Step-by-Step Retrieval Workflow

### Step 1: Query the Index
1. Open **[`INDEX.md`](../INDEX.md)**.
2. Filter projects by tags (e.g., `SaaS`, `Creative Dev`, `Dark-tech`, `Minimalist`, `Fintech`), interaction requirements, or technology stack.
3. Select 1–3 candidate reference folders that best match the current prompt.

### Step 2: Open Candidate Project AGENT-GUIDE.md
Every reference project contains a dedicated router:
`reference-library/<project-folder>/AGENT-GUIDE.md`
Read this file first to understand:
- Why this project was selected and what it excels at.
- Direct file links for specific design layers:
  - Full architecture: `analysis/structure.md`
  - Color palettes and tokens: `analysis/theme.md`
  - Interaction mechanics & physics: `analysis/design-patterns.md`
  - Granular section blueprints: `analysis/sections/<section-name>.md`
  - Ready-to-use production recipes: `reuse-notes.md`

### Step 3: Granular vs. Full-Page Reading Rules
- **For a Single Section or Component:**
  - DO NOT read the entire project directory.
  - Read **ONLY** the relevant section file in `analysis/sections/<section>.md` plus `analysis/theme.md` for tokens.
  - Check `reuse-notes.md` for specific copy-paste traps and DOM optimizations.
- **For an Entire Page / Architecture:**
  - Read `README.md`, `analysis/structure.md`, `analysis/theme.md`, `analysis/design-patterns.md`, and `skills.md`.

### Step 4: Strict Build & Grounding Invariants
- **Never guess missing details:** If a reference does not specify a value, do not invent generic values. Check if another reference has the pattern or stick strictly to the documented parameters.
- **Always Cite Reference Sources:** When generating code or documentation, include explicit source attribution:
  > *Pattern adapted from `reference-library/<project>/analysis/sections/<section>.md`*

### Step 5: Verification
Before outputting any code or completing your turn, test your solution against **[`_system/verification-checklist.md`](./verification-checklist.md)**.

### Step 6: Final Reporting
In your response, report:
1. Exact reference project(s) and section file(s) utilized.
2. What components, mechanics, or styles were adapted.
3. Verification results.
4. Any deliberate gaps or customizations made.

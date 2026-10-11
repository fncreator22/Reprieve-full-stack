# Reference Library — Agent Read-First Guide

Welcome to the **Reference Library**. This repository stores permanent, reverse-engineered, grounded, and verified real-world design systems, code patterns, and interaction architectures.

Each entry in this library is an **autonomous, self-contained project folder**. Inside any project folder, you will find everything pertaining to that specific reference: its overarching structure, complete design system, theme tokens, individual section breakdowns, component mechanics, animations and physics equations, production-ready code snippets, and asset audits.

Every file in this library is derived directly from inspected source code, runtime DOM audits, and mathematical reverse engineering. **No placeholder patterns, no generic AI slop, and no invented details are permitted.**

---

## 🛑 Core Invariants & Rules for Agents

1. **Self-Contained Projects:** Each reference is an isolated project directory (e.g., `reference-library/<reference-name>/`). Do not scatter or split components across global folders; keep all project-specific assets, sections, and tokens inside that project's folder.
2. **Never Invent Implementation Details:** If a token, asset, link, or physics formula is not explicitly documented or verified from source inspection, mark it explicitly as `"not captured"`. Never guess or hallucinate parameters.
3. **Always Cite Sources:** Whenever pulling a pattern or snippet into a project, cite the exact reference folder and section file (e.g. `reference-library/prgyn-creative-developer-portfolio/analysis/sections/01-blank-canvas-hero.md`).
4. **Verify Before Generating:** Consult `_system/verification-checklist.md` before claiming an analysis or implementation is complete.

---

## 🧭 Router by Intent

### Intent 1: "I need to BUILD or IMPLEMENT something"
1. Read **[`INDEX.md`](./INDEX.md)** to shortlist 1–3 reference candidates matching your required style, industry, or technical stack.
2. Follow **[`_system/retrieval-guide.md`](./_system/retrieval-guide.md)** for the step-by-step extraction workflow.
3. Open the target reference's **`AGENT-GUIDE.md`** (e.g. `reference-library/<project>/AGENT-GUIDE.md`) to locate the exact section, theme, or code recipe you need.

### Intent 2: "I need to ADD or ANALYZE a new project"
1. Read **[`_system/analysis-guide.md`](./_system/analysis-guide.md)** to follow the standard extraction and verification protocol.
2. Follow the checklist in **[`_system/add-new-reference.md`](./_system/add-new-reference.md)**.
3. Duplicate the scaffold from **[`_system/templates/reference-template/`](./_system/templates/reference-template/)** and register the new reference in **[`INDEX.md`](./INDEX.md)**.

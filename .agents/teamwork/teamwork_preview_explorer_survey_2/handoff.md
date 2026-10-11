# Handoff Report — Explorer 2 (Frontend & Visual Simulation Canvas)

**Recipient**: Project Orchestrator (`f63e4228-317f-45de-bff4-f932d1431e70`)  
**Sender**: Explorer 2 (`teamwork_preview_explorer_survey_2`)  
**Mission**: Frontend Architecture, Visual Simulation Canvas & Dual-Pane Integration Analysis for R3  
**Status**: Task Complete (Hard Handoff)

---

## 1. Observation

Direct observations from the repository inspection:

1. **Framework & Dependencies (`frontend/package.json:1-50`)**:
   - Next.js version: `"next": "16.3.8"` (App Router).
   - React version: `"react": "19.2.8"`, `"react-dom": "19.2.8"`.
   - Graph library: `"react-force-graph-2d": "1.29.2"`.
   - UI & Animation: `"radix-ui": "1.6.7"`, `"lucide-react": "1.50.0"`, `"gsap": "3.15.0"`, `"motion": "13.5.1"`, `"sonner": "2.0.8"`.
   - Data & Streaming: `"@tanstack/react-query": "5.104.1"`, `"@microsoft/fetch-event-source": "2.0.1"`, `"date-fns": "4.4.0"`.
   - Tailwind: `"tailwindcss": "4.3.3"`, `"@tailwindcss/postcss": "4.3.3"`, `"tw-animate-css": "1.4.0"`.
   - Verification of Radix Slider: In `frontend/node_modules/radix-ui/src/index.ts:26`, line reads: `export * as Slider from '@radix-ui/react-slider';`.

2. **Styling & Design Tokens (`frontend/styles/globals.css:1-223` & `frontend/lib/tokens.ts:1-63`)**:
   - Tokens defined: `--bg-canvas`, `--bg-surface`, `--brand`, `--proof`, `--sev-low`, `--sev-moderate`, `--sev-high`, `--sev-critical`.
   - Node-specific tokens: `--node-service:#5B4BE0` (light) / `#8B7DFF` (dark), `--node-person`, `--node-team`, `--node-control`, `--node-compensating`, `--node-customer-path`, `--node-runbook`.
   - Motion tokens: `--dur-fast: 120ms`, `--dur-base: 200ms`, `--dur-slow: 320ms`, `--dur-path: 90ms`.
   - Hard Rule (`CLAUDE.md:14`): "UI: use tokens from frontend/styles/globals.css. No raw hex. Every screen has loading/empty/error/degraded states. Severity never by color alone."

3. **Graph Rendering Engine (`frontend/components/graph/graph-canvas.tsx:1-165` & `frontend/lib/graph-draw.ts:1-60`)**:
   - Component: `GraphCanvas` wraps `<ForceGraph2D<GNode, GLink>>` with ref `fg` of type `ForceGraphMethods`.
   - Node rendering: `nodeCanvasObject` invokes `drawShape(ctx, n.label, x, y, r)` in `lib/graph-draw.ts` which draws geometric shapes per type (Exception = diamond `poly(4)`, Team = hexagon `poly(6)`, Control = triangle `poly(3)`, CompensatingControl = pentagon `poly(5)`, CustomerPath = 10-star, Service = circle `ctx.arc`).
   - Sizing: `r = (n.label === "Service" ? 7 + (n.score ?? 0) / 18 : 6) / Math.min(scale, 1.6)`.
   - Link particles: `linkDirectionalParticles={(l) => (drawn(l) && !still ? 2 : 0)}`, `linkDirectionalParticleWidth={3.5}`, `linkDirectionalParticleSpeed={0.008}`.
   - On node click: `onNodeClick={(n) => onOpen(n.id)}` where `onOpen` is `useEntityDrawer().open` (`components/graph/graph-explorer.tsx:39, 168`).

4. **Conversational Assistant (`frontend/components/steward/steward-chat.tsx:1-267` & `frontend/lib/sse.ts:1-90`)**:
   - Streaming transport: `openStream` in `lib/sse.ts` connects via `fetchEventSource` using `POST /api/v1/workspaces/{wsId}/chat/sessions/{sessionId}/messages`.
   - Event processing: Parses `token`, `tool.call`, `tool.result`, `final`, `error`.
   - Grounded Citation chips: `CitationChip` (`components/citation-chip.tsx`) replaces backticked node IDs; click currently opens `useEntityDrawer().open(citation.id)`.
   - Proof paths: Renders `ProofPath` (`components/proof-path.tsx`) with "Show on graph" link pointing to `/w/{slug}/graph?path=...`.
   - Degradation handling: If `LLM_UNAVAILABLE`, `AI_DISABLED`, or `QUOTA_EXCEEDED` is returned, shows banner with deterministic Quick answers ("Top risk right now", "Who owns this?").

5. **Existing Layout & Dual-Pane State (`frontend/components/shell/app-shell.tsx:88-105` & `shell-context.tsx:1-66`)**:
   - `AppShell` renders `LeftRail`, `TopBar`, `<main>{children}</main>`, and `<StewardPanel />`.
   - `StewardPanel` renders `StewardChat` as a 400px sticky right sidebar when `stewardOpen === true`.
   - On `/w/[ws]/graph` (`app/(app)/w/[ws]/graph/page.tsx:1-9`), `GraphExplorer` is rendered in `<main>`, but `stewardOpen` defaults to `false` and there is no coordination between canvas and chat citations.

6. **Backend Ground Truth Scenarios (`docs/07-seed-spec.md:47-57`)**:
   - Planted scenarios:
     - `S1` (Checkout Collision): 5 active exceptions within 2 hops of `checkout-api` (cascading dependency: `checkout-api` -> `payments-gateway`, `fraud-scoring`, `card-vault`).
     - `S5` (Quiet Expiry Week): 4 exceptions expiring between 28 Oct - 02 Nov on `team_data`.
     - Baseline `as_of`: 17 Oct 2026 (`1792195200`). Horizon offsets: +7d = 24 Oct, +14d = 31 Oct, +30d = 16 Nov.

---

## 2. Logic Chain

1. **Zero New NPM Dependencies**:
   - *Observation 1*: `package.json` contains `react-force-graph-2d`, `radix-ui`, `gsap`, `motion`, `@microsoft/fetch-event-source`, `@tanstack/react-query`, `lucide-react`, and `date-fns`. `radix-ui/src/index.ts` exports `* as Slider`.
   - *Inference*: No new dependencies are required to build the temporal slider, force graph simulation, particle animation, or conversational streaming. We only need to write `frontend/components/ui/slider.tsx` wrapping the existing Radix Slider export.

2. **Feasibility of Temporal Canvas Simulation**:
   - *Observation 3*: `GraphCanvas` directly controls `nodeCanvasObject`, `linkColor`, `linkWidth`, and `linkDirectionalParticles` on an HTML5 canvas context.
   - *Inference*: Dynamic risk heatmaps, pulsing halos, and cascade pulses can be achieved purely by binding `nodeCanvasObject` and `linkDirectionalParticles` to simulation state:
     - When scrubbing time (e.g., +7d, +30d, +90d), nodes switch fill color from entity token to simulated risk severity (`tokens.severity[band]`).
     - Nodes with high Avalanche Centrality (>0.7) or active collision receive an animated halo (`ctx.arc` with pulsing alpha).
     - Edges along cascade pathways set `linkDirectionalParticles = 4` with critical color (`tokens.severity.critical`) and high speed (`0.015`), while unaffected edges dim.

3. **Requirement for Simulation Proof Cards**:
   - *Observation 3*: Currently, clicking any node triggers `useEntityDrawer().open(n.id)` which opens a generic registry sheet.
   - *Inference*: Acceptance Criteria 3 ("Clicking on a predicted high-risk node or avalanche pathway displays a detailed proof card explaining the mathematical cause and affected downstream services") requires introducing `components/graph/simulation-proof-card.tsx`. When a simulated node is clicked, this card pops up displaying Avalanche Centrality, collision convergence window, downstream blast radius, and an "Ask Steward" mitigation button.

4. **Unifying the Dual-Pane Interface (R3.1)**:
   - *Observation 4 & 5*: Currently, Steward and Graph are separate; citations only open the entity drawer.
   - *Inference*: By establishing an imperative ref / callback contract between `GraphExplorer` and `StewardChat`:
     - Hovering a citation chip triggers a spotlight halo on the canvas.
     - Clicking a citation chip smooth-pans the camera (`fg.current?.centerAt(node.x, node.y, 500)`) and selects the node.
     - Clicking a proof path step highlights the path on the live canvas via GSAP and triggers particle flow.
     - Clicking a high-risk node offers an "Ask Steward" button to inject the cascade prompt into the chat.

5. **Backend Simulation Contract**:
   - *Observation 6 & ORIGINAL_REQUEST.md*: The system requires deterministic calculation of Avalanche Centrality and temporal collision in <100ms.
   - *Inference*: The frontend must integrate with a new backend endpoint: `GET /api/v1/workspaces/{ws_id}/simulation/forecast?horizon_days={days}` returning `SimulationForecastOut`. The frontend client will consume this via a React Query hook (`useSimulationForecast`).

---

## 3. Caveats

1. **WebGL / 3D Canvas**: The codebase uses `react-force-graph-2d` (HTML5 Canvas 2D) rather than `react-force-graph-3d` or WebGL. This is well-suited for 2D topological clarity and performance on graphs under 500 nodes (capped at 500 by `GRAPH_CAP`), but all pulsing halo animations must be drawn via standard Canvas 2D path rendering.
2. **Mobile Screen Real Estate**: On screens `< 1024px`, showing both the graph canvas and 400px assistant sidebar side-by-side causes layout collapse. The dual-pane interface must adopt a responsive behavior: split-view on desktop (≥1024px), sheet/overlay for the assistant on tablet/mobile.
3. **Backend Availability**: The simulation forecast endpoint (`/simulation/forecast`) is currently being surveyed/designed by Explorer 1 (Backend). Frontend types and query hooks must adhere to the contract detailed in `report.md` Section 6.

---

## 4. Conclusion

1. The frontend architecture is modern, clean, and completely capable of supporting both R3.1 and R3.2 without installing any new third-party packages.
2. The implementation roadmap requires:
   - Creating `frontend/components/ui/slider.tsx` (using bundled `radix-ui`).
   - Creating `frontend/components/graph/temporal-slider.tsx` (with presets: Now, +7d, +30d, +90d, scrubber, play/pause).
   - Creating `frontend/components/graph/simulation-proof-card.tsx` (mathematical cause, blast radius, cascade proof).
   - Upgrading `frontend/components/graph/graph-canvas.tsx` (dynamic heatmaps, pulsing halos, cascade particle pulses, camera centering).
   - Upgrading `frontend/components/graph/graph-explorer.tsx` into a dual-pane layout hosting `StewardChat` with synchronized citation/proof interactions.
   - Adding `useSimulationForecast` hook in `frontend/lib/hooks.ts` and models in `frontend/lib/types.ts`.
3. Detailed architectural designs, diagrams, data schemas, and component interfaces are documented in `teamwork_preview_explorer_survey_2/report.md`.

---

## 5. Verification Method

To independently verify the frontend state and claims in this handoff:

1. **Verify Installed Packages & Exports**:
   ```powershell
   cd frontend
   pnpm list radix-ui react-force-graph-2d gsap @tanstack/react-query @microsoft/fetch-event-source
   ```
2. **Verify Radix Slider Availability**:
   Inspect `frontend/node_modules/radix-ui/src/index.ts` line 26 or test importing `Slider` in a TypeScript file:
   ```typescript
   import { Slider } from "radix-ui";
   ```
3. **Verify Canvas Rendering Pipeline**:
   Inspect `frontend/components/graph/graph-canvas.tsx` lines 103–145 and `frontend/lib/graph-draw.ts` lines 13–51 to confirm custom geometric node drawing and particle animation mechanics.
4. **Verify Typecheck and Linting**:
   ```powershell
   cd frontend
   pnpm typecheck
   pnpm lint
   ```
5. **Invalidation Conditions**:
   - If `radix-ui` does not export `Slider` or throws on runtime render, a lightweight slider implementation or dedicated `@radix-ui/react-slider` would be needed. (Confirmed present).
   - If backend simulation response format diverges from `SimulationForecastOut`, the frontend type definitions in `frontend/lib/types.ts` must be updated to match Explorer 1's backend schema.

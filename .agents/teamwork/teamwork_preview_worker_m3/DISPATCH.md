## 2026-10-09T09:24:51Z

You are Worker M3 (Dual-Pane Interface & Visual Simulation Canvas).
Your assigned working directory is:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_worker_m3\

You are executing Milestone 3 for the Project Orchestrator (Conversation ID: f63e4228-317f-45de-bff4-f932d1431e70).

MANDATORY FIRST STEP:
Read the authoritative requirements at:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\ORIGINAL_REQUEST.md

Read the project specification at:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\orchestrator_1\PROJECT.md

Read Explorer 2's survey report at:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_explorer_survey_2\report.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your exclusive file write ownership:
- frontend/components/ui/slider.tsx
- frontend/components/graph/temporal-slider.tsx
- frontend/components/graph/simulation-proof-card.tsx
- frontend/components/graph/graph-canvas.tsx
- frontend/components/graph/graph-explorer.tsx
- frontend/lib/types.ts
- frontend/lib/hooks.ts
- frontend/components/steward/steward-chat.tsx

Mission & Tasks:
1. In frontend/lib/types.ts:
   - Add TypeScript interfaces for `SimulationForecastOut`, `AvalancheCentralityItem`, `TemporalCollisionItem`, `CanvasNodeDecoration`, and `ProofGraph` matching PROJECT.md §Interface Contracts #1.
2. In frontend/lib/hooks.ts:
   - Add `useSimulationForecast(workspaceId, horizonDays, targetServiceId)` React Query hook calling `/api/v1/workspaces/{ws_id}/prediction/simulation`.
3. In frontend/components/ui/slider.tsx:
   - Implement the Slider component using the existing bundled Radix Slider from `radix-ui` (`import { Slider as RadixSlider } from "radix-ui"`).
4. In frontend/components/graph/temporal-slider.tsx:
   - Implement the temporal horizon slider toolbar with presets: Now (+0d), +7d, +30d, +90d, custom date scrubbing, play/pause simulation playback, and forecast summary banner.
5. In frontend/components/graph/simulation-proof-card.tsx:
   - Implement the detailed proof card modal/popover that opens when a predicted high-risk or cascade node is clicked. Displays mathematical cause (Avalanche Centrality score, collision window), affected downstream services, customer path blast radius, and an "Ask Steward" mitigation action button.
6. In frontend/components/graph/graph-canvas.tsx:
   - Integrate simulation forecast decorations:
     * Dynamic node coloring based on simulated risk severity (`tokens.severity[decoration.risk_band]`).
     * Pulsing halo glow animations on avalanche sources and collision nodes (`decoration.pulse === true`).
     * Accelerated directional pulse particles (crimson/amber particles, `linkDirectionalParticles = 4`) along cascade failure edges.
7. In frontend/components/graph/graph-explorer.tsx:
   - Build the dual-pane split view uniting the force-directed canvas with the conversational assistant (`StewardChat`).
   - Add bidirectional interactions: clicking a citation chip in the chat or proof path smooth-pans the canvas camera to the target node (`centerAt(node.x, node.y, 500)`).
8. Verify frontend code:
   cd frontend && pnpm typecheck
   cd frontend && pnpm lint
9. Write your handoff report to:
c:\Users\sr2ma\Documents\github\webdev-hackthon\.agents\teamwork\teamwork_preview_worker_m3\handoff.md
Include typecheck and build/lint verification commands and outputs.

When finished, send a completion message via send_message to f63e4228-317f-45de-bff4-f932d1431e70.

<!-- Reprieve Agent Skill · October 15, 2026 -->

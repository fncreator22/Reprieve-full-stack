# Frontend & Visual Simulation Canvas Architecture Report (Survey 2)

**Author**: Explorer 2 (Frontend & Visual Simulation Canvas)  
**Date**: 2026-10-09  
**Target Milestone**: Survey 2  
**Original Request Reference**: `.agents/teamwork/ORIGINAL_REQUEST.md` (R3: Dual-Pane Conversational & Visual Simulation Interface)

---

## 1. Executive Summary

This investigation surveys the frontend codebase of **Reprieve** (`webdev-hackthon/frontend`) to establish the architectural foundation, determine existing visual and conversational capabilities, and map out the exact integration points required for **R3.1 (Grounded Conversational Assistant Sidebar)** and **R3.2 (Interactive Temporal Slider on Force-Directed Graph Canvas with Avalanche Centrality & Collision Heatmaps)**.

### Key Discoveries:
1. **Next.js & React Core**: Built with **Next.js 16.3.8** (App Router) and **React 19.2.8** with TypeScript 5.9.3. The workspace layout uses dynamic route segment `app/(app)/w/[ws]/...` with an app shell (`AppShell`) providing global sidebar, topbar, command palette, entity drawer, and steward panel.
2. **Graph Visualization Engine**: Already powered by **`react-force-graph-2d` (v1.29.2)** running on HTML5 Canvas via `next/dynamic` (`ssr: false`). It already contains custom geometric canvas rendering (`lib/graph-draw.ts`), d3 force tuning, neighbor lighting, directional arrows, and GSAP-driven particle flow on proof paths.
3. **Conversational Assistant (Steward)**: Fully implemented streaming chat interface (`components/steward/steward-chat.tsx`) using **`@microsoft/fetch-event-source` (v2.0.1)** with SSE, token streaming, tool call traces, markdown sanitization (`react-markdown` + `rehype-sanitize`), interactive citation pills (`CitationChip`), and actionable approval cards (`ProposedActionCard`).
4. **Dependencies & Styling**: Design tokens are strictly managed in `styles/globals.css` and runtime-mirrored in `lib/tokens.ts` (zero raw hex rule). Radix UI (`radix-ui` v1.6.7) is installed and **already exports Radix Slider**, meaning **zero new NPM packages are needed** to implement the temporal slider.

---

## 2. Current Frontend Architecture

### 2.1 Framework, Version & Build Configuration
- **Next.js Version**: `16.3.8` (App Router).
- **React Version**: `19.2.8` (`@types/react` 19.3.0).
- **TypeScript**: `5.9.3` (`tsconfig.json` with strict mode, `@/*` path aliases).
- **Package Manager**: `pnpm` (lockfile version 9 / `pnpm@11.18.0`).
- **Scripts**: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`.

### 2.2 Styling, Theme & Design System
- **Tailwind CSS**: `tailwindcss 4.3.3` with `@tailwindcss/postcss 4.3.3` and `tw-animate-css 1.4.0`.
- **Theme System**: `next-themes 0.4.6` with dark mode class switching (`.dark`).
- **Design Tokens**: Centralized in `frontend/styles/globals.css` and accessed dynamically in Canvas/JS via `frontend/lib/tokens.ts` (`readThemeTokens()`).
  - Strict Rule: **No raw hex in components**. Colors use semantic tokens: `--bg-canvas`, `--bg-surface`, `--brand`, `--proof`, `--sev-low`, `--sev-moderate`, `--sev-high`, `--sev-critical`.
  - Node Type Tokens: `--node-service` (`#5B4BE0` / `#8B7DFF`), `--node-person`, `--node-team`, `--node-control`, `--node-compensating`, `--node-customer-path`, `--node-runbook`.
  - Motion tokens: `--dur-fast: 120ms`, `--dur-base: 200ms`, `--dur-slow: 320ms`, `--dur-draw: 700ms`, `--dur-path: 90ms`.
  - Keyframe animations: `pulse-ring`, `dash-travel`, `draw-line`, `shimmer`, `radar`.
- **Icons**: `lucide-react 1.50.0`.
- **Animation Libraries**: `gsap 3.15.0`, `motion 13.5.1`, `lenis 1.3.26`.

### 2.3 UI Component Library & Primitives
Located in `frontend/components/ui/`:
- `accordion.tsx`, `alert-dialog.tsx`, `badge.tsx`, `button.tsx`, `card.tsx`, `checkbox.tsx`, `command.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `hover-card.tsx`, `input.tsx`, `label.tsx`, `popover.tsx`, `radio-group.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`, `sheet.tsx`, `skeleton.tsx`, `sonner.tsx`, `switch.tsx`, `table.tsx`, `tabs.tsx`, `textarea.tsx`, `tooltip.tsx`.
- **Missing Primitive**: `slider.tsx`. Note that `radix-ui` (v1.6.7) already bundles `@radix-ui/react-slider` (verified via `radix-ui/src/index.ts: export * as Slider`), so creating `components/ui/slider.tsx` is trivial and requires no extra install.

### 2.4 State Management & Data Fetching
- **Server State**: `@tanstack/react-query 5.104.1` with `QueryClientProvider` configured in `components/providers.tsx`.
- **API Client**: `frontend/lib/api.ts` provides:
  - `apiFetch<T>(path, opts, getToken)`: Handles Clerk Bearer tokens, `X-Request-ID`, `If-Match` optimistic concurrency, and RFC 7807 `problem+json` parsing into typed `ApiError`.
  - Cold-start resilience: Render free-tier retry backoff budget (`COLD_START_BUDGET_MS = 75_000`), exposing `waking` state via `useApiStatus()`.
  - React Hook: `useApi()` binds `apiFetch` to the current session.
  - Path builder: `wsPath(wsId, path) = /workspaces/{wsId}/...`.
- **Workspace State**: `frontend/lib/workspace.tsx`:
  - `WorkspaceProvider` supplies `{ wsId, slug, name, role, personId, asOf, workspace, membership }`.
  - `asOf`: epoch seconds representing the workspace temporal clock (supports simulated mode).
- **Shell State**: `frontend/components/shell/shell-context.tsx`:
  - `useShell()` supplies `{ railCollapsed, toggleRail, stewardOpen, setStewardOpen, commandOpen, setCommandOpen }`.

---

## 3. Existing Graph Canvas Implementation & Interactivity

### 3.1 Graph Components Architecture
1. **`GraphExplorer`** (`frontend/components/graph/graph-explorer.tsx`):
   - Handles route query parameters (`?focus=<id>&kinds=<csv>&path=<csv>&view=<canvas|list>`).
   - Fetches graph data via `GET /api/v1/workspaces/{wsId}/graph` (`useQuery`).
   - Computes path links and runs GSAP sequence tweens on proof paths (`HOP_MS = 90ms`).
   - Renders header kind filters, Reset button, View toggle (Canvas vs List), and dynamic client mount of `GraphCanvas`.
2. **`GraphCanvas`** (`frontend/components/graph/graph-canvas.tsx`):
   - Wraps `<ForceGraph2D<GNode, GLink>>` with ref `fg` exposing `ForceGraphMethods`.
   - Tuned D3 forces:
     - `charge`: `-90`, `distanceMax: 220`.
     - `link`: `distance: 36`.
     - `gravity`: Custom alpha centering force keeping disconnected nodes near the cluster.
   - Zoom bounds: `minZoom: 0.3`, `maxZoom: 6.0`.
   - On drag end: springs back into layout (`n.fx = undefined, n.fy = undefined; fg.current?.d3ReheatSimulation()`).

### 3.2 Visual Rendering & Polygons (`frontend/lib/graph-draw.ts`)
- Accessibility Rule: **Severity is never communicated by color alone**.
- Each node type has a distinct geometric shape drawn on the 2D context:
  - `Exception`: 4-sided diamond (`poly(4)`), colored by severity (1–5).
  - `Team`: 6-sided hexagon (`poly(6)`).
  - `Control`: 3-sided triangle (`poly(3)`).
  - `CompensatingControl`: 5-sided pentagon (`poly(5)`).
  - `CustomerPath`: 10-point star.
  - `Person`, `Runbook`, `Evidence`: Rounded rectangle (`ctx.roundRect`).
  - `Service` (default): Circle (`ctx.arc`), dynamically sized: `r = (7 + (n.score ?? 0) / 18) / Math.min(scale, 1.6)`.
- Labels: Painted via `ctx.fillText` using `canvasFont(11 / scale, weight)`, visible on hover, focus, proof path, or high zoom.

### 3.3 Link Rendering & Animation
- `linkColor`: Highlighted proof links render with `tokens.proof` (`#0F6F8A` / `#22D3EE`); active neighbor links render with `tokens.borderStrong`; others render with `tokens.border`.
- `linkDirectionalParticles`: Uses Canvas particle animation along edges. Currently set to `2` particles along proof paths when reduced motion is disabled.
- `linkDirectionalParticleSpeed`: `0.008`.
- `linkDirectionalParticleWidth`: `3.5`.
- Directional arrows: `linkDirectionalArrowLength: 3.5`, `linkDirectionalArrowRelPos: 1`.

### 3.4 Current Interactivity & Click Handling
- Hovering a node dims unrelated nodes (`alpha = 0.18`), highlights direct 1-hop neighbors, and enlarges links.
- Clicking a node calls `onOpen(n.id)` which invokes `useEntityDrawer().open(n.id)`. This opens `EntityDrawer` (`components/shell/entity-drawer.tsx`), displaying raw registry properties.
- **Current Limitation**: Clicking a node currently opens a generic entity drawer; it does **not** yet display an Avalanche / Temporal Simulation Proof Card with mathematical cause breakdown and downstream blast radius.

---

## 4. Existing Conversational Assistant (Steward) Architecture

### 4.1 Chat Implementation (`frontend/components/steward/steward-chat.tsx`)
- **Protocol**: Server-Sent Events via `frontend/lib/sse.ts` (`openStream`).
- **Endpoint**: `POST /api/v1/workspaces/{wsId}/chat/sessions/{sessionId}/messages`.
- **Event Handling**:
  - `token`: Appends streaming markdown text chunks.
  - `tool.call`: Adds executing tool pill to the tool trace list.
  - `tool.result`: Marks tool pill complete with summary.
  - `final`: Unpacks structured `StewardAnswer` payload containing:
    - `answer_markdown`: Text with backticked entity citations.
    - `citations`: List of `{ kind, id, label }`.
    - `proof_paths`: List of `{ summary, nodes, edges }`.
    - `proposed_actions`: Human-in-the-loop action proposals (`ProposedAction`).
    - `used_tools`: String array of tool identifiers.
    - `removed_claims`: Count of ungrounded claims stripped by backend guard.
  - `error`: Shows degraded mode warning or error message.

### 4.2 Citation & Proof Integration
- **`CitationChip`** (`frontend/components/citation-chip.tsx`):
  - Renders proof-tinted chip with kind icon and truncated ID.
  - Hovercard displays full entity kind, title, and ID.
  - Clicking currently invokes `useEntityDrawer().open(citation.id)`.
- **`ProofPath`** (`frontend/components/proof-path.tsx`):
  - Renders longest-path layered SVG mini-graph and natural-language hop chain.
  - Contains "Show on graph" link pointing to `/w/{slug}/graph?path={nodeIds}`.

---

## 5. Architectural Proposals for Requirements

### 5.1 R3.1: Grounded Conversational Assistant Sidebar Architecture

#### Objective:
Provide a unified dual-pane interface on `/w/[ws]/graph` where the force-directed canvas and the grounded conversational assistant operate concurrently with live, bidirectional synchronization.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TopBar (Workspace, Simulated Clock, Search ⌘K, Notifications, User)                             │
├────────────────────────────────────────────────────────┬────────────────────────────────────────┤
│ LEFT PANE: Visual Simulation Canvas (flex-1)           │ RIGHT PANE: Grounded Assistant (400px) │
│                                                        │                                        │
│  [Temporal Horizon Slider: Now | +7d | +30d | +90d]    │  Steward Chat                          │
│                                                        │  ───────────────────────────────────── │
│  Force-directed Graph Canvas                           │  User: What fails if secrets-manager   │
│  - Nodes colored by Avalanche / Collision Heatmap      │        is compromised?                 │
│  - Glowing halos on high-centrality sources            │                                        │
│  - Animated particle pulses on cascading pathways      │  Steward: [Thinking...]                │
│  - Clicked node -> [Simulation Proof Card Popover]     │  Reveals 3-hop cascade affecting:      │
│                                                        │  - [svc_card_vault] (Score: 88)        │
│  [Graph Legend: Heatmap & Shapes]                      │  - [svc_payments_gateway]              │
│                                                        │  - [svc_checkout_api]                  │
│                                                        │                                        │
│                                                        │  [Proof Path Mini-Graph]               │
│                                                        │  [Highlight on Active Canvas Button]   │
└────────────────────────────────────────────────────────┴────────────────────────────────────────┘
```

#### Key Architecture & Integration Points:
1. **Dual-Pane Layout on `/w/[ws]/graph`**:
   - Update `app/(app)/w/[ws]/graph/page.tsx` and `GraphExplorer` to host a split view:
     - Main pane (`flex-1 min-w-0 relative`): ForceGraph Canvas, Temporal Slider Toolbar, Proof Card popover.
     - Sidebar pane (`w-[400px] shrink-0 border-l border-border-subtle bg-surface flex flex-col`): `StewardChat` with predictive quick chips.
     - Responsive behavior: Below 1024px, the assistant collapses into the existing slide-over `Sheet` controlled by a toggle button.
   - Coordinate with `AppShell`: Suppress duplicate global `StewardPanel` on `/graph` route or share the open state cleanly through `useShell()`.
2. **Interactive Citation Linking (`CitationChip` -> Graph Canvas)**:
   - Introduce an imperative Graph Canvas Controller context / ref (`GraphCanvasRef`):
     ```typescript
     interface GraphCanvasRef {
       focusNode: (nodeId: string, zoom?: number) => void;
       highlightPath: (nodeIds: string[]) => void;
       pulseNode: (nodeId: string) => void;
       showProofCard: (nodeId: string) => void;
     }
     ```
   - When user hovers a `CitationChip`:
     - Canvas triggers transient ring spotlight on the cited node (`hoverNodeId = citation.id`).
   - When user clicks a `CitationChip`:
     - Canvas smooth-pans camera to center on that node: `fg.current?.centerAt(node.x, node.y, 500)`.
     - Sets focus state and opens the node's simulation proof card.
3. **Interactive Proof Path Linking**:
   - In `ProofPath` component:
     - Add a prop `onHighlightGraph?: (nodeIds: string[]) => void`.
     - When present in the dual-pane canvas view, clicking "Highlight on canvas" or hovering hops triggers instant GSAP sequential draw and particle travel directly on the live canvas without page navigation.
4. **Bidirectional Context Injection (Canvas -> Steward)**:
   - When an operator clicks a high-risk node or cascade pathway in the canvas, the Proof Card provides an **"Ask Steward to analyze cascade"** button.
   - This invokes `stewardChatRef.current?.send("Explain cascading impact and mitigation for " + node.name + " (" + node.id + ")")`, automatically streaming the grounded diagnosis.
5. **Strict Groundedness & Refusal Rendering**:
   - If Steward's response contains `removed_claims > 0` or returns fallback indicators, display a prominent amber badge:
     `⚠️ Strict Grounding Active: Speculative claims without verified graph paths were removed.`

---

### 5.2 R3.2: Interactive Temporal Slider & Simulation Engine Architecture

#### Objective:
Allow operators to scrub forward in time (+0d, +7d, +30d, +90d, or custom calendar date) to observe mathematical failure forecasts in real-time, with dynamic heatmap coloring, cascade pulse animations, and detailed proof cards.

#### 5.2.1 Temporal Slider Control (`components/graph/temporal-slider.tsx`)
- **Slider Component (`components/ui/slider.tsx`)**:
  - Implement using `radix-ui`'s `SliderPrimitive.Root`, `SliderPrimitive.Track`, `SliderPrimitive.Range`, `SliderPrimitive.Thumb`.
- **Toolbar Features**:
  - **Horizon Presets**:
    - `Now (+0d)`: Current workspace `as_of` baseline.
    - `+7d`: Short-term expiry window.
    - `+30d`: Mid-term convergence window (captures Quiet Expiry Week).
    - `+90d`: Extended horizon quarterly forecast.
    - `Custom`: Popover date picker input.
  - **Scrubber Track**:
    - Smooth continuous slider (0 to 90 days, step = 1 day).
  - **Play / Pause Simulation Stepper**:
    - An automatic timeline playback toggle with interval timer (steps +7d every 1.2s) allowing operators to watch systemic risk propagate dynamically.
  - **Status Indicator**:
    - Displays projected date and relative delta: e.g. `Simulating: +30d · 16 Nov 2026`.
    - Pill badge showing active cascade count and collision clusters.

#### 5.2.2 Dynamic Node Coloring & Risk Heatmaps
- **Simulation Data State**:
  - React Query hook: `useSimulationForecast(wsId, horizonDays)`.
  - Maps node simulation data to canvas renderers:
    ```typescript
    export interface NodeSimulationData {
      id: string;
      avalanche_centrality: number; // 0.0 to 1.0
      cascading_reachability: number; // count of reachable downstream services
      simulated_score: number; // 0 to 100
      risk_band: "low" | "moderate" | "high" | "critical";
      is_collision_hub: boolean;
      expiring_exceptions_count: number;
      is_avalanche_source: boolean;
      is_in_cascade_path: boolean;
    }
    ```
- **Canvas Rendering Rules (`nodeCanvasObject` in `graph-canvas.tsx`)**:
  - **Color**:
    - When simulation mode is active (`horizonDays > 0`), nodes transition fill color to their simulated `risk_band`:
      - `critical` (Score ≥ 75 or Avalanche Centrality ≥ 0.75): `var(--sev-critical)` (`#FB7185` dark / `#BE123C` light).
      - `high` (Score ≥ 50 or Avalanche Centrality ≥ 0.50): `var(--sev-high)` (`#FB923C` dark / `#B8400A` light).
      - `moderate` (Score ≥ 25): `var(--sev-moderate)` (`#FBBF24` dark / `#A84B08` light).
      - `low` (Score < 25): `var(--sev-low)` (`#34D399` dark / `#0A7A5A` light).
  - **Geometry Retained**:
    - Distinct node shapes (`drawShape`) remain active so color is never the sole differentiator.
  - **Pulsing Glow Halo**:
    - For nodes where `is_avalanche_source` is true or `is_collision_hub` is true:
      - Draw an animated concentric radial gradient or expanding halo on each frame:
        ```typescript
        const pulse = (Math.sin(Date.now() / 250) + 1) / 2; // 0..1
        ctx.beginPath();
        ctx.arc(x, y, r + 4 / scale + pulse * 4 / scale, 0, 2 * Math.PI);
        ctx.fillStyle = is_avalanche_source ? `${tokens.severity.critical}40` : `${tokens.severity.high}40`;
        ctx.fill();
        ```
  - **Radius Scaling**:
    - Service node radius scales proportionally to its simulated cascading reachability:
      `r = (6 + (nodeSim.cascading_reachability * 1.5) + (nodeSim.simulated_score / 20)) / Math.min(scale, 1.6)`.

#### 5.2.3 Connection Pulse Animations
- **Active Cascade Pathways**:
  - Edges identified in `cascade_paths` represent high-risk failure propagation routes.
- **Link Canvas Rules**:
  - `linkColor`:
    - Cascade links: `tokens.severity.critical` (or `tokens.severity.high`).
    - Unaffected links: dimmed with high transparency (`ctx.globalAlpha = 0.15` / `tokens.border` soft).
  - `linkWidth`:
    - Cascade links: `3.0px` (or `3.5px` on hover).
    - Normal links: `0.8px`.
  - `linkDirectionalParticles`:
    - Cascade links: `4` particles (or `6` on critical paths).
    - Normal links: `0` particles.
  - `linkDirectionalParticleSpeed`: `0.015` (fast pulse representing propagation energy).
  - `linkDirectionalParticleWidth`: `4.5px`.
  - `linkDirectionalParticleColor`: `() => tokens.severity.critical`.

#### 5.2.4 Interactive Simulation Proof Cards on Click (`components/graph/simulation-proof-card.tsx`)
- Acceptance Criteria:
  *"Clicking on a predicted high-risk node or avalanche pathway displays a detailed proof card explaining the mathematical cause and affected downstream services."*
- Rendered as a glassmorphic floating popover / overlay adjacent to the clicked node or docked in the lower-left:
  - **Card Header**:
    - Entity name, kind badge, and risk banner: `Critical Avalanche Source (Score: 89, Centrality: 0.84)`.
  - **Section 1: Mathematical Cause Breakdown**:
    - **Avalanche Centrality Metric**: Value, percentile rank, and formula components (Degree Centrality, Multi-hop Reachability, Upstream Control Ratio).
    - **Convergence / Collision Window**: Exact expiry dates, count of converging exceptions (e.g., `3 waivers expiring simultaneously between 28 Oct - 02 Nov`).
  - **Section 2: Downstream Blast Radius**:
    - Count and badges of all impacted downstream services (e.g. `8 services affected, 3 customer-facing: checkout-api, mobile-api, payouts`).
    - Customer path exposure warnings (e.g. `⚠️ Paralyzes Customer Path: Checkout`).
  - **Section 3: Propagation Path Proof**:
    - Compact sequential proof steps:
      `secrets-manager (waiver expired) ──AFFECTS──► card-vault ──DEPENDS_ON──► payments-gateway ──DEPENDS_ON──► checkout-api`
  - **Section 4: Direct Action Triggers**:
    - `[Ask Steward to Mitigate]`: Injects prompt directly into adjacent conversational assistant.
    - `[Isolate Subgraph]`: Focuses camera solely on the cascade subgraph.

---

## 6. Frontend API Integration with FastAPI Backend

### 6.1 Backend Endpoint Contract

To support the visual simulation interface and mathematical forecasting, the frontend requires the following backend contract:

#### Endpoint 1: Prediction Simulation (`GET /api/v1/workspaces/{ws_id}/simulation/forecast`)
- **Query Parameters**:
  - `horizon_days` (int, default `30`, min `0`, max `180`): Days forward from current workspace `as_of`.
  - `as_of` (int, optional): Base epoch seconds (defaults to workspace clock).
  - `threshold` (float, optional, default `0.2`): Minimum avalanche centrality to include in cascade paths.
- **Performance Guarantee**: Must execute deterministically in **< 100ms** via optimized Cypher queries.
- **Response Model (`SimulationForecastOut`)**:
```json
{
  "as_of": 1792195200,
  "horizon_days": 30,
  "simulated_date": 1794787200,
  "execution_time_ms": 14.2,
  "summary": {
    "total_nodes": 60,
    "at_risk_services": 5,
    "critical_avalanche_sources": 2,
    "active_collision_clusters": 1,
    "max_avalanche_centrality": 0.88
  },
  "nodes": {
    "svc_payments_gateway": {
      "id": "svc_payments_gateway",
      "label": "Service",
      "name": "payments-gateway",
      "avalanche_centrality": 0.88,
      "cascading_reachability": 4,
      "simulated_score": 85,
      "risk_band": "critical",
      "is_avalanche_source": true,
      "is_collision_hub": false,
      "expiring_exceptions_count": 2,
      "expiring_exception_ids": ["exc_pg_waiver_1", "exc_pg_waiver_2"]
    },
    "team_data": {
      "id": "team_data",
      "label": "Team",
      "name": "Data Platform",
      "avalanche_centrality": 0.32,
      "cascading_reachability": 3,
      "simulated_score": 72,
      "risk_band": "high",
      "is_avalanche_source": false,
      "is_collision_hub": true,
      "expiring_exceptions_count": 4,
      "expiring_exception_ids": ["exc_data_1", "exc_data_2", "exc_data_3", "exc_data_4"]
    }
  },
  "cascade_paths": [
    {
      "source_id": "svc_secrets_manager",
      "target_id": "svc_checkout_api",
      "severity": "critical",
      "node_ids": ["svc_secrets_manager", "svc_card_vault", "svc_payments_gateway", "svc_checkout_api"],
      "edges": [
        {"from": "svc_card_vault", "to": "svc_secrets_manager", "type": "DEPENDS_ON"},
        {"from": "svc_payments_gateway", "to": "svc_card_vault", "type": "DEPENDS_ON"},
        {"from": "svc_checkout_api", "to": "svc_payments_gateway", "type": "DEPENDS_ON"}
      ]
    }
  ],
  "collision_clusters": [
    {
      "cluster_id": "col_team_data_1792627200",
      "hub_node_id": "team_data",
      "window_start": 1792627200,
      "window_end": 1793232000,
      "exception_ids": ["exc_data_1", "exc_data_2", "exc_data_3", "exc_data_4"],
      "affected_service_ids": ["svc_data_warehouse", "svc_reporting", "svc_ml_features"]
    }
  ]
}
```

#### Endpoint 2: Grounded Conversational Endpoint (`POST /api/v1/workspaces/{ws_id}/chat/sessions/{session_id}/messages`)
- Already implemented via SSE streaming.
- Grounding constraint: Backend verifies all factual claims against FalkorDB graph state, citing explicit node IDs in backticks.
- Responses return `citations` matching nodes in FalkorDB (`Exception`, `Service`, `Person`, `Team`, `Control`) and `proof_paths`.

### 6.2 TypeScript Client & Type Definitions
To be added to `frontend/lib/types.ts`:
```typescript
export interface NodeSimulationRisk {
  id: string;
  label: string;
  name: string;
  avalanche_centrality: number;
  cascading_reachability: number;
  simulated_score: number;
  risk_band: Severity;
  is_avalanche_source: boolean;
  is_collision_hub: boolean;
  expiring_exceptions_count: number;
  expiring_exception_ids: string[];
}

export interface CascadePath {
  source_id: string;
  target_id: string;
  severity: Severity;
  node_ids: string[];
  edges: ProofEdge[];
}

export interface CollisionCluster {
  cluster_id: string;
  hub_node_id: string;
  window_start: number;
  window_end: number;
  exception_ids: string[];
  affected_service_ids: string[];
}

export interface SimulationForecastOut {
  as_of: number;
  horizon_days: number;
  simulated_date: number;
  execution_time_ms: number;
  summary: {
    total_nodes: number;
    at_risk_services: number;
    critical_avalanche_sources: number;
    active_collision_clusters: number;
    max_avalanche_centrality: number;
  };
  nodes: Record<string, NodeSimulationRisk>;
  cascade_paths: CascadePath[];
  collision_clusters: CollisionCluster[];
}
```

---

## 7. Analysis of Missing Items & Gap Identification

| Area | Status | Action Required |
|---|---|---|
| **NPM Packages** | **Complete** | **No new packages needed**. `react-force-graph-2d`, `radix-ui`, `gsap`, `motion`, `@microsoft/fetch-event-source`, `@tanstack/react-query`, `lucide-react`, `date-fns` are all installed and verified. |
| **UI Primitives** | **Missing 1 component** | Create `frontend/components/ui/slider.tsx` using `Slider` exported by installed `radix-ui`. |
| **Simulation Components** | **Missing 2 components** | 1. Create `frontend/components/graph/temporal-slider.tsx` (slider toolbar, presets, play/pause).<br>2. Create `frontend/components/graph/simulation-proof-card.tsx` (proof card popover on click). |
| **Canvas Enhancements** | **Needs Extension** | Update `frontend/components/graph/graph-canvas.tsx` to support: dynamic heatmap color mode, pulsing halo glow around avalanche sources, directional particle acceleration along cascade paths, and imperative ref controls (`focusNode`, `pulseNode`). |
| **Dual-Pane Container** | **Needs Extension** | Update `frontend/components/graph/graph-explorer.tsx` to host the side-by-side canvas and `StewardChat` with synchronized citation/proof events. |
| **Backend Integration** | **Needs Endpoint Client** | Add `getSimulationForecast` in `frontend/lib/api.ts` and `useSimulationForecast` hook in `frontend/lib/hooks.ts`. |

---

## 8. Step-by-Step Implementation Roadmap

1. **Step 1: UI Primitives & Types**:
   - Create `frontend/components/ui/slider.tsx`.
   - Add simulation types (`SimulationForecastOut`, `NodeSimulationRisk`, `CascadePath`, etc.) to `frontend/lib/types.ts`.
2. **Step 2: API Client & Query Hook**:
   - Add `useSimulationForecast(horizonDays)` in `frontend/lib/hooks.ts` calling `/api/v1/workspaces/{ws_id}/simulation/forecast`.
3. **Step 3: Temporal Slider Toolbar Component**:
   - Build `frontend/components/graph/temporal-slider.tsx` with presets (`Now`, `+7d`, `+30d`, `+90d`), play/pause animation stepper, and horizon labels.
4. **Step 4: Enhanced Force-Directed Canvas Simulation**:
   - Extend `frontend/components/graph/graph-canvas.tsx`:
     - Bind simulated node colors to `risk_band` / Avalanche Centrality.
     - Add animated halo glow around avalanche sources and collision hubs.
     - Add accelerated particle pulses (`linkDirectionalParticles = 4`, crimson/orange) along cascade paths.
     - Expose `centerAt` / `focusNode` via ref or callbacks.
5. **Step 5: Interactive Simulation Proof Card**:
   - Build `frontend/components/graph/simulation-proof-card.tsx` displaying mathematical cause, reachability blast radius, downstream impacted services, and "Ask Steward" trigger.
6. **Step 6: Dual-Pane Graph Page Integration**:
   - Update `frontend/components/graph/graph-explorer.tsx` to lay out the canvas (left) and `StewardChat` (right).
   - Wire `CitationChip` and `ProofPath` clicks to trigger instant highlighting and camera navigation on the canvas.
7. **Step 7: Verification & Build**:
   - Run `pnpm typecheck` and `pnpm lint` in `frontend/`.
   - Validate accessibility (keyboard navigation, tooltips, reduced-motion compliance).

---

## 9. Conclusion

The Reprieve frontend already possesses a solid, modern stack perfectly poised for this implementation. All heavy graphical and streaming dependencies are already present in `package.json`. Implementing R3.1 and R3.2 requires zero new dependencies, builds cleanly upon the existing App Router architecture, and creates an intuitive, high-fidelity experience uniting deterministic mathematical forecasting with grounded conversational intelligence.

"use client";

import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { List, Network, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { useEntityDrawer } from "@/components/shell/use-drawer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi, wsPath } from "@/lib/api";
import { errorMessage } from "@/lib/errors";
import { useMediaQuery, usePrefersReducedMotion, useThemeTokens } from "@/lib/hooks";
import type { ThemeTokens } from "@/lib/tokens";
import type { GraphOut } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace";

// Canvas library touches `window`; load it on the client only.
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

const KINDS = ["Service", "Exception", "Person", "Team", "Control", "CompensatingControl", "CustomerPath", "Runbook"] as const;
const KIND_LABEL: Record<string, string> = { CompensatingControl: "Compensating control", CustomerPath: "Customer path" };
const HOP_MS = 90; // 05 §12.2 --dur-path

type GNode = GraphOut["nodes"][number] & { x?: number; y?: number };
type GLink = { source: string | GNode; target: string | GNode; type: string };
const idOf = (v: string | GNode) => (typeof v === "string" ? v : v.id);

function nodeColor(n: GNode, t: ThemeTokens) {
  if (n.label === "Exception") {
    const s = n.severity ?? 1;
    return t.severity[s >= 5 ? "critical" : s >= 4 ? "high" : s >= 3 ? "moderate" : "low"];
  }
  return t.node[n.label as keyof ThemeTokens["node"]] ?? t.textMuted;
}

/** Shape per node type so the graph reads without color (05 §3.1.6). */
function drawShape(ctx: CanvasRenderingContext2D, label: string, x: number, y: number, r: number) {
  ctx.beginPath();
  const poly = (sides: number, rot = -Math.PI / 2) => {
    for (let i = 0; i < sides; i++) {
      const a = rot + (i * 2 * Math.PI) / sides;
      ctx[i ? "lineTo" : "moveTo"](x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
  };
  switch (label) {
    case "Exception":
      poly(4);
      break;
    case "Team":
      poly(6, 0);
      break;
    case "Control":
      poly(3);
      break;
    case "CompensatingControl":
      poly(5);
      break;
    case "CustomerPath":
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const rr = i % 2 ? r * 0.45 : r * 1.15;
        ctx[i ? "lineTo" : "moveTo"](x + rr * Math.cos(a), y + rr * Math.sin(a));
      }
      ctx.closePath();
      break;
    case "Person":
    case "Runbook":
    case "Evidence":
      ctx.roundRect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7, label === "Person" ? r * 0.4 : 1);
      break;
    default:
      ctx.arc(x, y, r, 0, 2 * Math.PI);
  }
}

/** SCR-P-02: force graph with filters, animated proof path, and an accessible list view. */
export function GraphExplorer() {
  const api = useApi();
  const { wsId } = useWorkspace();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useEntityDrawer();
  const tokens = useThemeTokens();
  const reduced = usePrefersReducedMotion();
  const mobile = useMediaQuery("(max-width: 639px)");
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const progress = useRef({ value: 1 });
  const [, repaint] = useState(0);

  const focus = params.get("focus");
  const view = params.get("view") ?? (mobile ? "list" : "canvas");
  const kinds = params.get("kinds")?.split(",") ?? [...KINDS];
  const pathIds = useMemo(() => params.get("path")?.split(",").filter(Boolean) ?? [], [params]);
  const pathSet = useMemo(() => new Set(pathIds), [pathIds]);

  const setParam = (k: string, v: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (v) next.set(k, v);
    else next.delete(k);
    router.replace(`${pathname}?${next}`, { scroll: false });
  };

  const graph = useQuery({
    queryKey: ["graph", wsId, focus, kinds.join(",")],
    queryFn: ({ signal }) => api<GraphOut>(wsPath(wsId, "/graph"), { signal, query: { focus: focus ?? undefined, depth: 2, kinds: kinds.join(",") } }),
  });

  const data = useMemo(() => {
    if (!graph.data) return { nodes: [] as GNode[], links: [] as GLink[] };
    return { nodes: graph.data.nodes.map((n) => ({ ...n })), links: graph.data.edges.map((e) => ({ source: e.from, target: e.to, type: e.type })) };
  }, [graph.data]);

  // Path edges in path order, so the draw-in follows the chain (05 §12.3 proof path draw).
  const pathLinks = useMemo(
    () =>
      data.links
        .filter((l) => pathSet.has(idOf(l.source)) && pathSet.has(idOf(l.target)))
        .sort((a, b) => pathIds.indexOf(idOf(a.source)) - pathIds.indexOf(idOf(b.source))),
    [data.links, pathIds, pathSet],
  );

  useEffect(() => {
    if (!pathLinks.length || reduced) {
      progress.current.value = 1;
      return;
    }
    progress.current.value = 0;
    const tween = gsap.to(progress.current, {
      value: 1,
      duration: (pathLinks.length * HOP_MS) / 1000 + 0.5,
      ease: "power1.inOut",
      delay: 0.6, // let the layout settle first
      onUpdate: () => repaint((n) => n + 1),
    });
    return () => {
      tween.kill();
    };
  }, [pathLinks, reduced]);

  useEffect(() => {
    if (!box.current) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, [view, graph.isPending]); // the box mounts only after data loads

  const pathActive = pathSet.size > 0;
  const drawnIndex = (l: GLink) => pathLinks.indexOf(l);

  return (
    <div className="flex h-[calc(100dvh-8.5rem)] flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle px-4 py-2">
        <h1 className="mr-2 font-display text-h2 font-semibold">Graph</h1>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Node types">
          {KINDS.map((k) => {
            const on = kinds.includes(k);
            return (
              <button
                key={k}
                type="button"
                aria-pressed={on}
                onClick={() => setParam("kinds", (on ? kinds.filter((x) => x !== k) : [...kinds, k]).join(",") || KINDS[0])}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-caption",
                  on ? "border-brand bg-brand-soft text-text-primary" : "border-border-subtle text-text-muted",
                )}
              >
                {KIND_LABEL[k] ?? k}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex gap-1">
          {(focus || pathActive) && (
            <Button variant="ghost" size="sm" onClick={() => router.replace(pathname)}>
              <RotateCcw aria-hidden /> Reset
            </Button>
          )}
          <Button variant={view === "canvas" ? "secondary" : "ghost"} size="sm" onClick={() => setParam("view", "canvas")} aria-pressed={view === "canvas"}>
            <Network aria-hidden /> Canvas
          </Button>
          <Button variant={view === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setParam("view", "list")} aria-pressed={view === "list"}>
            <List aria-hidden /> List
          </Button>
        </div>
      </div>

      {graph.data?.truncated && (
        <p className="bg-sev-moderate-soft px-4 py-1.5 text-body-sm">Showing {graph.data.total} nodes. Filter by type or open a node to focus.</p>
      )}

      {graph.isPending ? (
        <Skeleton className="m-4 flex-1" />
      ) : graph.isError ? (
        <p className="p-6 text-text-secondary">{errorMessage(graph.error)}</p>
      ) : !data.nodes.length ? (
        <EmptyState illustration title="No data yet" description="Add a service or load the sample workspace." className="m-6" />
      ) : view === "list" ? (
        <GraphList graph={graph.data} onOpen={open} pathSet={pathSet} />
      ) : (
        <div ref={box} className="relative flex-1 overflow-hidden" aria-label={`Graph of ${data.nodes.length} nodes. Use the List view for a text version.`} role="img">
          {tokens && (
            <ForceGraph2D
              width={size.w}
              height={size.h}
              graphData={data}
              backgroundColor="rgba(0,0,0,0)"
              cooldownTicks={120}
              autoPauseRedraw={false}
              nodeRelSize={5}
              onNodeClick={(n) => open((n as GNode).id)}
              nodeLabel={(n) => `${(n as GNode).label}: ${(n as GNode).name}`}
              linkColor={(l) => {
                const i = drawnIndex(l as GLink);
                if (i < 0) return pathActive ? tokens.border : tokens.borderStrong;
                return i < progress.current.value * pathLinks.length ? tokens.proof : tokens.border;
              }}
              linkWidth={(l) => (drawnIndex(l as GLink) >= 0 && drawnIndex(l as GLink) < progress.current.value * pathLinks.length ? 2.5 : 1)}
              linkDirectionalArrowLength={3}
              linkDirectionalArrowRelPos={1}
              nodeCanvasObject={(raw, ctx, scale) => {
                const n = raw as GNode;
                const onPath = pathSet.has(n.id);
                const r = n.label === "Service" ? 6 + (n.score ?? 0) / 25 : 5;
                ctx.globalAlpha = pathActive && !onPath ? 0.2 : 1;
                drawShape(ctx, n.label, n.x ?? 0, n.y ?? 0, r);
                ctx.fillStyle = nodeColor(n, tokens);
                ctx.fill();
                if (onPath || n.id === focus) {
                  ctx.lineWidth = 2 / scale;
                  ctx.strokeStyle = onPath ? tokens.proof : tokens.brand;
                  ctx.stroke();
                }
                if (scale > 1.6 || onPath || n.id === focus) {
                  ctx.font = `${11 / scale}px var(--font-instrument), system-ui, sans-serif`;
                  ctx.textAlign = "center";
                  ctx.fillStyle = tokens.text;
                  ctx.fillText(n.name.length > 28 ? `${n.name.slice(0, 27)}…` : n.name, n.x ?? 0, (n.y ?? 0) + r + 10 / scale);
                }
                ctx.globalAlpha = 1;
              }}
            />
          )}
          <Legend tokens={tokens} />
        </div>
      )}
    </div>
  );
}

function Legend({ tokens }: { tokens: ThemeTokens | null }) {
  if (!tokens) return null;
  return (
    <ul className="glass absolute bottom-3 left-3 grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg border border-border-subtle p-3 text-caption" aria-label="Legend">
      {KINDS.map((k) => (
        <li key={k} className="flex items-center gap-2">
          <canvas
            width={14}
            height={14}
            aria-hidden
            ref={(c) => {
              const ctx = c?.getContext("2d");
              if (!ctx) return;
              ctx.clearRect(0, 0, 14, 14);
              drawShape(ctx, k, 7, 7, 5);
              ctx.fillStyle = k === "Exception" ? tokens.severity.high : (tokens.node[k as keyof ThemeTokens["node"]] ?? tokens.textMuted);
              ctx.fill();
            }}
          />
          {KIND_LABEL[k] ?? k}
        </li>
      ))}
    </ul>
  );
}

/** Required accessible alternative to the canvas (PRD §9). */
function GraphList({ graph, onOpen, pathSet }: { graph: GraphOut; onOpen: (id: string) => void; pathSet: Set<string> }) {
  const name = Object.fromEntries(graph.nodes.map((n) => [n.id, n.name]));
  return (
    <div className="grid flex-1 gap-6 overflow-auto p-4 lg:grid-cols-2">
      <table className="w-full text-body-sm">
        <caption className="mb-2 text-left font-medium">Nodes ({graph.nodes.length})</caption>
        <thead className="text-left text-text-muted">
          <tr>
            <th className="py-1 font-medium">Name</th>
            <th className="py-1 font-medium">Type</th>
          </tr>
        </thead>
        <tbody>
          {graph.nodes.map((n) => (
            <tr key={n.id} className={cn("border-t border-border-subtle", pathSet.has(n.id) && "bg-proof-soft")}>
              <td className="py-1.5">
                <button type="button" onClick={() => onOpen(n.id)} className="text-left hover:underline">
                  {n.name}
                </button>
              </td>
              <td className="py-1.5 text-text-secondary">{KIND_LABEL[n.label] ?? n.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="w-full text-body-sm">
        <caption className="mb-2 text-left font-medium">Relationships ({graph.edges.length})</caption>
        <tbody>
          {graph.edges.map((e, i) => (
            <tr key={i} className="border-t border-border-subtle">
              <td className="py-1.5">{name[e.from]}</td>
              <td className="py-1.5 text-text-muted">{e.type.toLowerCase().replace(/_/g, " ")}</td>
              <td className="py-1.5">{name[e.to]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

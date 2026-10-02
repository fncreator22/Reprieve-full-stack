"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { entityMeta } from "@/components/entity-meta";
import { NodeShape } from "@/components/node-shape";
import { cn } from "@/lib/utils";

type N = { id: string; kind: string; name: string; x: number; y: number; sev?: "high" | "critical" | "moderate" };

// Illustrative graph modeled on the Northwind Pay sample workspace.
const NODES: N[] = [
  { id: "cp", kind: "CustomerPath", name: "Checkout", x: 64, y: 84 },
  { id: "api", kind: "Service", name: "checkout-api", x: 196, y: 150 },
  { id: "core", kind: "Service", name: "payments-core", x: 330, y: 214 },
  { id: "e1", kind: "Exception", name: "TLS waiver", x: 452, y: 112, sev: "high" },
  { id: "e2", kind: "Exception", name: "Skipped e2e", x: 474, y: 226, sev: "critical" },
  { id: "e3", kind: "Exception", name: "Flag override", x: 430, y: 330, sev: "moderate" },
  { id: "e4", kind: "Exception", name: "Key rotation", x: 300, y: 340, sev: "high" },
  { id: "team", kind: "Team", name: "Payments", x: 172, y: 300 },
  { id: "per", kind: "Person", name: "Owner (left)", x: 62, y: 352 },
  { id: "ctl", kind: "Control", name: "Encrypt in transit", x: 470, y: 30 },
];
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

// Proof path first (drawn in order), then context edges.
const PATH: [string, string][] = [
  ["cp", "api"],
  ["api", "core"],
  ["e1", "core"],
  ["e2", "core"],
  ["e3", "core"],
  ["e4", "core"],
];
const CONTEXT: [string, string][] = [
  ["team", "core"],
  ["per", "team"],
  ["e1", "ctl"],
  ["team", "api"],
];

const SEV_COLOR = { high: "var(--sev-high)", critical: "var(--sev-critical)", moderate: "var(--sev-moderate)" };

/**
 * Landing hero mini-graph (05 §12.3): nodes breathe, the proof path draws hop by hop and replays when
 * a service is hovered or focused. Reduced motion shows a static highlighted path.
 */
export function HeroGraph({ className }: { className?: string }) {
  const [run, setRun] = useState(0);
  const [paused, setPaused] = useState(false);
  const replay = () => setRun((r) => r + 1);

  return (
    <figure
      data-paused={paused}
      className={cn("relative data-[paused=true]:**:[animation-play-state:paused]", className)}
    >
      <div aria-hidden className="absolute inset-0 -z-10 rounded-[28px] aurora-mesh blur-2xl" />
      <div className="glass rounded-xl border border-border-subtle p-3 shadow-e3 sm:p-5">
        <div className="flex items-center justify-between px-1 pb-2">
          <p className="eyebrow text-proof">Proof path</p>
          <div className="flex items-center gap-3">
            <p className="hidden text-caption text-text-muted sm:block">Hover a service to trace it</p>
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              aria-pressed={paused}
              className="inline-flex min-h-6 items-center gap-1 rounded-sm px-1.5 text-caption text-text-secondary hover:text-text-primary motion-reduce:hidden"
            >
              {paused ? <Play aria-hidden className="size-3" /> : <Pause aria-hidden className="size-3" />}
              {paused ? "Play motion" : "Pause motion"}
            </button>
          </div>
        </div>
        <svg viewBox="0 0 540 390" className="h-auto w-full" role="group" aria-label="Example risk graph" aria-describedby="hero-graph-desc">
          {CONTEXT.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={byId[a].x}
              y1={byId[a].y}
              x2={byId[b].x}
              y2={byId[b].y}
              stroke="var(--border-strong)"
              strokeOpacity={0.5}
              strokeWidth={1}
            />
          ))}
          <g key={run}>
            {PATH.map(([a, b], i) => (
              <g key={`${a}-${b}`}>
                <line x1={byId[a].x} y1={byId[a].y} x2={byId[b].x} y2={byId[b].y} stroke="var(--proof)" strokeOpacity={0.16} strokeWidth={7} strokeLinecap="round" />
                <line
                  x1={byId[a].x}
                  y1={byId[a].y}
                  x2={byId[b].x}
                  y2={byId[b].y}
                  pathLength={1}
                  strokeDasharray="1"
                  stroke="var(--proof)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  className="motion-safe:animate-draw-line"
                  style={{ animationDelay: `${300 + i * 90}ms` }}
                />
              </g>
            ))}
          </g>
          {NODES.map((n, i) => {
            const meta = entityMeta(n.kind);
            const isService = n.kind === "Service";
            const fill = n.sev ? SEV_COLOR[n.sev] : meta.color;
            return (
              <g
                key={n.id}
                className="motion-safe:animate-drift [transform-box:fill-box]"
                style={{ animationDelay: `${(i % 5) * -1.1}s`, animationDuration: `${5 + (i % 3)}s` }}
                onMouseEnter={isService ? replay : undefined}
                onFocus={isService ? replay : undefined}
                tabIndex={isService ? 0 : undefined}
                role={isService ? "button" : undefined}
                aria-label={isService ? `Trace the proof path through ${n.name}` : undefined}
              >
                {isService && <circle cx={n.x} cy={n.y} r={22} fill="var(--brand-soft)" />}
                <NodeShape shape={meta.shape} cx={n.x} cy={n.y} r={isService ? 13 : 10} fill={fill} stroke="var(--bg-surface)" strokeWidth={2} />
                <text x={n.x} y={n.y + (isService ? 34 : 28)} textAnchor="middle" className="fill-text-secondary font-sans text-[12px]">
                  {n.name}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-2 rounded-md bg-proof-soft px-3 py-2 text-body-sm text-text-primary">
          <span className="font-medium">Checkout</span> requires <span className="font-medium">checkout-api</span>, which
          depends on <span className="font-medium">payments-core</span>: <span className="font-medium text-proof">4 active exceptions</span>
        </p>
      </div>
      <figcaption id="hero-graph-desc" className="sr-only">
        Example graph. The Checkout customer path requires the checkout-api service, which depends on payments-core.
        Payments-core carries four active exceptions: a TLS waiver, a skipped end-to-end test, a feature-flag override and a
        delayed key rotation. Its owning team, Payments, still lists an owner who has left. Each exception looks
        reasonable alone; together they put checkout at critical risk.
      </figcaption>
    </figure>
  );
}

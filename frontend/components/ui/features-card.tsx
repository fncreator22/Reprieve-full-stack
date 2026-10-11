'use client';

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  BarChart3,
  GitPullRequest,
  Play,
  RotateCcw,
  Check,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── AUTHENTIC SVG BRAND LOGOS ───────────────────────────────────────────────

function FalkorDbLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-label="FalkorDB">
      <defs>
        <linearGradient id="falkor-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF385C" />
          <stop offset="1" stopColor="#FF7A00" />
        </linearGradient>
      </defs>
      <path
        d="M6 9L16 4L26 9V19L21 27L16 29L11 27L6 19V9Z"
        stroke="url(#falkor-grad)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="url(#falkor-grad)"
        fillOpacity="0.14"
      />
      <path
        d="M16 4V16M16 16L6 9M16 16L26 9M16 16L11 27M16 16L21 27"
        stroke="url(#falkor-grad)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="2.5" fill="#FF7A00" />
      <circle cx="16" cy="4" r="1.5" fill="#FF385C" />
      <circle cx="6" cy="9" r="1.5" fill="#FF385C" />
      <circle cx="26" cy="9" r="1.5" fill="#FF7A00" />
      <circle cx="11" cy="27" r="1.5" fill="#FF385C" />
      <circle cx="21" cy="27" r="1.5" fill="#FF7A00" />
    </svg>
  );
}

function RedisLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-label="Redis">
      <path d="M16 2L29 7.8L16 13.6L3 7.8L16 2Z" fill="#DC382D" />
      <path d="M3 10.5L16 16.3V22.1L3 16.3V10.5Z" fill="#A3241B" />
      <path d="M29 10.5L16 16.3V22.1L29 16.3V10.5Z" fill="#B8271D" />
      <path d="M3 18.5L16 24.3V30.1L3 24.3V18.5Z" fill="#7A1B14" />
      <path d="M29 18.5L16 24.3V30.1L29 24.3V18.5Z" fill="#8C1F17" />
      <path d="M16 16.3L29 10.5L16 4.7L3 10.5L16 16.3Z" fill="#EF473A" fillOpacity="0.45" />
    </svg>
  );
}

function GitHubActionsLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="GitHub Actions">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function FastApiLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="FastAPI">
      <circle cx="12" cy="12" r="10" fill="#05998B" />
      <path
        d="M12.5 5.5L7 13.5H12L11.5 18.5L17 10.5H12L12.5 5.5Z"
        fill="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NextJsLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Next.js">
      <circle cx="12" cy="12" r="10" fill="#000" stroke="#333" strokeWidth="1.2" />
      <path
        d="M15.5 8.5V15.5M8.5 8.5V15.5M8.5 8.5L15.5 15.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClerkLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Clerk">
      <rect width="24" height="24" rx="6" fill="#6C47FF" />
      <path
        d="M12 7C9.79086 7 8 8.79086 8 11V12H7.5C6.67157 12 6 12.6716 6 13.5V17.5C6 18.3284 6.67157 19 7.5 19H16.5C17.3284 19 18 18.3284 18 17.5V13.5C18 12.6716 17.3284 12 16.5 12H16V11C16 8.79086 14.2091 7 12 7ZM14.5 12H9.5V11C9.5 9.61929 10.6193 8.5 12 8.5C13.3807 8.5 14.5 9.61929 14.5 11V12ZM12 14.5C12.5523 14.5 13 14.9477 13 15.5C13 15.82 12.849 16.104 12.614 16.289L12.75 17.25H11.25L11.386 16.289C11.151 16.104 11 15.82 11 15.5C11 14.9477 11.4477 14.5 12 14.5Z"
        fill="white"
      />
    </svg>
  );
}

// ─── TERMINAL & CODE CONFIGURATIONS ──────────────────────────────────────────

interface TerminalLog {
  text: string;
  type?: "cmd" | "info" | "warn" | "error" | "accent" | "mute" | "detail";
  delayMs: number;
}

const SCAN_SEQUENCE: TerminalLog[] = [
  { text: "$ npx reprieve scan --strict --submit", type: "cmd", delayMs: 350 },
  { text: "▶ Reprieve Autonomous Scanner: Scanning AST for unmanaged waivers...", type: "info", delayMs: 700 },
  { text: "⚠ Found 3 implicit waivers in source code:", type: "warn", delayMs: 1200 },
  { text: "  src/auth/tokens.py:42      → #nosec: TLS verification bypass for dev gateway", type: "detail", delayMs: 1550 },
  { text: "  src/services/checkout.ts:88 → TODO(waiver): Skip fraud validation on retry", type: "detail", delayMs: 1900 },
  { text: "  tests/e2e/payment.test.ts:14→ @skip: Flaky under high concurrent mock load", type: "detail", delayMs: 2250 },
  { text: "$ npx reprieve check --service checkout-api --horizon 30", type: "cmd", delayMs: 2800 },
  { text: "▶ Reprieve Circuit Breaker: Checking Architectural Risk...", type: "info", delayMs: 3300 },
  { text: "🚨 PRE-MERGE GATE BLOCKED: Critical Emergent Cascades Detected!", type: "error", delayMs: 3900 },
  { text: "  ● Service: payments-core — Risk Score: 84.0 (CRITICAL) [SINGLE POINT OF FAILURE]", type: "accent", delayMs: 4400 },
  { text: "  ● Temporal Expiry Collisions: 4 waivers expire during Cyber Week (+18d window)", type: "warn", delayMs: 4800 },
  { text: "  ● Shortest proof path: Checkout Path → checkout-api → payments-core ← [TLS waiver, Skipped e2e]", type: "detail", delayMs: 5200 },
  { text: "✓ Exit code: 1 (Pull request blocked until architectural review approved)", type: "mute", delayMs: 5600 },
];

const GITHUB_ACTION_YAML = `name: Reprieve Pre-Merge Circuit Breaker
on:
  pull_request:
    branches: [main, master]

jobs:
  graph-safety-gate:
    name: Evaluate Multi-Hop Cascades
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Scan AST Code Waivers (#nosec, @skip)
        run: npx reprieve scan --strict --submit
        env:
          REPRIEVE_API_KEY: \${{ secrets.REPRIEVE_API_KEY }}
          REPRIEVE_WORKSPACE: \${{ secrets.REPRIEVE_WORKSPACE }}

      - name: Enforce 30-Day Avalanche Gate
        run: npx reprieve check --horizon 30 --fail-threshold 75.0`;

const MCP_SAMPLE_CONFIG = `{
  "mcpServers": {
    "reprieve": {
      "url": "https://api.reprieve.dev/api/v1/workspaces/northwind-pay/mcp/tools",
      "headers": {
        "Authorization": "Bearer rep_live_94f8e21a..."
      }
    }
  }
}`;

// ─── 3 CLEAN DEVELOPER SURFACES ──────────────────────────────────────────────

type DeveloperSurfaceId = "cli" | "mcp" | "ci";

interface DeveloperSurface {
  id: DeveloperSurfaceId;
  title: string;
  badge: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DEVELOPER_SURFACES: DeveloperSurface[] = [
  {
    id: "cli",
    title: "CLI Scanner",
    badge: "Zero-Login",
    desc: "Local AST scan for code waivers with zero login required",
    icon: Terminal,
  },
  {
    id: "mcp",
    title: "MCP Protocol",
    badge: "14 Tools",
    desc: "14 read-only graph reasoning tools for Cursor & Claude",
    icon: Cpu,
  },
  {
    id: "ci",
    title: "GitHub CI Gate",
    badge: "Pre-Merge Gate",
    desc: "Automated PR comments blocking cascading failures",
    icon: GitPullRequest,
  },
];

export const FeaturesCard = () => {
  const [activeSurface, setActiveSurface] = useState<DeveloperSurfaceId>("cli");
  const [selectedMetric, setSelectedMetric] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Terminal scan playback state
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number>(SCAN_SEQUENCE.length);
  const [isBlocked, setIsBlocked] = useState(true);
  const timeoutsRef = useState<ReturnType<typeof setTimeout>[]>(() => [])[0];

  const clearAllTimers = () => {
    while (timeoutsRef.length > 0) {
      const id = timeoutsRef.pop();
      if (id) clearTimeout(id);
    }
  };

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const handleCopy = (text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runSimulation = () => {
    clearAllTimers();
    setIsRunning(true);
    setCompletedSteps(0);
    setIsBlocked(false);

    SCAN_SEQUENCE.forEach((step, index) => {
      const id = setTimeout(() => {
        setCompletedSteps(index + 1);
        if (index === SCAN_SEQUENCE.length - 1) {
          setIsRunning(false);
          setIsBlocked(true);
        }
      }, step.delayMs);
      timeoutsRef.push(id);
    });
  };

  const metrics = [
    { label: "Graph Query Latency", value: "12ms", trend: "-34%" },
    { label: "Collision Window Scan", value: "15ms", trend: "-18%" },
    { label: "False Positive Rate", value: "0.00%", trend: "-100%" },
    { label: "Grounding Accuracy", value: "100%", trend: "+0.00%" },
  ];

  const integrations = [
    { name: "FalkorDB", role: "Graph Core", logo: FalkorDbLogo },
    { name: "Redis", role: "In-Memory", logo: RedisLogo },
    { name: "GitHub Actions", role: "CI/CD Gate", logo: GitHubActionsLogo },
    { name: "FastAPI", role: "Async API", logo: FastApiLogo },
    { name: "Next.js", role: "Web Engine", logo: NextJsLogo },
    { name: "Clerk", role: "Session Auth", logo: ClerkLogo },
  ];

  return (
    <section
      id="developer-hub"
      aria-labelledby="features-heading"
      className="w-full bg-black py-20 px-4 md:px-8 text-white font-sans antialiased overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">
        {/* Section Header */}
        <div className="flex flex-col gap-5 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span className="text-xs font-semibold tracking-wider text-zinc-300">
              Operational Graph Intelligence · Zero-Login Developer Protocol
            </span>
          </div>
          <h2 id="features-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            Eliminate Cascading Silent Failures
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Developers don&apos;t want another dashboard. Reprieve comments directly on pull requests, exposes 14 graph reasoning tools to Cursor and Claude Desktop via MCP, and runs in 12ms inside your CI pipeline with zero login required.
          </p>
        </div>

        {/* Main Bento Grid: 3 Clean Developer Surfaces + Interactive Runtime Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT: 3 Clean Developer Surfaces (5 Columns) */}
          <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700/80 shadow-2xl">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold">
                <Terminal className="w-3.5 h-3.5 text-brand" />
                Developer Surfaces
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-1 text-white">Three Native Interfaces</h3>
              <p className="text-xs text-zinc-400 mb-6">
                Direct integration touchpoints designed for zero developer friction.
              </p>

              {/* 3 Spacious Surface Cards */}
              <div className="flex flex-col gap-3.5">
                {DEVELOPER_SURFACES.map((surface) => {
                  const Icon = surface.icon;
                  const isActive = activeSurface === surface.id;
                  return (
                    <button
                      key={surface.id}
                      type="button"
                      onClick={() => setActiveSurface(surface.id)}
                      className={cn(
                        "group/item relative flex items-start gap-4 rounded-xl p-4 text-left transition-all duration-200 border cursor-pointer",
                        isActive
                          ? "bg-zinc-900 border-brand/60 shadow-lg shadow-brand/10 ring-1 ring-brand/30"
                          : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/70"
                      )}
                    >
                      <div
                        className={cn(
                          "p-2.5 rounded-lg border transition-colors shrink-0",
                          isActive
                            ? "bg-brand/10 border-brand/40 text-brand"
                            : "bg-black/50 border-white/5 text-zinc-400 group-hover/item:text-zinc-200"
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-white tracking-tight">{surface.title}</span>
                          <span
                            className={cn(
                              "text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-semibold",
                              isActive
                                ? "bg-brand/10 border-brand/30 text-brand"
                                : "bg-zinc-800/80 border-zinc-700/60 text-zinc-400"
                            )}
                          >
                            {surface.badge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{surface.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Select surface to view runtime specs</span>
              <span className="text-zinc-400 font-semibold">Zero-Login Architecture</span>
            </div>
          </div>

          {/* RIGHT: Synchronized Runtime Specs & Terminal (7 Columns) */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700/80 shadow-2xl">
            <div>
              {/* Header with Active Surface Indicator and Quick Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="size-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="ml-2 font-mono text-[11px] text-zinc-400">
                    {activeSurface === "cli" && "reprieve scan --strict"}
                    {activeSurface === "mcp" && "claude_desktop_config.json"}
                    {activeSurface === "ci" && ".github/workflows/reprieve.yml"}
                  </span>
                </div>

                {/* Surface Indicator & Copy Action */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-zinc-700/60 bg-zinc-900 text-zinc-400">
                    {activeSurface === "cli" && "CLI Scanner"}
                    {activeSurface === "mcp" && "MCP Protocol"}
                    {activeSurface === "ci" && "GitHub Actions"}
                  </span>
                  {activeSurface === "cli" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy("npx reprieve scan --strict", "cli-npx")}
                      className="h-7 border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white font-mono text-[10px] px-2.5"
                    >
                      {copiedKey === "cli-npx" ? <Check className="mr-1 size-3 text-emerald-400" /> : <Copy className="mr-1 size-3" />}
                      <span>{copiedKey === "cli-npx" ? "Copied" : "Copy Command"}</span>
                    </Button>
                  )}
                  {activeSurface === "mcp" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(MCP_SAMPLE_CONFIG, "mcp-config")}
                      className="h-7 border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white font-mono text-[10px] px-2.5"
                    >
                      {copiedKey === "mcp-config" ? <Check className="mr-1 size-3 text-emerald-400" /> : <Copy className="mr-1 size-3" />}
                      <span>{copiedKey === "mcp-config" ? "Copied" : "Copy JSON"}</span>
                    </Button>
                  )}
                  {activeSurface === "ci" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(GITHUB_ACTION_YAML, "ci-yaml")}
                      className="h-7 border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white font-mono text-[10px] px-2.5"
                    >
                      {copiedKey === "ci-yaml" ? <Check className="mr-1 size-3 text-emerald-400" /> : <Copy className="mr-1 size-3" />}
                      <span>{copiedKey === "ci-yaml" ? "Copied" : "Copy YAML"}</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Dynamic Surface Body */}
              <div className="mt-4">
                {/* 1. CLI Tab */}
                {activeSurface === "cli" && (
                  <div className="space-y-3">
                    {/* Quick Install Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 font-mono text-[11px]">
                      <div className="flex flex-wrap items-center gap-2 text-zinc-300">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Quick Install:</span>
                        <span className="inline-flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-emerald-400 border border-emerald-500/20">
                          <span className="text-zinc-600">$</span> npm i -g reprieve-cli
                        </span>
                        <span className="text-zinc-600">or</span>
                        <span className="inline-flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-zinc-300 border border-white/10">
                          <span className="text-zinc-600">$</span> npx reprieve scan --strict
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy("npx reprieve scan --strict", "cli-npx")}
                          className="h-7 border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white font-mono text-[10px] px-2.5"
                        >
                          {copiedKey === "cli-npx" ? <Check className="mr-1 size-3 text-emerald-400" /> : <Copy className="mr-1 size-3" />}
                          <span>{copiedKey === "cli-npx" ? "Copied" : "Copy npx"}</span>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Pre-Approval AST Waiver &amp; Risk Breaker</span>
                        <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                          Zero-Login Ready
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={runSimulation}
                        disabled={isRunning}
                        className="h-7 border-brand/40 bg-brand/10 text-brand hover:bg-brand/20 font-mono text-[11px]"
                      >
                        {isRunning ? (
                          <>
                            <RotateCcw className="mr-1 size-3 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          <>
                            <Play className="mr-1 size-3 fill-current" />
                            Re-run Scan
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-[#07080a] p-4 font-mono text-[12px] leading-relaxed text-zinc-200 shadow-inner overflow-x-auto min-h-[220px] max-h-[260px] overflow-y-auto">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 text-[10px] text-zinc-500">
                        <span>bash — ~/src/payments-mesh</span>
                        <span className={isBlocked ? "text-red-400 font-bold" : "text-amber-400"}>
                          {isRunning ? "evaluating graph..." : isBlocked ? "exit code: 1 (BLOCKED)" : "ready"}
                        </span>
                      </div>

                      <div className="pt-2.5 space-y-1.5">
                        {SCAN_SEQUENCE.slice(0, completedSteps).map((step, idx) => {
                          if (step.type === "cmd") {
                            return (
                              <div key={idx} className="text-zinc-400">
                                <span className="text-emerald-400">$</span> {step.text.replace("$ ", "")}
                              </div>
                            );
                          }
                          if (step.type === "info") {
                            return <div key={idx} className="text-zinc-500">{step.text}</div>;
                          }
                          if (step.type === "warn") {
                            return <div key={idx} className="text-amber-300">{step.text}</div>;
                          }
                          if (step.type === "error") {
                            return <div key={idx} className="text-red-400 font-bold">{step.text}</div>;
                          }
                          if (step.type === "accent") {
                            return (
                              <div key={idx} className="pl-3 text-zinc-300">
                                ● Service: <span className="text-white font-bold">payments-core</span> — <span className="text-red-400 font-bold">Risk Score: 84.0 (CRITICAL)</span> [SINGLE POINT OF FAILURE]
                              </div>
                            );
                          }
                          if (step.type === "mute") {
                            return <div key={idx} className="text-zinc-500 pt-0.5">{step.text}</div>;
                          }
                          return (
                            <div key={idx} className="pl-3 text-zinc-400 text-[11.5px]">
                              {step.text}
                            </div>
                          );
                        })}

                        <div className="inline-flex items-center text-emerald-400 font-bold pt-1">
                          <span className="mr-1">$</span>
                          <span className="inline-block w-2 h-3.5 bg-emerald-400 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. MCP Protocol Tab (Clean, spacious JSON and protocol invariants) */}
                {activeSurface === "mcp" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Native Model Context Protocol Server</span>
                        <span className="rounded bg-brand/10 border border-brand/30 px-2 py-0.5 font-mono text-[10px] text-brand">
                          Cursor · Claude Desktop
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">14 Read-Only Graph Tools</span>
                    </div>

                    <pre className="rounded-xl border border-zinc-800 bg-[#07080a] p-4 font-mono text-[12px] leading-relaxed text-zinc-300 overflow-x-auto min-h-[170px] max-h-[220px]">
                      <code>{MCP_SAMPLE_CONFIG}</code>
                    </pre>

                    {/* Clean spacious highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
                        <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">14 Tools</div>
                        <p className="text-xs font-medium text-zinc-200">Read-Only Reasoning</p>
                        <p className="text-[11px] text-zinc-500">predict_avalanche, proof_path, collisions, what_if</p>
                      </div>
                      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
                        <div className="text-[11px] font-mono text-brand uppercase tracking-wider font-semibold">Grounded</div>
                        <p className="text-xs font-medium text-zinc-200">Zero Hallucinations</p>
                        <p className="text-[11px] text-zinc-500">Uncited entity IDs stripped by guard before delivery</p>
                      </div>
                      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
                        <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">Rate Guard</div>
                        <p className="text-xs font-medium text-zinc-200">Max 6 Tools / Turn</p>
                        <p className="text-[11px] text-zinc-500">Deterministic loop preventing runaway inference costs</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. GitHub CI Tab */}
                {activeSurface === "ci" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Pre-Merge Pull Request Risk Circuit Breaker</span>
                        <span className="rounded bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 font-mono text-[10px] text-purple-300">
                          GitHub Actions
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">Automated PR Check</span>
                    </div>

                    <pre className="rounded-xl border border-zinc-800 bg-[#07080a] p-4 font-mono text-[11.5px] leading-relaxed text-zinc-300 overflow-x-auto min-h-[170px] max-h-[220px] overflow-y-auto">
                      <code>{GITHUB_ACTION_YAML}</code>
                    </pre>

                    {/* Clean spacious highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
                        <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">AST Scanner</div>
                        <p className="text-xs font-medium text-zinc-200">Code Waiver Mining</p>
                        <p className="text-[11px] text-zinc-500">Detects #nosec, @skip, TODO(waiver) in repo pull requests</p>
                      </div>
                      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
                        <div className="text-[11px] font-mono text-red-400 uppercase tracking-wider font-semibold">Circuit Breaker</div>
                        <p className="text-xs font-medium text-zinc-200">Cascading Failures Block</p>
                        <p className="text-[11px] text-zinc-500">Fails CI exit code 1 if compound avalanche risk exceeds 75.0</p>
                      </div>
                      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
                        <div className="text-[11px] font-mono text-purple-300 uppercase tracking-wider font-semibold">Bot Annotation</div>
                        <p className="text-xs font-medium text-zinc-200">Automated PR Comment</p>
                        <p className="text-[11px] text-zinc-500">Posts shortest proof path directly on GitHub pull requests</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Endpoint: /api/v1/workspaces/&#123;id&#125;/mcp/tools</span>
              <span className="text-brand font-semibold">&lt;15ms deterministic graph evaluation</span>
            </div>
          </div>

          {/* Performance Metrics Card (6 Columns) */}
          <div className="lg:col-span-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700/80 shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Performance Telemetry</h3>
                    <p className="text-xs text-zinc-400">Deterministic benchmarks</p>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-semibold">
                  Live Engine
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {metrics.map((metric, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedMetric(idx)}
                    className={cn(
                      "text-left p-3.5 rounded-xl transition-all duration-200 border cursor-pointer",
                      selectedMetric === idx
                        ? "bg-zinc-800/90 border-zinc-600 shadow-sm"
                        : "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900"
                    )}
                  >
                    <p className="text-[11px] text-zinc-400">{metric.label}</p>
                    <div className="flex items-baseline justify-between mt-1.5">
                      <span className="text-base font-bold text-white font-mono">{metric.value}</span>
                      <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {metric.trend}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-4 text-[11px] text-zinc-500 font-mono">
              Measured across 10,000 simulated microservice graphs under sliding expiry windows.
            </p>
          </div>

          {/* Integrations Card with REAL, ORIGINAL SVG LOGOS (6 Columns) */}
          <div className="lg:col-span-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700/80 shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Stack Integrations</h3>
                    <p className="text-xs text-zinc-400">Authentic ecosystem connectors</p>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                  Production Grade
                </span>
              </div>

              {/* 6 Original Logos Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {integrations.map((int, idx) => {
                  const Logo = int.logo;
                  return (
                    <div
                      key={idx}
                      className="group/int p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200 flex flex-col items-center gap-2 cursor-pointer text-center"
                    >
                      <div className="size-8 rounded-lg bg-black/60 border border-white/5 flex items-center justify-center group-hover/int:scale-110 transition-transform duration-200">
                        <Logo className="size-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-zinc-200 truncate max-w-full">{int.name}</p>
                        <p className="text-[9px] text-zinc-500 truncate max-w-full">{int.role}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="mt-4 text-[11px] text-zinc-500 font-mono">
              Zero-latency in-memory synchronization between CI/CD pipeline triggers and living graph storage.
            </p>
          </div>
        </div>

        {/* BOTTOM GUARANTEE SPECIFICATIONS STRIP (Unified wide 4-metric anchor) */}
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-[#0a0b0e] p-6 shadow-xl sm:grid-cols-4 sm:p-8">
          <div className="space-y-1 text-center sm:text-left sm:border-r border-white/10 sm:pr-6">
            <div className="text-display-md sm:text-display-lg font-mono font-bold text-white">14 Tools</div>
            <p className="text-body-sm font-medium text-zinc-200">Read-Only Reasoning</p>
            <p className="text-[11px] font-mono text-zinc-400">8 Cypher rules (R1 to R8)</p>
          </div>

          <div className="space-y-1 text-center sm:text-left sm:border-r border-white/10 sm:pr-6">
            <div className="text-display-md sm:text-display-lg font-mono font-bold text-white">12ms</div>
            <p className="text-body-sm font-medium text-zinc-200">Pre-Merge Gate Latency</p>
            <p className="text-[11px] font-mono text-zinc-400">Evaluates in GitHub Actions CI</p>
          </div>

          <div className="space-y-1 text-center sm:text-left sm:border-r border-white/10 sm:pr-6">
            <div className="text-display-md sm:text-display-lg font-mono font-bold text-white">100%</div>
            <p className="text-body-sm font-medium text-zinc-200">Grounded Proof Paths</p>
            <p className="text-[11px] font-mono text-zinc-400">Every alert cites graph nodes</p>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="text-display-md sm:text-display-lg font-mono font-bold text-brand">0 Login</div>
            <p className="text-body-sm font-medium text-zinc-200">Developer Ergonomics</p>
            <p className="text-[11px] font-mono text-zinc-400">PR comments and CLI integration</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Component = FeaturesCard;
export default FeaturesCard;

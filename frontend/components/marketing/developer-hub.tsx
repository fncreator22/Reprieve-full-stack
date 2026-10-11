"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Copy,
  Terminal,
  Cpu,
  GitPullRequest,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type IntegrationTab = "cli" | "mcp" | "ci";

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

const MCP_TOOLS = [
  { name: "predict_avalanche", desc: "Calculates avalanche centrality (P = p0^h) over N-day sliding horizon" },
  { name: "predict_expiry_collisions", desc: "Finds temporal collision windows where waivers expire simultaneously" },
  { name: "proof_path", desc: "Returns shortest proof path between any two graph nodes" },
  { name: "what_if_as_of", desc: "Runs full graph detection at a future simulation date (read-only)" },
  { name: "list_alerts", desc: "Active alerts in workspace ranked by deterministic severity" },
  { name: "get_alert", desc: "Full alert detail including shortest proof path and nodes" },
  { name: "list_exceptions", desc: "Active exceptions in workspace with control, owner, service" },
  { name: "get_exception", desc: "Full exception detail with control, owner, and services" },
  { name: "list_expiring", desc: "Exceptions expiring within N days across sliding window" },
  { name: "list_orphaned", desc: "Exceptions whose owner has left company or is inactive" },
  { name: "list_services", desc: "Services with risk score, PageRank, and exception count" },
  { name: "get_service", desc: "Full service detail including dependency graph context" },
  { name: "propose_review", desc: "Proposes a ProposedAction to schedule review (human must approve)" },
  { name: "recall_precedent", desc: "Searches episodic memory for prior human decisions on this control" },
];

interface TerminalLog {
  text: string;
  type?: "cmd" | "info" | "warn" | "error" | "accent" | "mute" | "detail";
  delayMs: number;
}

const SCAN_SEQUENCE: TerminalLog[] = [
  { text: "$ npx reprieve scan --strict --submit", type: "cmd", delayMs: 400 },
  { text: "▶ Reprieve Autonomous Scanner: Scanning AST for unmanaged waivers...", type: "info", delayMs: 800 },
  { text: "⚠ Found 3 implicit waivers in source code:", type: "warn", delayMs: 1400 },
  { text: "  src/auth/tokens.py:42      → #nosec: TLS verification bypass for dev gateway", type: "detail", delayMs: 1800 },
  { text: "  src/services/checkout.ts:88 → TODO(waiver): Skip fraud validation on retry", type: "detail", delayMs: 2200 },
  { text: "  tests/e2e/payment.test.ts:14→ @skip: Flaky under high concurrent mock load", type: "detail", delayMs: 2600 },
  { text: "$ npx reprieve check --service checkout-api --horizon 30", type: "cmd", delayMs: 3200 },
  { text: "▶ Reprieve Circuit Breaker: Checking Architectural Risk...", type: "info", delayMs: 3800 },
  { text: "🚨 PRE-MERGE GATE BLOCKED: Critical Emergent Cascades Detected!", type: "error", delayMs: 4400 },
  { text: "  ● Service: payments-core — Risk Score: 84.0 (CRITICAL) [SINGLE POINT OF FAILURE]", type: "accent", delayMs: 4900 },
  { text: "  ● Temporal Expiry Collisions: 4 waivers expire during Cyber Week (+18d window)", type: "warn", delayMs: 5300 },
  { text: "  ● Shortest proof path: Checkout Path → checkout-api → payments-core ← [TLS waiver, Skipped e2e]", type: "detail", delayMs: 5700 },
  { text: "Run Steward or resolve expired waivers to lift merge block.", type: "mute", delayMs: 6100 },
];

export function DeveloperHub() {
  const [activeTab, setActiveTab] = useState<IntegrationTab>("cli");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Dynamic Terminal Execution State with Safe Timer Ref Cleanup
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

  return (
    <section id="developer-hub" aria-labelledby="dev-hub-title" className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 sm:py-28">
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-300">
          <Terminal className="size-3.5 text-brand" />
          <span>Zero-Login Developer Protocol</span>
        </div>
        <h2 id="dev-hub-title" className="text-display-lg font-display font-bold text-white tracking-tight">
          Connect via Terminal, MCP, or GitHub Actions
        </h2>
        <p className="text-body-lg text-zinc-300 leading-relaxed">
          Developers don&apos;t want another dashboard. Reprieve comments directly on your pull requests, exposes 14 graph reasoning tools to Cursor and Claude Desktop via MCP, and runs in 12ms inside your CI pipeline.
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="rounded-2xl border border-white/15 bg-[#0a0b0e] shadow-2xl overflow-hidden">
        {/* Top Control Bar / Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-[#111216] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 py-1">
            <span className="size-3 rounded-full bg-[#ff5f56]" />
            <span className="size-3 rounded-full bg-[#ffbd2e]" />
            <span className="size-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 font-mono text-[12px] text-zinc-400">reprieve-runtime v1.2</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-lg bg-black/40 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab("cli")}
              className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 font-mono text-[12px] font-medium transition-all ${
                activeTab === "cli"
                  ? "bg-brand text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Terminal className="size-3.5" />
              <span>Terminal CLI</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mcp")}
              className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 font-mono text-[12px] font-medium transition-all ${
                activeTab === "mcp"
                  ? "bg-brand text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Cpu className="size-3.5" />
              <span>MCP Protocol</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ci")}
              className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 font-mono text-[12px] font-medium transition-all ${
                activeTab === "ci"
                  ? "bg-brand text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <GitPullRequest className="size-3.5" />
              <span>GitHub Actions</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Terminal CLI */}
        {activeTab === "cli" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-h3 font-bold text-white flex items-center gap-2">
                  <span>Autonomous AST Scanner &amp; Circuit Breaker</span>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-mono text-[11px] text-emerald-400">
                    No Login Required
                  </span>
                </h3>
                <p className="mt-1 text-body-sm text-zinc-300">
                  Scan codebases for <code className="text-zinc-200">#nosec</code>, <code className="text-zinc-200">@skip</code>, and unmanaged feature flags. Query graph avalanche risks locally before pushing commits.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={runSimulation}
                  disabled={isRunning}
                  className="border-brand/40 bg-brand/10 text-brand hover:bg-brand/20 font-mono text-[12px]"
                >
                  {isRunning ? (
                    <>
                      <RotateCcw className="mr-1.5 size-3.5 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Play className="mr-1.5 size-3.5 fill-current" />
                      Re-run Scan Simulation
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy("npx reprieve scan --strict", "cli-scan")}
                  className="border-white/15 bg-white/[0.04] text-zinc-200 hover:text-white font-mono text-[12px]"
                >
                  {copiedKey === "cli-scan" ? <Check className="mr-1.5 size-3.5 text-emerald-400" /> : <Copy className="mr-1.5 size-3.5" />}
                  <span>{copiedKey === "cli-scan" ? "Copied!" : "Copy Command"}</span>
                </Button>
              </div>
            </div>

            {/* Quick Install Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0c0d12] px-4 py-3 font-mono text-[12px]">
              <div className="flex flex-wrap items-center gap-2.5 text-zinc-300">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Quick Install:</span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-emerald-400 border border-emerald-500/20">
                  <span className="text-zinc-600">$</span> npm i -g reprieve-cli
                </span>
                <span className="text-zinc-600">or</span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-zinc-300 border border-white/10">
                  <span className="text-zinc-600">$</span> npx reprieve scan --strict
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy("npm i -g reprieve-cli", "cli-npm")}
                  className="h-8 border-white/15 bg-white/[0.04] text-zinc-200 hover:text-white font-mono text-[11px] px-3"
                >
                  {copiedKey === "cli-npm" ? <Check className="mr-1.5 size-3.5 text-emerald-400" /> : <Copy className="mr-1.5 size-3.5" />}
                  <span>{copiedKey === "cli-npm" ? "Copied npm!" : "Copy npm"}</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy("npx reprieve scan --strict", "cli-npx")}
                  className="h-8 border-white/15 bg-white/[0.04] text-zinc-200 hover:text-white font-mono text-[11px] px-3"
                >
                  {copiedKey === "cli-npx" ? <Check className="mr-1.5 size-3.5 text-emerald-400" /> : <Copy className="mr-1.5 size-3.5" />}
                  <span>{copiedKey === "cli-npx" ? "Copied npx!" : "Copy npx"}</span>
                </Button>
              </div>
            </div>

            {/* Interactive Terminal Window */}
            <div className="rounded-xl border border-white/10 bg-[#07080a] p-5 font-mono text-[13px] leading-relaxed text-zinc-200 shadow-inner overflow-x-auto min-h-[360px]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[11px] text-zinc-500">
                <span>bash — ~/src/payments-mesh</span>
                <span className={isBlocked ? "text-red-400 font-bold" : "text-amber-400"}>
                  {isRunning ? "evaluating..." : isBlocked ? "exit code: 1 (BLOCKED)" : "evaluating..."}
                </span>
              </div>

              <div className="pt-3 space-y-2">
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
                      <div key={idx} className="pl-4 text-zinc-300">
                        ● Service: <span className="text-white font-bold">payments-core</span> — <span className="text-red-400 font-bold">Risk Score: 84.0 (CRITICAL)</span> [SINGLE POINT OF FAILURE]
                      </div>
                    );
                  }
                  if (step.type === "mute") {
                    return <div key={idx} className="text-zinc-500 pt-1">{step.text}</div>;
                  }
                  return (
                    <div key={idx} className="pl-4 text-zinc-300 font-mono text-[12.5px]">
                      {step.text}
                    </div>
                  );
                })}

                {/* Blinking Cursor */}
                <div className="inline-flex items-center text-emerald-400 font-bold">
                  <span className="mr-1">$</span>
                  <span className="inline-block w-2.5 h-4 bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Quick Command Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div
                onClick={() => handleCopy("npx reprieve scan", "card-scan")}
                className="group relative cursor-pointer rounded-lg border border-white/10 bg-white/[0.02] p-3 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-brand font-semibold">npx reprieve scan</span>
                  <span className="text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedKey === "card-scan" ? "Copied!" : "Click to copy"}
                  </span>
                </div>
                <p className="text-caption text-zinc-400 mt-1">Parses AST comments and extracts code waivers into draft graph nodes.</p>
              </div>
              <div
                onClick={() => handleCopy("npx reprieve check", "card-check")}
                className="group relative cursor-pointer rounded-lg border border-white/10 bg-white/[0.02] p-3 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-brand font-semibold">npx reprieve check</span>
                  <span className="text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedKey === "card-check" ? "Copied!" : "Click to copy"}
                  </span>
                </div>
                <p className="text-caption text-zinc-400 mt-1">Evaluates multi-hop cascading failure risk and returns exit code 0 or 1.</p>
              </div>
              <div
                onClick={() => handleCopy("npx reprieve blast-radius", "card-blast")}
                className="group relative cursor-pointer rounded-lg border border-white/10 bg-white/[0.02] p-3 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-brand font-semibold">npx reprieve blast-radius</span>
                  <span className="text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedKey === "card-blast" ? "Copied!" : "Click to copy"}
                  </span>
                </div>
                <p className="text-caption text-zinc-400 mt-1">Calculates avalanche centrality (P = p0^h) for any service in milliseconds.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Model Context Protocol (MCP) */}
        {activeTab === "mcp" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-h3 font-bold text-white flex items-center gap-2">
                  <span>Native MCP Server for AI Coding Agents</span>
                  <span className="rounded bg-brand/10 border border-brand/30 px-2 py-0.5 font-mono text-[11px] text-brand">
                    Cursor · Claude Desktop · Cline
                  </span>
                </h3>
                <p className="mt-1 text-body-sm text-zinc-300">
                  Allow your IDE coding agents to ask questions about architectural risk, inspect proof paths, and run simulations directly against FalkorDB.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(MCP_SAMPLE_CONFIG, "mcp-config")}
                  className="border-white/15 bg-white/[0.04] text-zinc-200 hover:text-white font-mono text-[12px]"
                >
                  {copiedKey === "mcp-config" ? <Check className="mr-1.5 size-3.5 text-emerald-400" /> : <Copy className="mr-1.5 size-3.5" />}
                  <span>{copiedKey === "mcp-config" ? "Copied Config!" : "Copy MCP Config JSON"}</span>
                </Button>
              </div>
            </div>

            {/* MCP Configuration Code & Endpoint */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: JSON snippet */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>claude_desktop_config.json / .cursor/mcp.json</span>
                  <span className="text-emerald-400">Bearer Auth Supported</span>
                </div>
                <pre className="rounded-xl border border-white/10 bg-[#07080a] p-4 font-mono text-[12px] leading-relaxed text-zinc-200 overflow-x-auto">
                  <code>{MCP_SAMPLE_CONFIG}</code>
                </pre>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-[12px] text-zinc-300">
                  <span className="font-semibold text-white">Live Endpoint: </span>
                  <code className="text-brand font-mono">GET /api/v1/workspaces/&#123;ws&#125;/mcp/tools</code>
                </div>
              </div>

              {/* Right: Available Tools List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Exposed Graph Tools (14 Total)</span>
                  <span className="text-brand">Read-Only Safety Invariant</span>
                </div>
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {MCP_TOOLS.map((t) => (
                    <div key={t.name} className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-body-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[12px] font-bold text-white">{t.name}</span>
                        <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">tool</span>
                      </div>
                      <p className="mt-1 text-caption text-zinc-400">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: GitHub Actions CI/CD */}
        {activeTab === "ci" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-h3 font-bold text-white flex items-center gap-2">
                  <span>12ms Pre-Merge Gate in Pull Requests</span>
                  <span className="rounded bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 font-mono text-[11px] text-purple-300">
                    GitHub Actions · GitLab CI
                  </span>
                </h3>
                <p className="mt-1 text-body-sm text-zinc-300">
                  Drop into your GitHub repository to block risky PRs before merge and comment shortest proof paths automatically.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(GITHUB_ACTION_YAML, "ci-yaml")}
                  className="border-white/15 bg-white/[0.04] text-zinc-200 hover:text-white font-mono text-[12px]"
                >
                  {copiedKey === "ci-yaml" ? <Check className="mr-1.5 size-3.5 text-emerald-400" /> : <Copy className="mr-1.5 size-3.5" />}
                  <span>{copiedKey === "ci-yaml" ? "Copied YAML!" : "Copy Workflow YAML"}</span>
                </Button>
              </div>
            </div>

            <pre className="rounded-xl border border-white/10 bg-[#07080a] p-5 font-mono text-[12px] leading-relaxed text-zinc-200 overflow-x-auto">
              <code>{GITHUB_ACTION_YAML}</code>
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}

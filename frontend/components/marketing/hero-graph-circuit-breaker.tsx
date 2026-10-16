"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  GitPullRequest,
  Terminal,
  Zap,
  ArrowRight,
  UserCheck,
  RotateCcw,
  Sparkles,
  Server,
  Layers,
  Activity,
  FileWarning,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Authentic Reprieve Executive Command Center Viewport.
 * Features:
 * - Two-column split:
 *   - Left: Service Concentration Hotspot for payments-core (Root Settlement Engine, SPOF Rank #1, Risk Score 99.1 -> 18.2).
 *   - Right: FalkorDB Graph Proof Path mini-canvas (Customer Checkout Path -> checkout-api (84.0) -> payments-core (99.1))
 *           with orthogonal SVG connectors, directed particle pulse, and shockwave/cascade indicator.
 *   - Bottom: Autonomous Steward AI Agent action proposal card ("Priya Raman left 64d ago. Reassign to Sam Okafor?")
 *             with interactive [Approve] and [Review] action buttons.
 * - Interactive state toggle animating risk score, connector colors, badges, and resolution state.
 * - Theme-grounded design tokens (#0A0C11, #11141B, #8B7DFF, #22D3EE, #FB7185, #FB923C, #34D399).
 */
export function HeroGraphCircuitBreaker() {
  const [isResolved, setIsResolved] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [displayScore, setDisplayScore] = useState(99.1);
  const [displayCheckoutScore, setDisplayCheckoutScore] = useState(84.0);

  useEffect(() => {
    const targetScore = isResolved ? 18.2 : 99.1;
    const targetCheckout = isResolved ? 14.5 : 84.0;
    
    let frameId: number;
    const startTime = performance.now();
    const duration = 650;
    const startScore = displayScore;
    const startCheckout = displayCheckoutScore;

    const animateScores = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      
      const nextScore = startScore + (targetScore - startScore) * ease;
      const nextCheckout = startCheckout + (targetCheckout - startCheckout) * ease;
      
      setDisplayScore(Number(nextScore.toFixed(1)));
      setDisplayCheckoutScore(Number(nextCheckout.toFixed(1)));

      if (progress < 1) {
        frameId = requestAnimationFrame(animateScores);
      }
    };

    frameId = requestAnimationFrame(animateScores);
    return () => cancelAnimationFrame(frameId);
  }, [isResolved]);

  // Toggle state
  const handleToggle = () => {
    setIsResolved((prev) => !prev);
  };

  const handleApprove = () => {
    setIsResolved(true);
  };

  const currentScore = displayScore.toFixed(1);
  const currentCheckoutScore = displayCheckoutScore.toFixed(1);

  return (
    <div className="relative w-full max-w-[580px] select-none font-sans">
      {/* Outer Glow / Shading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 -z-20 rounded-3xl bg-[radial-gradient(ellipse_at_center,_rgba(139,125,255,0.18)_0%,_rgba(34,211,238,0.06)_45%,_transparent_75%)] blur-2xl"
      />

      {/* Main Glassmorphic Window Container */}
      <div className="relative rounded-xl border border-[#2E3546] bg-[#0A0C11]/95 text-[#EEF1F7] shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300">
        
        {/* Window Titlebar */}
        <div className="flex items-center justify-between border-b border-[#232937] bg-[#11141B]/90 px-4 py-2.5">
          {/* Left: Window Controls & Workspace ID */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-[#FB7185]/80 inline-block" />
              <span className="size-2.5 rounded-full bg-[#FB923C]/80 inline-block" />
              <span className="size-2.5 rounded-full bg-[#34D399]/80 inline-block" />
            </div>
            <div className="h-3.5 w-px bg-[#2E3546]" />
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#A9B2C5]">
              <Terminal className="size-3 text-[#8B7DFF]" />
              <span className="text-[#8B7DFF] font-semibold">ws_northwind_prod</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400">topology_view</span>
            </div>
          </div>

          {/* Right: State Action Pill */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggle}
              aria-label="Toggle simulation risk state"
              className={cn(
                "group flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[11px] font-medium transition-all duration-200 cursor-pointer",
                isResolved
                  ? "border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399] hover:bg-[#34D399]/20"
                  : "border-[#FB7185]/40 bg-[#FB7185]/10 text-[#FB7185] hover:bg-[#FB7185]/20"
              )}
            >
              <span className="relative flex size-2">
                <span
                  className={cn(
                    "absolute inline-flex size-full animate-ping rounded-full opacity-75",
                    isResolved ? "bg-[#34D399]" : "bg-[#FB7185]"
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex size-2 rounded-full",
                    isResolved ? "bg-[#34D399]" : "bg-[#FB7185]"
                  )}
                />
              </span>
              <span>{isResolved ? "RISK INTERCEPTED / CLEAN GRAPH" : "CASCADE COLLISION"}</span>
              <span className="text-zinc-500 text-[10px] ml-0.5 group-hover:text-zinc-300">
                (Click to toggle)
              </span>
            </button>
          </div>
        </div>

        {/* Viewport Meta Sub-bar */}
        <div className="flex items-center justify-between border-b border-[#232937]/70 bg-[#0D1015] px-4 py-1.5 font-mono text-[10px] text-[#8791A6]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Activity className="size-3 text-[#22D3EE]" />
              <span>FalkorDB Engine: active</span>
            </span>
            <span className="text-zinc-700">|</span>
            <span>Sliding Horizon: 30d</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Pre-Merge Gate:</span>
            <span
              className={cn(
                "font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.2 rounded",
                isResolved ? "bg-[#34D399]/20 text-[#34D399]" : "bg-[#FB7185]/20 text-[#FB7185]"
              )}
            >
              {isResolved ? "PASSED (EXIT 0)" : "BLOCKED (EXIT 1)"}
            </span>
          </div>
        </div>

        {/* Two-Column Split Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#232937] bg-[#0A0C11]">
          
          {/* Left Column: Service Concentration Hotspot (md:col-span-6) */}
          <div className="p-4 md:col-span-6 flex flex-col justify-between space-y-3.5 bg-gradient-to-b from-[#11141B]/40 to-transparent">
            <div>
              {/* Header Badge & Name */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Server className="size-3.5 text-[#8B7DFF]" />
                    <span className="font-mono text-[13px] font-bold text-white tracking-tight">
                      payments-core
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8791A6] font-medium block mt-0.5">
                    Root Settlement Engine
                  </span>
                </div>

                {/* Single Point of Failure Tag */}
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded bg-[#FB7185]/15 border border-[#FB7185]/30 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#FB7185]">
                    SPOF #1
                  </span>
                </div>
              </div>

              {/* Dynamic Risk Metric Banner */}
              <div
                className={cn(
                  "mt-3 rounded-lg border p-2.5 transition-all duration-300",
                  isResolved
                    ? "border-[#34D399]/30 bg-[#34D399]/[0.06]"
                    : "border-[#FB7185]/40 bg-[#FB7185]/[0.08]"
                )}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] font-semibold text-[#A9B2C5] uppercase tracking-wider">
                    Compound Risk Index
                  </span>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span
                      className={cn(
                        "text-2xl font-bold tracking-tight transition-colors duration-300",
                        isResolved ? "text-[#34D399]" : "text-[#FB7185]"
                      )}
                    >
                      {currentScore}
                    </span>
                    <span className="text-[11px] text-[#8791A6]">/ 100</span>
                  </div>
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-[#8791A6]">
                    {isResolved ? "Decoupled via Sam Okafor" : "3 Overlapping Exceptions"}
                  </span>
                  <span
                    className={cn(
                      "font-mono font-medium",
                      isResolved ? "text-[#34D399]" : "text-[#FB7185]"
                    )}
                  >
                    {isResolved ? "-81.9 pts Intercepted" : "P0 Cascading Breach"}
                  </span>
                </div>
              </div>

              {/* Colliding Exceptions List */}
              <div className="mt-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8791A6]">
                    Active Exceptions
                  </span>
                  <span className="font-mono text-[10px] text-[#8B7DFF]">
                    {isResolved ? "1 Active (Controlled)" : "3 Colliding"}
                  </span>
                </div>

                {/* Exception Item 1 */}
                <div className="rounded border border-[#2E3546]/80 bg-[#11141B] p-2 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold text-zinc-200 truncate max-w-[150px]">
                      EXP-2024-089
                    </span>
                    <span className="rounded bg-[#FB7185]/15 border border-[#FB7185]/30 px-1 py-0.2 font-mono text-[9px] font-semibold text-[#FB7185]">
                      CRITICAL
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#A9B2C5] leading-snug line-clamp-1">
                    Gateway Timeout Threshold Override (3500ms)
                  </p>
                  <div className="mt-1.5 flex items-center justify-between font-mono text-[9px] text-[#8791A6]">
                    <span className="text-[#FB923C]">Expires in 4d</span>
                    <span className={cn(isResolved ? "text-[#34D399]" : "text-[#FB7185] font-semibold")}>
                      {isResolved ? "Owner: Sam Okafor" : "Ghost Owner: Priya Raman"}
                    </span>
                  </div>
                </div>

                {/* Exception Item 2 */}
                <div
                  className={cn(
                    "rounded border p-2 transition-colors",
                    isResolved
                      ? "border-[#2E3546]/40 bg-[#11141B]/40 opacity-60"
                      : "border-[#2E3546]/80 bg-[#11141B]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold text-zinc-200 truncate max-w-[150px]">
                      EXP-2024-104
                    </span>
                    <span className="rounded bg-[#FB923C]/15 border border-[#FB923C]/30 px-1 py-0.2 font-mono text-[9px] font-semibold text-[#FB923C]">
                      HIGH
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#A9B2C5] leading-snug line-clamp-1">
                    Idempotency Ledger Skip on Retry
                  </p>
                  <div className="mt-1.5 flex items-center justify-between font-mono text-[9px] text-[#8791A6]">
                    <span>12d overdue</span>
                    <span>Squad Settlement</span>
                  </div>
                </div>

                {/* Exception Item 3 */}
                <div
                  className={cn(
                    "rounded border p-2 transition-colors",
                    isResolved
                      ? "border-[#2E3546]/40 bg-[#11141B]/40 opacity-60"
                      : "border-[#2E3546]/80 bg-[#11141B]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold text-zinc-200 truncate max-w-[150px]">
                      EXP-2024-118
                    </span>
                    <span className="rounded bg-[#34D399]/15 border border-[#34D399]/30 px-1 py-0.2 font-mono text-[9px] font-semibold text-[#34D399]">
                      LOW
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#A9B2C5] leading-snug line-clamp-1">
                    Load Spike Concurrency Cap Waiver
                  </p>
                </div>
              </div>
            </div>

            {/* Ghost Owner Warning Strip */}
            <div
              className={cn(
                "rounded border p-2 flex items-center gap-2 font-mono text-[10px] transition-all",
                isResolved
                  ? "border-[#34D399]/30 bg-[#34D399]/5 text-[#34D399]"
                  : "border-[#FB7185]/30 bg-[#FB7185]/10 text-[#FB7185]"
              )}
            >
              {isResolved ? (
                <>
                  <UserCheck className="size-3.5 text-[#34D399] shrink-0" />
                  <span className="truncate">Handed off to Sam Okafor (Staff SRE)</span>
                </>
              ) : (
                <>
                  <FileWarning className="size-3.5 text-[#FB7185] shrink-0" />
                  <span className="truncate">Priya Raman departed 64 days ago (Orphaned)</span>
                </>
              )}
            </div>
          </div>

          {/* Right Column: FalkorDB Graph Proof Path Mini-Canvas (md:col-span-6) */}
          <div className="p-4 md:col-span-6 flex flex-col justify-between bg-[#0D1015]/70 relative overflow-hidden">
            {/* Background Grid Accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#8B7DFF_1px,transparent_1px),linear-gradient(to_bottom,#8B7DFF_1px,transparent_1px)] bg-[size:16px_16px]"
            />

            <div>
              {/* Proof Path Header */}
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-1.5">
                  <Layers className="size-3.5 text-[#22D3EE]" />
                  <span className="font-mono text-[11px] font-bold text-[#EEF1F7] uppercase tracking-wider">
                    FalkorDB Proof Path
                  </span>
                </div>
                <span className="rounded bg-[#22D3EE]/10 border border-[#22D3EE]/30 px-1.5 py-0.5 font-mono text-[9px] text-[#22D3EE] font-semibold">
                  2 HOPS TO REVENUE
                </span>
              </div>

              {/* Interactive Topological Nodes Diagram */}
              <div className="relative py-2 flex flex-col items-center z-10 min-h-[250px] justify-between">
                
                {/* SVG Connectors Canvas */}
                <svg
                  className="absolute inset-0 size-full pointer-events-none overflow-visible"
                  viewBox="0 0 250 240"
                  fill="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="cascadeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B7DFF" />
                      <stop offset="50%" stopColor={isResolved ? "#22D3EE" : "#FB7185"} />
                      <stop offset="100%" stopColor={isResolved ? "#34D399" : "#FB7185"} />
                    </linearGradient>

                    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Orthogonal Link 1: Customer Path -> checkout-api */}
                  <path
                    d="M 125 38 L 125 78"
                    stroke={isResolved ? "#22D3EE" : "#FB7185"}
                    strokeWidth="2"
                    strokeDasharray={isResolved ? "none" : "4 3"}
                    className={cn(!isResolved && "motion-safe:animate-pulse")}
                  />

                  {/* Orthogonal Link 2: checkout-api -> payments-core */}
                  <path
                    d="M 125 128 L 125 168"
                    stroke={isResolved ? "#22D3EE" : "url(#cascadeGrad)"}
                    strokeWidth="2.5"
                    filter="url(#glowEffect)"
                  />

                  {/* Pulsing Particle along connector */}
                  <circle
                    r="3.5"
                    fill={isResolved ? "#22D3EE" : "#FB7185"}
                    className="motion-safe:animate-bounce"
                  >
                    <animateMotion
                      path="M 125 38 L 125 168"
                      dur={isResolved ? "3s" : "1.2s"}
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>

                {/* Node 1: Customer Checkout Path (Root Tier-1 Revenue Node) */}
                <div className="w-full max-w-[210px] rounded border border-[#8B7DFF]/40 bg-[#11141B] p-2 shadow-lg hover:border-[#8B7DFF] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#8B7DFF]" />
                      <span className="font-mono text-[11px] font-semibold text-white">
                        Customer Path
                      </span>
                    </div>
                    <span className="rounded bg-[#8B7DFF]/15 px-1 py-0.2 font-mono text-[8px] text-[#8B7DFF] font-bold uppercase">
                      P0 Revenue
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[9px] text-[#8791A6] font-mono">
                    <span>Edge: Ingress API</span>
                    <span className="text-[#34D399] font-medium">99.99% SLO</span>
                  </div>
                </div>

                {/* Node 2: checkout-api (Service Hop) */}
                <div className="w-full max-w-[210px] rounded border border-[#2E3546] bg-[#11141B] p-2 shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "size-2 rounded-full transition-colors",
                          isResolved ? "bg-[#22D3EE]" : "bg-[#FB923C]"
                        )}
                      />
                      <span className="font-mono text-[11px] font-semibold text-white">
                        checkout-api
                      </span>
                    </div>
                    <span
                      className={cn(
                        "rounded px-1 py-0.2 font-mono text-[9px] font-bold border transition-colors",
                        isResolved
                          ? "bg-[#34D399]/10 border-[#34D399]/30 text-[#34D399]"
                          : "bg-[#FB923C]/10 border-[#FB923C]/30 text-[#FB923C]"
                      )}
                    >
                      Risk: {currentCheckoutScore}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[9px] text-[#8791A6] font-mono">
                    <span>PR #482 Gate</span>
                    <span className={cn(isResolved ? "text-[#34D399]" : "text-[#FB923C]")}>
                      {isResolved ? "Cascade Cleared" : "1 Upstream Blocker"}
                    </span>
                  </div>
                </div>

                {/* Node 3: payments-core (Target Concentration Anchor) */}
                <div
                  className={cn(
                    "w-full max-w-[210px] rounded border p-2 shadow-lg transition-all relative",
                    isResolved
                      ? "border-[#34D399]/40 bg-[#11141B]"
                      : "border-[#FB7185]/60 bg-[#FB7185]/10 shadow-[0_0_15px_rgba(251,113,133,0.15)]"
                  )}
                >
                  {/* Shockwave indicator when blocked */}
                  {!isResolved && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-1 -right-1 flex size-3"
                    >
                      <span className="animate-ping absolute inline-flex size-full rounded-full bg-[#FB7185] opacity-75" />
                      <span className="relative inline-flex rounded-full size-3 bg-[#FB7185]" />
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          isResolved ? "bg-[#34D399]" : "bg-[#FB7185]"
                        )}
                      />
                      <span className="font-mono text-[11px] font-bold text-white">
                        payments-core
                      </span>
                    </div>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.2 font-mono text-[9px] font-bold border",
                        isResolved
                          ? "bg-[#34D399]/10 border-[#34D399]/30 text-[#34D399]"
                          : "bg-[#FB7185]/20 border-[#FB7185]/40 text-[#FB7185]"
                      )}
                    >
                      Score: {currentScore}
                    </span>
                  </div>

                  <div className="mt-1 text-[9px] font-mono flex items-center justify-between text-[#8791A6]">
                    <span>Settlement Cluster</span>
                    <span className={cn(isResolved ? "text-[#34D399]" : "text-[#FB7185]")}>
                      {isResolved ? "Shield Active" : "Cascade Center"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Proof Path Telemetry Footer */}
            <div className="mt-2 border-t border-[#232937] pt-2 flex items-center justify-between text-[10px] font-mono text-[#8791A6]">
              <span className="flex items-center gap-1">
                <Zap className="size-3 text-[#22D3EE]" />
                <span>Traversal: 12ms</span>
              </span>
              <span className="text-zinc-500">Deterministic R4+R8 Rules</span>
            </div>
          </div>
        </div>

        {/* Bottom: Autonomous Steward AI Agent Action Proposal Card */}
        <div className="border-t border-[#232937] bg-[#11141B] p-3.5 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Steward Agent Avatar & Proposal Text */}
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="relative size-8 rounded-lg bg-gradient-to-br from-[#8B7DFF]/30 to-[#5848E5]/50 border border-[#8B7DFF]/40 flex items-center justify-center shrink-0">
                <Sparkles className="size-4 text-[#8B7DFF]" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-[#34D399] ring-2 ring-[#11141B]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-white tracking-wide">
                    Steward AI Agent
                  </span>
                  <span className="rounded bg-[#8B7DFF]/15 px-1.5 py-0.2 font-mono text-[9px] text-[#8B7DFF] font-semibold">
                    ProposedAction
                  </span>
                  {isResolved && (
                    <span className="rounded bg-[#34D399]/15 text-[#34D399] px-1.5 py-0.2 font-mono text-[9px] font-bold">
                      EXECUTED
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-[#A9B2C5] leading-snug">
                  {isResolved ? (
                    <span className="text-[#34D399]">
                      ✓ Exception reassigned to Sam Okafor (Staff SRE). Pre-merge PR #482 unlocked.
                    </span>
                  ) : (
                    <>
                      Priya Raman left 64d ago. Reassign orphaned settlement waiver to{" "}
                      <strong className="text-white font-medium">Sam Okafor</strong>?
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Interactive Buttons [Approve] & [Review] */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {isResolved ? (
                <button
                  type="button"
                  onClick={handleToggle}
                  className="flex items-center gap-1.5 rounded border border-[#2E3546] bg-[#0D1015] px-3 py-1.5 font-mono text-[11px] font-medium text-[#A9B2C5] hover:border-[#8B7DFF] hover:text-white transition-all cursor-pointer"
                >
                  <RotateCcw className="size-3 text-[#8B7DFF]" />
                  <span>Reset Collision</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsReviewOpen(!isReviewOpen)}
                    className="rounded border border-[#2E3546] bg-[#0D1015] px-3 py-1.5 font-mono text-[11px] font-medium text-[#A9B2C5] hover:border-[#8791A6] hover:text-white transition-all cursor-pointer"
                  >
                    {isReviewOpen ? "Close Details" : "Review Proof"}
                  </button>

                  <button
                    type="button"
                    onClick={handleApprove}
                    className="flex items-center gap-1.5 rounded border border-[#5848E5] bg-[#5848E5] px-3.5 py-1.5 font-mono text-[11px] font-bold text-white shadow-md shadow-[#5848E5]/30 hover:bg-[#8B7DFF] hover:border-[#8B7DFF] transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Approve</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Collapsible Review Details (when Review Proof is clicked) */}
          {isReviewOpen && !isResolved && (
            <div className="mt-3 rounded border border-[#2E3546] bg-[#0D1015] p-2.5 font-mono text-[10px] text-[#A9B2C5] animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[#8B7DFF] font-semibold mb-1">
                <span>CYPHER PROOF AUDIT</span>
                <span>MATCH (p:Person {`{id: 'priya_raman'}`})</span>
              </div>
              <p className="text-[#8791A6] text-[10px] leading-relaxed">
                Platform Graph verified Priya Raman inactive in platform_users since 2026-08-12.
                Candidate Sam Okafor is active Owner of Squad Settlement with L5 approval rights.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Optical Symmetry Sub-caption */}
      <div className="mt-2.5 flex items-center justify-between px-2 font-mono text-[11px] text-[#8791A6]">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[#8B7DFF]" />
          <span>FalkorDB Three-Graph Model</span>
        </div>
        <span>Deterministic Rule R4: Concentration Centrality</span>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, ArrowRight, ShieldCheck, AlertTriangle, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IncidentWipeData {
  id: string;
  target: string;
  date: string;
  sourceUrl: string;
  sourceLabel: string;
  lossFigure: string;
  whatHappened: string;
  withReprieve: string;
  rules: string[];
}

const INCIDENTS: IncidentWipeData[] = [
  {
    id: "crowdstrike",
    target: "CrowdStrike Falcon Sensor",
    date: "July 2024",
    sourceUrl: "https://www.crowdstrike.com/falcon-content-update-remediation-and-guidance-hub/",
    sourceLabel: "Official CrowdStrike PIR",
    lossFigure: "8.5M Systems Crashed",
    whatHappened:
      "A content update in Channel File 291 passed syntax checks but skipped staged rollout, triggering out-of-bounds reads directly on the kernel path.",
    withReprieve:
      "Blocks direct push to high-blast services. Pre-merge AST scanner forces phased rollout gates whenever changes touch root operating dependencies.",
    rules: ["Rule R4: Service Concentration", "Rule R8: Customer-Path Exposure"],
  },
  {
    id: "change-healthcare",
    target: "Change Healthcare (UnitedHealth)",
    date: "February 2024",
    sourceUrl: "https://www.finance.senate.gov/hearings/hacking-healthcare-examining-the-change-healthcare-cyberattack-and-its-impact-on-the-nation",
    sourceLabel: "Senate Hearing & SEC 8-K",
    lossFigure: "$1.6B Claims Freeze",
    whatHappened:
      "An unmonitored legacy Citrix portal had no MFA enabled—a forgotten policy exception left behind after a corporate merger with zero active owner.",
    withReprieve:
      "Flags unowned systems and expired policy exceptions. Sentinel alerts security teams before dormant, single-factor backdoors reach production.",
    rules: ["Rule R2: Ghost Owner", "Rule R7: Broken Compensating Control"],
  },
  {
    id: "square-block",
    target: "Square (Block, Inc.)",
    date: "September 2023",
    sourceUrl: "https://status.square.com/",
    sourceLabel: "Official Square PIR",
    lossFigure: "24-Hour Checkout Outage",
    whatHappened:
      "An internal firewall update coincided with a DNS server upgrade, exhausting DNS capacity and severing microservices from checkout payment gateways.",
    withReprieve:
      "Detects compound change collisions. Halts deployments when concurrent infrastructure updates intersect on shared resolution paths.",
    rules: ["Rule R4: Service Concentration", "Rule R6: High-Blast Wave"],
  },
];

interface IncidentThumbnailMeta {
  docCode: string;
  docTitle: string;
  attribution: string;
}

const THUMBNAILS: Record<string, IncidentThumbnailMeta> = {
  crowdstrike: {
    docCode: "PIR-2024-07",
    docTitle: "Channel File 291 Review",
    attribution: "CrowdStrike PIR",
  },
  "change-healthcare": {
    docCode: "SENATE-UHG-2024",
    docTitle: "Senate Finance Hearing",
    attribution: "Senate Record & SEC 8-K",
  },
  "square-block": {
    docCode: "BLOCK-PIR-2023",
    docTitle: "DNS & Firewall PIR",
    attribution: "Block Engineering PIR",
  },
};

function IncidentWipeBand({ incident }: { incident: IncidentWipeData }) {
  const [sliderPos, setSliderPos] = useState(50);
  const thumb = THUMBNAILS[incident.id];

  return (
    <div className="rounded-none border border-white/[0.08] bg-[#0c0d12] p-5 sm:p-7 shadow-xl space-y-5">
      {/* Top Header: Company, Date, Thumbnail Slot & Verified Official Source */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          {/* Document Thumbnail Slot */}
          <div
            className="group relative flex h-12 w-16 shrink-0 flex-col justify-between overflow-hidden rounded-none border border-white/15 bg-[#141620] p-1.5 shadow-inner transition-colors hover:border-brand/50"
            title={`${thumb?.attribution ?? "Official Document"}: ${thumb?.docTitle ?? incident.sourceLabel}`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-0.5">
              <span className="font-mono text-[8px] font-bold tracking-tight text-brand">
                {thumb?.docCode ?? "DOC"}
              </span>
              <FileText className="size-2.5 text-zinc-400" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <div className="h-0.5 w-full bg-white/20" />
              <div className="h-0.5 w-3/4 bg-white/15" />
            </div>
            <span className="font-mono text-[7px] text-zinc-400 truncate">
              {thumb?.attribution ?? "Public Source"}
            </span>
          </div>

          <div>
            <h3 className="font-display text-[1.25rem] font-bold text-white flex items-center gap-2">
              {incident.target}
              <span className="font-mono text-[12px] font-normal text-zinc-400">({incident.date})</span>
            </h3>
            <span className="font-mono text-[11px] text-zinc-400">
              Verified Public Record · Official Incident Post-Mortem
            </span>
          </div>
        </div>

        {/* Official Source Link */}
        <a
          href={incident.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-none border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[12px] font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-brand"
        >
          <span>{incident.sourceLabel}</span>
          <ExternalLink className="size-3 text-zinc-400" aria-hidden="true" />
        </a>
      </div>

      {/* Interactive Wipe Band Container */}
      <div className="relative rounded-none border border-white/[0.08] bg-[#08090c] p-4 sm:p-6 overflow-hidden select-none">
        {/* Dynamic Desktop Reveal Layout */}
        <div className="hidden md:flex gap-0 items-stretch min-h-[170px] relative">
          {/* Left Pane: What Happened (Catastrophic Loss) */}
          <div
            style={{ width: `${sliderPos}%` }}
            className="overflow-hidden pr-6 space-y-3 transition-[width] duration-75 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="size-3.5 text-red-400" aria-hidden="true" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-red-400">
                  The Root Failure
                </span>
              </div>
              {/* Money First: Prominent Catastrophic Metric */}
              <div className="mt-2 font-mono text-2xl lg:text-3xl font-bold tracking-tight text-red-400 leading-none truncate">
                {incident.lossFigure}
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-zinc-300 line-clamp-3">
                {incident.whatHappened}
              </p>
            </div>
            <span className="font-mono text-[10px] uppercase text-zinc-500">Documented Incident Breakdown</span>
          </div>

          {/* Interactive Draggable Seam / Vertical Divider */}
          <div className="relative flex items-center justify-center w-3 shrink-0 cursor-ew-resize group">
            <div className="h-full w-[2px] bg-white/15 group-hover:bg-brand transition-colors" />
            <div className="absolute top-1/2 -translate-y-1/2 size-5 rounded-none border border-white/20 bg-[#121318] flex items-center justify-center shadow-md text-zinc-400 group-hover:text-white group-hover:border-brand">
              <span className="font-mono text-[8px] font-bold">↔</span>
            </div>
          </div>

          {/* Right Pane: With Reprieve (Accent Interception) */}
          <div
            style={{ width: `${100 - sliderPos}%` }}
            className="overflow-hidden pl-6 space-y-3 transition-[width] duration-75 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-brand" aria-hidden="true" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand">
                  How Reprieve Prevents This
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {incident.rules.map((rule) => (
                  <span
                    key={rule}
                    className="rounded-none border border-brand/30 bg-brand/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand whitespace-nowrap"
                  >
                    {rule}
                  </span>
                ))}
              </div>
              <div className="mt-2.5 font-display text-lg lg:text-xl font-bold tracking-tight text-white leading-tight">
                Pre-Merge Gate Halts Deployment
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-zinc-300 line-clamp-3">
                {incident.withReprieve}
              </p>
            </div>
            <span className="font-mono text-[10px] uppercase text-brand font-semibold">Deterministic Graph Interception</span>
          </div>
        </div>

        {/* Mobile View: Vertical Stack Ensuring High Legibility (390px Safe) */}
        <div className="flex md:hidden flex-col gap-5">
          <div className="rounded-none border border-red-500/20 bg-red-950/10 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-red-400">
              <AlertTriangle className="size-3.5" aria-hidden="true" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider">The Root Failure</span>
            </div>
            <div className="font-mono text-xl font-bold text-red-400">
              {incident.lossFigure}
            </div>
            <p className="text-[13px] leading-relaxed text-zinc-300">
              {incident.whatHappened}
            </p>
          </div>

          <div className="rounded-none border border-brand/20 bg-brand/5 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-brand">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider">How Reprieve Prevents This</span>
            </div>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {incident.rules.map((rule) => (
                <span
                  key={rule}
                  className="rounded-none border border-brand/30 bg-brand/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand"
                >
                  {rule}
                </span>
              ))}
            </div>
            <div className="font-display text-base font-bold text-white pt-1">
              Pre-Merge Gate Halts Deployment
            </div>
            <p className="text-[13px] leading-relaxed text-zinc-300">
              {incident.withReprieve}
            </p>
          </div>
        </div>

        {/* Accessible Keyboard-Operable Range Divider (Desktop Only) */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] hidden md:flex items-center justify-between gap-4">
          <label
            htmlFor={`wipe-range-${incident.id}`}
            className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider shrink-0"
          >
            Interactive Prevention Wipe:
          </label>
          <div className="flex-1 max-w-sm">
            <input
              id={`wipe-range-${incident.id}`}
              type="range"
              min="20"
              max="80"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label={`Interactive prevention wipe divider for ${incident.target}`}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand focus-visible:outline-2 focus-visible:outline-brand"
            />
          </div>
          <span className="font-mono text-[11px] text-zinc-400 w-16 text-right tabular-nums">
            {sliderPos}% / {100 - sliderPos}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function CaseStudiesSection() {
  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 sm:py-32"
    >
      {/* Section Header */}
      <div className="max-w-3xl space-y-2 mb-10 text-left">
        <span className="text-[12px] font-mono uppercase tracking-[0.1em] text-zinc-400 font-semibold">
          INCIDENT POST-MORTEMS · ROOT CAUSE ANALYSIS
        </span>
        <h2 id="case-studies-heading" className="text-[2.25rem] sm:text-[2.75rem] font-display font-bold text-white tracking-tight leading-[1.15]">
          How graph governance prevents systemic outages
        </h2>
        <p className="text-[1.05rem] text-zinc-300 leading-relaxed">
          Real-world engineering disasters from top tech companies. Here is how Reprieve&apos;s deterministic graph rules intercept these failure modes before code merges.
        </p>
      </div>

      {/* 3 Full-Width Incident Wipe Bands */}
      <div className="space-y-6">
        {INCIDENTS.map((incident) => (
          <IncidentWipeBand key={incident.id} incident={incident} />
        ))}
      </div>

      {/* Dedicated Standalone Simulation Strip (Separated from Documented Incidents) */}
      <div className="mt-8 rounded-none border border-brand/30 bg-[#0f1019] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded-none bg-brand/15 border border-brand/30 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-brand">
                SIMULATED BENCHMARK
              </span>
              <span className="font-mono text-[12px] text-zinc-400">185 Microservices · $40M Daily Volume</span>
            </div>
            <h3 className="text-[1.25rem] font-display font-bold text-white">
              Try It Yourself: Interactive Sandbox Simulation
            </h3>
            <p className="text-[14px] text-zinc-300 leading-relaxed">
              Explore four colliding Cyber Monday waivers 2 hops from customer checkout. Test all 8 detection rules, inspect shortest proof paths, and run temporal collision scrubbers with zero login required.
            </p>
          </div>

          <div className="shrink-0">
            <Button asChild size="lg" className="rounded-none bg-brand-solid text-white hover:bg-brand-solid/90 shadow-lg px-6 font-semibold">
              <Link href="/w/northwind-pay/home">
                Launch Live Sandbox (0 Login)
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

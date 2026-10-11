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
    sourceLabel: "Official CrowdStrike PIR & Hub",
    lossFigure: "8.5M Systems Crashed",
    whatHappened:
      "A template update in Channel File 291 passed isolated syntax validation but bypassed phased rollout, triggering out-of-bounds reads and cascading kernel panics globally.",
    withReprieve:
      "Pre-merge AST scanner detects bypass on root dependency paths with zero isolation before merge.",
    rules: ["Rule R4: Service Concentration", "Rule R8: Customer-Path Exposure"],
  },
  {
    id: "knight-capital",
    target: "Knight Capital Group",
    date: "August 2012",
    sourceUrl: "https://www.sec.gov/newsroom/press-releases/2013-222",
    sourceLabel: "SEC Release No. 2013-222",
    lossFigure: "$440M Lost in 45 Min",
    whatHappened:
      "Repurposed retired 'Power Peg' flag deployed onto 7 of 8 servers; omitted node ran dormant unowned test code executing millions of unintended market orders.",
    withReprieve:
      "Sentinel halts deployment immediately upon detecting a retired flag bound to an inactive owner.",
    rules: ["Rule R2: Ghost Owner", "Rule R5: Renewal Treadmill"],
  },
  {
    id: "gitlab",
    target: "GitLab Database Outage",
    date: "January 2017",
    sourceUrl: "https://about.gitlab.com/blog/gitlab-dot-com-database-incident/",
    sourceLabel: "GitLab Public Incident Report",
    lossFigure: "300GB Primary Desync",
    whatHappened:
      "Automated backup verification routines were temporarily disabled during replication lag; engineer accidental deletion on primary had zero live compensating controls.",
    withReprieve:
      "Graph model identifies that waiving backup verifiers during degraded primary load completely eliminates safety margin.",
    rules: ["Rule R3: Shared Fallback Bottleneck", "Rule R7: Broken Compensating Control"],
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
    attribution: "Official CrowdStrike PIR",
  },
  "knight-capital": {
    docCode: "SEC 3-15570",
    docTitle: "Release No. 2013-222",
    attribution: "SEC Official Filing",
  },
  gitlab: {
    docCode: "INC-2017-0131",
    docTitle: "Database Incident Report",
    attribution: "GitLab Public Postmortem",
  },
};

function IncidentWipeBand({ incident }: { incident: IncidentWipeData }) {
  const [sliderPos, setSliderPos] = useState(50);
  const thumb = THUMBNAILS[incident.id];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d12] p-5 sm:p-7 shadow-xl space-y-5">
      {/* Top Header: Company, Date, Thumbnail Slot & Verified Official Source */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          {/* Document Thumbnail Slot */}
          <div
            className="group relative flex h-12 w-16 shrink-0 flex-col justify-between overflow-hidden rounded-md border border-white/15 bg-[#141620] p-1.5 shadow-inner transition-colors hover:border-brand/50"
            title={`${thumb?.attribution ?? "Official Document"}: ${thumb?.docTitle ?? incident.sourceLabel}`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-0.5">
              <span className="font-mono text-[8px] font-bold tracking-tight text-brand">
                {thumb?.docCode ?? "DOC"}
              </span>
              <FileText className="size-2.5 text-zinc-400" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <div className="h-0.5 w-full rounded bg-white/20" />
              <div className="h-0.5 w-3/4 rounded bg-white/15" />
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
              Verified Public Source · Official Post-Mortem
            </span>
          </div>
        </div>

        {/* Official Source Link */}
        <a
          href={incident.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[12px] font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-brand"
        >
          <span>{incident.sourceLabel}</span>
          <ExternalLink className="size-3 text-zinc-400" aria-hidden="true" />
        </a>
      </div>

      {/* Interactive Wipe Band Container */}
      <div className="relative rounded-xl border border-white/[0.08] bg-[#08090c] p-4 sm:p-6 overflow-hidden select-none">
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
                  What Happened
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
            <span className="font-mono text-[10px] uppercase text-zinc-400">Historical Disruption</span>
          </div>

          {/* Interactive Draggable Seam / Vertical Divider */}
          <div className="relative flex items-center justify-center w-3 shrink-0 cursor-ew-resize group">
            <div className="h-full w-[2px] bg-white/15 group-hover:bg-brand transition-colors" />
            <div className="absolute top-1/2 -translate-y-1/2 size-5 rounded-full border border-white/20 bg-[#121318] flex items-center justify-center shadow-md text-zinc-400 group-hover:text-white group-hover:border-brand">
              <span className="font-mono text-[8px] font-bold">↔</span>
            </div>
          </div>

          {/* Right Pane: With Reprieve (Accent Interception) */}
          <div
            style={{ width: `${100 - sliderPos}%` }}
            className="overflow-hidden pl-6 space-y-3 transition-[width] duration-75 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-brand" aria-hidden="true" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand">
                    With Reprieve
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {incident.rules.map((rule) => (
                    <span
                      key={rule}
                      className="rounded border border-brand/30 bg-brand/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand whitespace-nowrap"
                    >
                      {rule}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-2 font-display text-lg lg:text-xl font-bold tracking-tight text-white leading-tight">
                Blocked Pre-Merge Before Customer Impact
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-zinc-300 line-clamp-3">
                {incident.withReprieve}
              </p>
            </div>
            <span className="font-mono text-[10px] uppercase text-brand font-semibold">Graph Governance Invariant</span>
          </div>
        </div>

        {/* Mobile View: Vertical Stack Ensuring High Legibility (390px Safe) */}
        <div className="flex md:hidden flex-col gap-5">
          <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-red-400">
              <AlertTriangle className="size-3.5" aria-hidden="true" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider">What Happened</span>
            </div>
            <div className="font-mono text-xl font-bold text-red-400">
              {incident.lossFigure}
            </div>
            <p className="text-[13px] leading-relaxed text-zinc-300">
              {incident.whatHappened}
            </p>
          </div>

          <div className="rounded-lg border border-brand/20 bg-brand/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-brand">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider">With Reprieve</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {incident.rules.map((rule) => (
                  <span
                    key={rule}
                    className="rounded border border-brand/30 bg-brand/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            </div>
            <div className="font-display text-base font-bold text-white">
              Blocked Pre-Merge Before Customer Impact
            </div>
            <p className="text-[13px] leading-relaxed text-zinc-300">
              {incident.withReprieve}
            </p>
          </div>
        </div>

        {/* Accessible Keyboard-Operable Range Divider */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
          <label
            htmlFor={`wipe-range-${incident.id}`}
            className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider shrink-0"
          >
            Interactive Wipe Divider:
          </label>
          <div className="flex-1 max-w-sm">
            <input
              id={`wipe-range-${incident.id}`}
              type="range"
              min="20"
              max="80"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label={`Interactive comparison wipe divider for ${incident.target}`}
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
      <div className="max-w-3xl space-y-4 mb-14 text-left">
        <span className="text-[12px] font-mono uppercase tracking-[0.1em] text-zinc-400 font-semibold">
          DOCUMENTED OUTAGE POST-MORTEMS
        </span>
        <h2 id="case-studies-heading" className="text-[2.25rem] sm:text-[2.75rem] font-display font-bold text-white tracking-tight leading-[1.15]">
          How Graph Governance Intercepts Real Disasters
        </h2>
        <p className="text-[1.125rem] text-zinc-300 leading-relaxed">
          Major outages rarely stem from a single broken function. They collide across microservice boundaries. Here is how Reprieve&apos;s deterministic rules model and intercept documented public incidents.
        </p>
      </div>

      {/* 3 Full-Width Incident Wipe Bands */}
      <div className="space-y-6">
        {INCIDENTS.map((incident) => (
          <IncidentWipeBand key={incident.id} incident={incident} />
        ))}
      </div>

      {/* Dedicated Standalone Simulation Strip (Separated from Documented Incidents) */}
      <div className="mt-8 rounded-2xl border border-brand/30 bg-[#0f1019] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded bg-brand/15 border border-brand/30 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-brand">
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
            <Button asChild size="lg" className="bg-brand-solid text-white hover:bg-brand-solid/90 shadow-lg px-6 font-semibold">
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

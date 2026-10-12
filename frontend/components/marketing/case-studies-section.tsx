"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StackingCard, type ProjectData } from "@/components/ui/stacking-card";

export const INCIDENTS: ProjectData[] = [
  {
    id: "crowdstrike",
    title: "CrowdStrike Falcon Sensor",
    target: "CrowdStrike Falcon Sensor",
    date: "July 2024",
    lossFigure: "8.5M Systems Crashed",
    link: "https://www.crowdstrike.com/falcon-content-update-remediation-and-guidance-hub/",
    sourceUrl: "https://www.crowdstrike.com/falcon-content-update-remediation-and-guidance-hub/",
    sourceLabel: "Official CrowdStrike PIR",
    sourceDomain: "crowdstrike.com",
    articleImage: "/articles/crowdstrike-pir.png",
    description:
      "A rapid-response content update in Channel File 291 passed syntax gates but skipped staged rollout, triggering an out-of-bounds memory read directly on the kernel path.",
    whatHappened:
      "A rapid-response content update in Channel File 291 passed syntax gates but skipped staged rollout, triggering an out-of-bounds memory read directly on the kernel path.",
    withReprieve:
      "Blocks direct pushes to high-blast services. Pre-merge AST scanner forces phased rollout gates whenever changes touch root operating dependencies.",
    rules: ["Rule R4: Service Concentration", "Rule R8: Customer-Path Exposure"],
    color: "#0b0c13",
    borderClass: "border-red-500/20 hover:border-red-500/35",
    glowGradient: "from-red-500/10 via-transparent to-transparent",
    lossColor: "text-red-400 bg-red-500/10 border-red-500/25",
  },
  {
    id: "change-healthcare",
    title: "Change Healthcare (UnitedHealth)",
    target: "Change Healthcare (UnitedHealth)",
    date: "February 2024",
    lossFigure: "$1.6B Claims Freeze",
    link: "https://www.unitedhealthgroup.com/content/dam/UHG/PDF/2024/UHG-Change-Healthcare-Incident-Overview.pdf",
    sourceUrl: "https://www.unitedhealthgroup.com/content/dam/UHG/PDF/2024/UHG-Change-Healthcare-Incident-Overview.pdf",
    sourceLabel: "Official UHG Incident Release",
    sourceDomain: "unitedhealthgroup.com",
    articleImage: "/articles/change-healthcare-pir.png",
    description:
      "An unmonitored legacy Citrix portal had no MFA enabled—a forgotten policy exception left behind after a corporate merger with zero active owner.",
    whatHappened:
      "An unmonitored legacy Citrix portal had no MFA enabled—a forgotten policy exception left behind after a corporate merger with zero active owner.",
    withReprieve:
      "Flags unowned systems and expired policy exceptions. Sentinel alerts security teams before dormant, single-factor backdoors reach production.",
    rules: ["Rule R2: Ghost Owner", "Rule R7: Broken Compensating Control"],
    color: "#0c0d16",
    borderClass: "border-amber-500/20 hover:border-amber-500/35",
    glowGradient: "from-amber-500/10 via-transparent to-transparent",
    lossColor: "text-amber-400 bg-amber-500/10 border-amber-500/25",
  },
  {
    id: "square-block",
    title: "Square (Block, Inc.)",
    target: "Square (Block, Inc.)",
    date: "September 2023",
    lossFigure: "24-Hour Checkout Outage",
    link: "https://developer.squareup.com/blog/incident-summary-2023-09-07",
    sourceUrl: "https://developer.squareup.com/blog/incident-summary-2023-09-07",
    sourceLabel: "Official Square Engineering PIR",
    sourceDomain: "developer.squareup.com",
    articleImage: "/articles/square-pir.png",
    description:
      "An internal firewall update coincided with a DNS server upgrade, exhausting DNS capacity and severing microservices from checkout payment gateways.",
    whatHappened:
      "An internal firewall update coincided with a DNS server upgrade, exhausting DNS capacity and severing microservices from checkout payment gateways.",
    withReprieve:
      "Detects compound change collisions. Halts deployments when concurrent infrastructure updates intersect on shared resolution paths.",
    rules: ["Rule R4: Service Concentration", "Rule R6: High-Blast Wave"],
    color: "#0d0e1a",
    borderClass: "border-brand/30 hover:border-brand/45",
    glowGradient: "from-brand/15 via-transparent to-transparent",
    lossColor: "text-brand bg-brand/10 border-brand/30",
  },
];

export function CaseStudiesSection() {
  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className="mx-auto max-w-[1280px] px-4 sm:px-8 py-16 sm:py-24"
    >
      {/* Section Header */}
      <div className="max-w-3xl space-y-2 mb-8 text-left">
        <span className="text-[12px] font-mono uppercase tracking-[0.1em] text-zinc-400 font-semibold">
          INCIDENT POST-MORTEMS · ROOT CAUSE ANALYSIS
        </span>
        <h2
          id="case-studies-heading"
          className="text-[2.25rem] sm:text-[2.75rem] font-display font-bold text-white tracking-tight leading-[1.15]"
        >
          How graph governance prevents systemic outages
        </h2>
        <p className="text-[1.05rem] text-zinc-300 leading-relaxed">
          Real-world engineering disasters from top tech companies. Here is how
          Reprieve&apos;s deterministic graph rules intercept these failure modes
          before code merges.
        </p>
      </div>

      {/* Interactive Stacking Cards Sequence via UI Component */}
      <StackingCard projects={INCIDENTS} />

      {/* Dedicated Standalone Simulation Strip */}
      <div className="mt-8 rounded-2xl border border-brand/30 bg-[#0f1019] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-brand/15 border border-brand/30 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-brand">
                SIMULATED BENCHMARK
              </span>
              <span className="font-mono text-[12px] text-zinc-400">
                185 Microservices · $40M Daily Volume
              </span>
            </div>
            <h3 className="text-[1.25rem] font-display font-bold text-white">
              Try It Yourself: Interactive Sandbox Simulation
            </h3>
            <p className="text-[14px] text-zinc-300 leading-relaxed">
              Explore four colliding Cyber Monday waivers 2 hops from customer
              checkout. Test all 8 detection rules, inspect shortest proof paths,
              and run temporal collision scrubbers with zero login required.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-brand-solid text-white hover:bg-brand-solid/90 shadow-lg px-6 font-semibold"
            >
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

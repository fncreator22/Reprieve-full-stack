"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  FileText,
  Route,
  ShieldAlert,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CaseStudiesSectionProps {
  onBookCall: () => void;
}

interface IncidentAnalysis {
  badge: string;
  target: string;
  scope: string;
  title: string;
  sourceUrl?: string;
  sourceLabel?: string;
  sandboxHref?: string;
  crisisSummary: string;
  repreveInterception: string;
  cypherRules: string[];
  proofChain: string[];
  engineeringLesson: string;
}

const DOCUMENTED_INCIDENTS: IncidentAnalysis[] = [
  {
    badge: "Public Incident Analysis",
    target: "CrowdStrike Falcon Sensor",
    scope: "8.5M Systems Crashed · Global Outage (July 2024)",
    title: "Cascading Configuration Bypass Across Mission-Critical Dependencies",
    sourceUrl: "https://www.crowdstrike.com/falcon-content-update-remediation-and-guidance-hub/",
    sourceLabel: "Official CrowdStrike PIR & Hub",
    crisisSummary:
      "A template update in Channel File 291 passed syntax validation but bypassed phased rollout stages. The unmonitored exception reached production endpoints simultaneously, causing out-of-bounds memory reads and cascading kernel panics across 8.5 million machines worldwide.",
    repreveInterception:
      "Reprieve's pre-merge CI scanner analyzes configuration ASTs against the dependency graph. Sentinel evaluates Rule R4 (Service Concentration) and Rule R8 (Customer-Path Exposure), detecting that this bypass sits directly on root execution paths with zero isolation, halting the release before deployment.",
    cypherRules: ["Rule R4: Service Concentration", "Rule R8: Customer-Path Exposure"],
    proofChain: ["Channel File #291", "AFFECTS", "CSAgent Core", "DEPENDS_ON", "Kernel Sensor Engine"],
    engineeringLesson:
      "Isolated configuration bypasses cannot be evaluated without mapping every downstream dependency in the service graph.",
  },
  {
    badge: "Regulatory Enforcement Record",
    target: "Knight Capital Group",
    scope: "$440M Capital Loss in 45 Min · SEC Administrative Action",
    title: "Dormant Feature Flag Reuse and Incomplete Deployment",
    sourceUrl: "https://www.sec.gov/news/press-release/2013-222",
    sourceLabel: "SEC Release No. 2013-222",
    crisisSummary:
      "A developer repurposed a retired feature flag ('Power Peg') previously used for test execution. During deployment across eight production servers, one server was inadvertently omitted. The dormant code remained enabled on that node with no active owner, executing millions of unintended market orders in 45 minutes.",
    repreveInterception:
      "Reprieve tracks temporary feature flags, skipped checks, and code waivers as living nodes bound to verified owners and expiration dates. Sentinel fires Rule R2 (Ghost Owner) and Rule R5 (Renewal Treadmill), identifying that a retired flag with an inactive owner was triggered, halting deployment immediately.",
    cypherRules: ["Rule R2: Ghost Owner", "Rule R5: Renewal Treadmill"],
    proofChain: ["Power Peg Flag", "OWNED_BY", "Inactive Owner", "AFFECTS", "SMARS Order Router"],
    engineeringLesson:
      "Dormant flags and waivers without living, verified owners are time bombs that standard unit tests and ticket boards cannot see.",
  },
  {
    badge: "Engineering Post-Mortem",
    target: "GitLab Database Outage",
    scope: "300GB Primary Desync · Multi-Hour Outage (Jan 2017)",
    title: "Multiple Concurrent Safeguard Waivers and Shared Fallback Failure",
    sourceUrl: "https://about.gitlab.com/blog/2017/02/01/gitlab-dot-com-database-incident/",
    sourceLabel: "GitLab Public Incident Report",
    crisisSummary:
      "During severe replication lag, multiple automated backup verification routines and replication checks were temporarily waived or disabled. When an engineer executed a manual recovery operation on the wrong node, zero compensating backup controls were active to absorb the error.",
    repreveInterception:
      "Reprieve models secondary replicas and automated backup jobs as compensating controls in the architecture graph. Sentinel evaluates Rule R3 (Shared Fallback Bottleneck) and Rule R7 (Broken Compensating Control), detecting that disabling verification while primary load is degraded eliminates all safety margin.",
    cypherRules: ["Rule R3: Shared Fallback Bottleneck", "Rule R7: Broken Compensating Control"],
    proofChain: ["Backup Verifier", "WAIVED", "Postgres Primary", "SHARED_FALLBACK", "Secondary Replica"],
    engineeringLesson:
      "Waiving an operational safeguard is only safe if compensating controls remain verified and active across all shared fallbacks.",
  },
  {
    badge: "Interactive Reference Sandbox",
    target: "Northwind Pay (Simulated)",
    scope: "185 Microservices · $40M Daily Volume · Pre-Seeded",
    title: "Multi-Squad Cyber Monday Waiver Collisions on Checkout",
    sandboxHref: "/w/northwind-pay/home",
    crisisSummary:
      "Four squads took isolated, justifiable shortcuts: a TLS waiver on payments-gateway, a skipped load test on auth-cache, and two unmanaged feature flags. All four were scheduled to expire during Cyber Week, two hops away from checkout-api.",
    repreveInterception:
      "Reprieve's deterministic avalanche engine calculates Avalanche Centrality (P = p0^h) and Temporal Expiry Collisions in 12ms. Sentinel generates a shortest proof path pinpointing checkout-api failure 18 days before peak holiday traffic.",
    cypherRules: ["Rule R1: Expiring Waivers", "Rule R6: Expiry Collision Window", "Avalanche Centrality (P = p0^h)"],
    proofChain: ["Checkout Path", "REQUIRES", "checkout-api", "DEPENDS_ON", "payments-core", "COLLIDES", "4 Active Waivers"],
    engineeringLesson:
      "Pre-seeded in our live sandbox. You can inspect the full graph, timeline scrubber, and proof paths with zero login.",
  },
];

export function CaseStudiesSection({ onBookCall }: CaseStudiesSectionProps) {
  return (
    <section aria-labelledby="case-studies-heading" className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 sm:py-28">
      {/* Architectural Specifications Strip */}
      <div className="mb-16 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-[#0a0b0e] p-6 shadow-xl sm:grid-cols-4 sm:p-8">
        <div className="space-y-1 text-center sm:text-left sm:border-r border-white/10 sm:pr-6">
          <div className="text-display-md sm:text-display-lg font-mono font-bold text-white">8 Rules</div>
          <p className="text-body-sm font-medium text-zinc-200">Deterministic Cypher</p>
          <p className="text-[11px] font-mono text-zinc-400">Formal graph queries (R1 to R8)</p>
        </div>

        <div className="space-y-1 text-center sm:text-left sm:border-r border-white/10 sm:pr-6">
          <div className="text-display-md sm:text-display-lg font-mono font-bold text-white">&lt; 15ms</div>
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

      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-300">
          <FileText className="size-3.5 text-brand" />
          <span>Documented Outage Post-Mortems</span>
        </div>
        <h2 id="case-studies-heading" className="text-display-lg font-display font-bold text-white tracking-tight">
          How Graph Governance Intercepts Real Disasters
        </h2>
        <p className="text-body-lg text-zinc-300 leading-relaxed">
          Major outages rarely stem from a single broken function. They happen when isolated waivers and unmonitored bypasses collide across microservice boundaries. Here is how Reprieve&apos;s deterministic rules model and intercept documented public incidents.
        </p>
      </div>

      {/* Clean High-Contrast Incident Cards */}
      <div className="space-y-8">
        {DOCUMENTED_INCIDENTS.map((incident, idx) => (
          <div
            key={incident.target}
            className="rounded-2xl border border-white/15 bg-[#0a0b0e] p-6 sm:p-8 shadow-2xl transition-all hover:border-brand/50 space-y-6"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.05] font-mono font-bold text-white text-body-base">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="text-h3 font-bold text-white flex flex-wrap items-center gap-2.5">
                    {incident.target}
                    <span className="rounded border border-white/15 bg-white/[0.05] px-2.5 py-0.5 font-mono text-[11px] text-zinc-300">
                      {incident.scope}
                    </span>
                  </h3>
                  <p className="mt-0.5 text-body-sm font-medium text-zinc-300">{incident.title}</p>
                </div>
              </div>

              {/* Source Link / Verification Pill */}
              <div>
                {incident.sourceUrl && (
                  <a
                    href={incident.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.06] px-3.5 py-2 font-mono text-[12px] font-medium text-white hover:bg-white/[0.1] hover:border-brand transition-colors"
                  >
                    <span>{incident.sourceLabel}</span>
                    <ExternalLink className="size-3.5 text-zinc-300" />
                  </a>
                )}
                {incident.sandboxHref && (
                  <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/[0.06] text-white hover:bg-white/[0.1] font-mono text-[12px]">
                    <Link href={incident.sandboxHref}>
                      <span>Explore Sandbox</span>
                      <ArrowRight className="ml-1.5 size-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Clear Side-by-Side Narrative */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-semibold font-mono text-[12px] uppercase tracking-wider">
                  <AlertTriangle className="size-4" />
                  <span>The Real Failure Mode</span>
                </div>
                <p className="text-body-sm text-zinc-200 leading-relaxed font-normal">
                  {incident.crisisSummary}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono text-[12px] uppercase tracking-wider">
                  <ShieldCheck className="size-4" />
                  <span>How Reprieve Intercepts It</span>
                </div>
                <p className="text-body-sm text-zinc-200 leading-relaxed font-normal">
                  {incident.repreveInterception}
                </p>
              </div>
            </div>

            {/* Evaluated Rules and Proof Chain */}
            <div className="rounded-xl border border-white/10 bg-[#121317] p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-[12px] font-mono">
                <span className="text-zinc-400 uppercase tracking-wider">Evaluated Graph Rules:</span>
                <div className="flex flex-wrap gap-2">
                  {incident.cypherRules.map((rule) => (
                    <span key={rule} className="rounded border border-brand/40 bg-brand/15 px-2.5 py-0.5 text-brand font-medium">
                      {rule}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[12px] font-mono pt-1">
                <span className="text-zinc-400">Shortest Proof Path:</span>
                {incident.proofChain.map((node, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        i % 2 === 0
                          ? "border border-white/15 bg-white/[0.06] text-white"
                          : "text-zinc-400"
                      }`}
                    >
                      {node}
                    </span>
                    {i < incident.proofChain.length - 1 && <span className="text-zinc-500">&rarr;</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Architectural Takeaway */}
            <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-body-sm">
              <ShieldAlert className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-zinc-300">
                <strong className="text-white">Architecture Takeaway:</strong> {incident.engineeringLesson}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 rounded-2xl border border-white/15 bg-[#0a0b0e] p-8 sm:p-12 text-center space-y-5 shadow-2xl">
        <h3 className="text-h2 font-bold text-white">
          Ready to verify your microservice architecture against cascading failures?
        </h3>
        <p className="max-w-xl mx-auto text-body-lg text-zinc-300 leading-relaxed">
          Book a 15-minute architecture audit, or explore our pre-seeded Northwind Pay sandbox to test all 8 rules in real time.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button size="lg" onClick={onBookCall} className="gap-2 font-bold px-8 shadow-md">
            <Calendar className="size-4" />
            Book Architecture Audit
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/[0.05] text-white hover:bg-white/[0.1]">
            <Link href="/w/northwind-pay/home">
              Launch Live Sandbox (0 Login) &rarr;
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

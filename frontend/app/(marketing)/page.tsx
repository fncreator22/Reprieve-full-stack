"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Calendar,
  CalendarClock,
  Cpu,
  Flame,
  Layers,
  Network,
  Radar,
  Route,
  ShieldAlert,
  Sparkles,
  UserCheck,
  UserX,
  type LucideIcon,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { StewardOrb } from "@/components/marketing/steward-orb";
import { CaseStudiesSection } from "@/components/marketing/case-studies-section";
import { BookCallModal } from "@/components/marketing/book-call-modal";
import { LinearSpotlightCard } from "@/components/marketing/linear-spotlight-card";
import { CollisionScrubber } from "@/components/marketing/collision-scrubber";
import { PrecedentCard } from "@/components/precedent-card";
import { SeverityBadge } from "@/components/severity-badge";
import { CLERK_ENABLED } from "@/lib/auth-config";
import { cn } from "@/lib/utils";
import { FeaturesCard } from "@/components/ui/features-card";

const TRUST: { icon: LucideIcon; text: string }[] = [
  { icon: UserCheck, text: "A human approves every change" },
  { icon: Cpu, text: "Scores are deterministic, never AI-guessed" },
  { icon: Route, text: "100% Grounded proof paths cite living nodes" },
];

const FAQ = [
  {
    q: "What is Reprieve?",
    a: "An agentic safety platform that tracks temporary exceptions (security waivers, flag overrides, skipped tests, limit extensions) as a graph, detects when they add up to real risk, and routes a review to the person who can decide today.",
  },
  {
    q: "Is it a GRC suite?",
    a: "No. Reprieve does one job: exception debt. It does not manage policies, audits or vendor risk. It complements the tools where exceptions are approved.",
  },
  {
    q: "How are risk scores calculated?",
    a: "With a published, deterministic formula over the graph: exception severity, age, how overdue it is, how central the affected service is, and rule multipliers. The same inputs always give the same score. AI never sets a number.",
  },
  {
    q: "What does the AI do, and what is sent to it?",
    a: "The Steward answers questions and drafts proposals using tools over your graph. It sends entity IDs, names and short excerpts, never whole documents. Every claim must cite an entity, and uncited claims are removed.",
  },
  {
    q: "Can I turn the AI off?",
    a: "Yes. Each workspace has an AI mode. With AI off, detection, scoring, proof paths and reviews keep working; only the Steward and AI-written summaries are disabled.",
  },
  {
    q: "Does anything change without my approval?",
    a: "No. The Steward can only propose. Reviews, activations and other changes need an explicit Approve from someone with the right role.",
  },
  {
    q: "Can I try it without my own data?",
    a: "Yes. The sample workspace, Northwind Pay, loads a realistic payments company with services, people and exceptions so you can explore every feature on a simulated date with zero login.",
  },
  {
    q: "Where is my data stored?",
    a: "In a per-workspace FalkorDB graph database. During the early beta, use the sample workspace or non-sensitive data.",
  },
];

const TELEMETRY_DATA = {
  checkout: {
    service: "checkout-api",
    summary: "4 independent squad waivers directly 2 hops from customer checkout",
    score: "84.0 / 100",
    tier: "Tier-1 Alert (CRITICAL)",
    items: [
      { name: "Skipped load test (Cyber Week)", squad: "Squad Checkout", age: "Expires in 4 days", sev: "critical" as const, decay: "Single point of failure" },
      { name: "Skip fraud validation on retry", squad: "Squad Checkout", age: "12 days overdue", sev: "high" as const, decay: "Cascading to checkout" },
      { name: "Checkout rate limit bypass", squad: "Squad Growth", age: "Expires in 2 days", sev: "high" as const, decay: "Cascading to checkout" },
      { name: "3DS verification fallback override", squad: "Squad Mobile", age: "2x renewed", sev: "moderate" as const, decay: "Cascading to checkout" },
    ],
  },
  auth: {
    service: "card-vault",
    summary: "3 waivers accumulated around HSM tokenization and credential boundary",
    score: "78.5 / 100",
    tier: "Tier-2 Alert (HIGH)",
    items: [
      { name: "Legacy TLS 1.0 waiver", squad: "Squad Auth", age: "64 days overdue", sev: "high" as const, decay: "Upstream ingress exposure" },
      { name: "HSM key rotation deferral", squad: "Squad Security", age: "Owner inactive (Priya Raman)", sev: "high" as const, decay: "Ghost owner unmonitored" },
      { name: "Service mesh mTLS disable", squad: "Squad Platform", age: "Expires in 8 days", sev: "moderate" as const, decay: "Cascading to checkout" },
    ],
  },
  payments: {
    service: "payments-core",
    summary: "4 squad waivers concentrated on high-throughput settlement engine",
    score: "82.4 / 100",
    tier: "Tier-1 Alert (CRITICAL)",
    items: [
      { name: "Payment gateway timeout override", squad: "Squad Settlement", age: "3x renewed", sev: "critical" as const, decay: "Cascading to checkout" },
      { name: "Shared fallback bottleneck: Sam Okafor", squad: "Squad Compliance", age: "3 controls dependent", sev: "high" as const, decay: "Single human failure" },
      { name: "Refund idempotency key waiver", squad: "Squad Disputes", age: "Expires in 6 days", sev: "moderate" as const, decay: "Downstream ledger risk" },
      { name: "Batch settlement retry backoff skip", squad: "Squad Core", age: "18 days overdue", sev: "moderate" as const, decay: "Upstream queue backlog" },
    ],
  },
};

export default function LandingPage() {
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"checkout" | "auth" | "payments">("checkout");

  const currentTelemetry = TELEMETRY_DATA[activeTab];

  return (
    <>
      {/* SECTION 1: High-Velocity Hero Stage with Luminous Ambient AI Orb & 0-Login CTA */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 md:pb-24">
        {/* Volumetric Aurora Backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className="absolute -top-[160px] h-[550px] w-[950px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(94,106,210,0.25)_0%,_rgba(8,9,11,0)_70%)] blur-[90px]" />
          <div className="aurora-mesh absolute -inset-[10%] opacity-25 motion-safe:animate-aurora" />
        </div>

        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Mission & 0-Login Actions */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 rounded-md border border-white/[0.1] bg-white/[0.03] px-3.5 py-1 font-mono text-[11px] font-medium tracking-[0.12em] text-zinc-300">
                <span className="size-1.5 rounded-full bg-brand" />
                <span>PRE-MERGE ARCHITECTURE SAFETY ENGINE</span>
              </div>

              <h1 id="hero-title" className="text-display-xl sm:text-[3.4rem] font-display font-bold tracking-[-0.04em] text-[#f7f8f8] leading-[1.08]">
                An expired code waiver caused a $2.4M checkout blackout.{" "}
                <span className="text-zinc-400 font-normal block sm:inline">Reprieve intercepts compound risk before merge.</span>
              </h1>

              <p className="text-body-lg text-zinc-300 sm:text-[1.12rem] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Jira treats shortcuts as closed tickets. Reprieve maps temporary waivers (<code className="text-zinc-200 bg-white/10 px-1.5 py-0.5 rounded font-mono text-sm">#nosec</code>, <code className="text-zinc-200 bg-white/10 px-1.5 py-0.5 rounded font-mono text-sm">@skip</code>, unmanaged flags) across your living microservice dependency graph to stop multi-hop cascading outages.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setBookCallOpen(true)}
                  className="gap-2 font-semibold px-7 py-6 text-body-base bg-brand hover:bg-brand/90 text-white shadow-xl shadow-brand/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Calendar className="size-4" />
                  Book Architecture Audit
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/15 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08] px-6 py-6 text-body-base">
                  <Link href={CLERK_ENABLED ? "/sign-up" : "/w/northwind-pay/home"}>
                    Launch Live Sandbox (0 Login) &rarr;
                  </Link>
                </Button>
              </div>

              <p className="text-[12px] font-mono text-zinc-400">
                Zero production credentials · Evaluates in 12ms · 100% Grounded proof paths
              </p>
            </div>

            {/* Right Column: Luminous Ambient AI Orb (Steward Neural Mesh) */}
            <div className="lg:col-span-5 flex justify-center">
              <StewardOrb />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Operational Graph Intelligence & Zero-Login Developer Protocol */}
      <FeaturesCard />

      {/* SECTION 3: Documented Engineering Post-Mortems (CrowdStrike, Knight Capital, GitLab, Northwind Pay) */}
      <div id="case-studies">
        <CaseStudiesSection onBookCall={() => setBookCallOpen(true)} />
      </div>

      {/* SECTION 4: Interactive Architecture Telemetry (Concentration, Collision Scrubber, Precedent Memory) */}
      <section aria-labelledby="telemetry-heading" className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center space-y-3 mb-14">
          <span className="inline-block rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-[0.12em] text-zinc-400">
            Compound Graph Telemetry
          </span>
          <h2 id="telemetry-heading" className="text-display-lg font-bold text-zinc-100">
            Exceptions are approved alone. <br />
            Risk compounds across the graph.
          </h2>
          <p className="text-body text-zinc-400">
            Individual waivers look harmless on sprint boards. Reprieve projects them onto your microservice topology to catch cascading failures before peak traffic.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Dominant 7-Column Canvas: Live Compound Service Concentration */}
          <LinearSpotlightCard className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-[#16171a] text-brand">
                    <Layers className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-h3 font-semibold text-zinc-100">Concentration on {currentTelemetry.service}</h3>
                    <p className="text-[12px] text-zinc-400">{currentTelemetry.summary}</p>
                  </div>
                </div>
                <div className="flex rounded-lg border border-white/[0.08] bg-[#121316] p-1">
                  {(["checkout", "auth", "payments"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "rounded-md px-3 py-1 text-[12px] font-medium capitalize transition-colors",
                        activeTab === tab
                          ? "bg-white/[0.1] text-zinc-100 shadow-sm"
                          : "text-zinc-400 hover:text-zinc-200"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {currentTelemetry.items.map((item, idx) => (
                  <div
                    key={item.name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-white/[0.04] bg-[#121317] p-3.5 transition-colors hover:border-white/[0.12]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-6 items-center justify-center rounded-md bg-white/[0.05] font-mono text-[11px] text-zinc-400">
                        0{idx + 1}
                      </span>
                      <div>
                        <span className="block text-[13px] font-medium text-zinc-200">{item.name}</span>
                        <span className="block text-[11px] text-zinc-500">{item.squad} · {item.age}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">{item.decay}</span>
                      <SeverityBadge severity={item.sev} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4 text-[12px]">
              <div className="flex items-center gap-2 text-zinc-400">
                <Flame className="size-4 text-sev-high" />
                <span>Avalanche Risk Score:</span>
                <span className="font-mono font-bold text-zinc-100">{currentTelemetry.score} ({currentTelemetry.tier})</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">
                Formula: score = Σ base × age × overdue × centrality × multipliers
              </span>
            </div>
          </LinearSpotlightCard>

          {/* 5-Column Side: Live Collision Scrubber & Precedent Memory */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <CollisionScrubber />

            <LinearSpotlightCard className="p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand">
                  <BrainCircuit className="size-4" />
                </span>
                <div>
                  <h4 className="text-[14px] font-semibold text-zinc-100">Precedent Memory Recall</h4>
                  <span className="text-[11px] text-zinc-400">FalkorDB Semantic Memory</span>
                </div>
              </div>
              <p className="mt-3 text-[12px] text-zinc-400 leading-relaxed">
                Past review decisions automatically resurface when the same control or service is evaluated.
              </p>
              <div className="mt-4">
                <PrecedentCard
                  precedent={{
                    outcome_id: "out_sample",
                    decision: "revoke",
                    note: "Third renewal with no rotation plan. Revoked; owner to schedule the key rotation.",
                    decided_at: 1789776000,
                    same_service: true,
                    renewal_depth: 2,
                    exception_id: "exc_sample",
                  }}
                />
              </div>
            </LinearSpotlightCard>
          </div>
        </div>
      </section>

      {/* SECTION 5: Trust Principles, FAQ & Final Conversion CTA */}
      <section aria-label="Principles" className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-3">
          {TRUST.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 rounded-lg border border-white/10 bg-surface/60 px-4 py-4">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-proof/10 text-proof">
                <Icon aria-hidden className="size-4" />
              </span>
              <span className="text-body font-medium text-zinc-200">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 id="faq-title" className="text-center text-display-lg font-bold text-white">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="mt-10">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`q${i}`}>
              <AccordionTrigger className="text-left text-body-lg font-medium text-zinc-200">{f.q}</AccordionTrigger>
              <AccordionContent className="text-body text-zinc-400 leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section aria-labelledby="cta-title" className="mx-auto max-w-[1240px] px-4 pb-24 sm:px-6">
        <div className="rounded-xl bg-aurora p-px shadow-glow">
          <div className="relative overflow-hidden rounded-[19px] bg-[#0a0b0e] px-6 py-14 text-center sm:px-12">
            <div aria-hidden className="aurora-mesh absolute inset-0 opacity-30" />
            <h2 id="cta-title" className="relative text-display-lg font-bold text-white">
              Map and intercept exception debt across your architecture
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-body-lg text-zinc-300">
              Book a 15-minute confidential architecture audit, or explore our live Northwind Pay environment today.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => setBookCallOpen(true)} className="gap-2 font-bold shadow-lg bg-brand hover:bg-brand/90 text-white">
                <Calendar className="size-4" />
                Book Architecture Audit
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 bg-white/[0.05] text-white hover:bg-white/[0.1]">
                <Link href={CLERK_ENABLED ? "/sign-up" : "/w/northwind-pay/home"}>
                  Explore Sample Data
                  <ArrowRight aria-hidden className="ml-1.5 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <BookCallModal open={bookCallOpen} onOpenChange={setBookCallOpen} />
    </>
  );
}

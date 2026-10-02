import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CalendarClock,
  Check,
  Cpu,
  Layers,
  Network,
  PencilLine,
  PowerOff,
  Radar,
  Route,
  Sigma,
  UserCheck,
  UserX,
  type LucideIcon,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HeroGraph } from "@/components/marketing/hero-graph";
import { Reveal } from "@/components/marketing/reveal";
import { ProofChain, ScoreStack, StepVisual, StepsLine } from "@/components/marketing/visuals";
import { PrecedentCard } from "@/components/precedent-card";
import { ProofPath } from "@/components/proof-path";
import { RuleChip } from "@/components/rule-chip";
import { ScoreRing } from "@/components/score-ring";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusChip } from "@/components/status-chip";
import type { ProofPath as ProofPathT } from "@/lib/types";

// Illustrative content from the Northwind Pay sample workspace (07-seed-spec). Not customer data.
const SAMPLE_PROOF: ProofPathT = {
  summary: "Checkout requires checkout-api, which depends on payments-core, where 4 active exceptions apply.",
  nodes: [
    { id: "cp_checkout", label: "CustomerPath", name: "Checkout" },
    { id: "svc_checkout_api", label: "Service", name: "checkout-api" },
    { id: "svc_payments_core", label: "Service", name: "payments-core" },
    { id: "exc_w17", label: "Exception", name: "TLS waiver" },
    { id: "exc_w21", label: "Exception", name: "Skipped e2e" },
  ],
  edges: [
    { from: "cp_checkout", to: "svc_checkout_api", type: "REQUIRES" },
    { from: "svc_checkout_api", to: "svc_payments_core", type: "DEPENDS_ON" },
    { from: "exc_w17", to: "svc_payments_core", type: "AFFECTS" },
    { from: "exc_w21", to: "svc_payments_core", type: "AFFECTS" },
  ],
};

function SectionHeading({ id, eyebrow, title, sub }: { id: string; eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow text-brand">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-display-lg font-bold text-text-primary">{title}</h2>
      {sub && <p className="mt-4 text-body-lg text-text-secondary">{sub}</p>}
    </div>
  );
}

function ProblemCards() {
  return (
    <section aria-labelledby="problem" className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24 md:py-32">
      <Reveal>
        <SectionHeading
          id="problem"
          eyebrow="The problem"
          title="Exceptions are approved one at a time. Risk adds up all at once."
          sub="Each waiver, override and skipped check made sense when it was granted. Nobody tracks what they do together."
        />
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-6">
        <Reveal delay={0}>
          <article className="glass h-full rounded-xl border border-border-subtle p-6">
            <CalendarClock aria-hidden className="size-6 text-sev-moderate" strokeWidth={1.5} />
            <h3 className="mt-4 text-h3 font-semibold">Forgotten expiry</h3>
            <p className="mt-2 text-body text-text-secondary">
              A 30-day waiver quietly passes its end date. The control it waived is still off.
            </p>
            <div className="mt-5 rounded-lg bg-sunken p-3">
              <div className="flex items-center justify-between text-caption">
                <span className="text-text-secondary">TLS waiver</span>
                <StatusChip status="expiring" />
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border-subtle">
                <div className="h-full origin-left rounded-full bg-sev-moderate motion-safe:animate-shrink" />
              </div>
            </div>
          </article>
        </Reveal>
        <Reveal delay={0.08}>
          <article className="glass h-full rounded-xl border border-border-subtle p-6">
            <UserX aria-hidden className="size-6 text-sev-high" strokeWidth={1.5} />
            <h3 className="mt-4 text-h3 font-semibold">Ghost owner</h3>
            <p className="mt-2 text-body text-text-secondary">
              The person who owns the exception left in August. Reviews still route to them.
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-lg bg-sunken p-3">
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-soft text-caption font-semibold text-brand motion-safe:animate-ghost">
                PR
              </span>
              <span className="text-body-sm">
                <span className="block font-medium">Priya R.</span>
                <span className="block text-text-muted">Owner · 2 exceptions</span>
              </span>
              <span className="ml-auto inline-flex h-[22px] items-center gap-1 rounded-full bg-neutral-soft px-2 text-caption font-medium text-text-secondary">
                <UserX aria-hidden className="size-3.5" />
                Left
              </span>
            </div>
          </article>
        </Reveal>
        <Reveal delay={0.16}>
          <article className="glass h-full rounded-xl border border-border-subtle p-6">
            <Layers aria-hidden className="size-6 text-sev-critical" strokeWidth={1.5} />
            <h3 className="mt-4 text-h3 font-semibold">Piling up on one service</h3>
            <p className="mt-2 text-body text-text-secondary">
              Four teams each granted one exception. All four sit two hops from checkout.
            </p>
            <ul className="mt-5 space-y-1.5" aria-label="Exceptions on payments-core">
              {["TLS waiver", "Skipped e2e", "Flag override", "Key rotation"].map((t, i) => (
                <li
                  key={t}
                  className="flex items-center justify-between rounded-md bg-sunken px-3 py-1.5 text-body-sm motion-safe:animate-fade-up"
                  style={{ animationDelay: `${400 + i * 120}ms` }}
                >
                  {t}
                  <span className="font-mono text-caption text-text-muted">payments-core</span>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: PencilLine, title: "Capture", body: "Record exceptions with an owner, an expiry and what they waive. Start from the sample or a blank workspace." },
  { icon: Network, title: "Connect", body: "Each exception joins a graph of services, dependencies, teams, people and controls." },
  { icon: Radar, title: "Detect", body: "Sentinel runs eight deterministic rules over the graph and ranks services by compound risk." },
  { icon: Route, title: "Prove", body: "Every alert shows the path that caused it, the score formula, and who should decide." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 border-y border-border-subtle bg-surface/50">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-brand">How it works</p>
            <h2 id="how-title" className="mt-3 text-display-lg font-bold">
              From scattered approvals to one ranked view
            </h2>
          </div>
        </Reveal>
        <ol className="relative mt-14 grid gap-8 md:grid-cols-4 md:gap-6">
          <StepsLine />
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.title} className="relative">
                <Reveal delay={i * 0.08} className="flex flex-col items-start md:items-center md:text-center">
                  <StepVisual step={i} />
                  <span className="relative inline-flex size-12 items-center justify-center rounded-full border border-border-subtle bg-raised shadow-e2">
                    <Icon aria-hidden className="size-5 text-brand" strokeWidth={1.5} />
                    <span className="absolute -top-1 -right-1 inline-flex size-5 items-center justify-center rounded-full bg-brand-solid font-mono text-[11px] text-text-on-brand">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-4 text-h3 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-body text-text-secondary">{s.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function BentoCard({
  icon: Icon,
  title,
  body,
  children,
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={`card-e1 flex flex-col p-6 ${className}`}>
      <Icon aria-hidden className="size-5 text-brand" strokeWidth={1.5} />
      <h3 className="mt-3 text-h3 font-semibold">{title}</h3>
      <p className="mt-1.5 text-body text-text-secondary">{body}</p>
      {children && <div className="mt-5 flex-1">{children}</div>}
    </article>
  );
}

function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-20 mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24 md:py-32">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-brand">Features</p>
          <h2 id="features-title" className="mt-3 text-display-lg font-bold">
            Built to show its work
          </h2>
        </div>
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-6 lg:gap-6">
        <Reveal className="md:col-span-4">
          <BentoCard
            icon={Layers}
            title="Compound-risk detection"
            body="Rules look across exceptions: concentration on a service, shared fallbacks, expiry collisions, renewal treadmills and customer-path exposure."
            className="h-full"
          >
            <div className="flex flex-wrap items-center gap-4">
              <ScoreRing score={82} size="md" />
              <div className="flex flex-wrap gap-1.5">
                <RuleChip rule="R4" />
                <RuleChip rule="R8" />
                <RuleChip rule="R6" />
                <RuleChip rule="R3" />
              </div>
            </div>
          </BentoCard>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.06}>
          <BentoCard
            icon={UserCheck}
            title="Current-owner routing"
            body="When an owner has left, reviews go to the current team lead, with the reason shown."
            className="h-full"
          >
            <ol className="space-y-1.5 text-body-sm">
              <li className="flex items-center justify-between rounded-md bg-sunken px-3 py-2">
                <span className="font-medium">Marcus B.</span>
                <span className="rounded-full bg-brand-soft px-2 text-caption text-brand">Team lead</span>
              </li>
              <li className="flex items-center justify-between rounded-md bg-sunken px-3 py-2 text-text-secondary">
                <span>Workspace admin</span>
                <span className="rounded-full bg-neutral-soft px-2 text-caption">Admin</span>
              </li>
            </ol>
          </BentoCard>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.06}>
          <BentoCard icon={Route} title="Proof paths" body="Every claim links to the nodes and edges behind it. Open any path on the graph." className="h-full">
            <ProofChain />
          </BentoCard>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.1}>
          <BentoCard icon={Sigma} title="Deterministic scores" body="Scores come from a published formula. AI writes explanations; it never sets a number." className="h-full">
            <ScoreStack />
          </BentoCard>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.14}>
          <BentoCard icon={Check} title="Human approval" body="The Steward proposes reviews and drafts. Nothing changes until a person approves." className="h-full">
            <div className="rounded-lg border-2 border-dashed border-proof/60 p-3 text-body-sm">
              <p className="eyebrow text-proof">Proposed by Steward</p>
              <p className="mt-1 font-medium">Open a review for the TLS waiver</p>
            </div>
          </BentoCard>
        </Reveal>
        <Reveal className="md:col-span-6" delay={0.06}>
          <BentoCard
            icon={BrainCircuit}
            title="Memory and precedent"
            body="Past decisions come back when the same control or service shows up again, in a new session or a new review."
          >
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
          </BentoCard>
        </Reveal>
      </div>
    </section>
  );
}

function Explainability() {
  return (
    <section aria-labelledby="explain-title" className="border-y border-border-subtle bg-surface/50">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-[5fr_7fr] md:items-center md:py-32">
        <Reveal>
          <p className="eyebrow text-brand">Explainability</p>
          <h2 id="explain-title" className="mt-3 text-display-lg font-bold">
            Every alert arrives with its evidence
          </h2>
          <p className="mt-4 text-body-lg text-text-secondary">
            The why, the path, the score breakdown and the people who can act, in the first view. No black box, no hunting
            through tickets.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <figure className="card-e1 overflow-hidden" aria-label="Example alert from the sample workspace">
            <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle p-4">
              <RuleChip rule="R4" />
              <SeverityBadge severity="critical" />
              <StatusChip status="open" />
              <span className="ml-auto text-caption text-text-muted">Example · sample data</span>
            </div>
            <div className="space-y-4 p-4">
              <div className="flex items-start gap-4">
                <ScoreRing score={82} size="md" />
                <div>
                  <h3 className="text-h3 font-semibold">Checkout carries 4 active exceptions</h3>
                  <p className="mt-1 text-body-sm text-text-secondary">
                    Four active exceptions sit within two hops of checkout-api, and two expire this week.
                  </p>
                </div>
              </div>
              <ProofPath path={SAMPLE_PROOF} graphHref={null} />
              <div>
                <p className="eyebrow text-text-muted">Score breakdown</p>
                <dl className="mt-2 space-y-1.5 text-body-sm">
                  {[
                    ["TLS waiver", 34],
                    ["Skipped e2e", 26],
                    ["Flag override", 14],
                    ["Key rotation", 8],
                  ].map(([name, v]) => (
                    <div key={name} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-3">
                      <dt className="truncate text-text-secondary">{name}</dt>
                      <dd className="h-2 overflow-hidden rounded-full bg-sunken">
                        <span className="block h-full rounded-full bg-brand" style={{ width: `${(Number(v) / 34) * 100}%` }} />
                      </dd>
                      <dd className="tabular text-right text-text-primary">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 font-mono text-caption text-text-muted">
                  score = Σ base × age × overdue × centrality × multipliers
                </p>
              </div>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

const TRUST: { icon: LucideIcon; text: string }[] = [
  { icon: UserCheck, text: "A human approves every change" },
  { icon: Cpu, text: "Scores are deterministic, never AI-guessed" },
  { icon: PowerOff, text: "AI can be turned off per workspace" },
];

const FAQ = [
  {
    q: "What is Reprieve?",
    a: "An agent that tracks temporary exceptions (security waivers, flag overrides, skipped tests, limit extensions) as a graph, detects when they add up to real risk, and routes a review to the person who can decide today.",
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
    a: "Yes. The sample workspace, Northwind Pay, loads a realistic payments company with services, people and exceptions so you can explore every feature on a simulated date.",
  },
  {
    q: "Where is my data stored?",
    a: "In a per-workspace graph database. During the early beta, use the sample workspace or non-sensitive data. See the privacy page for details.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 md:pb-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="aurora-mesh absolute -inset-[10%] motion-safe:animate-aurora" />
        </div>
        <div className="mx-auto grid max-w-[1360px] grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 sm:px-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface/60 px-3 py-1 text-text-secondary">
              <span aria-hidden className="size-1.5 rounded-full bg-proof" />
              The exception debt agent
            </p>
            <h1 id="hero-title" className="mt-6 text-display-xl font-bold text-text-primary">
              Individually reasonable exceptions add up to one{" "}
              <span className="text-aurora">unreasonable risk.</span>
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-text-secondary sm:text-[1.25rem]">
              Reprieve is the agent that sees the sum.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="aurora" size="lg">
                <Link href="/sign-up">
                  Explore with sample data
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
            <p className="mt-4 text-body-sm text-text-muted">Sample workspace included. No credit card.</p>
          </div>
          <HeroGraph />
        </div>
      </section>

      <ProblemCards />
      <HowItWorks />
      <Features />
      <Explainability />

      {/* Trust strip */}
      <section aria-label="Principles" className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-3">
          {TRUST.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface/60 px-4 py-4">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-proof-soft text-proof">
                <Icon aria-hidden className="size-4" />
              </span>
              <span className="text-body font-medium">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 id="faq-title" className="text-center text-display-lg font-bold">
          Questions
        </h2>
        <Accordion type="single" collapsible className="mt-10">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`q${i}`}>
              <AccordionTrigger className="text-left text-body-lg font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-body text-text-secondary">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <section aria-labelledby="cta-title" className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6">
        <div className="rounded-xl bg-aurora p-px shadow-glow">
          <div className="relative overflow-hidden rounded-[19px] bg-surface px-6 py-14 text-center sm:px-12">
            <div aria-hidden className="aurora-mesh absolute inset-0" />
            <h2 id="cta-title" className="relative text-display-lg font-bold">
              See what your exceptions add up to
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-body-lg text-text-secondary">
              Explore a realistic payments company in the sample workspace, then start your own.
            </p>
            <div className="relative mt-8 flex justify-center">
              <Button asChild variant="aurora" size="lg">
                <Link href="/sign-up">
                  Explore with sample data
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

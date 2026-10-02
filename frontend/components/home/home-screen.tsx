"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BellRing, CalendarClock, ClipboardCheck, FileWarning, Network, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { EmptyState } from "@/components/empty-state";
import { ExpiryRunway } from "@/components/home/expiry-runway";
import { PageContainer, PageHeader } from "@/components/page-header";
import { ProofPath } from "@/components/proof-path";
import { RuleChip, isRuleId } from "@/components/rule-chip";
import { ScoreBreakdown } from "@/components/score-breakdown";
import { ScoreRing } from "@/components/score-ring";
import { SeverityBadge } from "@/components/severity-badge";
import { useRiskSummary } from "@/components/shell/use-shell-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi, wsPath } from "@/lib/api";
import { errorMessage } from "@/lib/errors";
import type { AlertOut, Page, RunwayItem, ServiceRisk, ServiceRiskDetail } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace";

const PROMPTS = [
  "Which service is carrying the most hidden risk?",
  "Who should own the exceptions whose owner left?",
  "What expires in the next two weeks?",
];

/** SCR-P-01: where hidden risk concentrates right now, and what to do first. */
export function HomeScreen() {
  const api = useApi();
  const { wsId, slug, asOf, personId } = useWorkspace();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const base = `/w/${slug}`;

  const summary = useRiskSummary();
  const services = useQuery({
    queryKey: ["risk-services", wsId],
    queryFn: ({ signal }) => api<ServiceRisk[]>(wsPath(wsId, "/risk/services"), { signal, query: { limit: 8 } }),
  });
  const selectedId = params.get("service") ?? services.data?.[0]?.service.id;
  const detail = useQuery({
    queryKey: ["risk-service", wsId, selectedId],
    queryFn: ({ signal }) => api<ServiceRiskDetail>(wsPath(wsId, `/risk/services/${selectedId}`), { signal }),
    enabled: !!selectedId,
  });
  const runway = useQuery({
    queryKey: ["runway", wsId],
    queryFn: ({ signal }) => api<RunwayItem[]>(wsPath(wsId, "/risk/runway"), { signal, query: { days: 30 } }),
  });
  const critical = useQuery({
    queryKey: ["alerts", wsId, "critical"],
    queryFn: ({ signal }) => api<Page<AlertOut>>(wsPath(wsId, "/alerts"), { signal, query: { severity: "critical", limit: 4 } }),
  });
  const reviews = useQuery({
    queryKey: ["reviews", wsId, "mine-pending"],
    queryFn: ({ signal }) =>
      api<Page<{ id: string; alert: { label: string }; exception: { label: string } }>>(wsPath(wsId, "/reviews"), {
        signal,
        query: { assigned_to_me: true, status: "pending", limit: 4 },
      }),
    enabled: !!personId,
  });

  const select = (id: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("service", id);
    router.replace(`${pathname}?${next}`, { scroll: false });
  };

  if (services.data && services.data.every((s) => s.active_exceptions === 0 && s.score === 0)) {
    return (
      <PageContainer width="home">
        <PageHeader title="Home" />
        <EmptyState
          illustration
          title="No exceptions to analyse yet"
          description="Add a service, the people who own it, then the first exception. Sentinel ranks risk as soon as there is a graph."
          action={
            <Button asChild>
              <Link href={`${base}/services`}>
                <Plus aria-hidden /> Add your first service
              </Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const s = summary.data;
  const openTotal = s ? Object.values(s.open_alerts).reduce((a, b) => a + b, 0) : 0;

  return (
    <PageContainer width="home">
      <PageHeader title="Home" subtitle="Where hidden risk is concentrating right now, and what to do first." />

      <section aria-label="Summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric href={`${base}/alerts`} icon={BellRing} label="Open alerts" value={s && openTotal} loading={summary.isPending}>
          {s && (
            <span className="flex flex-wrap gap-x-2 text-caption text-text-muted">
              {(["critical", "high", "moderate"] as const).map((k) => (
                <span key={k} className="tabular">
                  {s.open_alerts[k] ?? 0} {k}
                </span>
              ))}
            </span>
          )}
        </Metric>
        <Metric href={`${base}/exceptions?status=active`} icon={FileWarning} label="Active exceptions" value={s?.active_exceptions} loading={summary.isPending} />
        <Metric
          href={`${base}/exceptions?expiring_within_days=7`}
          icon={CalendarClock}
          label="Expiring in 7 days"
          value={s?.expiring_7d}
          loading={summary.isPending}
          tone={s && s.expiring_7d > 0 ? "warn" : undefined}
        />
        <Metric href={`${base}/reviews`} icon={ClipboardCheck} label="Reviews waiting for you" value={s?.my_reviews} loading={summary.isPending} />
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card title="Top risk services" className="lg:col-span-5" error={services.error} onRetry={services.refetch}>
          {services.isPending ? (
            <RowsSkeleton />
          ) : (
            <ol className="-mx-2">
              {services.data?.map((r, i) => (
                <li key={r.service.id}>
                  <button
                    type="button"
                    onClick={() => select(r.service.id)}
                    aria-current={r.service.id === selectedId}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-brand-soft",
                      r.service.id === selectedId && "bg-brand-soft shadow-[inset_2px_0_0_var(--brand)]",
                    )}
                  >
                    <span className="tabular w-4 text-caption text-text-muted">{i + 1}</span>
                    <ScoreRing score={r.score} band={r.band} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{r.service.label}</span>
                      <span className="block truncate text-caption text-text-muted">
                        Tier {r.tier} · {r.team?.label ?? "No team"} · {r.active_exceptions} active
                      </span>
                    </span>
                    <span className="hidden gap-1 sm:flex">
                      {r.rule_hits.filter(isRuleId).map((h) => (
                        <RuleChip key={h} rule={h} compact />
                      ))}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card
          title={detail.data ? `Why ${detail.data.service.label}?` : "Why?"}
          className="lg:col-span-7"
          error={detail.error}
          onRetry={detail.refetch}
          action={
            detail.data && (
              <Button asChild variant="ghost" size="sm">
                <Link href={`${base}/graph?focus=${detail.data.service.id}`}>
                  <Network aria-hidden /> Open on graph
                </Link>
              </Button>
            )
          }
        >
          {!detail.data ? (
            <RowsSkeleton />
          ) : (
            <div className="grid gap-6 md:grid-cols-[auto_1fr]">
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={detail.data.score} band={detail.data.band} size="lg" />
                <span className="text-caption text-text-muted">{detail.data.customer_facing ? "Customer-facing" : "Internal"}</span>
              </div>
              <div className="min-w-0 space-y-5">
                <ScoreBreakdown breakdown={detail.data.breakdown} names={detail.data.names} limit={4} />
                {detail.data.proof && <ProofPath path={detail.data.proof} compact />}
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card title="Expiry runway · next 30 days" className="lg:col-span-8" error={runway.error} onRetry={runway.refetch}>
          {runway.isPending || asOf == null ? (
            <RowsSkeleton />
          ) : runway.data?.length ? (
            <ExpiryRunway items={runway.data} asOf={asOf} />
          ) : (
            <p className="text-body-sm text-text-muted">Nothing expires in the next 30 days.</p>
          )}
        </Card>

        <Card title="Needs your attention" className="lg:col-span-4" error={critical.error} onRetry={critical.refetch}>
          <ul className="space-y-3">
            {!personId && (
              <li className="text-body-sm text-text-secondary">
                <Link href={`${base}/reviews`} className="text-brand hover:underline">
                  Link your profile
                </Link>{" "}
                to see reviews assigned to you.
              </li>
            )}
            {reviews.data?.items.map((r) => (
              <AttentionRow key={r.id} href={`${base}/reviews/${r.id}`} icon={ClipboardCheck} title={r.alert.label} meta={`Review · ${r.exception.label}`} />
            ))}
            {critical.data?.items.map((a) => (
              <AttentionRow key={a.id} href={`${base}/alerts/${a.id}`} badge={<SeverityBadge severity={a.severity} />} title={a.title} meta={a.subject.label ?? ""} />
            ))}
            {critical.data?.items.length === 0 && !reviews.data?.items.length && (
              <li className="text-body-sm text-text-muted">No critical alerts or pending reviews.</li>
            )}
          </ul>
        </Card>
      </div>

      <AskSteward base={base} />
    </PageContainer>
  );
}

function Metric({
  href,
  icon: Icon,
  label,
  value,
  loading,
  tone,
  children,
}: {
  href: string;
  icon: typeof BellRing;
  label: string;
  value: number | undefined;
  loading: boolean;
  tone?: "warn";
  children?: ReactNode;
}) {
  return (
    <Link href={href} className="card-e1 group block p-4 transition-colors hover:border-border-strong md:p-5">
      <span className="flex items-center gap-2 text-body-sm text-text-secondary">
        <Icon className="size-4" aria-hidden /> {label}
      </span>
      {loading ? (
        <Skeleton className="mt-2 h-9 w-16" />
      ) : (
        <span className={cn("tabular mt-1 block font-display text-metric font-bold", tone === "warn" && "text-sev-moderate")}>{value ?? 0}</span>
      )}
      {children}
    </Link>
  );
}

function Card({
  title,
  action,
  className,
  error,
  onRetry,
  children,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
  error?: unknown;
  onRetry?: () => void;
  children: ReactNode;
}) {
  return (
    <section className={cn("card-e1 p-4 md:p-5", className)} aria-label={title}>
      <header className="mb-4 flex min-h-8 items-center justify-between gap-2">
        <h2 className="font-sans text-h3 font-semibold">{title}</h2>
        {action}
      </header>
      {error ? (
        <div className="text-body-sm">
          <p className="text-text-secondary">{errorMessage(error)}</p>
          <Button size="sm" variant="secondary" className="mt-2" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : (
        children
      )}
    </section>
  );
}

function AttentionRow({ href, icon: Icon, badge, title, meta }: { href: string; icon?: typeof BellRing; badge?: ReactNode; title: string; meta: string }) {
  return (
    <li>
      <Link href={href} className="group flex items-start gap-3 rounded-md">
        {badge ?? (Icon && <Icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />)}
        <span className="min-w-0">
          <span className="line-clamp-2 text-body-sm font-medium group-hover:underline">{title}</span>
          <span className="block truncate text-caption text-text-muted">{meta}</span>
        </span>
      </Link>
    </li>
  );
}

function AskSteward({ base }: { base: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const ask = (text: string) => text.trim() && router.push(`${base}/steward?q=${encodeURIComponent(text.trim())}`);
  return (
    <section className="card-e1 p-4 md:p-5" aria-label="Ask Steward">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
      >
        <label className="relative flex-1">
          <span className="sr-only">Ask Steward</span>
          <Sparkles className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask Steward about risk, owners, or expiries"
            className="h-10 w-full rounded-md border border-border-strong bg-sunken pl-9 pr-3 outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
        </label>
        <Button type="submit" aria-label="Ask">
          <ArrowRight aria-hidden />
        </Button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {PROMPTS.map((p) => (
          <button key={p} type="button" onClick={() => ask(p)} className="rounded-full border border-border-subtle px-3 py-1 text-body-sm text-text-secondary hover:border-brand hover:text-text-primary">
            {p}
          </button>
        ))}
      </div>
    </section>
  );
}

function RowsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-10" />
      ))}
    </div>
  );
}

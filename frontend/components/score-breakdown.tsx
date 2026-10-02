import { SeverityBadge } from "@/components/severity-badge";
import type { ScoreBreakdown as Breakdown } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Per-exception contribution bars + the formula (05 §8 ScoreBreakdown). Overdue segments are hatched, not color-only. */
export function ScoreBreakdown({
  breakdown,
  names = {},
  limit = 6,
  className,
}: {
  breakdown: Breakdown;
  names?: Record<string, string>;
  limit?: number;
  className?: string;
}) {
  const items = breakdown.contributions.slice(0, limit);
  const max = Math.max(...items.map((c) => c.value), 0.0001);
  const rest = breakdown.contributions.length - items.length;
  return (
    <div className={cn("space-y-4", className)}>
      <ol className="space-y-2.5" aria-label="Contribution by exception">
        {items.map((c) => (
          <li key={c.exception_id} className="space-y-1">
            <div className="flex items-baseline justify-between gap-3 text-body-sm">
              <span className="truncate">{names[c.exception_id] ?? c.exception_id}</span>
              <span className="tabular shrink-0 font-mono text-text-secondary">{c.value.toFixed(1)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-sunken">
              <div
                className={cn("h-full rounded-full bg-brand", c.overdue > 1 && "hatched")}
                style={{ width: `${(c.value / max) * 100}%` }}
              />
            </div>
            <p className="text-caption text-text-muted">
              {c.hops === 0 ? "On this service" : `${c.hops} hop${c.hops > 1 ? "s" : ""} away`}
              {c.overdue > 1 && " · overdue ×" + c.overdue}
              {c.centrality > 0 && ` · centrality ${c.centrality.toFixed(2)}`}
            </p>
          </li>
        ))}
      </ol>
      {rest > 0 && <p className="text-caption text-text-muted">+{rest} smaller contributions</p>}
      <div className="rounded-md bg-sunken px-3 py-2 font-mono text-[12px] leading-relaxed text-text-secondary">
        score = 100 × (1 − e<sup>−raw × mult / K</sup>)
        <br />
        raw <span className="text-text-primary">{breakdown.raw.toFixed(2)}</span> · mult{" "}
        <span className="text-text-primary">×{breakdown.multiplier}</span>
        {breakdown.rule_hits.length > 0 && <> ({breakdown.rule_hits.join(", ")})</>} →{" "}
        <span className="text-text-primary">{Math.round(breakdown.score)}</span>
      </div>
      <SeverityBadge severity={breakdown.band} />
    </div>
  );
}

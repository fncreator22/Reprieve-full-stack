"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, ArrowRight, DollarSign, Flame, HelpCircle, Play, ShieldAlert, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/workspace";

interface ExecutiveHookBannerProps {
  onSimulateOutage?: () => void;
  onOpenGuide?: () => void;
  onOpenCiGate?: () => void;
}

export function ExecutiveHookBanner({
  onSimulateOutage,
  onOpenGuide,
  onOpenCiGate,
}: ExecutiveHookBannerProps) {
  const { slug, workspace } = useWorkspace();
  const router = useRouter();
  const [minimized, setMinimized] = useState(false);
  const isSample = workspace?.data_mode === "sample";

  const handleSimulate = () => {
    if (onSimulateOutage) {
      onSimulateOutage();
    } else {
      router.push(`/w/${slug}/graph?focus=svc_payments_gateway&horizon=30&sim=1`);
    }
  };

  if (minimized) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-subtle px-3 py-1.5 text-caption text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-brand">Reprieve Risk Engine</span>
          <span className="hidden sm:inline text-text-muted">·</span>
          <span className="hidden sm:inline">Tracking dangerous code shortcuts before they trigger production outages</span>
        </div>
        <div className="flex items-center gap-2">
          {isSample && (
            <button
              type="button"
              onClick={handleSimulate}
              className="font-medium text-danger hover:underline flex items-center gap-1"
            >
              <Play className="size-3" /> Simulate Outage
            </button>
          )}
          <button
            type="button"
            onClick={() => setMinimized(false)}
            className="text-text-muted hover:text-text-primary text-caption underline"
          >
            Expand banner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0d10] p-4 shadow-sm transition-all sm:p-5">
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left column: Plain English Elevator Pitch & Problem Translation */}
        <div className="max-w-2xl space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-[0.12em] text-zinc-300">
              Pre-Merge Risk Engine
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-[0.12em] text-zinc-400">
              Continuous Governance
            </span>
          </div>

          <h2 className="text-h3 font-display font-semibold tracking-tight text-text-primary">
            Jira tracks what you plan to build.{" "}
            <span className="text-brand">Reprieve tracks the shortcuts</span> your team took to ship on time.
          </h2>

          <p className="text-body-sm text-text-secondary leading-relaxed">
            Temporary waivers (<code className="rounded bg-sunken px-1 font-mono text-caption text-text-primary">#nosec</code>,{" "}
            <code className="rounded bg-sunken px-1 font-mono text-caption text-text-primary">@skip</code>, unmanaged feature flags) 
            expire invisibly and cascade through microservices. Reprieve catches them across the dependency graph before they become an emergency.
          </p>
        </div>

        {/* Right column: Business Impact Metrics & 1-Click Simulation CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          {/* Dollar Risk & Downstream Tier */}
          <div className="rounded-lg border border-border-subtle bg-surface/80 p-3 backdrop-blur sm:w-64 space-y-1.5">
            <div className="flex items-center justify-between text-caption font-medium text-text-muted">
              <span className="flex items-center gap-1">
                <DollarSign className="size-3.5 text-danger" />
                Est. Outage Exposure
              </span>
              <span className="rounded bg-danger/10 px-1.5 py-0.2 font-mono text-danger font-semibold">CRITICAL</span>
            </div>
            <div className="text-body-base font-bold text-text-primary flex items-baseline justify-between">
              <span>~$340,000 / hr</span>
              <span className="text-caption font-normal text-text-secondary">4 services exposed</span>
            </div>
            <div className="text-[11px] text-text-muted">
              Cascading multi-hop failure path detected
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {isSample && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleSimulate}
                className="gap-1.5 shadow-sm font-semibold flex-1 sm:flex-initial"
              >
                <Play className="size-3.5 fill-current" />
                Simulate 30-Day Outage
              </Button>
            )}

            {onOpenCiGate && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenCiGate}
                className="gap-1.5 flex-1 sm:flex-initial"
              >
                <ShieldAlert className="size-3.5 text-brand" />
                View PR Bot Gate
              </Button>
            )}

            {onOpenGuide && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onOpenGuide}
                className="gap-1 text-text-muted hover:text-text-primary"
              >
                <HelpCircle className="size-3.5" />
                Quick Guide
              </Button>
            )}

            <button
              type="button"
              onClick={() => setMinimized(true)}
              aria-label="Dismiss banner"
              className="rounded p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-colors ml-auto sm:ml-0"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

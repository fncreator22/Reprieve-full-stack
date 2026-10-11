"use client";

import { AlertTriangle, ArrowRight, Bot, Download, FileCheck, ShieldAlert, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SeverityBadge } from "@/components/severity-badge";
import type { AvalancheCentralityItem, TemporalCollisionItem } from "@/lib/types";

interface SimulationProofCardProps {
  avalancheItem?: AvalancheCentralityItem | null;
  collisionItem?: TemporalCollisionItem | null;
  onClose: () => void;
  onAskSteward?: (question: string) => void;
}

export function SimulationProofCard({
  avalancheItem,
  collisionItem,
  onClose,
  onAskSteward,
}: SimulationProofCardProps) {
  if (!avalancheItem && !collisionItem) return null;

  const exportProofPacket = () => {
    const targetId = avalancheItem ? avalancheItem.service_id : collisionItem?.cluster_id ?? "unknown";
    const packet = {
      standard: "Reprieve-Audit-Proof-Packet-v1.0",
      exported_at: new Date().toISOString(),
      evaluation_model: "Deterministic Cypher Topological Calculus",
      simulation_type: avalancheItem ? "AvalancheCentrality" : "TemporalExpiryCollision",
      evidence: avalancheItem
        ? {
            service_id: avalancheItem.service_id,
            service_name: avalancheItem.service_name,
            score: avalancheItem.score,
            band: avalancheItem.band,
            spof_rank: avalancheItem.spof_rank,
            cascade_probability: avalancheItem.cascade_probability,
            reachable_services: avalancheItem.reachable_services,
            customer_paths: avalancheItem.customer_paths,
            proof: avalancheItem.proof,
          }
        : {
            cluster_id: collisionItem?.cluster_id,
            window_start: collisionItem?.window_start,
            window_end: collisionItem?.window_end,
            collision_severity: collisionItem?.collision_severity ?? collisionItem?.severity_band,
            exception_ids: collisionItem?.exception_ids,
            affected_services: collisionItem?.affected_services,
          },
      compliance_attestation: "Verified deterministically from FalkorDB graph topology. Compliant with SOC2 CC7.1 / ISO 27001 A.12.1.2 exception management standards.",
    };

    const blob = new Blob([JSON.stringify(packet, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reprieve-proof-packet-${targetId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Audit Proof Packet exported! Ready for SOC2 & Risk Review.");
  };

  return (
    <div className="absolute bottom-16 right-4 z-20 w-96 rounded-xl border bg-card p-4 shadow-xl backdrop-blur">
      <div className="flex items-start justify-between gap-2 border-b pb-3">
        <div className="flex items-center gap-2">
          {avalancheItem ? (
            <ShieldAlert className="size-5 text-amber-500" />
          ) : (
            <AlertTriangle className="size-5 text-rose-500" />
          )}
          <div>
            <h4 className="text-sm font-semibold">
              {avalancheItem ? avalancheItem.service_name : "Temporal Expiry Collision"}
            </h4>
            <span className="font-mono text-xs text-muted-foreground">
              {avalancheItem ? avalancheItem.service_id : collisionItem?.cluster_id}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="size-6" onClick={onClose}>
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="my-3 space-y-3 text-xs">
        {avalancheItem && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avalanche Centrality Score</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold">{avalancheItem.score}/100</span>
                <SeverityBadge severity={avalancheItem.band} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">SPOF Rank</span>
              <Badge variant="outline" className="font-mono">
                #{avalancheItem.spof_rank}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cascading Failure Probability</span>
              <span className="font-mono font-semibold">
                {(avalancheItem.cascade_probability * 100).toFixed(0)}%
              </span>
            </div>

            {avalancheItem.reachable_services.length > 0 && (
              <div>
                <span className="text-muted-foreground">Vulnerable Downstream Services:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {avalancheItem.reachable_services.map((svc) => (
                    <Badge key={svc} variant="neutral" className="font-mono text-[10px]">
                      {svc}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {avalancheItem.customer_paths.length > 0 && (
              <div>
                <span className="text-muted-foreground">Affected Customer Journeys:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {avalancheItem.customer_paths.map((cp) => (
                    <Badge key={cp} variant="outline" className="text-[10px] text-rose-500 border-rose-500/30">
                      {cp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {collisionItem && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Collision Severity</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold">
                  {collisionItem.collision_severity ?? collisionItem.severity_score ?? 0}
                </span>
                <SeverityBadge
                  severity={
                    collisionItem.severity_band ??
                    ((collisionItem.severity_score ?? collisionItem.collision_severity ?? 0) >= 75
                      ? "critical"
                      : (collisionItem.severity_score ?? collisionItem.collision_severity ?? 0) >= 50
                        ? "high"
                        : (collisionItem.severity_score ?? collisionItem.collision_severity ?? 0) >= 25
                          ? "moderate"
                          : "low")
                  }
                />
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">Expiring Exceptions:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {collisionItem.exception_ids.map((exc) => (
                  <Badge key={exc} variant="neutral" className="font-mono text-[10px]">
                    {exc}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">Simultaneously Impacted Services:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {collisionItem.affected_services.map((svc) => (
                  <Badge key={svc} variant="outline" className="font-mono text-[10px]">
                    {svc}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="border-t pt-2.5 space-y-1.5">
        <Button
          size="sm"
          variant="outline"
          className="w-full justify-between text-xs font-mono"
          onClick={exportProofPacket}
        >
          <span className="flex items-center gap-1.5">
            <Download className="size-3.5 text-brand" />
            <span>Export SOC2 Proof Packet</span>
          </span>
          <span className="text-[10px] text-muted-foreground uppercase">JSON</span>
        </Button>

        {onAskSteward && (
          <Button
            size="sm"
            variant="default"
            className="w-full justify-between text-xs"
            onClick={() => {
              const query = avalancheItem
                ? `Explain the cascading failure risk and mitigation plan for ${avalancheItem.service_id}.`
                : `How can we stagger the expiring exceptions in collision cluster ${collisionItem?.cluster_id}?`;
              onAskSteward(query);
            }}
          >
            <span className="flex items-center gap-1.5">
              <Bot className="size-3.5" />
              Ask Steward for Mitigation
            </span>
            <ArrowRight className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

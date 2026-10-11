"use client";

import { Play, Pause, RotateCcw, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import type { SimulationForecastOut } from "@/lib/types";

interface TemporalSliderProps {
  horizonDays: number;
  onHorizonChange: (days: number | ((prev: number) => number)) => void;
  forecast?: SimulationForecastOut | null;
  isLoading?: boolean;
}

const PRESETS = [
  { label: "Now", days: 0 },
  { label: "+7d", days: 7 },
  { label: "+30d", days: 30 },
  { label: "+90d", days: 90 },
];

export function TemporalSlider({
  horizonDays,
  onHorizonChange,
  forecast,
  isLoading,
}: TemporalSliderProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onHorizonChange((prev: number) => {
        const next = Math.min(90, prev + 1);
        if (next >= 90) {
          setTimeout(() => setIsPlaying(false), 0);
        }
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying, onHorizonChange]);

  const topSPOF = forecast?.avalanche_centrality?.[0];
  const collisionCount = forecast?.temporal_collisions?.length ?? 0;

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-background/95 p-3 shadow-md backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Forecast Horizon
          </span>
          <Badge variant="outline" className="font-mono text-xs">
            +{horizonDays} days
          </Badge>
          {isLoading && (
            <span className="text-xs text-muted-foreground animate-pulse">
              Simulating...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {PRESETS.map((p) => (
            <Button
              key={p.days}
              variant={horizonDays === p.days ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {
                setIsPlaying(false);
                onHorizonChange(p.days);
              }}
            >
              {p.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setIsPlaying((p) => !p)}
            title={isPlaying ? "Pause simulation" : "Play simulation timeline"}
          >
            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => {
              setIsPlaying(false);
              onHorizonChange(0);
            }}
            title="Reset to present day"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-1">
        <Slider
          value={[horizonDays]}
          min={0}
          max={90}
          step={1}
          onValueChange={([val]) => {
            setIsPlaying(false);
            onHorizonChange(val);
          }}
          className="w-full cursor-pointer"
        />
      </div>

      {forecast && (
        <div className="flex flex-wrap items-center gap-3 border-t pt-2 text-xs text-muted-foreground">
          {topSPOF && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-amber-500" />
              <span>
                Top SPOF: <strong className="text-foreground">{topSPOF.service_name}</strong> (Score {topSPOF.score})
              </span>
            </div>
          )}
          {collisionCount > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="size-3.5 text-rose-500" />
              <span>
                <strong className="text-rose-500">{collisionCount}</strong> Expiry Collision{collisionCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
          <span className="ml-auto font-mono text-[10px] text-muted-foreground/70">
            {forecast.execution_time_ms.toFixed(1)}ms execution
          </span>
        </div>
      )}
    </div>
  );
}

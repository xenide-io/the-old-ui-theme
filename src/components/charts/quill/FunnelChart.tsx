"use client";

import { useMemo } from "react";
import { useChartTokens } from "@/lib/chart/use-ph-chart-tokens";
import { cn } from "@/lib/cn";

export interface FunnelStep {
  label: string;
  count: number;
}

export interface FunnelChartProps {
  steps: FunnelStep[];
  className?: string;
}

export function FunnelChart({ steps, className }: FunnelChartProps) {
  const tokens = useChartTokens();

  const maxCount = useMemo(() => Math.max(...steps.map((s) => s.count)), [steps]);

  return (
    <div className={cn("space-y-2", className)} suppressHydrationWarning>
      {steps.map((step, i) => {
        const pct = (step.count / maxCount) * 100;
        const prev = i > 0 ? steps[i - 1].count : step.count;
        const dropoff = prev > 0 ? ((prev - step.count) / prev) * 100 : 0;

        return (
          <div key={step.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-ph-ink">{step.label}</span>
              <span className="tabular-nums text-ph-subtle">{step.count.toLocaleString()}</span>
            </div>
            <div className="relative h-8 overflow-hidden rounded-md" style={{ background: tokens.muted }}>
              <div
                className="h-full rounded-md transition-all duration-500"
                style={{ width: `${pct}%`, background: i === 0 ? tokens.series[0] : tokens.series[i % tokens.series.length] }}
              />
            </div>
            {i > 0 && dropoff > 0 && (
              <p className="text-xs text-ph-danger">-{dropoff.toFixed(1)}% dropoff</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

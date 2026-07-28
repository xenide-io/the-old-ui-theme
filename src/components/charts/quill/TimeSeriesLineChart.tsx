"use client";

import { useMemo } from "react";
import { CanvasTrendLineChart } from "@/lib/hog-charts-lite/CanvasTrendLineChart";
import { useChartTokens } from "@/lib/chart/use-ph-chart-tokens";
import { buildHogChartTheme } from "@/lib/hog-charts-lite/build-theme";
import { cn } from "@/lib/cn";

export interface TimeSeriesLineChartSeries {
  key: string;
  label: string;
  data: number[];
  color?: string;
}

export interface TimeSeriesLineChartProps {
  series: TimeSeriesLineChartSeries[];
  labels: string[];
  className?: string;
  showGrid?: boolean;
  showCrosshair?: boolean;
  height?: number;
}

export function TimeSeriesLineChart({
  series,
  labels,
  className,
  showGrid = true,
  showCrosshair = true,
  height = 280,
}: TimeSeriesLineChartProps) {
  const tokens = useChartTokens();
  const theme = useMemo(() => buildHogChartTheme(tokens), [tokens]);

  const resolved = useMemo(
    () =>
      series.map((s, i) => ({
        key: s.key,
        label: s.label,
        data: s.data,
        color: s.color ?? tokens.series[i % tokens.series.length],
      })),
    [series, tokens.series]
  );

  return (
    <div
      className={cn("relative w-full", className)}
      style={{ height, minHeight: 220 }}
    >
      <CanvasTrendLineChart
        labels={labels}
        series={resolved}
        theme={theme}
        showGrid={showGrid}
        showCrosshair={showCrosshair}
        className="h-full min-h-[220px]"
      />
    </div>
  );
}

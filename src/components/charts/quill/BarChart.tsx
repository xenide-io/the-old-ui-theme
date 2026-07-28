"use client";

import { useMemo } from "react";
import { useChartTokens } from "@/lib/chart/use-ph-chart-tokens";
import { cn } from "@/lib/cn";

export interface BarChartSeries {
  key: string;
  label: string;
  data: number[];
  color?: string;
}

export interface BarChartProps {
  series: BarChartSeries[];
  labels: string[];
  className?: string;
  height?: number;
}

export function BarChart({ series, labels, className, height = 280 }: BarChartProps) {
  const tokens = useChartTokens();
  const groupCount = labels.length;
  const barCount = series.length;

  const { maxVal, chartData } = useMemo(() => {
    let mx = 0;
    const flat = series.flatMap((s) => s.data);
    for (const v of flat) if (v > mx) mx = v;
    return {
      maxVal: mx || 1,
      chartData: series.map((s, i) => ({
        label: s.label,
        color: s.color ?? tokens.series[i % tokens.series.length],
        values: s.data,
      })),
    };
  }, [series, tokens.series]);

  const padding = { top: 16, right: 8, bottom: 24, left: 8 };
  const innerW = 400 - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const groupW = innerW / groupCount;
  const barW = Math.max(4, (groupW * 0.7) / barCount);
  const gap = groupW * 0.15;

  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <svg viewBox={`0 0 400 ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" suppressHydrationWarning>
        {chartData.map((bar, bi) =>
          bar.values.map((v, li) => {
            const x = padding.left + li * groupW + gap / 2 + bi * barW;
            const barH = (v / maxVal) * (innerH - 4);
            const y = padding.top + innerH - barH;
            return (
              <rect
                key={`${bi}-${li}`}
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={bar.color}
                rx={2}
              >
                <title>{`${bar.label}: ${v}`}</title>
              </rect>
            );
          })
        )}
        {labels.map((l, i) => (
          <text
            key={l}
            x={padding.left + i * groupW + groupW / 2}
            y={height - 4}
            textAnchor="middle"
            className="fill-ph-mutedtext"
            fontSize="10"
          >
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
}

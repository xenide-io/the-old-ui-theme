"use client";

import { useMemo } from "react";
import { useChartTokens } from "@/lib/chart/use-ph-chart-tokens";
import { cn } from "@/lib/cn";

export interface SparklineProps {
  data: number[];
  color?: string;
  className?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

export function Sparkline({
  data,
  color,
  className,
  width = 80,
  height = 32,
  strokeWidth = 2,
}: SparklineProps) {
  const tokens = useChartTokens();
  const resolvedColor = color ?? tokens.series[0];

  const path = useMemo(() => {
    if (data.length < 2) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const xStep = width / (data.length - 1);

    return data
      .map((v, i) => {
        const x = i * xStep;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }, [data, width, height]);

  if (data.length < 2) return null;

  return (
    <svg
      className={cn("shrink-0", className)}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      suppressHydrationWarning
    >
      <path d={path} fill="none" stroke={resolvedColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

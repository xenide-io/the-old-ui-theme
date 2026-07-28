"use client";

import { useMemo } from "react";
import { useChartTokens } from "@/lib/chart/use-ph-chart-tokens";
import { cn } from "@/lib/cn";

export interface PieChartSlice {
  key: string;
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  slices: PieChartSlice[];
  className?: string;
  size?: number;
}

export function PieChart({ slices, className, size = 200 }: PieChartProps) {
  const tokens = useChartTokens();

  const { total, segments } = useMemo(() => {
    const t = slices.reduce((s, sl) => s + Math.max(0, sl.value), 0);
    let cum = 0;
    const segs = slices.map((sl, i) => {
      const start = cum;
      const val = Math.max(0, sl.value);
      cum += val;
      return {
        ...sl,
        color: sl.color ?? tokens.series[i % tokens.series.length],
        startAngle: (start / t) * 360,
        endAngle: (cum / t) * 360,
        pct: t > 0 ? (val / t) * 100 : 0,
      };
    });
    return { total: t, segments: segs };
  }, [slices, tokens.series]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const ir = r * 0.6;

  const polarToCart = (angleDeg: number, radius: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const describeArc = (start: number, end: number) => {
    if (end - start >= 359.9) {
      const p1 = polarToCart(start, r);
      const p2 = polarToCart(start + 179.9, r);
      const p3 = polarToCart(start + 359.9, r);
      return `M${p1.x},${p1.y} A${r},${r} 0 0,1 ${p2.x},${p2.y} A${r},${r} 0 0,1 ${p3.x},${p3.y} Z`;
    }
    const s = polarToCart(start, r);
    const e = polarToCart(end, r);
    const si = polarToCart(start, ir);
    const ei = polarToCart(end, ir);
    const large = end - start > 180 ? 1 : 0;
    return `M${s.x},${s.y} A${r},${r} 0 ${large},1 ${e.x},${e.y} L${ei.x},${ei.y} A${ir},${ir} 0 ${large},0 ${si.x},${si.y} Z`;
  };

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" suppressHydrationWarning>
        {segments.map((s) => (
          <path key={s.key} d={describeArc(s.startAngle, s.endAngle)} fill={s.color}>
            <title>{`${s.label}: ${s.pct.toFixed(1)}%`}</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r={ir} fill="var(--ph-surface)" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-lg font-bold text-ph-ink tabular-nums">{slices.length}</span>
      </div>
    </div>
  );
}

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

const DEFAULT_SERIES_CYCLE = [1, 2, 3, 4, 5, 6, 7] as const;

export interface MiniTrendBarsProps {
  /** Normalised heights 0–100 for each bar (% of chart row). */
  heights: readonly number[];
  /** Tailwind height of the bars row (flex align-end). Default matches gallery `h-28`. */
  rowClassName?: string;
  /**
   * Map bar index → CSS `--ph-data-*` token index (1–7).
   * Default cycles through PostHog’s default trend palette.
   */
  seriesResolver?: (index: number, height: number) => number;
  className?: string;
}

function clampPct(n: number): number {
  if (!Number.isFinite(n)) {
    return 0;
  }
  return Math.max(0, Math.min(100, n));
}

export function MiniTrendBars({
  heights,
  rowClassName = "h-28",
  seriesResolver,
  className,
}: MiniTrendBarsProps) {
  const resolveSeries =
    seriesResolver ??
    ((i: number) => DEFAULT_SERIES_CYCLE[i % DEFAULT_SERIES_CYCLE.length] ?? 1);

  return (
    <div className={cn("flex items-end gap-0.5", rowClassName, className)}>
      {heights.map((raw, i) => {
        const pct = clampPct(raw);
        const series = resolveSeries(i, pct);
        const style = {
          height: `${pct}%`,
          background: `var(--ph-data-${String(series)})`,
          minHeight: pct > 0 ? 4 : 0,
        } satisfies CSSProperties;

        return <div key={`bar-${String(i)}`} className="min-h-0 flex-1 rounded-t-[3px]" style={style} />;
      })}
    </div>
  );
}

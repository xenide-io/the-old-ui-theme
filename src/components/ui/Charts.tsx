"use client";

import { useChartTokens } from "@/lib/chart/use-ph-chart-tokens";
import { cn } from "@/lib/cn";

export { useChartTokens, type ChartTokens } from "@/lib/chart/use-ph-chart-tokens";

export interface ChartSlice {
  label: string;
  value: number;
  colour?: string;
}

export interface DonutChartProps {
  slices: readonly ChartSlice[];
  label: string;
  formatValue?: (value: number) => string;
  className?: string;
}

export interface BarChartProps {
  items: readonly ChartSlice[];
  formatValue?: (value: number) => string;
  className?: string;
}

export interface StackedBarChartProps {
  slices: readonly ChartSlice[];
  label: string;
  formatValue?: (value: number) => string;
  className?: string;
}

function percent(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function EmptyChart() {
  return <p className="text-sm text-ph-subtle">No data for this period.</p>;
}

function sliceColour(slice: ChartSlice, index: number, series: string[]): string {
  return slice.colour ?? series[index % series.length];
}

export function DonutChart({ slices, label, formatValue, className }: DonutChartProps) {
  const { series } = useChartTokens();
  const visible = slices.filter((slice) => slice.value > 0);
  const total = visible.reduce((sum, slice) => sum + slice.value, 0);
  if (total <= 0) return <EmptyChart />;

  const stops = visible
    .map((slice, index) => {
      const colour = sliceColour(slice, index, series);
      const before = visible
        .slice(0, index)
        .reduce((sum, item) => sum + item.value, 0);
      const start = (before / total) * 360;
      const end = ((before + slice.value) / total) * 360;
      return `${colour} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div className={cn("flex flex-col items-center gap-4 sm:flex-row sm:items-center", className)}>
      <div
        role="img"
        aria-label={label}
        className="relative h-36 w-36 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <span
          className="absolute inset-[22%] rounded-full bg-ph-surface ring-1 ring-ph-border"
          aria-hidden
        />
      </div>
      <ul className="min-w-0 w-full flex-1 space-y-2">
        {visible.map((slice, index) => {
          const colour = sliceColour(slice, index, series);
          return (
            <li key={slice.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-ph-subtle">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: colour }} />
                <span className="truncate">{slice.label}</span>
              </span>
              <span className="shrink-0 tabular-nums text-ph-ink">
                {formatValue ? formatValue(slice.value) : `${percent(slice.value, total)}%`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function BarChart({ items, formatValue, className }: BarChartProps) {
  const { series } = useChartTokens();
  const visible = items.filter((item) => item.value > 0);
  const max = Math.max(...visible.map((item) => item.value), 1);
  if (!visible.length) return <EmptyChart />;

  return (
    <ul className={cn("space-y-3", className)}>
      {visible.map((item, index) => {
        const colour = sliceColour(item, index, series);
        return (
          <li key={item.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-ph-subtle">{item.label}</span>
              <span className="shrink-0 tabular-nums text-ph-ink">
                {formatValue ? formatValue(item.value) : item.value.toLocaleString("en-AU")}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-ph-muted ring-1 ring-ph-border">
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none"
                style={{
                  width: `${Math.max((item.value / max) * 100, 2)}%`,
                  background: colour,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function StackedBarChart({
  slices,
  label,
  formatValue,
  className,
}: StackedBarChartProps) {
  const { series } = useChartTokens();
  const visible = slices.filter((slice) => slice.value > 0);
  const total = visible.reduce((sum, slice) => sum + slice.value, 0);
  if (total <= 0) return <EmptyChart />;

  return (
    <div className={cn("space-y-3", className)}>
      <div
        role="img"
        aria-label={label}
        className="flex h-3 overflow-hidden rounded-full bg-ph-muted ring-1 ring-ph-border"
      >
        {visible.map((slice, index) => (
          <span
            key={slice.label}
            className="h-full"
            style={{
              width: `${Math.max((slice.value / total) * 100, 2)}%`,
              background: sliceColour(slice, index, series),
            }}
          />
        ))}
      </div>
      <ul className="space-y-2">
        {visible.map((slice, index) => {
          const colour = sliceColour(slice, index, series);
          return (
            <li key={slice.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-ph-subtle">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: colour }} />
                <span className="truncate">{slice.label}</span>
              </span>
              <span className="shrink-0 tabular-nums text-ph-ink">
                {formatValue ? formatValue(slice.value) : `${percent(slice.value, total)}%`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

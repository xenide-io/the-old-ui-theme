"use client";

import { scaleLinear, scalePoint } from "d3-scale";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { HogChartTheme, HogLineSeries } from "./hog-charts-types";

/** Matches PostHog `frontend/src/lib/hog-charts/core/hooks/useChartMargins.ts`. */
export const HOG_LITE_DEFAULT_MARGINS = { top: 16, right: 16, bottom: 32, left: 48 } as const;

type ResolvedSeries = HogLineSeries & { resolvedColor: string };

function resolveDisplayedSeries(series: HogLineSeries[], palette: string[]): ResolvedSeries[] {
  const visible = series.filter((s) => !s.visibility?.excluded);
  return visible.map((s, visibleIndex) => {
    const hasExplicit = s.color != null && String(s.color).trim() !== "";
    const resolvedColor = hasExplicit ? String(s.color).trim() : palette[visibleIndex % palette.length];
    return { ...s, resolvedColor };
  });
}

function yDomainForSeries(resolved: ResolvedSeries[]): [number, number] {
  let ymin = Number.POSITIVE_INFINITY;
  let ymax = Number.NEGATIVE_INFINITY;
  for (const s of resolved) {
    for (const v of s.data) {
      if (typeof v === "number" && Number.isFinite(v)) {
        ymin = Math.min(ymin, v);
        ymax = Math.max(ymax, v);
      }
    }
  }
  if (!Number.isFinite(ymin) || !Number.isFinite(ymax)) {
    return [0, 1];
  }
  ymin = Math.min(0, ymin);
  if (ymax < 0) {
    ymax = 0;
  }
  if (ymax === ymin) {
    ymax = ymin + 1;
  }
  return [ymin, ymax];
}

function drawHighlightPoint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  backgroundColor: string,
  radius = 4,
): void {
  ctx.fillStyle = backgroundColor;
  ctx.beginPath();
  ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export interface CanvasTrendLineChartProps {
  labels: readonly string[];
  series: HogLineSeries[];
  theme: HogChartTheme;
  /** Horizontal rules at linear y-axis ticks — same idea as hog-charts `showGrid`. */
  showGrid?: boolean;
  showCrosshair?: boolean;
  /** Optional class on the sizing wrapper (`relative min-h-* w-full`). */
  className?: string;
}

/**
 * Minimal **hog-charts-style** trends chart: Canvas 2D + `d3-scale` point/linear scales,
 * mirroring PostHog's `frontend/src/lib/hog-charts/charts/LineChart.tsx` rendering model
 * (line width 2, round caps, dashed `stroke.pattern`, semi-transparent fills).
 *
 * Not a verbatim copy — PostHog's app uses the full hog-charts stack (interaction, pinning,
 * derived series). This lab keeps the subset needed to match the insight look & feel with
 * our CSS variables.
 */
export function CanvasTrendLineChart({
  labels,
  series,
  theme,
  showGrid = true,
  showCrosshair = true,
  className = "",
}: CanvasTrendLineChartProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const update = () => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const resolved = useMemo(() => resolveDisplayedSeries(series, theme.colors), [series, theme.colors]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return;
    }

    const { width: cssW, height: cssH } = size;
    if (cssW < 20 || cssH < 20) {
      return;
    }

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const m = HOG_LITE_DEFAULT_MARGINS;
    const plotLeft = m.left;
    const plotTop = m.top;
    const plotWidth = cssW - m.left - m.right;
    const plotHeight = cssH - m.top - m.bottom;
    if (plotWidth <= 4 || plotHeight <= 4) {
      return;
    }

    const bg = theme.backgroundColor ?? "#ffffff";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, cssW, cssH);

    const labelList = [...labels];
    const xScale = scalePoint<string>().domain(labelList).range([plotLeft, plotLeft + plotWidth]).padding(0.5);

    const [y0, y1] = yDomainForSeries(resolved);
    const yScale = scaleLinear().domain([y0, y1]).nice().range([plotTop + plotHeight, plotTop]);

    const axisColor = theme.axisColor ?? "#666";
    const gridColor = theme.gridColor ?? "rgba(0,0,0,0.08)";

    if (showGrid) {
      const ticks = yScale.ticks(6);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      for (const t of ticks) {
        const y = Math.round(yScale(t)) + 0.5;
        ctx.beginPath();
        ctx.moveTo(plotLeft, y);
        ctx.lineTo(plotLeft + plotWidth, y);
        ctx.stroke();
      }
    }

    const xAt = (i: number): number | undefined => {
      const label = labels[i];
      return label !== undefined ? xScale(label) : undefined;
    };

    /** Areas first (fills under primary series — same paint order intent as hog-charts). */
    for (const s of resolved) {
      if (s.overlay || !s.fill) {
        continue;
      }
      const opacity = s.fill.opacity ?? 0.45;
      const baseline = yScale(0);
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = s.resolvedColor;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < labels.length; i++) {
        const x = xAt(i);
        const v = s.data[i];
        if (x == null || typeof v !== "number" || !Number.isFinite(v)) {
          started = false;
          continue;
        }
        const y = yScale(v);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      for (let i = labels.length - 1; i >= 0; i--) {
        const x = xAt(i);
        if (x == null) {
          continue;
        }
        ctx.lineTo(x, baseline);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    for (const s of resolved) {
      if (s.visibility?.excluded) {
        continue;
      }
      const pattern = s.stroke?.pattern ?? [];
      ctx.strokeStyle = s.resolvedColor;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.setLineDash(pattern);
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < labels.length; i++) {
        const x = xAt(i);
        const v = s.data[i];
        if (x == null || typeof v !== "number" || !Number.isFinite(v)) {
          started = false;
          continue;
        }
        const y = yScale(v);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = axisColor;
    const bodyFamily =
      typeof document !== "undefined"
        ? window.getComputedStyle(document.body).fontFamily.trim()
        : "ui-sans-serif, system-ui, sans-serif";
    ctx.font = `11px ${bodyFamily || "ui-sans-serif, system-ui, sans-serif"}`;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const yTicks = yScale.ticks(6);
    for (const t of yTicks) {
      const y = yScale(t);
      ctx.fillText(String(Number.isInteger(t) ? t : Number(t.toFixed(2))), plotLeft - 8, y);
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const step = Math.max(1, Math.ceil(labels.length / 8));
    for (let i = 0; i < labels.length; i += step) {
      const x = xAt(i);
      if (x == null) {
        continue;
      }
      const text = labels[i];
      if (text === undefined) {
        continue;
      }
      ctx.fillText(text.length > 8 ? `${text.slice(0, 7)}…` : text, x, plotTop + plotHeight + 8);
    }

    const hi = hoverIndex;
    if (hi != null && hi >= 0 && hi < labels.length && showCrosshair) {
      const cx = xAt(hi);
      if (cx != null) {
        const cross = theme.crosshairColor ?? gridColor;
        ctx.strokeStyle = cross;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx, plotTop);
        ctx.lineTo(cx, plotTop + plotHeight);
        ctx.stroke();
        ctx.setLineDash([]);

        for (const s of resolved) {
          if (s.overlay || s.visibility?.excluded) {
            continue;
          }
          const v = s.data[hi];
          if (typeof v !== "number" || !Number.isFinite(v)) {
            continue;
          }
          const y = yScale(v);
          drawHighlightPoint(ctx, cx, y, s.resolvedColor, bg, 4);
        }
      }
    }
  }, [hoverIndex, labels, resolved, showCrosshair, showGrid, size.height, size.width, theme]);

  useEffect(() => {
    draw();
  }, [draw]);

  const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const mx = event.nativeEvent.offsetX;

    const m = HOG_LITE_DEFAULT_MARGINS;
    const plotLeft = m.left;
    const plotWidth = size.width - m.left - m.right;
    if (plotWidth <= 4) {
      return;
    }

    const labelList = [...labels];
    const xScale = scalePoint<string>().domain(labelList).range([plotLeft, plotLeft + plotWidth]).padding(0.5);

    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    labels.forEach((lab, i) => {
      const xi = xScale(lab);
      if (xi == null) {
        return;
      }
      const d = Math.abs(mx - xi);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setHoverIndex(best);
  };

  const onMouseLeave = () => {
    setHoverIndex(null);
  };

  const tooltipRows = useMemo(() => {
    if (hoverIndex == null) {
      return null;
    }
    const label = labels[hoverIndex];
    if (label === undefined) {
      return null;
    }
    return resolved
      .filter((s) => !s.overlay && !s.visibility?.excluded)
      .map((s) => ({
        label: s.label,
        color: s.resolvedColor,
        value: s.data[hoverIndex],
      }))
      .filter((row) => typeof row.value === "number" && Number.isFinite(row.value));
  }, [hoverIndex, labels, resolved]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`.trim()}>
      <canvas
        ref={canvasRef}
        className="block w-full cursor-crosshair rounded-[2px]"
        aria-label="Trend line chart canvas"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
      {tooltipRows != null && tooltipRows.length > 0 && hoverIndex != null ? (
        <div
          className="pointer-events-none absolute z-20 max-w-xs rounded-[var(--ph-radius-app)] border border-ph-border-strong bg-ph-surface px-3 py-2 text-xs shadow-ph-md"
          style={{
            left: 12,
            top: 8,
          }}
        >
          <div className="font-semibold text-ph-ink">{labels[hoverIndex]}</div>
          <ul className="mt-1 space-y-0.5 text-ph-mutedtext">
            {tooltipRows.map((row) => (
              <li key={row.label} className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: row.color }} />
                <span className="min-w-0 truncate">{row.label}</span>
                <span className="ml-auto tabular-nums text-ph-ink">{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

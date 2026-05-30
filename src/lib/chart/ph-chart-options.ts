import type { ChartConfiguration, ChartOptions } from "chart.js";
import type { ChartTokens } from "@/lib/chart/ph-chart-tokens";
import { withAlpha } from "@/lib/chart/with-alpha";

function readAppRadiusPx(): number {
  if (typeof document === "undefined") {
    return 6;
  }
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--ph-radius-app").trim();
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) {
    return 6;
  }
  return raw.endsWith("rem") ? n * 16 : n;
}

type LinePlugins = NonNullable<ChartOptions<"line">["plugins"]>;
type BarPlugins = NonNullable<ChartOptions<"bar">["plugins"]>;
type LineTooltipOptions = NonNullable<LinePlugins["tooltip"]>;
type BarTooltipOptions = NonNullable<BarPlugins["tooltip"]>;
type BarLegendOptions = NonNullable<BarPlugins["legend"]>;

export function buildInsightLegend(tokens: ChartTokens): NonNullable<LinePlugins["legend"]> {
  return {
    display: true,
    position: "bottom",
    labels: {
      color: tokens.text,
      boxWidth: 10,
      boxHeight: 10,
      padding: 14,
      usePointStyle: true,
      font: { size: 12 },
    },
  };
}

export function buildInsightTooltipLine(tokens: ChartTokens): LineTooltipOptions {
  return {
    backgroundColor: tokens.surface,
    titleColor: tokens.text,
    bodyColor: tokens.textMuted,
    borderColor: tokens.borderStrong,
    borderWidth: 1,
    padding: 12,
    cornerRadius: readAppRadiusPx(),
    displayColors: true,
    caretPadding: 8,
    titleSpacing: 6,
    bodySpacing: 6,
    multiKeyBackground: tokens.surface,
  };
}

export function buildInsightTooltipBar(tokens: ChartTokens): BarTooltipOptions {
  return buildInsightTooltipLine(tokens) as BarTooltipOptions;
}

/** Shared legend/tooltip styling for radial charts (doughnut · polarArea · pie). */
function radialLegend(tokens: ChartTokens) {
  return {
    display: true,
    position: "bottom" as const,
    labels: {
      color: tokens.text,
      boxWidth: 10,
      boxHeight: 10,
      padding: 14,
      usePointStyle: true,
      font: { size: 12 },
    },
  };
}

function radialInsightTooltip(tokens: ChartTokens) {
  return {
    backgroundColor: tokens.surface,
    titleColor: tokens.text,
    bodyColor: tokens.textMuted,
    borderColor: tokens.borderStrong,
    borderWidth: 1,
    padding: 12,
    cornerRadius: readAppRadiusPx(),
    displayColors: true,
    caretPadding: 8,
    titleSpacing: 6,
    bodySpacing: 6,
    multiKeyBackground: tokens.surface,
  };
}

/** Vertical bar — like a single-series **Trends** bar chart or top values breakdown. */
export function buildVerticalBarDemo(tokens: ChartTokens): ChartConfiguration<"bar"> {
  return {
    type: "bar",
    data: {
      labels: ["Chrome", "Safari", "Firefox", "Edge", "Other"],
      datasets: [
        {
          label: "Unique users",
          data: [18_400, 12_100, 4200, 3100, 900],
          backgroundColor: withAlpha(tokens.series[0], 0.85),
          borderColor: tokens.borderStrong,
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: buildInsightTooltipBar(tokens),
      },
      scales: {
        x: {
          border: { display: false },
          ticks: { color: tokens.textMuted, font: { size: 11 } },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          border: { display: false },
          ticks: { color: tokens.textMuted, font: { size: 11 } },
          grid: { color: tokens.grid },
        },
      },
    },
  };
}

/** Horizontal bars — typical for URL / property breakdowns with long labels. */
export function buildHorizontalBarDemo(tokens: ChartTokens): ChartConfiguration<"bar"> {
  return {
    type: "bar",
    data: {
      labels: [
        "/project/settings",
        "/insights/new",
        "/feature-flags",
        "/dashboard",
        "/session-replay",
      ],
      datasets: [
        {
          label: "Pageviews",
          data: [12_800, 9400, 7200, 6100, 4300],
          backgroundColor: [
            withAlpha(tokens.series[0], 0.85),
            withAlpha(tokens.series[1], 0.85),
            withAlpha(tokens.series[2], 0.85),
            withAlpha(tokens.series[3], 0.85),
            withAlpha(tokens.series[4], 0.85),
          ],
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: buildInsightTooltipBar(tokens),
      },
      scales: {
        x: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: tokens.grid },
          ticks: { color: tokens.textMuted, font: { size: 11 } },
        },
        y: {
          border: { display: false },
          grid: { display: false },
          ticks: { color: tokens.textMuted, font: { size: 11 } },
        },
      },
    },
  };
}

/** Stacked bars — analogous to multi-series breakdown / formula insights. */
export function buildStackedBarDemo(tokens: ChartTokens): ChartConfiguration<"bar"> {
  return {
    type: "bar",
    data: {
      labels: ["US", "GB", "DE", "AU", "IN"],
      datasets: [
        {
          label: "Direct",
          data: [120, 98, 45, 40, 210],
          backgroundColor: withAlpha(tokens.series[0], 0.92),
          borderRadius: 4,
        },
        {
          label: "Organic search",
          data: [80, 72, 38, 30, 160],
          backgroundColor: withAlpha(tokens.series[1], 0.92),
          borderRadius: 4,
        },
        {
          label: "Referral",
          data: [44, 22, 18, 12, 90],
          backgroundColor: withAlpha(tokens.series[2], 0.92),
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: buildInsightLegend(tokens) as BarLegendOptions,
        tooltip: buildInsightTooltipBar(tokens),
      },
      scales: {
        x: {
          stacked: true,
          border: { display: false },
          grid: { display: false },
          ticks: { color: tokens.textMuted, font: { size: 11 } },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          border: { display: false },
          grid: { color: tokens.grid },
          ticks: { color: tokens.textMuted, font: { size: 11 } },
        },
      },
    },
  };
}

/** Doughnut (`cutout` ≠ 0) vs pie (`cutout: 0`). Uses `ArcElement`. */
export function buildDoughnutDemo(tokens: ChartTokens): ChartConfiguration<"doughnut"> {
  return {
    type: "doughnut",
    data: {
      labels: ["Direct", "Organic search", "Referral", "Paid", "Other"],
      datasets: [
        {
          label: "Channel mix",
          data: [42, 28, 14, 10, 6],
          backgroundColor: [
            withAlpha(tokens.series[0], 0.88),
            withAlpha(tokens.series[1], 0.88),
            withAlpha(tokens.series[2], 0.88),
            withAlpha(tokens.series[3], 0.88),
            withAlpha(tokens.series[4], 0.88),
          ],
          borderColor: tokens.surface,
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: radialLegend(tokens),
        tooltip: radialInsightTooltip(tokens),
      },
    },
  };
}

/** Polar area — categorical magnitudes on a radial axis (`r` scale). */
export function buildPolarAreaDemo(tokens: ChartTokens): ChartConfiguration<"polarArea"> {
  return {
    type: "polarArea",
    data: {
      labels: ["Chrome", "Safari", "Firefox", "Edge", "Other"],
      datasets: [
        {
          label: "Browser share",
          data: [52, 24, 12, 8, 4],
          backgroundColor: [
            withAlpha(tokens.series[0], 0.72),
            withAlpha(tokens.series[1], 0.72),
            withAlpha(tokens.series[2], 0.72),
            withAlpha(tokens.series[3], 0.72),
            withAlpha(tokens.series[4], 0.72),
          ],
          borderWidth: 1,
          borderColor: tokens.surface,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          ticks: {
            color: tokens.textMuted,
            backdropColor: tokens.surface,
            font: { size: 10 },
          },
          grid: {
            color: tokens.grid,
          },
          angleLines: {
            color: tokens.grid,
          },
          pointLabels: {
            color: tokens.textMuted,
            font: { size: 11 },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: radialInsightTooltip(tokens),
      },
    },
  };
}

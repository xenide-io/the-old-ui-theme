/**
 * Subset of hog-charts `ChartTheme` — see PostHog `frontend/src/lib/hog-charts/core/types.ts`.
 * PostHog renders most product-analytics line/area trends via **hog-charts** (canvas + D3),
 * not Chart.js. MIT License — https://github.com/PostHog/posthog
 */
export interface HogChartTheme {
  colors: string[];
  backgroundColor?: string;
  axisColor?: string;
  gridColor?: string;
  crosshairColor?: string;
}

/**
 * Subset compatible with hog-charts `Series` — see PostHog `frontend/src/lib/hog-charts/core/types.ts`.
 */
export interface HogLineSeries {
  key: string;
  label: string;
  data: number[];
  color?: string;
  stroke?: { pattern?: number[] };
  fill?: { opacity?: number };
  overlay?: boolean;
  visibility?: { excluded?: boolean };
}

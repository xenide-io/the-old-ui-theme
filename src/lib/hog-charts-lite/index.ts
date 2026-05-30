/**
 * hog-charts-style (Canvas + D3-scale) trend — mirrors how PostHog renders line/area insights.
 * @see https://github.com/PostHog/posthog/blob/master/frontend/src/lib/hog-charts/README.md
 */
export type { HogChartTheme, HogLineSeries } from "@/lib/hog-charts-lite/hog-charts-types";
export { buildHogChartTheme } from "@/lib/hog-charts-lite/build-theme";
export { CanvasTrendLineChart, HOG_LITE_DEFAULT_MARGINS } from "@/lib/hog-charts-lite/CanvasTrendLineChart";

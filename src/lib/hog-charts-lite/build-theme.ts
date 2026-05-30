/**
 * Maps theme-lab semantic tokens onto hog-charts-style `ChartTheme` colour slots.
 */
import type { ChartTokens } from "@/lib/chart/ph-chart-tokens";

import type { HogChartTheme } from "./hog-charts-types";

export function buildHogChartTheme(tokens: ChartTokens): HogChartTheme {
  return {
    colors: tokens.series.slice(),
    backgroundColor: tokens.surface,
    axisColor: tokens.textMuted,
    gridColor: tokens.grid,
    crosshairColor: tokens.borderStrong,
  };
}

export interface ChartTokens {
  /** Insight series palette — `--ph-data-1` … `--ph-data-7`. */
  series: string[];
  grid: string;
  text: string;
  textMuted: string;
  surface: string;
  borderStrong: string;
  accent: string;
}

/** Matches default `posthog-light` tokens when CSS is not readable (SSR). */
export const FALLBACK_CHART_TOKENS: ChartTokens = {
  series: ["#1d4aff", "#621da6", "#42827e", "#ce0e74", "#f14f58", "#529a0a", "#fe729e"],
  grid: "hsl(78 13% 85%)",
  text: "hsl(0 0% 25%)",
  textMuted: "hsl(0 0% 42%)",
  surface: "#ffffff",
  borderStrong: "hsl(69 8% 65%)",
  accent: "hsl(19deg 100% 48%)",
};

function readCssVar(el: HTMLElement, key: string): string {
  return getComputedStyle(el).getPropertyValue(key).trim();
}

/** Reads semantic insight colours from the active `data-theme` root. */
export function readChartTokens(root?: HTMLElement): ChartTokens {
  if (typeof document === "undefined") {
    return FALLBACK_CHART_TOKENS;
  }
  const el = root ?? document.documentElement;
  const series = [1, 2, 3, 4, 5, 6, 7].map((index) => {
    const raw = readCssVar(el, `--ph-data-${index}`);
    return raw !== "" ? raw : FALLBACK_CHART_TOKENS.series[index - 1];
  });

  const grid = readCssVar(el, "--ph-border") || FALLBACK_CHART_TOKENS.grid;
  const text = readCssVar(el, "--ph-text-secondary") || FALLBACK_CHART_TOKENS.text;
  const textMuted = readCssVar(el, "--ph-text-tertiary") || FALLBACK_CHART_TOKENS.textMuted;
  const surface = readCssVar(el, "--ph-surface") || FALLBACK_CHART_TOKENS.surface;
  const borderStrong =
    readCssVar(el, "--ph-border-strong") || FALLBACK_CHART_TOKENS.borderStrong;
  const accent = readCssVar(el, "--ph-accent") || FALLBACK_CHART_TOKENS.accent;

  return { series, grid, text, textMuted, surface, borderStrong, accent };
}

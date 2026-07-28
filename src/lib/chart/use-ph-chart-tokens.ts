"use client";

import { useEffect, useState } from "react";

export interface ChartTokens {
  series: string[];
  muted: string;
  surface: string;
}

const DEFAULT_TOKENS: ChartTokens = {
  series: ["#1d4aff", "#621da6", "#42827e", "#ce0e74", "#f14f58", "#529a0a", "#fe729e"],
  muted: "hsl(220 9% 90%)",
  surface: "#ffffff",
};

function readTokens(): ChartTokens {
  if (typeof document === "undefined") return DEFAULT_TOKENS;
  const style = getComputedStyle(document.documentElement);
  const read = (key: string, fallback: string) => style.getPropertyValue(key).trim() || fallback;
  return {
    series: [
      read("--ph-data-1", DEFAULT_TOKENS.series[0]),
      read("--ph-data-2", DEFAULT_TOKENS.series[1]),
      read("--ph-data-3", DEFAULT_TOKENS.series[2]),
      read("--ph-data-4", DEFAULT_TOKENS.series[3]),
      read("--ph-data-5", DEFAULT_TOKENS.series[4]),
      read("--ph-data-6", DEFAULT_TOKENS.series[5]),
      read("--ph-data-7", DEFAULT_TOKENS.series[6]),
    ],
    muted: read("--ph-muted", DEFAULT_TOKENS.muted),
    surface: read("--ph-surface", DEFAULT_TOKENS.surface),
  };
}

export function useChartTokens(): ChartTokens {
  const [tokens, setTokens] = useState(DEFAULT_TOKENS);

  useEffect(() => {
    setTokens(readTokens());
  }, []);

  return tokens;
}

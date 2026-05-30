"use client";

import { useEffect, useState } from "react";
import { FALLBACK_CHART_TOKENS, readChartTokens } from "@/lib/chart/ph-chart-tokens";
import type { ChartTokens } from "@/lib/chart/ph-chart-tokens";

/** Re-reads `--ph-data-*` / border / text tokens whenever `data-theme` changes. */
export function useChartTokens(): ChartTokens {
  const [tokens, setTokens] = useState<ChartTokens>(FALLBACK_CHART_TOKENS);

  useEffect(() => {
    const root = document.documentElement;
    const refresh = () => {
      setTokens(readChartTokens(root));
    };
    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return tokens;
}

import type { InsightShellProps } from "./InsightShell";
import { InsightShell } from "./InsightShell";
import { InsightShellHeader } from "./InsightShellHeader";
import { MiniTrendBars } from "./MiniTrendBars";

export interface InsightMiniCardProps extends Omit<InsightShellProps, "children"> {
  title: string;
  subtitle?: string;
  heights: readonly number[];
}

/** Opinionated insight tile: coloured ribbon + headline + subtitle + mini Hog-style bar sparkline. */
export function InsightMiniCard({
  title,
  subtitle,
  heights,
  ribbonColour,
  ...shellProps
}: InsightMiniCardProps) {
  return (
    <InsightShell ribbonColour={ribbonColour} {...shellProps}>
      <InsightShellHeader title={title} subtitle={subtitle} />
      <MiniTrendBars heights={heights} />
    </InsightShell>
  );
}

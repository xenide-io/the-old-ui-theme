import {
  HogTrendLineChart,
  InsightDoughnutChart,
  InsightHorizontalBarChart,
  InsightPolarAreaChart,
  InsightStackedBarChart,
  InsightVerticalBarChart,
} from "@/components/charts";
import { DashboardWell, InsightShell, InsightShellHeader } from "@/components/dashboard";
import { ShowcaseWrapper } from "@/components/ui";

export default function ChartShowcase() {
  const code = `import { HogTrendLineChart, InsightDoughnutChart, InsightHorizontalBarChart, InsightPolarAreaChart, InsightStackedBarChart, InsightVerticalBarChart } from "the-old-ui";
import { DashboardWell, InsightShell, InsightShellHeader } from "the-old-ui";

<DashboardWell>
  <div className="grid gap-6 lg:grid-cols-2">
    <InsightShell className="min-h-0">
      <InsightShellHeader
        title="Trends (hog-charts model · canvas + d3-scale)"
        subtitle={
          <>
            Same <code className="ph-kbd">Series</code> shape as PostHog (<code className="ph-kbd">stroke.pattern</code>,
            <code className="ph-kbd">fill.opacity</code>), 2&nbsp;px round-capped strokes, horizontal grid, dashed
            crosshair, multi-series hover ring.
          </>
        }
      />
      <HogTrendLineChart />
    </InsightShell>

    <InsightShell className="min-h-0">
      <InsightShellHeader
        title="Vertical bars (Chart.js)"
        subtitle={
          <>
            Bar charts in PostHog&apos;s UI are also built on <code className="ph-kbd">TimeSeriesBarChart</code> /
            <code className="ph-kbd">BarChart</code> in hog-charts; this tile uses Chart.js with the same semantic
            <code className="ph-kbd">--ph-data-*</code> colours.
          </>
        }
      />
      <InsightVerticalBarChart />
    </InsightShell>

    <InsightShell className="min-h-0 lg:col-span-2">
      <InsightShellHeader
        title="Horizontal bar (Chart.js)"
        subtitle={
          <>
            <code className="ph-kbd">indexAxis: &quot;y&quot;</code> mirrors long-label breakdowns (URLs, flags, cohorts).
          </>
        }
      />
      <InsightHorizontalBarChart />
    </InsightShell>

    <InsightShell className="min-h-0 lg:col-span-2">
      <InsightShellHeader
        title="Stacked breakdown (Chart.js)"
        subtitle={
          <>
            Multiple datasets with <code className="ph-kbd">stacked: true</code> — analogous to multi-series bar
            layouts in insights.
          </>
        }
      />
      <InsightStackedBarChart />
    </InsightShell>

    <InsightShell className="min-h-0">
      <InsightShellHeader
        title="Doughnut (Chart.js)"
        subtitle={
          <>
            <code className="ph-kbd">ArcElement</code> + <code className="ph-kbd">cutout</code> for donut slices;
            legend and tooltip use the same CSS-variable palette.
          </>
        }
      />
      <InsightDoughnutChart />
    </InsightShell>

    <InsightShell className="min-h-0">
      <InsightShellHeader
        title="Polar area (Chart.js)"
        subtitle={
          <>
            <code className="ph-kbd">RadialLinearScale</code> for spoke grid lines; useful for compact multi-metric
            comparisons.
          </>
        }
      />
      <InsightPolarAreaChart />
    </InsightShell>
  </div>
</DashboardWell>`;

  return (
    <ShowcaseWrapper
      title="Charts (PostHog-style)"
      description="In the open-source PostHog app, most product-analytics trend lines and areas are drawn with hog-charts — Canvas 2D plus D3 scales. Chart.js remains for some chart types."
      code={code}
      filename="ChartExample.tsx"
    >
      <DashboardWell>
        <div className="grid gap-6 lg:grid-cols-2">
          <InsightShell className="min-h-0">
            <InsightShellHeader
              title="Trends (hog-charts model · canvas + d3-scale)"
              subtitle={
                <>
                  Same <code className="ph-kbd">Series</code> shape as PostHog (<code className="ph-kbd">stroke.pattern</code>,
                  <code className="ph-kbd">fill.opacity</code>), 2&nbsp;px round-capped strokes, horizontal grid, dashed
                  crosshair, multi-series hover ring.
                </>
              }
            />
            <HogTrendLineChart />
          </InsightShell>

          <InsightShell className="min-h-0">
            <InsightShellHeader
              title="Vertical bars (Chart.js)"
              subtitle={
                <>
                  Bar charts in PostHog&apos;s UI are also built on <code className="ph-kbd">TimeSeriesBarChart</code> /
                  <code className="ph-kbd">BarChart</code> in hog-charts; this tile uses Chart.js with the same semantic
                  <code className="ph-kbd">--ph-data-*</code> colours.
                </>
              }
            />
            <InsightVerticalBarChart />
          </InsightShell>

          <InsightShell className="min-h-0 lg:col-span-2">
            <InsightShellHeader
              title="Horizontal bar (Chart.js)"
              subtitle={
                <>
                  <code className="ph-kbd">indexAxis: &quot;y&quot;</code> mirrors long-label breakdowns (URLs, flags, cohorts).
                </>
              }
            />
            <InsightHorizontalBarChart />
          </InsightShell>

          <InsightShell className="min-h-0 lg:col-span-2">
            <InsightShellHeader
              title="Stacked breakdown (Chart.js)"
              subtitle={
                <>
                  Multiple datasets with <code className="ph-kbd">stacked: true</code> — analogous to multi-series bar
                  layouts in insights.
                </>
              }
            />
            <InsightStackedBarChart />
          </InsightShell>

          <InsightShell className="min-h-0">
            <InsightShellHeader
              title="Doughnut (Chart.js)"
              subtitle={
                <>
                  <code className="ph-kbd">ArcElement</code> + <code className="ph-kbd">cutout</code> for donut slices;
                  legend and tooltip use the same CSS-variable palette.
                </>
              }
            />
            <InsightDoughnutChart />
          </InsightShell>

          <InsightShell className="min-h-0">
            <InsightShellHeader
              title="Polar area (Chart.js)"
              subtitle={
                <>
                  <code className="ph-kbd">RadialLinearScale</code> for spoke grid lines; useful for compact multi-metric
                  comparisons.
                </>
              }
            />
            <InsightPolarAreaChart />
          </InsightShell>
        </div>
      </DashboardWell>
    </ShowcaseWrapper>
  );
}

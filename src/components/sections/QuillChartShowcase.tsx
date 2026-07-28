"use client";

import { ShowcaseWrapper } from "@/components/ui";
import { TimeSeriesLineChart, BarChart, PieChart, Sparkline, MetricCard, FunnelChart, InsightShell } from "@/components/charts/quill";

const lineCode = 'import { TimeSeriesLineChart } from "@xenide-io/the-old-ui-theme";\n\n<TimeSeriesLineChart\n  labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}\n  series={[\n    { key: "views", label: "Pageviews", data: [4200, 5100, 4800, 6200, 5900, 3100, 2800] },\n    { key: "signups", label: "Signups", data: [920, 990, 940, 1040, 1012, 540, 510] },\n  ]}\n/>';

const barCode = 'import { BarChart } from "@xenide-io/the-old-ui-theme";\n\n<BarChart\n  labels={["A","B","C","D"]}\n  series={[\n    { key: "s1", label: "Series 1", data: [30, 45, 25, 60] },\n    { key: "s2", label: "Series 2", data: [20, 35, 40, 30] },\n  ]}\n/>';

const pieCode = 'import { PieChart } from "@xenide-io/the-old-ui-theme";\n\n<PieChart\n  slices={[\n    { key: "a", label: "Direct", value: 40 },\n    { key: "b", label: "Organic", value: 30 },\n    { key: "c", label: "Referral", value: 20 },\n    { key: "d", label: "Social", value: 10 },\n  ]}\n/>';

const metricCode = 'import { MetricCard, Sparkline } from "@xenide-io/the-old-ui-theme";\n\n<MetricCard\n  value="89.2k"\n  label="Page Views"\n  change={{ value: 12 }}\n  sparklineData={[65, 72, 68, 80, 95, 88, 92]}\n/>';

export default function QuillChartShowcase() {
  return (
    <>
      <ShowcaseWrapper
        id="quill-timeline"
        title="Quill TimeSeriesLineChart"
        description="Canvas-based trend line chart with optional grid and crosshair."
        code={lineCode}
      >
        <TimeSeriesLineChart
          labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}
          series={[
            { key: "views", label: "Pageviews", data: [4200, 5100, 4800, 6200, 5900, 3100, 2800] },
            { key: "signups", label: "Signups", data: [920, 990, 940, 1040, 1012, 540, 510] },
          ]}
        />
      </ShowcaseWrapper>

      <ShowcaseWrapper
        id="quill-barchart"
        title="Quill BarChart"
        description="Vertical bar chart with multi-series support."
        code={barCode}
      >
        <BarChart
          labels={["A","B","C","D"]}
          series={[
            { key: "s1", label: "Series 1", data: [30, 45, 25, 60] },
            { key: "s2", label: "Series 2", data: [20, 35, 40, 30] },
          ]}
        />
      </ShowcaseWrapper>

      <ShowcaseWrapper
        id="quill-piechart"
        title="Quill PieChart"
        description="Donut chart with slice labels and legend."
        code={pieCode}
      >
        <PieChart
          slices={[
            { key: "a", label: "Direct", value: 40 },
            { key: "b", label: "Organic", value: 30 },
            { key: "c", label: "Referral", value: 20 },
            { key: "d", label: "Social", value: 10 },
          ]}
        />
      </ShowcaseWrapper>

      <ShowcaseWrapper
        id="quill-metriccard"
        title="Quill MetricCard and Sparkline"
        description="Metric stat card with sparkline trend."
        code={metricCode}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            value="89.2k"
            label="Page Views"
            change={{ value: 12 }}
            sparklineData={[65, 72, 68, 80, 95, 88, 92]}
          />
          <MetricCard
            value="2,847"
            label="Active Users"
            change={{ value: 3 }}
            sparklineData={[42, 48, 45, 52, 50, 48, 55]}
          />
          <MetricCard
            value="23.1%"
            label="Conversion Rate"
            change={{ value: -1.2, positive: false }}
            sparklineData={[24, 23, 23.5, 22.8, 23.2, 22.5, 23.1]}
          />
        </div>
      </ShowcaseWrapper>
    </>
  );
}

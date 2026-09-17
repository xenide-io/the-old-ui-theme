"use client";

import { BarChart, ComponentDocs, DonutChart, ShowcaseWrapper, StackedBarChart } from "@/components/ui";

const slices = [
  { label: "Activities", value: 18 },
  { label: "Tasks done", value: 11 },
  { label: "Documents", value: 7 },
];

export default function ChartsShowcase() {
  const code = `import { BarChart, DonutChart, StackedBarChart } from "@xenide-io/the-old-ui-theme/ui";

<DonutChart label="Work mix" slices={slices} />
<BarChart items={slices} />
<StackedBarChart label="Work mix" slices={slices} />`;

  return (
    <ShowcaseWrapper
      id="charts"
      title="Charts"
      description="Token-coloured donut, bar, and stacked bar charts. No Chart.js — they read --ph-data-* so light and dark themes stay in sync."
      code={code}
      filename="ChartsExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "DonutChart", type: "component", description: "Proportional mix with a legend. Pass formatValue for hours or counts." },
            { name: "BarChart", type: "component", description: "Horizontal comparison bars scaled to the largest item." },
            { name: "StackedBarChart", type: "component", description: "Single 100% bar plus a legend for mix charts." },
            { name: "useChartTokens", type: "hook", description: "Live --ph-data-* series colours from the active theme." },
          ]}
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <DonutChart label="Work mix" slices={slices} />
        <BarChart items={slices} />
        <StackedBarChart label="Work mix" slices={slices} />
      </div>
    </ShowcaseWrapper>
  );
}

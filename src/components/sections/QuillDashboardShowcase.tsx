"use client";

import { ShowcaseWrapper } from "@/components/ui";
import { InsightShell, MetricCard } from "@/components/charts/quill";
import { TimeSeriesLineChart, BarChart, PieChart, FunnelChart, Sparkline } from "@/components/charts/quill";

export default function QuillDashboardShowcase() {
  return (
    <>
      <ShowcaseWrapper
        id="quill-dashboard"
        title="Quill Dashboard Shells"
        description="InsightShell panels for wrapping Quill charts."
        code={`import { InsightShell } from "@xenide-io/the-old-ui-theme";
import { TimeSeriesLineChart } from "@xenide-io/the-old-ui-theme";`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InsightShell title="Weekly Active Users" subtitle="Last 14 days" ribbonColor="var(--ph-data-1)">
            <TimeSeriesLineChart
              labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}
              series={[{ key: "wau", label: "WAU", data: [4200, 5100, 4800, 6200, 5900, 3100, 2800] }]}
              height={180}
            />
          </InsightShell>
          <InsightShell title="Conversion Funnel" subtitle="Step-by-step dropoff" ribbonColor="var(--ph-data-2)">
            <FunnelChart
              steps={[
                { label: "Page Visit", count: 12000 },
                { label: "Sign Up", count: 5400 },
                { label: "Onboarding", count: 3200 },
                { label: "Active Use", count: 1800 },
              ]}
            />
          </InsightShell>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        id="quill-funnel"
        title="Quill Funnel Chart"
        description="Conversion funnel with dropoff percentages."
        code={`import { FunnelChart } from "@xenide-io/the-old-ui-theme";

<FunnelChart
  steps={[
    { label: "Visitors", count: 12000 },
    { label: "Signups", count: 5400 },
    { label: "Activated", count: 1800 },
  ]}
/>`}
      >
        <div className="max-w-md">
          <FunnelChart
            steps={[
              { label: "Website Visits", count: 45000 },
              { label: "Product Page", count: 28000 },
              { label: "Added to Cart", count: 12000 },
              { label: "Checkout Started", count: 6500 },
              { label: "Purchase Complete", count: 4200 },
            ]}
          />
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        id="quill-metrics-grid"
        title="Quill Metrics Grid"
        description="Metric cards with sparklines for dashboard KPIs."
        code={`import { MetricCard } from "@xenide-io/the-old-ui-theme";`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            value="$128.4k"
            label="Revenue"
            change={{ value: 12.5 }}
            sparklineData={[80, 95, 88, 102, 110, 108, 128]}
          />
          <MetricCard
            value="4,847"
            label="Active Users"
            change={{ value: 8.3 }}
            sparklineData={[42, 48, 45, 52, 50, 48, 55]}
          />
          <MetricCard
            value="32.1%"
            label="Conversion"
            change={{ value: -2.1, positive: false }}
            sparklineData={[34, 33, 33.5, 32.8, 32.2, 31.5, 32.1]}
          />
          <MetricCard
            value="2.4s"
            label="Avg. Load Time"
            change={{ value: -15, positive: true }}
            sparklineData={[3.2, 2.8, 2.9, 2.6, 2.5, 2.4, 2.4]}
          />
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        id="quill-charts-overview"
        title="Quill Charts Overview"
        description="All Quill chart types in one place."
        code={`import { BarChart, PieChart, Sparkline } from "@xenide-io/the-old-ui-theme";`}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <InsightShell title="Bar Chart" subtitle="Multi-series bars">
            <BarChart
              labels={["A","B","C","D"]}
              series={[
                { key: "s1", label: "S1", data: [30, 45, 25, 60] },
                { key: "s2", label: "S2", data: [20, 35, 40, 30] },
              ]}
              height={180}
            />
          </InsightShell>
          <InsightShell title="Pie Chart" subtitle="Distribution">
            <div className="flex justify-center">
              <PieChart
                slices={[
                  { key: "a", label: "Direct", value: 40 },
                  { key: "b", label: "Organic", value: 30 },
                  { key: "c", label: "Referral", value: 20 },
                  { key: "d", label: "Social", value: 10 },
                ]}
                size={180}
              />
            </div>
          </InsightShell>
          <InsightShell title="Sparklines" subtitle="Inline mini-trends">
            <div className="space-y-4">
              {[
                { label: "Page Views", data: [65, 72, 68, 80, 95, 88, 92], color: "var(--ph-data-1)" },
                { label: "Signups", data: [20, 25, 22, 30, 28, 35, 40], color: "var(--ph-data-2)" },
                { label: "Revenue", data: [80, 95, 88, 102, 110, 108, 128], color: "var(--ph-data-3)" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <Sparkline data={s.data} color={s.color} width={80} height={24} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ph-ink">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </InsightShell>
        </div>
      </ShowcaseWrapper>
    </>
  );
}

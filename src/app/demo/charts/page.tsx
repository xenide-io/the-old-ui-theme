"use client";

import QuillChartShowcase from "@/components/sections/QuillChartShowcase";
import QuillDashboardShowcase from "@/components/sections/QuillDashboardShowcase";
import TableShowcase from "@/components/sections/TableShowcase";
import TimelineShowcase from "@/components/sections/TimelineShowcase";

import { DemoPage } from "../demo-page";

export default function ChartsDemoPage() {
  return (
    <DemoPage
      eyebrow="Data surfaces"
      title="Charts & data"
      description="Token-aware visualization and information-dense compositions, isolated from the primitive and pattern demos."
    >
      <QuillDashboardShowcase />
      <QuillChartShowcase />
      <TableShowcase />
      <TimelineShowcase />
    </DemoPage>
  );
}

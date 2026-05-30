"use client";

import { useState } from "react";
import { ComponentDocs, ShowcaseWrapper, Tabs } from "@/components/ui";

const pillItems = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
  { value: "settings", label: "Settings" },
];

const insightItems = [
  { value: "funnels", label: "Funnels" },
  { value: "trends", label: "Trends" },
  { value: "retention", label: "Retention" },
];

const insightCopy: Record<string, string> = {
  funnels: "Step-through conversion diagnostics for each stage of your onboarding.",
  trends: "Arithmetic, formulas, breakdowns — the default insight landing state.",
  retention: "Cohort resurfacing curves with optional granularity controls.",
};

export default function TabShowcase() {
  const [pill, setPill] = useState("overview");
  const [insight, setInsight] = useState("funnels");

  const code = `import { Tabs } from "the-old-ui";

<div className="grid gap-8 lg:grid-cols-2">
  <div className="ph-panel">
    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Floating pill track</h3>
    <Tabs items={pillItems} value={pill} onChange={setPill} />
    <p className="mt-6 text-sm text-ph-subtle">
      Mirrors the softly inset control groups from the product chrome — muted rail + white thumb.
    </p>
  </div>

  <div className="ph-panel space-y-4">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Underline tabs</h3>
    <Tabs items={insightItems} value={insight} onChange={setInsight} variant="underline" />
    <div className="rounded-lg border border-ph-border bg-ph-surface p-5 shadow-ph">
      <p className="text-sm leading-relaxed text-ph-subtle">{insightCopy[insight]}</p>
    </div>
  </div>
</div>`;

  return (
    <ShowcaseWrapper
      title="Tabs"
      description="Controlled tab primitive with pill and underline variants."
      code={code}
      filename="TabsExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "items", type: "{ value; label }[]", description: "Tab labels and values." },
            { name: "value", type: "string", description: "Current tab value." },
            { name: "onChange", type: "(value: string) => void", description: "Called when a tab is selected." },
            { name: "variant", type: "pill | underline", defaultValue: "pill", description: "Visual tab style." },
          ]}
        />
      }
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="ph-panel">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Floating pill track</h3>
          <Tabs items={pillItems} value={pill} onChange={setPill} />
          <p className="mt-6 text-sm text-ph-subtle">
            Mirrors the softly inset control groups from the product chrome — muted rail + white thumb.
          </p>
        </div>

        <div className="ph-panel space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Underline tabs</h3>
          <Tabs items={insightItems} value={insight} onChange={setInsight} variant="underline" />
          <div className="rounded-lg border border-ph-border bg-ph-surface p-5 shadow-ph">
            <p className="text-sm leading-relaxed text-ph-subtle">{insightCopy[insight]}</p>
          </div>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

"use client";

import { useState } from "react";
import { ComponentDocs, SegmentedControl, ShowcaseWrapper } from "@/components/ui";
import { IconGridView, IconListView } from "@/components/icons";

export default function SegmentedControlShowcase() {
  const [view, setView] = useState("grid");

  const options = [
    { value: "grid", label: "Grid", icon: <IconGridView className="h-4 w-4" /> },
    { value: "list", label: "List", icon: <IconListView className="h-4 w-4" /> },
  ];

  const code = `import { SegmentedControl } from "the-old-ui";
import { IconGridView, IconListView } from "the-old-ui";

<div className="ph-panel">
  <SegmentedControl options={options} value={view} onChange={setView} />
  <div className="mt-4 rounded-lg bg-ph-muted p-4 text-sm text-ph-subtle">
    Selected: <span className="font-semibold text-ph-ink">{view}</span>
  </div>
</div>`;

  return (
    <ShowcaseWrapper
      title="Segmented Control"
      description="Compact controlled switch for mutually exclusive display modes."
      code={code}
      filename="SegmentedControlExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "options", type: "{ value; label; icon? }[]", description: "Segments to render." },
            { name: "value", type: "string", description: "Currently selected value." },
            { name: "onChange", type: "(value: string) => void", description: "Called when a segment is selected." },
          ]}
        />
      }
    >
      <div className="ph-panel">
        <SegmentedControl options={options} value={view} onChange={setView} />
        <div className="mt-4 rounded-lg bg-ph-muted p-4 text-sm text-ph-subtle">
          Selected: <span className="font-semibold text-ph-ink">{view}</span>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

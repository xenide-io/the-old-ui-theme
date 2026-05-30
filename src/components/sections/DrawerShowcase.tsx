"use client";

import { useState } from "react";
import {
  IconCohort,
  IconCumulativeChart,
  IconFlag,
  IconFlask,
  IconHome,
  IconPanelRight,
  IconTuning,
} from "@/components/icons";
import { Button, ComponentDocs, Drawer, ShowcaseWrapper } from "@/components/ui";

const navItems = [
  { icon: IconHome, label: "Dashboard" },
  { icon: IconCumulativeChart, label: "Insights" },
  { icon: IconCohort, label: "Persons" },
  { icon: IconFlag, label: "Feature flags" },
  { icon: IconFlask, label: "Experiments" },
  { icon: IconTuning, label: "Settings" },
];

export default function DrawerShowcase() {
  const [open, setOpen] = useState(false);

  const code = `import { IconCohort, IconCumulativeChart, IconFlag, IconFlask, IconHome, IconPanelRight, IconTuning } from "the-old-ui";
import { Button, Drawer } from "the-old-ui";

<div className="ph-panel">
  <Button
    variant="primary"
    icon={<IconPanelRight className="h-4 w-4" aria-hidden />}
    onClick={() => setOpen(true)}
  >
    Inspect graph
  </Button>

  <Drawer open={open} onClose={() => setOpen(false)} title="Insight controls">
    <nav className="flex flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.label} type="button" className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-ph-subtle transition hover:bg-ph-muted">
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </button>
        );
      })}
    </nav>
  </Drawer>
</div>`;

  return (
    <ShowcaseWrapper
      title="Drawers"
      description="Slide-out panels with overlay backdrop — useful for secondary navigation, detail views, or configuration panels."
      code={code}
      filename="DrawerExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "open", type: "boolean", defaultValue: "false", description: "Controls drawer visibility." },
            { name: "onClose", type: "() => void", description: "Called by backdrop and close button." },
            { name: "side", type: "left | right", defaultValue: "right", description: "Which side the drawer enters from." },
            { name: "size", type: "sm | md | lg", defaultValue: "md", description: "Controls drawer width." },
            { name: "title", type: "ReactNode", description: "Optional header title." },
          ]}
        />
      }
    >
      <div className="ph-panel">
        <Button
          variant="primary"
          icon={<IconPanelRight className="h-4 w-4" aria-hidden />}
          onClick={() => setOpen(true)}
        >
          Inspect graph
        </Button>

        <Drawer open={open} onClose={() => setOpen(false)} title="Insight controls">
          <nav className="flex flex-col gap-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} type="button" className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-ph-subtle transition hover:bg-ph-muted">
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </Drawer>
      </div>
    </ShowcaseWrapper>
  );
}

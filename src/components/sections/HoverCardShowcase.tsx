"use client";

import { Badge, Button, ComponentDocs, HoverCard, ShowcaseWrapper } from "@/components/ui";

export default function HoverCardShowcase() {
  const code = `import { Badge, Button, HoverCard } from "the-old-ui";

<div className="ph-panel flex justify-center py-12">
  <HoverCard trigger={<Button>Hover me</Button>}>
    <div className="space-y-2">
      <h4 className="font-semibold text-ph-ink">User Profile</h4>
      <p className="text-sm text-ph-subtle">This is a hover card with rich content that appears on hover.</p>
      <div className="flex gap-2 pt-2">
        <Badge variant="brand">Admin</Badge>
        <Badge variant="neutral">Pro</Badge>
      </div>
    </div>
  </HoverCard>
</div>`;

  return (
    <ShowcaseWrapper
      title="Hover Card"
      description="Rich hover disclosure for contextual details."
      code={code}
      filename="HoverCardExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "trigger", type: "ReactNode", description: "Element users hover or focus." },
            { name: "children", type: "ReactNode", description: "Content shown in the card." },
          ]}
        />
      }
    >
      <div className="ph-panel flex justify-center py-12">
        <HoverCard trigger={<Button>Hover me</Button>}>
          <div className="space-y-2">
            <h4 className="font-semibold text-ph-ink">User Profile</h4>
            <p className="text-sm text-ph-subtle">This is a hover card with rich content that appears on hover.</p>
            <div className="flex gap-2 pt-2">
              <Badge variant="brand">Admin</Badge>
              <Badge variant="neutral">Pro</Badge>
            </div>
          </div>
        </HoverCard>
      </div>
    </ShowcaseWrapper>
  );
}

"use client";

import {
  Badge,
  Chip,
  ComponentDocs,
  Dot,
  Link,
  Panel,
  ShowcaseWrapper,
  Spinner,
  Stat,
} from "@/components/ui";

export default function PrimitivesShowcase() {
  const code = `import { Chip, Dot, Link, Spinner, Stat } from "@xenide-io/the-old-ui-theme/ui";

<Stat label="Tracked this week" value="32h 15m" />

<Chip onRemove={() => clearStatus()}>Status: Active</Chip>

<Dot color="green" />  <Spinner size="sm" />

<Link href="/docs">Read the docs</Link>`;

  return (
    <ShowcaseWrapper
      id="primitives"
      title="Status & metric primitives"
      description="The small pieces the product apps lean on for dashboards, filter summaries, and inline state."
      code={code}
      filename="PrimitivesExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "Stat", type: "component", description: "Metric with label, value, optional icon, footer, and tone." },
            { name: "Chip", type: "component", description: "Compact pill; passing onRemove adds a separate, focusable remove button." },
            { name: "Dot", type: "green | yellow | red | blue | gray", description: "Semantic status dot for list rows and legends." },
            { name: "Spinner", type: "sm | md | lg", description: "Inline indeterminate spinner for buttons and panels." },
            { name: "Link", type: "component", description: "Token-aware anchor with underline and focus treatment." },
          ]}
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Metrics" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Stat label="Tracked this week" value="32h 15m" />
            <Stat label="Active projects" value="7" tone="brand" />
          </div>
        </Panel>

        <Panel title="Applied filters" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Chip onRemove={() => {}}>Status: Active</Chip>
            <Chip onRemove={() => {}}>Client: Northwind</Chip>
            <Chip selected>Billable</Chip>
          </div>
        </Panel>

        <Panel title="Inline state" className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-ph-subtle">
            <span className="inline-flex items-center gap-2">
              <Dot color="green" /> Synced
            </span>
            <span className="inline-flex items-center gap-2">
              <Dot color="yellow" /> Pending review
            </span>
            <span className="inline-flex items-center gap-2">
              <Dot color="red" /> Failed
            </span>
            <span className="inline-flex items-center gap-2">
              <Spinner size="sm" /> Importing
            </span>
          </div>
        </Panel>

        <Panel title="Links & tags" className="space-y-4">
          <p className="text-sm text-ph-subtle">
            Read the <Link href="#primitives">component reference</Link> before adding a new primitive.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="brand">Beta</Badge>
            <Badge variant="neutral">Internal</Badge>
          </div>
        </Panel>
      </div>
    </ShowcaseWrapper>
  );
}

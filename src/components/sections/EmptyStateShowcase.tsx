"use client";

import { Button, ComponentDocs, EmptyState, ShowcaseWrapper } from "@/components/ui";
import { IconBox, IconPlus } from "@/components/icons";

export default function EmptyStateShowcase() {
  const code = `import { Button, EmptyState } from "the-old-ui";
import { IconBox, IconPlus } from "the-old-ui";

<EmptyState
  icon={<IconBox className="h-7 w-7" />}
  title="No projects yet"
  description="Get started by creating your first project to organize your analytics."
  action={
    <Button icon={<IconPlus className="h-4 w-4" />}>
      Create Project
    </Button>
  }
/>`;

  return (
    <ShowcaseWrapper
      title="Empty State"
      description="Reusable blank-state component for zero data, filtered results, or onboarding prompts."
      code={code}
      filename="EmptyStateExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "icon", type: "ReactNode", description: "Optional visual icon." },
            { name: "title", type: "string", description: "Primary message." },
            { name: "description", type: "string", description: "Supporting copy." },
            { name: "action", type: "ReactNode", description: "Primary CTA slot." },
          ]}
        />
      }
    >
      <EmptyState
        icon={<IconBox className="h-7 w-7" />}
        title="No projects yet"
        description="Get started by creating your first project to organize your analytics."
        action={
          <Button icon={<IconPlus className="h-4 w-4" />}>
            Create Project
          </Button>
        }
      />
    </ShowcaseWrapper>
  );
}

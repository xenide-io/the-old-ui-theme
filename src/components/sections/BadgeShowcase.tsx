import { Badge, ComponentDocs, ShowcaseWrapper } from "@/components/ui";

export default function BadgeShowcase() {
  const code = `import { Badge } from "the-old-ui";

<div className="ph-panel space-y-6">
  <div>
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Semantic</h3>
    <div className="flex flex-wrap gap-2">
      <Badge variant="brand">Beta</Badge>
      <Badge variant="neutral">Archived</Badge>
      <Badge variant="success">Live</Badge>
      <Badge variant="warning">Queued</Badge>
      <Badge variant="danger">Failed</Badge>
      <Badge variant="info">Docs</Badge>
    </div>
  </div>
  <div>
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Outline</h3>
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">Feature flag</Badge>
      <Badge variant="outline">Experiment</Badge>
    </div>
  </div>
</div>`;

  return (
    <ShowcaseWrapper
      title="Badges"
      description="Use badges for compact status, category, and product metadata. Defaults work without classes; use props for variants."
      code={code}
      filename="BadgeExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "variant", type: "brand | neutral | success | warning | danger | info | outline", defaultValue: "neutral", description: "Controls semantic colour and border treatment." },
            { name: "size", type: "sm | md", defaultValue: "md", description: "Use sm for dense tables or compact nav." },
            { name: "className", type: "string", description: "Optional escape hatch for layout-only overrides." },
          ]}
        />
      }
    >
      <div className="ph-panel space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Semantic</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="brand">Beta</Badge>
            <Badge variant="neutral">Archived</Badge>
            <Badge variant="success">Live</Badge>
            <Badge variant="warning">Queued</Badge>
            <Badge variant="danger">Failed</Badge>
            <Badge variant="info">Docs</Badge>
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Outline</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Feature flag</Badge>
            <Badge variant="outline">Experiment</Badge>
          </div>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

import { Avatar, AvatarGroup, ComponentDocs, ShowcaseWrapper } from "@/components/ui";

export default function AvatarShowcase() {
  const code = `import { Avatar, AvatarGroup } from "the-old-ui";

<div className="grid gap-8 lg:grid-cols-2">
  <div className="ph-panel space-y-4">
    <h3>Sizes</h3>
    <Avatar label="XL" size="xl" color="bg-ph-brand text-white" />
    <Avatar label="LG" size="lg" color="bg-ph-blue text-white" />
    <Avatar label="MD" size="md" color="bg-ph-purple text-white" />
    <Avatar label="SM" size="sm" color="bg-ph-toolbar text-ph-ink" />
  </div>

  <div className="ph-panel space-y-5">
    <h3>Stacked collaborators</h3>
    <AvatarGroup>
      <Avatar label="MJ" color="bg-orange-400 text-orange-950" />
      <Avatar label="AR" color="bg-sky-500 text-white" />
      <Avatar label="CK" color="bg-violet-600 text-white" />
    </AvatarGroup>

    <div className="flex gap-4">
      <Avatar label="ON" color="bg-emerald-200 text-emerald-950" status="online" />
      <Avatar label="JD" color="bg-ph-muted text-ph-ink" status="offline" />
      <Avatar label="CP" color="bg-amber-200 text-amber-950" badge="12" />
    </div>
  </div>
</div>`;

  return (
    <ShowcaseWrapper
      title="Avatars"
      description="Reusable avatar component with sizes, status indicators, badges, and group stacking."
      code={code}
      filename="AvatarExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "label", type: "string", description: "Text initials or label." },
            { name: "size", type: "xs | sm | md | lg | xl", defaultValue: "md", description: "Avatar size." },
            { name: "color", type: "string", defaultValue: "bg-ph-brand text-white", description: "Tailwind colour classes." },
            { name: "status", type: "online | offline | away | busy", description: "Status indicator dot." },
            { name: "badge", type: "string", description: "Badge count/text." },
            { name: "icon", type: "ReactNode", description: "Optional icon or image." },
          ]}
        />
      }
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="ph-panel space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Sizes</h3>
          <div className="flex flex-wrap items-end gap-5">
            <Avatar label="XL" size="xl" color="bg-ph-brand text-white" />
            <Avatar label="LG" size="lg" color="bg-ph-blue text-white" />
            <Avatar label="MD" size="md" color="bg-ph-purple text-white" />
            <Avatar label="SM" size="sm" color="bg-ph-toolbar text-ph-ink" />
            <Avatar label="XS" size="xs" color="bg-ph-muted text-ph-ink" />
          </div>
        </div>

        <div className="ph-panel space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Stacked collaborators</h3>
          <AvatarGroup max={3}>
            <Avatar label="MJ" color="bg-orange-400 text-orange-950" />
            <Avatar label="AR" color="bg-sky-500 text-white" />
            <Avatar label="CK" color="bg-violet-600 text-white" />
            <Avatar label="+9" color="bg-ph-toolbar text-ph-subtle" />
          </AvatarGroup>

          <div className="flex gap-4">
            <Avatar label="ON" color="bg-emerald-200 text-emerald-950" status="online" />
            <Avatar label="JD" color="bg-ph-muted text-ph-ink" status="offline" />
            <Avatar label="CP" color="bg-amber-200 text-amber-950" badge="12" />
          </div>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

import { Alert, ComponentDocs, ShowcaseWrapper } from "@/components/ui";

export default function AlertShowcase() {
  const code = `import { Alert } from "@xenide-io/the-old-ui-theme";

<div className="space-y-4">
  <Alert status="info" title="Pipeline delay" description="Events are flowing; warehouse sync may lag by ~2 minutes." />
  <Alert status="success" title="Flag shipped" description="The multivariate rollout finished for all environments." />
  <Alert status="warning" title="Sample rate adjusted" description="Replay capture dropped to 20% until billing resets." />
  <Alert status="danger" title="Exporter error" description="Snowflake credential rotation failed — check IAM role ARN." />
</div>`;

  return (
    <ShowcaseWrapper
      title="Alerts"
      description="Status messages with built-in icon, title, description, and optional dismiss action."
      code={code}
      filename="AlertExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "status", type: "info | success | warning | danger", defaultValue: "info", description: "Controls icon, border, and semantic colour." },
            { name: "title", type: "string", description: "Short message title." },
            { name: "description", type: "string", description: "Supporting message copy." },
            { name: "onDismiss", type: "() => void", description: "Shows a close button when provided." },
            { name: "icon", type: "ReactNode", description: "Optional custom icon override." },
            { name: "live", type: "off | polite | assertive", description: "Opt into live-region announcements for content that appears dynamically." },
          ]}
        />
      }
    >
      <div className="space-y-4">
        <Alert status="info" title="Pipeline delay" description="Events are flowing; warehouse sync may lag by ~2 minutes." />
        <Alert status="success" title="Flag shipped" description="The multivariate rollout finished for all environments." />
        <Alert status="warning" title="Sample rate adjusted" description="Replay capture dropped to 20% until billing resets." />
        <Alert status="danger" title="Exporter error" description="Snowflake credential rotation failed — check IAM role ARN." />
      </div>
    </ShowcaseWrapper>
  );
}

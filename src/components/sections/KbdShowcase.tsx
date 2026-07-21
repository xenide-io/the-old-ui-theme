import { ComponentDocs, Kbd, Panel, ShowcaseWrapper } from "@/components/ui";

export default function KbdShowcase() {
  const code = `import { Kbd, Panel } from "@xenide-io/the-old-ui-theme";

<Panel className="space-y-5">
  <div className="flex flex-wrap items-center gap-4">
    <Kbd keys={["Command", "K"]} platform="mac" />
    <Kbd keys={["Control", "K"]} platform="windows" />
    <Kbd keys={["Control", "K"]} />
  </div>
  <div className="flex flex-wrap items-center gap-3">
    <Kbd variant="key">Escape</Kbd>
    <Kbd variant="key">↵</Kbd>
    <Kbd variant="token">HogQL</Kbd>
  </div>
</Panel>`;

  return (
    <ShowcaseWrapper
      title="Keyboard glyphs"
      description="PostHog-style joined shortcut caps with crisp lower borders, monospace type, and separate inline code tokens."
      code={code}
      filename="KbdExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "variant", type: "shortcut | key | token", defaultValue: "shortcut", description: "Chooses a shortcut group, single physical key, or inline code token." },
            { name: "keys", type: "readonly ReactNode[]", description: "Joins a shortcut chord inside one compact cap without stringifying React nodes." },
            { name: "platform", type: "text | mac | windows", defaultValue: "text", description: "Converts named modifier keys only when explicitly requested." },
            { name: "separator", type: "ReactNode", description: "Optional visual separator inside the joined shortcut cap." },
            { name: "aria-label", type: "string", description: "Optional spoken shortcut override; textual keys generate one automatically." },
          ]}
        />
      }
    >
      <Panel className="space-y-5">
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Platform shortcuts</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Kbd keys={["Command", "K"]} platform="mac" />
            <Kbd keys={["Control", "K"]} platform="windows" />
            <Kbd keys={["Control", "K"]} />
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Keys and tokens</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Kbd variant="key">Escape</Kbd>
            <Kbd variant="key">↵</Kbd>
            <Kbd variant="token">HogQL</Kbd>
          </div>
        </div>
      </Panel>
    </ShowcaseWrapper>
  );
}

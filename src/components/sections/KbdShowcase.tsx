import { Kbd, Panel, ShowcaseWrapper } from "@/components/ui";

export default function KbdShowcase() {
  const code = `import { Kbd, Panel } from "the-old-ui";

<Panel className="flex flex-wrap items-center gap-3 text-ph-subtle">
  <Kbd keys={["⌘", "K"]} />
  <span className="text-xs font-semibold text-ph-mutedtext">/</span>
  <Kbd keys={["⌥", "⇧", "E"]} />
  <span className="text-xs font-semibold text-ph-mutedtext">/</span>
  <Kbd variant="token">HogQL</Kbd>
  <p className="w-full pt-5 text-xs text-ph-mutedtext">
    Keyboard hints and code tokens are rendered through the same reusable component.
  </p>
</Panel>`;

  return (
    <ShowcaseWrapper title="Keyboard glyphs" code={code} filename="KbdExample.tsx">
      <Panel className="flex flex-wrap items-center gap-3 text-ph-subtle">
        <Kbd keys={["⌘", "K"]} />
        <span className="text-xs font-semibold text-ph-mutedtext">/</span>
        <Kbd keys={["⌥", "⇧", "E"]} />
        <span className="text-xs font-semibold text-ph-mutedtext">/</span>
        <Kbd variant="token">HogQL</Kbd>
        <p className="w-full pt-5 text-xs text-ph-mutedtext">
          Keyboard hints and code tokens are rendered through the same reusable component.
        </p>
      </Panel>
    </ShowcaseWrapper>
  );
}

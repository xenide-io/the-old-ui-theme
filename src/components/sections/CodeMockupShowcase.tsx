import { IconQueryEditor } from "@/components/icons";
import { ComponentDocs, ShowcaseWrapper, Terminal } from "@/components/ui";

export default function CodeMockupShowcase() {
  const code = `import { Terminal } from "the-old-ui";

<Terminal
  title="sandbox · posthog-wizard"
  lines={[
    { text: "❯ bun add posthog-js", color: "text-neutral-600" },
    { text: "● added posthog-js@1...", color: "text-emerald-400" },
    { text: "❯ POSTHOG_KEY=...", color: "text-neutral-600" },
  ]}
/>`;

  return (
    <ShowcaseWrapper
      title="Terminal capture"
      description="Terminal and replay shells for documentation, demos, and embedded developer flows."
      code={code}
      filename="TerminalExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "title", type: "string", description: "Window title in the header." },
            { name: "lines", type: "Array<{ text; color? }>", description: "Terminal lines to render." },
            { name: "children", type: "ReactNode", description: "Custom content instead of lines." },
          ]}
        />
      }
    >
      <div className="space-y-10">
        <Terminal
          title="sandbox · posthog-wizard"
          lines={[
            { text: "❯ bun add posthog-js", color: "text-neutral-600" },
            { text: "● added posthog-js@1...", color: "text-emerald-400" },
            { text: "❯ POSTHOG_KEY=...", color: "text-neutral-600" },
          ]}
        />

        <div className="rounded-xl border border-ph-border shadow-ph-md">
          <header className="relative flex items-center justify-center border-b border-ph-border px-10 py-3 text-[11px] font-semibold text-ph-mutedtext">
            <span className="absolute left-5 top-4 h-px w-[88%] rounded-full bg-ph-border opacity-70" />
            Replay preview
          </header>
          <div className="flex flex-col items-center gap-5 bg-ph-toolbar px-6 py-14 text-ph-subtle">
            <IconQueryEditor className="h-14 w-14 opacity-50" />
            <p className="text-center font-semibold text-ph-ink">Session snapshot shell</p>
            <p className="max-w-xs text-center text-xs">Mirrors bordered frame around insight embeds rather than DaisyUI mocks.</p>
          </div>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

import { Button, ShowcaseWrapper } from "@/components/ui";

export default function TooltipShowcase() {
  const code = `import { Button } from "the-old-ui";

<div className="ph-panel space-y-8">
  <div className="flex flex-wrap items-center gap-10">
    <div className="group relative inline-block">
      <Button variant="secondary">Hover me</Button>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        HogQL <span className="ph-shortcut border-neutral-700 bg-neutral-800 text-neutral-100">⌘ /</span>
      </span>
    </div>

    <span className="ph-tip cursor-help" title="Native title tooltip for zero-JS parity">
      Dashed chrome (title attribute)
    </span>
  </div>
</div>`;

  return (
    <ShowcaseWrapper
      title="Tooltips"
      description="PostHog tooltips lean on muted inverse surfaces. Here we fake the vibe with charcoal chips + blur for contrast on light canvas."
      code={code}
      filename="TooltipExample.tsx"
    >
      <div className="ph-panel space-y-8">
        <div className="flex flex-wrap items-center gap-10">
          <div className="group relative inline-block">
            <Button variant="secondary">Hover me</Button>
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              HogQL <span className="ph-shortcut border-neutral-700 bg-neutral-800 text-neutral-100">⌘ /</span>
            </span>
          </div>

          <span className="ph-tip cursor-help" title="Native title tooltip for zero-JS parity">
            Dashed chrome (title attribute)
          </span>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

import { Button, ShowcaseWrapper, Tooltip, TooltipProvider } from "@/components/ui";

export default function TooltipShowcase() {
  const code = `import { Button, Tooltip, TooltipProvider } from "the-old-ui";

<TooltipProvider delayDuration={300}>
  <div className="ph-panel flex flex-wrap items-center gap-10">
    <Tooltip content="Run a HogQL query (Command + /)" side="top">
      <Button variant="secondary">Hover me</Button>
    </Tooltip>

    <Tooltip content="Available on hover and keyboard focus" side="bottom">
      <button type="button" className="ph-tip cursor-help">Dashed chrome</button>
    </Tooltip>
  </div>
</TooltipProvider>`;

  return (
    <ShowcaseWrapper
      title="Tooltips"
      description="Accessible supporting text on an adaptive inverse surface. Tooltips open on hover or focus, avoid viewport collisions, and dismiss with Escape."
      code={code}
      filename="TooltipExample.tsx"
    >
      <TooltipProvider delayDuration={300}>
        <div className="ph-panel flex flex-wrap items-center gap-10">
          <Tooltip content="Run a HogQL query (Command + /)" side="top">
            <Button variant="secondary">Hover me</Button>
          </Tooltip>

          <Tooltip content="Available on hover and keyboard focus" side="bottom">
            <button type="button" className="ph-tip cursor-help">Dashed chrome</button>
          </Tooltip>
        </div>
      </TooltipProvider>
    </ShowcaseWrapper>
  );
}

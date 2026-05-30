import { IconSpinner } from "@/components/icons";
import { ComponentDocs, Progress, ShowcaseWrapper } from "@/components/ui";

export default function ProgressShowcase() {
  const code = `import { Progress } from "the-old-ui";

<div className="space-y-8">
  <div className="ph-panel space-y-6">
    <Progress label="Ingest backlog" value={72} color="bg-ph-brand" showPercentage />
    <Progress label="Exports" value={45} color="bg-ph-blue" showPercentage />
    <Progress label="LLM evaluations" value={28} color="bg-ph-purple" showPercentage />
  </div>

  <div className="ph-panel flex flex-wrap items-center gap-10">
    <Progress value={72} color="bg-ph-brand" size="lg" className="w-48" />
    <Progress value={45} color="bg-ph-blue" size="lg" className="w-48" />
  </div>

  <div className="ph-panel flex flex-wrap items-center gap-8">
    <span className="ph-loading" role="status" aria-label="Loading" />
    <IconSpinner className="h-6 w-6 text-ph-brand" role="status" aria-label="Loading" />
    <div className="ph-loading-dots" role="status" aria-label="Loading">
      <span />
      <span />
      <span />
    </div>
  </div>
</div>`;

  return (
    <ShowcaseWrapper
      title="Progress & loading"
      description="Linear progress bars, spinners, and skeleton placeholders with semantic colour support."
      code={code}
      filename="ProgressExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "value", type: "number", description: "Current value." },
            { name: "max", type: "number", defaultValue: "100", description: "Maximum value." },
            { name: "color", type: "string", defaultValue: "bg-ph-brand", description: "Tailwind colour class for the bar." },
            { name: "label", type: "string", description: "Label shown above the bar." },
            { name: "showPercentage", type: "boolean", defaultValue: "false", description: "Show percentage text." },
            { name: "size", type: "sm | md | lg", defaultValue: "md", description: "Bar height." },
          ]}
        />
      }
    >
      <div className="space-y-8">
        <div className="ph-panel space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Linear bars</h3>
          <Progress label="Ingest backlog" value={72} color="bg-ph-brand" showPercentage />
          <Progress label="Exports" value={45} color="bg-ph-blue" showPercentage />
          <Progress label="LLM evaluations" value={28} color="bg-ph-purple" showPercentage />
        </div>

        <div className="ph-panel flex flex-wrap items-center gap-10">
          <div className="w-full">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Large bars</h3>
            <div className="flex gap-10">
              <Progress value={72} color="bg-ph-brand" size="lg" className="w-48" />
              <Progress value={45} color="bg-ph-blue" size="lg" className="w-48" />
            </div>
          </div>
        </div>

        <div className="ph-panel flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-3 text-ph-subtle">
            <span className="ph-loading" role="status" aria-label="Loading" />
            <code className="ph-kbd">ph-loading</code> — CSS spinner
          </div>
          <div className="flex items-center gap-3 text-ph-subtle">
            <IconSpinner className="h-6 w-6 text-ph-brand" role="status" aria-label="Loading" />
            <code className="ph-kbd">IconSpinner</code> — Animated icon
          </div>
          <div className="ph-loading-dots" role="status" aria-label="Loading">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

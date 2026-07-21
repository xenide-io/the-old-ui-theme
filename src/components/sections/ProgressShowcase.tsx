import {
  ComponentDocs,
  Loader,
  LoadingState,
  Progress,
  ShowcaseWrapper,
  Skeleton,
} from "@/components/ui";

export default function ProgressShowcase() {
  const code = `import { Loader, LoadingState, Progress, Skeleton } from "@xenide-io/the-old-ui-theme";

<Progress label="Ingest backlog" value={72} showPercentage />
<Loader variant="spinner" label="Refreshing insight" />
<Loader variant="dots" label="Loading events" />
<Loader variant="pulse" label="Connecting" />
<LoadingState title="Loading dashboard" description="Restoring the latest results." />
<div role="status" aria-label="Loading account">
  <Skeleton shape="title" />
  <Skeleton shape="text" />
  <Skeleton shape="short-text" />
</div>`;

  return (
    <ShowcaseWrapper
      title="Progress & loading"
      description="Determinate progress, compact action loaders, full-region loading states, and structure-matching cold-load skeletons."
      code={code}
      filename="LoadingExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "Loader.variant", type: "spinner | dots | pulse", defaultValue: "spinner", description: "Indeterminate treatment for compact asynchronous work." },
            { name: "Loader.size", type: "sm | md | lg", defaultValue: "md", description: "Visual loader size." },
            { name: "LoadingState", type: "LoadingStateProps", description: "Centered region state with one accessible status message." },
            { name: "Skeleton.shape", type: "title | text | short-text | avatar | button | block", defaultValue: "text", description: "Decorative skeleton matching expected content geometry." },
            { name: "Progress.value", type: "number", description: "Real determinate progress value." },
          ]}
        />
      }
    >
      <div className="space-y-6">
        <div className="ph-panel space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Determinate progress</h3>
          <Progress label="Ingest backlog" value={72} color="bg-ph-brand" showPercentage />
          <Progress label="Exports" value={45} color="bg-ph-blue" showPercentage />
          <Progress label="LLM evaluations" value={28} color="bg-ph-purple" showPercentage />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {(["spinner", "dots", "pulse"] as const).map((variant) => (
            <div key={variant} className="ph-panel flex min-h-28 flex-col items-center justify-center gap-3">
              <Loader variant={variant} size="lg" label={`${variant} loader`} />
              <code className="ph-kbd">{variant}</code>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="ph-panel p-0">
            <LoadingState
              label="Loading dashboard"
              title="Loading dashboard"
              description="Restoring the latest results without pretending progress is measurable."
            />
          </div>
          <div className="ph-panel" role="status" aria-label="Loading account summary">
            <div className="mb-5 flex items-center gap-3">
              <Skeleton shape="avatar" />
              <div className="min-w-0 flex-1">
                <Skeleton shape="title" className="mb-2 w-1/2" />
                <Skeleton shape="short-text" className="w-2/3" />
              </div>
            </div>
            <Skeleton shape="block" className="mb-4" />
            <div className="flex justify-end"><Skeleton shape="button" /></div>
          </div>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

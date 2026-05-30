import { ShowcaseWrapper } from "@/components/ui";

export default function StackShowcase() {
  const code = `

<div className="rounded-xl border border-ph-border bg-ph-muted p-10">
  <div className="relative mx-auto h-44 w-48">
    <div className="absolute inset-3 translate-x-4 translate-y-4 rounded-xl border border-ph-border bg-ph-toolbar shadow-ph ring-8 ring-ph-muted" />
    <div className="absolute inset-y-7 left-8 right-[-1rem] translate-x-1 rounded-xl border border-ph-border bg-ph-blue text-center text-xs font-semibold uppercase leading-[4.75rem] text-white shadow-ph ring-8 ring-ph-muted">
      Replay
    </div>
    <div className="absolute inset-x-5 top-0 flex h-[5.75rem] items-center justify-center rounded-xl border border-ph-border bg-ph-surface shadow-ph-md ring-8 ring-ph-muted">
      <span className="text-sm font-bold text-ph-brand">Trends insight</span>
    </div>
  </div>
</div>`;

  return (
    <ShowcaseWrapper title="Stacked surfaces" code={code} filename="StackExample.tsx">
      <div className="rounded-xl border border-ph-border bg-ph-muted p-10">
        <div className="relative mx-auto h-44 w-48">
          <div className="absolute inset-3 translate-x-4 translate-y-4 rounded-xl border border-ph-border bg-ph-toolbar shadow-ph ring-8 ring-ph-muted" />
          <div className="absolute inset-y-7 left-8 right-[-1rem] translate-x-1 rounded-xl border border-ph-border bg-ph-blue text-center text-xs font-semibold uppercase leading-[4.75rem] text-white shadow-ph ring-8 ring-ph-muted">
            Replay
          </div>
          <div className="absolute inset-x-5 top-0 flex h-[5.75rem] items-center justify-center rounded-xl border border-ph-border bg-ph-surface shadow-ph-md ring-8 ring-ph-muted">
            <span className="text-sm font-bold text-ph-brand">Trends insight</span>
          </div>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

import { ShowcaseWrapper } from "@/components/ui";

export default function CountdownShowcase() {
  const code = `

<div className="ph-panel">
  <p className="mb-6 text-sm text-ph-subtle">Static split — swap for synced timers once you plug in real experiment deadlines.</p>
  <div className="flex flex-wrap justify-center gap-3 text-ph-ink sm:justify-start">
    {[
      { v: "04", label: "Days" },
      { v: "12", label: "Hrs" },
      { v: "33", label: "Min" },
      { v: "09", label: "Sec" },
    ].map(({ v, label }) => (
      <div key={label} className="flex min-w-[4.75rem] flex-col items-center rounded-xl border border-ph-border bg-ph-surface px-4 py-3 shadow-ph">
        <span className="text-3xl font-bold tabular-nums">{v}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ph-mutedtext">{label}</span>
      </div>
    ))}
  </div>
</div>`;

  return (
    <ShowcaseWrapper title="Countdown motif" code={code} filename="CountdownExample.tsx">
      <div className="ph-panel">
        <p className="mb-6 text-sm text-ph-subtle">Static split — swap for synced timers once you plug in real experiment deadlines.</p>
        <div className="flex flex-wrap justify-center gap-3 text-ph-ink sm:justify-start">
          {[
            { v: "04", label: "Days" },
            { v: "12", label: "Hrs" },
            { v: "33", label: "Min" },
            { v: "09", label: "Sec" },
          ].map(({ v, label }) => (
            <div key={label} className="flex min-w-[4.75rem] flex-col items-center rounded-xl border border-ph-border bg-ph-surface px-4 py-3 shadow-ph">
              <span className="text-3xl font-bold tabular-nums">{v}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ph-mutedtext">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

"use client";

import { useState } from "react";
import { ShowcaseWrapper } from "@/components/ui";

/** Lightweight before/after — PostHog product diffs screenshots in Visual Review Playwright suites. */

export default function DiffShowcase() {
  const [pct, setPct] = useState(50);

  const code = `

<div className="ph-panel max-w-3xl">
  <label className="mb-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
    Position
    <input type="range" min={0} max={100} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="flex-1" />
    <span className="tabular-nums text-ph-ink">{pct}%</span>
  </label>
  <div className="relative aspect-video overflow-hidden rounded-xl border border-ph-border shadow-ph-md">
    <div className="absolute inset-0 grid place-content-center bg-ph-toolbar text-xs font-semibold uppercase text-ph-mutedtext">
      After · lightened neutral surfaces
    </div>
    <div
      className="absolute inset-y-0 left-0 overflow-hidden bg-ph-muted"
      style={{
        clipPath: \`inset(0 \${100 - pct}% 0 0)\`,
      }}
    >
      <div className="grid h-full place-content-center text-xs font-semibold uppercase text-ph-ink">
        Before · richer contrast rails
      </div>
    </div>
    <span
      className="pointer-events-none absolute inset-y-0 w-px bg-ph-surface"
      style={{ left: \`\${pct}%\`, boxShadow: "0 0 0 1px hsl(0deg 0% 0% / .15)" }}
    />
  </div>
</div>`;

  return (
    <ShowcaseWrapper title="Diff slider" code={code} filename="DiffExample.tsx">
      <div className="ph-panel max-w-3xl">
        <label className="mb-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
          Position
          <input type="range" min={0} max={100} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="flex-1" />
          <span className="tabular-nums text-ph-ink">{pct}%</span>
        </label>
        <div className="relative aspect-video overflow-hidden rounded-xl border border-ph-border shadow-ph-md">
          <div className="absolute inset-0 grid place-content-center bg-ph-toolbar text-xs font-semibold uppercase text-ph-mutedtext">
            After · lightened neutral surfaces
          </div>
          <div
            className="absolute inset-y-0 left-0 overflow-hidden bg-ph-muted"
            style={{
              clipPath: `inset(0 ${100 - pct}% 0 0)`,
            }}
          >
            <div className="grid h-full place-content-center text-xs font-semibold uppercase text-ph-ink">
              Before · richer contrast rails
            </div>
          </div>
          <span
            className="pointer-events-none absolute inset-y-0 w-px bg-ph-surface"
            style={{ left: `${pct}%`, boxShadow: "0 0 0 1px hsl(0deg 0% 0% / .15)" }}
          />
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

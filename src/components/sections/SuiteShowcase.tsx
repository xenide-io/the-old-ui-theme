"use client";

import Image from "next/image";

import {
  SuiteIcon,
  SUITE_ICON_NAMES,
  APP_ACCENTS,
  type SuiteAccentSlug,
} from "@/suite/icons";
import { ShowcaseWrapper } from "@/components/ui";

const REAL_APPS = ["turtletime", "tides", "kraken", "shellstack"] as const;
type RealAppSlug = (typeof REAL_APPS)[number];

const APP_ICON_SRC: Record<RealAppSlug, string> = {
  turtletime: "/turtletime-icon.svg",
  tides: "/tides-icon.svg",
  kraken: "/kraken-icon.svg",
  shellstack: "/shellstack-icon.svg",
};

const ICON_SIZE = 44;

export default function SuiteShowcase() {
  return (
    <ShowcaseWrapper
      id="suite"
      title="Suite icons"
      description="The actual app favicons for the ShellStack apps, plus the shared suite icon system — programmatic app marks and hand-drawn lucide-grammar glyphs."
      code={`import Image from "next/image";

<Image src="/turtletime-icon.svg" width={44} height={44} alt="TurtleTime" />
<SuiteIcon name="today-sun" accent="turtletime" size={24} />`}
      filename="SuiteIconExample.tsx"
    >
      <div className="space-y-8">
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Actual app icons</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              The real favicons shipped by each app — not generated suite glyphs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 rounded-lg border border-ph-border-subtle bg-ph-raised p-6">
            {REAL_APPS.map((app) => (
              <div key={app} className="flex flex-col items-center gap-2">
                <div className="relative h-11 w-11 overflow-hidden rounded-xl">
                  <Image
                    src={APP_ICON_SRC[app]}
                    alt={APP_ACCENTS[app].label}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    className="h-full w-full"
                    unoptimized
                  />
                </div>
                <span className="text-xs font-medium text-ph-subtle">{APP_ACCENTS[app].label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Suite glyphs</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              24×24 strokes that inherit currentColor and accept a per-app accent tint.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {SUITE_ICON_NAMES.map((name) => (
              <div
                key={name}
                className="flex min-w-0 flex-col items-center gap-2 rounded-lg border border-ph-border-subtle bg-ph-raised p-3 text-center"
              >
                <div className="flex h-8 items-center text-ph-ink">
                  <SuiteIcon name={name} size={24} />
                </div>
                <span className="max-w-full break-words text-[10px] font-medium tracking-wide text-ph-mutedtext">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Accent tints</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              The same glyph with each app accent applied via CSS custom property.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 rounded-lg border border-ph-border-subtle bg-ph-raised p-6">
            {REAL_APPS.map((app) => (
              <div key={app} className="flex flex-col items-center gap-2">
                <SuiteIcon name="today-sun" accent={app} size={32} />
                <span className="text-xs font-medium text-ph-subtle">{APP_ACCENTS[app].label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ShowcaseWrapper>
  );
}

"use client";

import { IconBell, IconBellOff, IconMoon, IconSun, IconVolume, IconVolumeOff } from "@/components/icons";
import { cn } from "@/lib/cn";
import { ShowcaseWrapper } from "@/components/ui";

function IconSwapToggle({
  offIcon: OffIcon,
  onIcon: OnIcon,
  offClassName,
  onClassName,
}: {
  offIcon: typeof IconBellOff;
  onIcon: typeof IconBell;
  offClassName?: string;
  onClassName?: string;
}) {
  return (
    <label className="group relative inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-ph-surface shadow-ph">
      <input type="checkbox" className="sr-only" />
      <span className="ph-icon-swap h-7 w-7" aria-hidden>
        <OffIcon
          className={cn(
            "opacity-100 transition group-has-[:checked]:pointer-events-none group-has-[:checked]:opacity-0",
            offClassName,
          )}
        />
        <OnIcon
          className={cn(
            "opacity-0 transition group-has-[:checked]:opacity-100",
            onClassName,
          )}
        />
      </span>
    </label>
  );
}

export default function SwapShowcase() {
  const code = `import { IconBell, IconBellOff, IconMoon, IconSun, IconVolume, IconVolumeOff } from "the-old-ui";

<div className="flex flex-wrap gap-10 rounded-xl border border-ph-border bg-ph-muted p-8">
  <IconSwapToggle
    offIcon={IconVolume}
    onIcon={IconVolumeOff}
    offClassName="text-ph-brand"
    onClassName="text-ph-mutedtext"
  />

  <IconSwapToggle
    offIcon={IconBell}
    onIcon={IconBellOff}
    offClassName="rotate-[-8deg] text-ph-mutedtext"
    onClassName="text-ph-mutedtext"
  />

  <IconSwapToggle
    offIcon={IconMoon}
    onIcon={IconSun}
    offClassName="text-ph-mutedtext"
    onClassName="text-amber-500"
  />
</div>`;

  return (
    <ShowcaseWrapper title="Icon swap" code={code} filename="SwapExample.tsx">
      <div className="flex flex-wrap gap-10 rounded-xl border border-ph-border bg-ph-muted p-8">
        <IconSwapToggle
          offIcon={IconVolume}
          onIcon={IconVolumeOff}
          offClassName="text-ph-brand"
          onClassName="text-ph-mutedtext"
        />

        <IconSwapToggle
          offIcon={IconBell}
          onIcon={IconBellOff}
          offClassName="rotate-[-8deg] text-ph-mutedtext"
          onClassName="text-ph-mutedtext"
        />

        <IconSwapToggle
          offIcon={IconMoon}
          onIcon={IconSun}
          offClassName="text-ph-mutedtext"
          onClassName="text-amber-500"
        />
      </div>
    </ShowcaseWrapper>
  );
}

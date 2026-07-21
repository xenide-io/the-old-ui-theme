"use client";

import { IconBell, IconBellOff, IconMoon, IconSun, IconVolume, IconVolumeOff } from "@/components/icons";
import { cn } from "@/lib/cn";
import { ShowcaseWrapper } from "@/components/ui";

function IconSwapToggle({
  offIcon: OffIcon,
  onIcon: OnIcon,
  offClassName,
  onClassName,
  label,
}: {
  offIcon: typeof IconBellOff;
  onIcon: typeof IconBell;
  offClassName?: string;
  onClassName?: string;
  label: string;
}) {
  return (
    <label className="group relative inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-ph-surface shadow-ph focus-within:ring-2 focus-within:ring-ph-focus focus-within:ring-offset-2">
      <input type="checkbox" className="sr-only" aria-label={label} />
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
  const code = `import { IconBell, IconBellOff, IconMoon, IconSun, IconVolume, IconVolumeOff } from "@xenide-io/the-old-ui-theme";

<div className="flex flex-wrap gap-10 rounded-xl border border-ph-border bg-ph-muted p-8">
  <IconSwapToggle
    label="Mute audio"
    offIcon={IconVolume}
    onIcon={IconVolumeOff}
    offClassName="text-ph-brand"
    onClassName="text-ph-mutedtext"
  />

  <IconSwapToggle
    label="Mute notifications"
    offIcon={IconBell}
    onIcon={IconBellOff}
    offClassName="rotate-[-8deg] text-ph-mutedtext"
    onClassName="text-ph-mutedtext"
  />

  <IconSwapToggle
    label="Use light appearance"
    offIcon={IconMoon}
    onIcon={IconSun}
    offClassName="text-ph-mutedtext"
    onClassName="text-ph-warning"
  />
</div>`;

  return (
    <ShowcaseWrapper title="Icon swap" code={code} filename="SwapExample.tsx">
      <div className="flex flex-wrap gap-10 rounded-xl border border-ph-border bg-ph-muted p-8">
        <IconSwapToggle
          label="Mute audio"
          offIcon={IconVolume}
          onIcon={IconVolumeOff}
          offClassName="text-ph-brand"
          onClassName="text-ph-mutedtext"
        />

        <IconSwapToggle
          label="Mute notifications"
          offIcon={IconBell}
          onIcon={IconBellOff}
          offClassName="rotate-[-8deg] text-ph-mutedtext"
          onClassName="text-ph-mutedtext"
        />

        <IconSwapToggle
          label="Use light appearance"
          offIcon={IconMoon}
          onIcon={IconSun}
          offClassName="text-ph-mutedtext"
          onClassName="text-ph-warning"
        />
      </div>
    </ShowcaseWrapper>
  );
}

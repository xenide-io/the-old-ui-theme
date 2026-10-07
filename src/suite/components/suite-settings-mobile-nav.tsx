"use client";

import { isValidElement, type ElementType, type ReactNode } from "react";
import { trackSuiteEvent } from "../../lib/suite-analytics";
import { cn } from "../lib/cn";

export interface SuiteSettingsNavItem {
  label: string;
  href: string;
  icon: ElementType | ReactNode;
  id?: string;
  testId?: string;
}

interface SuiteSettingsMobileNavProps {
  items: SuiteSettingsNavItem[];
  activeHref: string;
  onSelect: (href: string) => void;
  dataTest?: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Horizontal scrollable settings nav for mobile.
 * Replaces a native <select> with icon+label pills that are easier to scan,
 * meet 44px touch targets, and preserve visual hierarchy (Law of UX: Hick's Law,
 * Recognition over Recall).
 */
export function SuiteSettingsMobileNav({
  items,
  activeHref,
  onSelect,
  dataTest,
  ariaLabel = "Settings sections",
  className,
}: SuiteSettingsMobileNavProps) {
  return (
    <nav
      data-test={dataTest}
      aria-label={ariaLabel}
      className={cn("suite-settings-mobile-nav lg:hidden", className)}
    >
      <div className="flex snap-x gap-2 overflow-x-auto pb-3 pt-1 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const Icon = item.icon as ElementType;
          const active =
            activeHref === item.href || activeHref.startsWith(`${item.href}/`);
          const iconNode = isValidElement(item.icon) ? (
            item.icon
          ) : (
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                active ? "text-[var(--ph-selected-text)]" : "text-ph-mutedtext",
              )}
              aria-hidden
            />
          );
          return (
            <button
              key={item.href}
              type="button"
              id={item.id}
              data-test={item.testId}
              onClick={() => {
                trackSuiteEvent("Tab Viewed", { tab: item.id ?? item.href });
                onSelect(item.href);
              }}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex min-h-[44px] shrink-0 snap-start items-center gap-2 rounded-[var(--ph-radius-control)] border px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:shadow-[var(--ph-focus-halo)]",
                active
                  ? "border-[var(--ph-selected-border)] bg-[var(--ph-selected-bg)] text-[var(--ph-selected-text)]"
                  : "border-ph-border bg-ph-surface text-ph-subtle hover:bg-[var(--ph-surface-hover)] hover:text-ph-ink",
              )}
            >
              {iconNode}
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

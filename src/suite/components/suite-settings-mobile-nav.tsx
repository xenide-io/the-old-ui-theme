'use client';

import { isValidElement, type ComponentType, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface SuiteSettingsNavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }> | ReactNode;
  testId?: string;
}

interface SuiteSettingsMobileNavProps {
  items: SuiteSettingsNavItem[];
  activeHref: string;
  onSelect: (href: string) => void;
  dataTest?: string;
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
}: SuiteSettingsMobileNavProps) {
  return (
    <nav
      data-test={dataTest}
      aria-label="Settings sections"
      className="-mx-4 px-4 lg:hidden"
    >
      <div className="flex snap-x gap-2 overflow-x-auto pb-3 pt-1 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const Icon = item.icon as ComponentType<{
            className?: string;
            'aria-hidden'?: boolean;
          }>;
          const active =
            activeHref === item.href || activeHref.startsWith(`${item.href}/`);
          const iconNode = isValidElement(item.icon) ? (
            item.icon
          ) : (
            <Icon
              className={cn(
                'h-4 w-4 shrink-0 transition',
                active ? 'text-ph-surface' : 'text-ph-mutedtext',
              )}
              aria-hidden
            />
          );
          return (
            <button
              key={item.href}
              type="button"
              data-test={item.testId}
              onClick={() => onSelect(item.href)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group relative flex shrink-0 snap-start items-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-medium transition',
                'min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand',
                active
                  ? 'bg-ph-ink text-ph-surface shadow-sm'
                  : 'bg-ph-surface text-ph-subtle ring-1 ring-ph-border hover:bg-ph-muted hover:text-ph-ink',
              )}
            >
              {iconNode}
              <span className="whitespace-nowrap">{item.label}</span>
              {active ? (
                <span className="absolute inset-x-0 -bottom-3 h-0.5 rounded-full bg-ph-ink lg:hidden" />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

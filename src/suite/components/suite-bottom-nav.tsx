'use client';

import Link from 'next/link';
import type { ComponentType } from 'react';

import { cn } from '../lib/cn';

/** Any icon component that accepts sizing/stroke props (Lucide, theme icons). */
export type SuiteNavIcon = ComponentType<{
  className?: string;
  strokeWidth?: number | string;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

/**
 * Suite bottom navigation — the mobile/tablet primary nav, identical in
 * every app. Hick's Law: 5 items maximum (dev warning beyond that).
 * Visuals come from suite-skin.css (`suite-bottom-nav`, `__pill`) so the
 * translucent blur, safe-area padding, and press physics stay in sync
 * across the suite; per-item content stays app-side via `items`.
 */
export interface SuiteBottomNavItem {
  href: string;
  label: string;
  icon: SuiteNavIcon;
  active?: boolean;
  dataTest?: string;
}

export function SuiteBottomNav({
  items,
  ariaLabel = 'Primary navigation',
  dataTest = 'suite-bottom-nav',
  className,
}: {
  items: readonly SuiteBottomNavItem[];
  ariaLabel?: string;
  dataTest?: string;
  className?: string;
}) {
  if (process.env.NODE_ENV !== 'production' && items.length > 5) {
    // eslint-disable-next-line no-console
    console.warn(
      `SuiteBottomNav: ${items.length} items — bottom nav should have at most 5 (Hick's Law).`,
    );
  }

  const activeIndex = items.findIndex((item) => item.active);

  return (
    <>
      {/* In-flow spacer reserves the fixed bar's height so page content
          never slides underneath it. Height = item height + safe area. */}
      <div
        aria-hidden
        className="shrink-0 lg:hidden"
        style={{ height: 'calc(60px + env(safe-area-inset-bottom))' }}
      />
      <nav
        aria-label={ariaLabel}
        data-test={dataTest}
        className={cn(
          'suite-bottom-nav no-print z-40 grid auto-cols-fr grid-flow-col lg:hidden',
          className,
        )}
        style={
          {
            gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
            '--suite-nav-items': items.length,
            '--suite-nav-active': activeIndex >= 0 ? activeIndex : 0,
          } as React.CSSProperties
        }
      >
        {activeIndex >= 0 ? (
          <span aria-hidden className="suite-bottom-nav__indicator" />
        ) : null}
        {items.map((item) => {
          const Icon = item.icon;
          const active = Boolean(item.active);

          return (
            <Link
              key={item.href}
              href={item.href}
              data-test={item.dataTest ?? `suite-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'suite-bottom-nav__item relative flex min-h-[60px] min-w-0 flex-col items-center justify-center gap-1 px-1 pb-1.5 pt-2 text-[10px] font-medium leading-none text-ph-mutedtext transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ph-brand motion-reduce:transition-none',
                active && 'font-semibold text-ph-brand',
              )}
            >
              <span
                className={cn(
                  'suite-bottom-nav__icon relative z-10 inline-flex items-center justify-center',
                  active && 'suite-bottom-nav__icon--active',
                )}
              >
                <Icon
                  className="h-6 w-6"
                  strokeWidth={active ? 2.25 : 1.75}
                  aria-hidden
                />
              </span>
              <span className="relative z-10 max-w-full truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

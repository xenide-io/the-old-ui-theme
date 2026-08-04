'use client';

import type { ComponentType, ElementType, ReactNode, SVGProps } from 'react';
import { cn } from '../lib/cn';
import { TodayTimeIcon } from './today-ui';

type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

const WIDTHS = {
  full: 'max-w-none',
  wide: 'max-w-7xl',
  content: 'max-w-6xl',
  narrow: 'max-w-4xl',
} as const;

export type SuitePageWidth = keyof typeof WIDTHS;

export interface SuiteBreadcrumbsProps {
  items: { label: ReactNode; href?: string }[];
  className?: string;
}

/** Minimal slash-separated breadcrumb line. */
export function SuiteBreadcrumbs({ items, className }: SuiteBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex min-w-0 items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? (
                <span className="select-none text-ph-border" aria-hidden="true">
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="truncate transition hover:text-ph-ink"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    'truncate',
                    isLast ? 'font-medium text-ph-ink' : 'text-ph-subtle',
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SuitePage({
  children,
  width = 'wide',
  inset = true,
  className,
  as: Component = 'div',
  dataTest,
  id,
  role,
  'aria-live': ariaLive,
}: {
  children: ReactNode;
  width?: SuitePageWidth;
  inset?: boolean;
  className?: string;
  as?: ElementType;
  dataTest?: string;
  id?: string;
  role?: string;
  'aria-live'?: React.AriaAttributes['aria-live'];
}) {
  return (
    <Component
      id={id}
      data-test={dataTest}
      role={role}
      aria-live={ariaLive}
      className={cn(
        'mx-auto flex w-full min-w-0 flex-col',
        WIDTHS[width],
        // Same inset as TodayPageFrame so every page title sits at the
        // same baseline regardless of app.
        inset &&
          'px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8',
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function SuitePageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
  titleClassName,
  dataTest,
  /** Optional icon rendered before the title. */
  icon,
  /** Use the animated sun/moon icon from the Today page. */
  todayIcon,
  todayIconClassName,
  /** Small badge/pill next to the title (e.g. "Beta", org name). */
  badge,
  /** Breadcrumb line rendered above the title. */
  breadcrumb,
}: {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
  dataTest?: string;
  icon?: ReactNode;
  todayIcon?: boolean;
  todayIconClassName?: string;
  badge?: ReactNode;
  breadcrumb?: ReactNode;
}) {
  const resolvedIcon = todayIcon ? (
    <TodayTimeIcon
      className={cn(
        'h-6 w-6 sm:h-7 sm:w-7 text-amber-500',
        todayIconClassName,
      )}
    />
  ) : (
    icon
  );

  return (
    <header
      data-test={dataTest}
      className={cn(
        'flex items-start justify-between gap-4 pb-6 sm:pb-7',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {resolvedIcon ? (
          <div
            className="hidden shrink-0 pt-1 sm:block"
            aria-hidden="true"
          >
            {resolvedIcon}
          </div>
        ) : null}
        <div className="flex min-w-0 flex-col gap-1">
          {eyebrow ? (
            <div className="mb-0.5 flex min-w-0 items-center gap-1.5 text-xs text-ph-subtle">
              {eyebrow}
            </div>
          ) : null}
          {breadcrumb ? (
            <div className="mb-0.5 flex min-w-0 items-center gap-1.5 text-xs text-ph-subtle">
              {breadcrumb}
            </div>
          ) : null}
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <h1
              className={cn(
                'font-display text-[1.625rem] font-bold leading-tight tracking-tight text-ph-ink sm:text-[2.25rem]',
                titleClassName,
              )}
            >
              {title}
            </h1>
            {badge ? (
              <span className="rounded-md bg-ph-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ph-subtle">
                {badge}
              </span>
            ) : null}
          </div>
          {description ? (
            <div className="mt-1 max-w-2xl text-pretty text-sm leading-5 text-ph-subtle">
              {description}
            </div>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2 pt-1">
          {actions}
        </div>
      ) : null}
    </header>
  );
}

export function SuiteToolbar({
  children,
  className,
  label = 'Page tools',
  dataTest,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  dataTest?: string;
}) {
  return (
    <div
      role="toolbar"
      aria-label={label}
      data-test={dataTest}
      className={cn('flex min-w-0 flex-wrap items-center gap-2', className)}
    >
      {children}
    </div>
  );
}

export function SuiteTabList({
  children,
  className,
  label,
  dataTest,
}: {
  children: ReactNode;
  className?: string;
  label: string;
  dataTest?: string;
}) {
  return (
    <nav
      aria-label={label}
      data-test={dataTest}
      className={cn(
        'flex min-w-0 flex-wrap gap-2 [&_a]:min-h-[48px] [&_button]:min-h-[48px] sm:[&_a]:min-h-[44px] sm:[&_button]:min-h-[44px]',
        className,
      )}
    >
      {children}
    </nav>
  );
}

export function SuiteSectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="font-display text-balance text-lg font-semibold tracking-tight text-ph-ink sm:text-xl">
          {title}
        </h2>
        {description ? (
          <div className="mt-1 max-w-2xl text-pretty text-sm leading-5 text-ph-subtle">
            {description}
          </div>
        ) : null}
      </div>
      {action ? (
        <div className="flex min-h-[44px] shrink-0 items-center">{action}</div>
      ) : null}
    </div>
  );
}

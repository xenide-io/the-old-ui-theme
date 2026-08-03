'use client';

import type { ElementType, ReactNode } from 'react';
import { cn } from '../lib/cn';

const WIDTHS = {
  full: 'max-w-none',
  wide: 'max-w-7xl',
  content: 'max-w-6xl',
  narrow: 'max-w-4xl',
} as const;

export type SuitePageWidth = keyof typeof WIDTHS;

export function SuitePage({
  children,
  width = 'wide',
  inset = true,
  className,
  as: Component = 'div',
  dataTest,
}: {
  children: ReactNode;
  width?: SuitePageWidth;
  inset?: boolean;
  className?: string;
  as?: ElementType;
  dataTest?: string;
}) {
  return (
    <Component
      data-test={dataTest}
      className={cn(
        'mx-auto flex w-full min-w-0 flex-col',
        WIDTHS[width],
        inset && 'px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5 lg:px-8 lg:py-8',
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
}: {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
  dataTest?: string;
}) {
  return (
    <header
      data-test={dataTest}
      className={cn(
        'flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-ph-mutedtext">
            {eyebrow}
          </div>
        ) : null}
        <h1
          className={cn(
            'font-display text-balance text-[1.5rem] font-bold leading-tight tracking-tight text-ph-ink sm:text-[2.25rem]',
            titleClassName,
          )}
        >
          {title}
        </h1>
        {description ? (
          <div className="mt-1 max-w-2xl text-pretty text-sm leading-5 text-ph-subtle sm:text-base">
            {description}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:shrink-0 sm:justify-end [&_a]:min-h-[48px] [&_button]:min-h-[48px] sm:[&_a]:min-h-[44px] sm:[&_button]:min-h-[44px]">
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

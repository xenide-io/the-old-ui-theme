'use client';

import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

interface SuiteSkeletonProps {
  className?: string;
  lines?: number;
  circle?: boolean;
  width?: string;
}

/**
 * Shared skeleton using the-old-ui-theme `ph-skeleton` shimmer class.
 * The shimmer animation is defined in the theme, so this component is
 * framework-agnostic and works in any app that imports the theme.
 */
export function SuiteSkeleton({
  className,
  lines = 1,
  circle,
  width,
}: SuiteSkeletonProps) {
  return (
    <div
      className={cn('space-y-2', circle ? 'flex flex-col items-center' : '')}
      aria-hidden
    >
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="animate-[skeleton-stagger_0.6s_ease-out_both]"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div
            className={cn(
              'ph-skeleton',
              circle ? 'h-10 w-10 rounded-full' : 'h-3',
              className,
            )}
            style={
              !circle
                ? {
                    width:
                      width ?? `${70 + (index % 3) * 15}%`,
                  }
                : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}

export function SuiteSkeletonCard({
  className,
  rows = 3,
  header = true,
}: {
  className?: string;
  rows?: number;
  header?: boolean;
}) {
  return (
    <div
      className={cn(
        'ph-skeleton-card animate-[skeleton-stagger_0.5s_ease-out_both] rounded-2xl border border-ph-border bg-ph-surface p-6 shadow-sm',
        className,
      )}
      aria-hidden
    >
      {header ? (
        <div
          className="mb-5 flex items-center gap-3 animate-[skeleton-stagger_0.5s_ease-out_both]"
          style={{ animationDelay: '100ms' }}
        >
          <div className="ph-skeleton h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="ph-skeleton h-4 w-1/3" />
            <div className="ph-skeleton h-3 w-1/2" />
          </div>
        </div>
      ) : null}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="animate-[skeleton-stagger_0.5s_ease-out_both]"
            style={{ animationDelay: `${200 + index * 80}ms` }}
          >
            <div
              className="ph-skeleton h-3"
              style={{ width: `${70 + (index % 3) * 15}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SuiteSkeletonList({
  className,
  items = 4,
}: {
  className?: string;
  items?: number;
}) {
  return (
    <div className={cn('space-y-3', className)} aria-hidden>
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="animate-[skeleton-stagger_0.6s_ease-out_both]"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-3 rounded-xl border border-ph-border bg-ph-surface p-4">
            <div className="ph-skeleton h-10 w-10 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="ph-skeleton h-3.5 w-3/4" />
              <div className="ph-skeleton h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface SuiteEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * Branded empty state with a soft gradient orb and clear action affordance.
 * Uses the app icon when available so empty states feel native to each app.
 */
export function SuiteEmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = 'md',
}: SuiteEmptyStateProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-ph-border bg-ph-surface text-center',
        size === 'sm' ? 'px-5 py-8' : 'px-6 py-12 sm:px-10 sm:py-16',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60" aria-hidden>
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-ph-brand/10 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-ph-accent/10 blur-3xl" />
      </div>
      <div className="relative">
        {icon ? (
          <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-ph-muted p-3 shadow-sm ring-1 ring-black/[0.06]">
            {icon}
          </div>
        ) : null}
        <h3
          className={cn(
            'font-semibold text-ph-ink',
            size === 'sm' ? 'text-base' : 'text-lg',
          )}
        >
          {title}
        </h3>
        {description ? (
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ph-subtle">
            {description}
          </p>
        ) : null}
        {action ? (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
}

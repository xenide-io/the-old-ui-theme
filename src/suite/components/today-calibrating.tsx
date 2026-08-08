'use client';

import { Refresh as RefreshCw, SunLight as Sun } from 'iconoir-react';

import { cn } from '../lib/cn';
import type { SuiteSpinnerComponent } from '../lib/injected';

/**
 * Today-page loading/empty calibrating state. Apps inject their branded
 * AppSpinner. Kept deliberately quiet — single soft fade + one spinner,
 * no ping/pulse stacks that compete with OAuth/launch handoffs.
 */
export function TodayCalibrating({
  onRetry,
  retrying = false,
  className,
  spinner: Spinner,
  variant: _variant = 'ring',
  retrySpinnerClassName = 'text-ph-brand',
}: {
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
  spinner: SuiteSpinnerComponent;
  /** @deprecated Kept for call-site compat; ornamentation is always calm. */
  variant?: 'ring' | 'pulse';
  retrySpinnerClassName?: string;
}) {
  void _variant;
  return (
    <div
      className={cn(
        'suite-auth-handoff relative flex min-h-[14rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-ph-border bg-ph-surface px-5 py-8 text-center shadow-sm',
        className,
      )}
      data-test="today-calibrating"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(251,191,36,0.1),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-ph-border bg-ph-surface text-ph-ink shadow-sm">
        <Sun className="h-8 w-8" strokeWidth={2} aria-hidden />
      </div>
      <h2 className="relative text-base font-semibold tracking-tight text-ph-ink sm:text-lg md:text-xl">
        Calibrating your day
      </h2>
      <p className="relative mt-1.5 max-w-sm text-sm sm:text-[15px] leading-relaxed text-ph-subtle">
        Pulling together tasks, time and updates from your workspace…
      </p>
      <div className="relative mt-5 flex justify-center">
        <Spinner size="sm" className="opacity-70" label="Loading today" />
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="relative mt-6 inline-flex items-center gap-2 rounded-xl border border-ph-border bg-ph-canvas px-4 py-2 text-sm font-medium text-ph-ink transition hover:bg-ph-muted disabled:opacity-60"
        >
          {retrying ? (
            <Spinner size="sm" className={retrySpinnerClassName} />
          ) : (
            <RefreshCw className="h-4 w-4" aria-hidden />
          )}
          Try again
        </button>
      ) : null}
    </div>
  );
}

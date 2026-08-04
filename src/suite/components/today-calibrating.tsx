'use client';

import { Refresh as RefreshCw, SunLight as Sun } from 'iconoir-react';

import { cn } from '../lib/cn';
import type { SuiteSpinnerComponent } from '../lib/injected';

/**
 * Today-page loading/empty calibrating state. Apps inject their branded
 * AppSpinner; `variant` picks the ornamentation style:
 * - `ring` — large spinner ring + ping behind the sun (TurtleTime/ShellStack)
 * - `pulse` — pulsing sun only (Tides/Kraken)
 */
export function TodayCalibrating({
  onRetry,
  retrying = false,
  className,
  spinner: Spinner,
  variant = 'ring',
  retrySpinnerClassName = 'text-ph-brand',
}: {
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
  spinner: SuiteSpinnerComponent;
  variant?: 'ring' | 'pulse';
  retrySpinnerClassName?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-[14rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-ph-border bg-ph-surface px-5 py-8 text-center shadow-sm',
        className,
      )}
      data-test="today-calibrating"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(251,191,36,0.12),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        {variant === 'ring' ? (
          <>
            <Spinner
              size="lg"
              className="absolute inset-0 m-auto opacity-40"
              label="Loading today"
            />
            <span
              className="bg-ph-muted/30 absolute inset-2 animate-ping rounded-full"
              aria-hidden
            />
          </>
        ) : null}
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-ph-border bg-ph-surface text-ph-ink shadow-sm">
          <Sun
            className={cn('h-9 w-9', variant === 'pulse' && 'animate-pulse')}
            strokeWidth={2}
            aria-hidden
          />
        </span>
      </div>
      <h2 className="relative text-base font-semibold tracking-tight text-ph-ink sm:text-lg md:text-xl">
        Calibrating your day
      </h2>
      <p className="relative mt-1.5 max-w-sm text-sm sm:text-[15px] leading-relaxed text-ph-subtle">
        Pulling together tasks, time and updates from your workspace…
      </p>
      <div className="relative mt-5 flex gap-1.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-1.5 w-5 animate-pulse rounded-full bg-ph-muted"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
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

'use client';

import { Refresh as RefreshCw } from 'iconoir-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { SuiteAppIcon } from '../icons/suite-app-icon';
import { SuiteIcon } from '../icons/suite-icon';
import type { SuiteIconName } from '../icons/glyphs';
type LucideIcon = import('react').ComponentType<import('react').SVGProps<SVGSVGElement>>;

export type SuiteAppSlug = 'shellstack' | 'tides' | 'turtletime' | 'kraken';

const APP_META: Record<SuiteAppSlug, { name: string }> = {
  shellstack: { name: 'ShellStack' },
  tides: { name: 'Tides' },
  turtletime: { name: 'TurtleTime' },
  kraken: { name: 'Kraken' },
};

const SUITE_APPS: SuiteAppSlug[] = [
  'shellstack',
  'tides',
  'turtletime',
  'kraken',
];

export function sourceToSuiteApp(source: string): SuiteAppSlug {
  if (source === 'tides' || source === 'turtletime' || source === 'kraken') {
    return source;
  }
  return 'shellstack';
}

export function suiteAppLabel(source: string): string {
  return APP_META[sourceToSuiteApp(source)].name;
}

const SOURCE_APP_GLYPH: Record<SuiteAppSlug, SuiteIconName> = {
  shellstack: 'stack-hex',
  tides: 'kanban-wave',
  turtletime: 'timer-shell',
  kraken: 'squid-doc',
};

/**
 * Small line icon for list rows — the app's suite glyph with its brand
 * accent on a muted base. Not the branded app tile (see SuiteAppIcon).
 */
export function SourceAppGlyph({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const app = sourceToSuiteApp(source);
  return (
    <SuiteIcon
      name={SOURCE_APP_GLYPH[app]}
      accent={app}
      className={cn('h-4 w-4 shrink-0 text-ph-subtle', className)}
    />
  );
}

function formatLongDate(date = new Date()): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function SuiteAppStrip({
  className,
  icons,
}: {
  className?: string;
  icons?: Partial<Record<SuiteAppSlug, ReactNode>>;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-2.5',
        className,
      )}
      aria-label="ShellStack suite apps"
    >
      {SUITE_APPS.map((app) => (
        <div
          key={app}
          className="flex items-center gap-2 rounded-full border border-ph-border bg-ph-surface px-2.5 py-1.5 shadow-sm"
        >
          {icons?.[app] ?? <SuiteAppIcon app={app} size="sm" />}
          <span className="text-xs font-medium text-ph-subtle">
            {APP_META[app].name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AnimatedSun({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="animatedSunCenter" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      <g className="origin-center motion-safe:animate-[spin_20s_linear_infinite] motion-reduce:animate-none">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="20"
            y1="4"
            x2="20"
            y2="9"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${angle} 20 20)`}
          />
        ))}
      </g>
      <circle cx="20" cy="20" r="9" fill="url(#animatedSunCenter)" />
    </svg>
  );
}

export function AnimatedMoon({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="animatedMoonBody" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <path
        d="M27.5 25.5A11 11 0 1 1 14.5 9.6a9 9 0 1 0 13 15.9Z"
        fill="url(#animatedMoonBody)"
      />
      <g className="motion-safe:animate-[pulse_4s_ease-in-out_infinite] motion-reduce:animate-none">
        <circle cx="29" cy="10" r="1.4" fill="#c7d2fe" />
        <circle cx="34" cy="16" r="1" fill="#c7d2fe" />
        <circle cx="25" cy="5.5" r="0.9" fill="#c7d2fe" />
      </g>
    </svg>
  );
}

/** Sun through the day, moon from 18:00 to 06:00. */
export function TodayTimeIcon({ className }: { className?: string }) {
  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour < 6;
  return isNight ? (
    <AnimatedMoon className={className} />
  ) : (
    <AnimatedSun className={className} />
  );
}
export function TodayTopBar({
  refreshing,
  loading,
  onRefresh,
  appIcon,
  appName,
}: {
  refreshing?: boolean;
  loading?: boolean;
  onRefresh: () => void;
  appIcon?: ReactNode;
  appName?: string;
}) {
  const icon = appIcon ?? <TodayTimeIcon className="h-6 w-6 sm:h-7 sm:w-7 text-amber-500" />;
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden shrink-0 sm:block" aria-hidden="true">
          {icon}
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <h1 className="font-display text-[1.625rem] font-bold leading-tight tracking-tight text-ph-ink sm:text-[2.25rem]">
            Today
          </h1>
          {appName ? (
            <span className="rounded-md bg-ph-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ph-subtle">
              {appName}
            </span>
          ) : null}
          <span className="text-sm text-ph-subtle">{formatLongDate()}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing || loading}
          className="press-subtle inline-flex h-10 w-10 items-center justify-center rounded-lg text-ph-subtle transition hover:bg-ph-surface hover:text-ph-ink disabled:opacity-50"
          data-test="today-refresh"
          aria-label="Refresh today"
        >
          <RefreshCw
            className={cn('h-4 w-4', refreshing && 'animate-spin')}
            aria-hidden
          />
        </button>
      </div>
    </header>
  );
}

export function getTodayGreeting(
  user?: { first_name?: string; name?: string; email?: string },
  stats?: { taskCount?: number; overdueCount?: number; hours?: number },
): string {
  const hour = new Date().getHours();
  let period = 'morning';
  if (hour >= 12 && hour < 17) period = 'afternoon';
  else if (hour >= 17 && hour < 21) period = 'evening';
  else if (hour >= 21 || hour < 5) period = 'night';

  const name =
    user?.first_name ||
    user?.name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    null;

  let greeting = `Good ${period}`;
  if (name) greeting += `, ${name}`;

  const taskCount = stats?.taskCount ?? 0;
  const overdueCount = stats?.overdueCount ?? 0;
  const hours = stats?.hours ?? 0;

  if (overdueCount > 0) {
    return `${greeting}. You have ${taskCount} task${taskCount === 1 ? '' : 's'} due today, ${overdueCount} overdue.`;
  }
  if (taskCount > 0) {
    return `${greeting}. You have ${taskCount} task${taskCount === 1 ? '' : 's'} due today.`;
  }
  if (hours > 0) {
    return `${greeting}. You logged ${hours} hour${hours === 1 ? '' : 's'} today.`;
  }
  if (period === 'evening' || period === 'night') {
    return `${greeting}. Time to wrap up.`;
  }
  return `${greeting}. Nothing overdue — take a nice, deep breath.`;
}

export function TodayHero({
  message = 'Take a nice, deep breath.',
}: {
  message?: ReactNode;
}) {
  return (
    <div className="mt-8 text-center sm:mt-10">
      <p
        key={typeof message === 'string' ? message : 'hero'}
        className="today-hero font-display text-2xl font-bold tracking-tight text-ph-ink sm:text-[1.75rem] sm:leading-tight"
      >
        {message}
      </p>
    </div>
  );
}

export function TodaySection({
  icon: Icon,
  iconClassName,
  title,
  description,
  action,
  testId,
  children,
}: {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  testId?: string;
  children: ReactNode;
}) {
  return (
    <section data-test={testId} className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3.5">
          <span
            className={cn(
              'inline-flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-black/[0.06]',
              iconClassName ?? 'bg-ph-muted text-ph-ink',
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 pt-0.5">
            <h2 className="font-display text-lg font-bold tracking-tight text-ph-ink">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-ph-subtle">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function TodayPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-ph-border/70 rounded-2xl border bg-ph-surface p-6 shadow-[0_2px_28px_-10px_rgba(15,23,42,0.14)] transition-all duration-200 ease-out sm:p-6',
        'hover:shadow-[0_8px_32px_-12px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:transform-none',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TodayEmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-ph-border/80 rounded-xl border border-dashed px-5 py-8 text-center">
      <p className="text-sm font-semibold text-ph-ink">{title}</p>
      {description ? (
        <p className="mt-1.5 text-sm leading-relaxed text-ph-subtle">
          {description}
        </p>
      ) : null}
    </div>
  );
}

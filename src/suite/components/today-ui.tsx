'use client';

import { Refresh as RefreshCw } from 'iconoir-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { SuiteAppIcon } from '../icons/suite-app-icon';
import { SuiteIcon } from '../icons/suite-icon';
import type { SuiteIconName } from '../icons/glyphs';
type LucideIcon = import('react').ComponentType<
  import('react').SVGProps<SVGSVGElement>
>;

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
      {/* ponytail: static rays + soft opacity pulse; spin was too busy for a sticky header */}
      <g className="origin-center opacity-80 motion-safe:animate-[pulse_8s_ease-in-out_infinite] motion-reduce:animate-none">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="20"
            y1="5"
            x2="20"
            y2="9"
            stroke="#fbbf24"
            strokeWidth="1.75"
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
      <g className="opacity-70 motion-safe:animate-[pulse_10s_ease-in-out_infinite] motion-reduce:animate-none">
        <circle cx="29" cy="10" r="1.2" fill="#c7d2fe" />
        <circle cx="34" cy="16" r="0.9" fill="#c7d2fe" />
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
  const icon = appIcon ?? (
    <TodayTimeIcon className="h-6 w-6 sm:h-7 sm:w-7 text-amber-500" />
  );
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
    return `${greeting}. ${taskCount} task${taskCount === 1 ? '' : 's'} due today, ${overdueCount} overdue.`;
  }
  if (taskCount > 0) {
    return `${greeting}. ${taskCount} task${taskCount === 1 ? '' : 's'} due today.`;
  }
  if (hours > 0) {
    return `${greeting}. ${hours} hour${hours === 1 ? '' : 's'} logged today.`;
  }
  if (period === 'evening' || period === 'night') {
    return `${greeting}. Nice work — time to wrap up.`;
  }
  return `${greeting}. Clear queue — take a nice, deep breath.`;
}

export function TodayHero({
  message = 'Take a nice, deep breath.',
  brief,
  briefMeta,
}: {
  message?: ReactNode;
  /** AI / local focus brief under the greeting. */
  brief?: ReactNode;
  briefMeta?: ReactNode;
}) {
  return (
    <div className="mt-4 sm:mt-6">
      <p
        key={typeof message === 'string' ? message : 'hero'}
        className="today-hero max-w-2xl font-display text-lg font-semibold tracking-tight text-ph-ink sm:text-xl sm:leading-snug"
      >
        {message}
      </p>
      {brief ? (
        <div className="mt-4 max-w-2xl" data-test="today-focus-brief">
          <p className="text-[15px] leading-[1.65] text-ph-ink">{brief}</p>
          {briefMeta ? (
            <p className="mt-1.5 text-xs text-ph-mutedtext">{briefMeta}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export type TodayPrimaryAccent =
  'tides' | 'turtletime' | 'kraken' | 'shellstack' | 'neutral';

/**
 * Compact primary CTA for Today — one action per app.
 * Colours live in suite-skin (.today-primary-action); no idle animation.
 */
export function TodayPrimaryAction({
  label,
  description,
  icon,
  accent = 'neutral',
  onClick,
  href,
  loading = false,
  active = false,
  className,
  dataTest = 'today-primary-action',
}: {
  label: string;
  description?: string;
  icon?: ReactNode;
  accent?: TodayPrimaryAccent;
  onClick?: () => void;
  href?: string;
  loading?: boolean;
  /** e.g. timer already running */
  active?: boolean;
  className?: string;
  dataTest?: string;
}) {
  const classes = cn(
    'today-primary-action group relative flex w-full max-w-md items-center gap-3 overflow-hidden rounded-xl px-3.5 py-2.5 text-left transition sm:px-4 sm:py-3',
    `today-primary-action--${accent}`,
    active && 'today-primary-action--active',
    loading && 'pointer-events-none opacity-70',
    className,
  );

  const body = (
    <>
      <span className="today-primary-action__icon inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold tracking-tight sm:text-base">
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-xs opacity-80 sm:text-sm">
            {description}
          </span>
        ) : null}
      </span>
      <span
        className="today-primary-action__chevron shrink-0 text-base opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100"
        aria-hidden
      >
        →
      </span>
    </>
  );

  if (href && !onClick) {
    return (
      <a
        href={href}
        className={classes}
        data-test={dataTest}
        aria-busy={loading}
      >
        {body}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={classes}
      data-test={dataTest}
      aria-busy={loading}
    >
      {body}
    </button>
  );
}

export function TodayEmptyAction({
  title,
  description,
  actionLabel,
  href,
  onClick,
  dataTest,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  href?: string;
  onClick?: () => void;
  dataTest?: string;
}) {
  return (
    <div
      className="rounded-lg border border-dashed border-ph-border/80 bg-ph-muted/30 px-4 py-4 text-center"
      data-test={dataTest}
    >
      <p className="text-sm font-semibold text-ph-ink">{title}</p>
      {description ? (
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-ph-subtle sm:text-sm">
          {description}
        </p>
      ) : null}
      {actionLabel && (href || onClick) ? (
        href ? (
          <a
            href={href}
            className="mt-2.5 inline-flex text-sm font-semibold text-ph-brand hover:underline"
          >
            {actionLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={onClick}
            className="mt-2.5 inline-flex text-sm font-semibold text-ph-brand hover:underline"
          >
            {actionLabel}
          </button>
        )
      ) : null}
    </div>
  );
}

/** Desktop Today shell: main column + sticky Ask AI / brief aside. */
export function TodayLayout({
  primary,
  main,
  aside,
  className,
}: {
  primary?: ReactNode;
  main: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('mt-5 space-y-6 sm:mt-6', className)}
      data-test="today-layout"
    >
      {primary ? <div className="max-w-md">{primary}</div> : null}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-8">{main}</div>
        {aside ? (
          <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
            {aside}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Today Ask AI CTA — opens the suite assistant (not Kraken Deep Research).
 * Prefer onClick → openSuiteAskAi(); href is a fallback only.
 */
export function TodayAskAiCard({
  title = 'Ask AI',
  description = 'Ask about your workspace, draft something, or look a fact up online.',
  cta = 'Ask',
  className,
  onClick,
  href,
}: {
  title?: string;
  description?: string;
  cta?: string;
  className?: string;
  onClick?: () => void;
  href?: string;
}) {
  const classes = cn(
    'group flex w-full items-start gap-3.5 rounded-2xl border border-ph-border/70 bg-ph-surface px-4 py-3.5 text-left shadow-[0_1px_12px_-8px_rgba(15,23,42,0.1)] transition hover:border-ph-brand/35 hover:bg-[color-mix(in_oklab,var(--ph-accent)_6%,var(--ph-surface))] sm:px-5',
    className,
  );

  const body = (
    <>
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ph-brand/15 text-ph-brand shadow-sm ring-1 ring-black/[0.06]">
        <SuiteIcon name="stack-hex" accent="shellstack" className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="font-display text-sm font-bold tracking-tight text-ph-ink">
            {title}
          </span>
          <span className="text-sm font-medium text-ph-brand transition group-hover:underline">
            {cta}
          </span>
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-ph-subtle">
          {description}
        </span>
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={classes}
        data-test="today-ask-ai"
      >
        {body}
      </button>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} data-test="today-ask-ai">
        {body}
      </a>
    );
  }

  return (
    <div className={classes} data-test="today-ask-ai">
      {body}
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
    <section data-test={testId} className="space-y-5">
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
        'border-ph-border/70 rounded-2xl border bg-ph-surface p-5 shadow-[0_1px_16px_-8px_rgba(15,23,42,0.12)] sm:p-5',
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

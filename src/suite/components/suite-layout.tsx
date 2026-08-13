'use client';

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { TodayTimeIcon } from './today-ui';

/** Width tokens — applied as data-width; CSS in suite-skin.css owns max-width. */
export type SuitePageWidth =
  | 'full'
  | 'wide'
  | 'content'
  | 'narrow'
  | 'reading';

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
  width = 'full',
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
      data-width={width}
      role={role}
      aria-live={ariaLive}
      className={cn(
        'suite-page-stage flex w-full min-w-0 flex-col',
        inset && 'suite-page-inset',
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
  /** Stick to the top of the scrollport (desktop page titles). */
  sticky = false,
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
  sticky?: boolean;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    if (!sticky) return;
    const el = headerRef.current;
    if (!el) return;

    // Sentinel just above the header — when it leaves the scrollport, we're stuck.
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText =
      'position:relative;height:1px;width:100%;margin:0;padding:0;pointer-events:none';
    el.parentElement?.insertBefore(sentinel, el);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(!entry.isIntersecting);
      },
      { threshold: [1], root: null },
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [sticky]);

  const resolvedIcon = todayIcon ? (
    <TodayTimeIcon
      className={cn(
        'h-7 w-7 text-amber-500 sm:h-8 sm:w-8',
        todayIconClassName,
      )}
    />
  ) : (
    icon
  );

  return (
    <header
      ref={headerRef}
      data-test={dataTest}
      data-stuck={sticky ? (stuck ? 'true' : 'false') : undefined}
      className={cn(
        'flex min-w-0 flex-col items-start gap-3 pb-2 sm:flex-row sm:justify-between sm:gap-4 sm:pb-3',
        // No extra pt here — page inset sets the shared title baseline.
        // Stuck state adds pad via .suite-page-header-sticky[data-stuck].
        sticky && 'suite-page-header-sticky',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
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
        {/* Icon aligns with the title line only — not the description. */}
        <div className="flex min-w-0 items-center gap-3">
          {resolvedIcon ? (
            <div
              className="hidden shrink-0 sm:flex sm:items-center [&_svg]:h-7 [&_svg]:w-7 sm:[&_svg]:h-8 sm:[&_svg]:w-8"
              aria-hidden="true"
            >
              {resolvedIcon}
            </div>
          ) : null}
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <h1
              className={cn(
                'min-w-0 break-words font-display text-[1.625rem] font-bold leading-none tracking-tight text-ph-ink text-balance sm:text-[2.25rem]',
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
        </div>
        {description ? (
          <div
            className={cn(
              'mt-1.5 max-w-2xl text-pretty text-sm leading-5 text-ph-subtle',
              resolvedIcon && 'sm:pl-11',
            )}
          >
            {description}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex max-w-full items-center gap-2 self-stretch overflow-x-auto pb-1 sm:shrink-0 sm:self-center sm:overflow-visible sm:pb-0">
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

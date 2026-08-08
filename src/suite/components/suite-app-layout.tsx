'use client';

import { type ReactNode, type PointerEvent } from 'react';

import { cn } from '../lib/cn';

export interface SuiteAppLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  mobileHeader?: ReactNode;
  bottomNav?: ReactNode;
  /** Desktop sidebar width in px. */
  sidebarWidth?: number;
  /** True when the sidebar is collapsed to the icon rail. */
  collapsed?: boolean;
  /**
   * When true, `#main-content` does not scroll — the page owns an internal
   * scrollport (e.g. Deep Research: fixed header + composer, chat scrolls).
   */
  lockMainScroll?: boolean;
  /** Drag this to resize the sidebar. */
  onStartResize?: (e: PointerEvent<HTMLDivElement>) => void;
  /** Double-click to reset sidebar width. */
  onResetWidth?: () => void;
  className?: string;
}

/**
 * Responsive ShellStack app shell. One content tree (no duplicate children),
 * one `#main-content` landmark. Desktop: fixed sidebar + scrollable main.
 * Mobile: header + main + bottom nav.
 */
export function SuiteAppLayout({
  sidebar,
  children,
  mobileHeader,
  bottomNav,
  sidebarWidth = 240,
  collapsed = false,
  lockMainScroll = false,
  onStartResize,
  onResetWidth,
  className,
}: SuiteAppLayoutProps) {
  return (
    <div
      data-test="app-shell"
      className={cn('flex min-h-dvh lg:h-screen lg:overflow-hidden', className)}
    >
      <aside
        className="relative hidden shrink-0 flex-col overflow-hidden border-r border-ph-border transition-[width] duration-200 ease-out lg:flex"
        style={{ width: `${sidebarWidth}px` }}
        data-collapsed={collapsed ? 'true' : 'false'}
      >
        {sidebar}
        {onStartResize ? (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            onPointerDown={onStartResize}
            onDoubleClick={onResetWidth}
            className="absolute inset-y-0 right-0 z-10 w-1 cursor-col-resize transition-colors hover:bg-[color-mix(in_oklab,var(--ph-accent)_30%,transparent)]"
          />
        ) : null}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {mobileHeader ? (
          <div className="shrink-0 lg:hidden">{mobileHeader}</div>
        ) : null}
        <main
          id="main-content"
          tabIndex={-1}
          data-lock-scroll={lockMainScroll ? 'true' : undefined}
          className={cn(
            'flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overscroll-contain bg-ph-canvas focus:outline-none',
            lockMainScroll ? 'overflow-hidden' : 'overflow-y-auto',
          )}
        >
          {children}
        </main>
        {bottomNav ? (
          <div className="shrink-0 lg:hidden">{bottomNav}</div>
        ) : null}
      </div>
    </div>
  );
}

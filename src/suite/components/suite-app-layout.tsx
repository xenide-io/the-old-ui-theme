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
  /** Drag this to resize the sidebar. */
  onStartResize?: (e: PointerEvent<HTMLDivElement>) => void;
  /** Double-click to reset sidebar width. */
  onResetWidth?: () => void;
  className?: string;
}

/**
 * Responsive ShellStack app shell. Desktop: resizable fixed sidebar +
 * scrollable content with an optional drag handle. Mobile/tablet: mobile
 * header + content + bottom nav. This is the single layout primitive every
 * app should use.
 */
export function SuiteAppLayout({
  sidebar,
  children,
  mobileHeader,
  bottomNav,
  sidebarWidth = 240,
  collapsed = false,
  onStartResize,
  onResetWidth,
  className,
}: SuiteAppLayoutProps) {
  return (
    <div data-test="app-shell" className={cn('min-h-screen', className)}>
      <div className="hidden lg:flex h-screen overflow-hidden">
        <aside
          className="relative shrink-0 border-r border-ph-border bg-ph-canvas transition-[width] duration-200 ease-out"
          style={{ width: `${sidebarWidth}px` }}
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
        <main className="min-w-0 flex-1 overflow-y-auto bg-ph-canvas">{children}</main>
      </div>

      <div className="flex min-h-screen flex-col lg:hidden">
        {mobileHeader ? <div className="shrink-0">{mobileHeader}</div> : null}
        <main className="min-w-0 flex-1 overflow-y-auto bg-ph-canvas">{children}</main>
        {bottomNav ? <div className="shrink-0">{bottomNav}</div> : null}
      </div>
    </div>
  );
}

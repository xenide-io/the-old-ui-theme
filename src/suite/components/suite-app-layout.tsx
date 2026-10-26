"use client";

import { type ReactNode, type PointerEvent, useEffect, useState } from "react";

import { cn } from "../lib/cn";
import {
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_RAIL_WIDTH,
} from "../lib/use-sidebar-width";

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
  /** Keyboard equivalent for the resize handle. */
  onResizeBy?: (delta: number) => void;
  /** Double-click to reset sidebar width. */
  onResetWidth?: () => void;
  /** Current route path; changes retrigger the page entrance. */
  routeKey?: string;
  /** Optional app-level density preset. Default is the shared comfortable scale. */
  density?: "compact" | "comfortable" | "spacious";
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
  onResizeBy,
  onResetWidth,
  routeKey,
  density,
  className,
}: SuiteAppLayoutProps) {
  const [resizing, setResizing] = useState(false);

  useEffect(() => {
    if (!resizing) return;
    const stop = () => setResizing(false);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [resizing]);

  return (
    <div
      data-test="app-shell"
      data-density={density && density !== "comfortable" ? density : undefined}
      className={cn(
        "suite-app-layout flex h-dvh overflow-hidden",
        className,
      )}
    >
      <aside
        aria-label="Sidebar"
        className="suite-app-layout__sidebar relative hidden shrink-0 flex-col overflow-visible border-r ease-out lg:flex"
        style={{ width: `${sidebarWidth}px` }}
        data-collapsed={collapsed ? "true" : "false"}
        data-resizing={resizing ? "true" : undefined}
      >
        {/* ponytail: isolate so Ask AI cannot cover the resize handle */}
        <div className="relative z-0 h-full min-h-0 isolate">{sidebar}</div>
        {onStartResize ? (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            aria-valuenow={sidebarWidth}
            aria-valuemin={SIDEBAR_RAIL_WIDTH}
            aria-valuemax={SIDEBAR_MAX_WIDTH}
            aria-valuetext={`${sidebarWidth} pixels`}
            data-test="sidebar-resize-handle"
            tabIndex={onResizeBy ? 0 : undefined}
            onPointerDown={
              onStartResize
                ? (event) => {
                    setResizing(true);
                    onStartResize(event);
                  }
                : undefined
            }
            onDoubleClick={onResetWidth}
            onKeyDown={(event) => {
              if (event.key === "Home") {
                event.preventDefault();
                onResizeBy?.(SIDEBAR_RAIL_WIDTH - sidebarWidth);
              } else if (event.key === "End") {
                event.preventDefault();
                onResizeBy?.(SIDEBAR_MAX_WIDTH - sidebarWidth);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                onResizeBy?.(-16);
              } else if (event.key === "ArrowRight") {
                event.preventDefault();
                onResizeBy?.(16);
              }
            }}
            className="suite-sidebar-resize-handle absolute inset-y-0 right-0 z-20 w-2 cursor-col-resize touch-none before:absolute before:-left-2 before:-right-2 before:inset-y-0 before:content-['']"
          />
        ) : null}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {mobileHeader ? (
          <div className="shrink-0 lg:hidden">{mobileHeader}</div>
        ) : null}
        <main
          id="main-content"
          tabIndex={0}
          data-lock-scroll={lockMainScroll ? "true" : undefined}
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overscroll-contain bg-ph-canvas focus:outline-hidden",
            "suite-app-layout__main",
            lockMainScroll ? "overflow-hidden" : "overflow-y-auto",
          )}
        >
          <div
            key={routeKey ?? "static"}
            className="suite-route-transition flex min-h-0 min-w-0 flex-1 flex-col"
          >
            {children}
          </div>
        </main>
        {bottomNav ? (
          <div className="shrink-0 lg:hidden">{bottomNav}</div>
        ) : null}
      </div>
    </div>
  );
}

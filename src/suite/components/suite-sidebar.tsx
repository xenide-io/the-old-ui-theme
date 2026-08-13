"use client";

import Link from "next/link";
import { type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Tooltip } from "../../components/ui/Tooltip";
import type { SuiteNavIcon } from "./suite-bottom-nav";

type CollapsedNode = ReactNode | ((collapsed: boolean) => ReactNode);

export interface SuiteSidebarNavItem {
  href: string;
  label: string;
  icon: SuiteNavIcon;
  id?: string;
  dataTest?: string;
  active?: boolean;
  onClick?: () => void;
  badge?: ReactNode;
  /** Optional colour class for the nav icon. */
  iconClassName?: string;
}

export interface SuiteSidebarProps {
  /** Optional custom app switcher node, or a function of collapsed state. */
  appSwitcher?: CollapsedNode;
  /** Workspace/org/project switcher rendered below the app switcher. */
  contextSwitcher: CollapsedNode;
  navItems: SuiteSidebarNavItem[];
  /** Optional secondary nav / tree rendered below primary nav. */
  secondaryNav?: ReactNode;
  userMenu: CollapsedNode;
  notificationBell?: CollapsedNode;
  /** Optional extra footer content placed next to the user menu. */
  footerExtras?: CollapsedNode;
  collapsed?: boolean;
  className?: string;
  /** Use the richer surface background instead of canvas. */
  surface?: boolean;
}

function renderNode(
  node: CollapsedNode | undefined,
  collapsed: boolean,
): ReactNode {
  if (typeof node === "function") return node(collapsed);
  return node;
}

/**
 * Standardised ShellStack sidebar. Matches the original TurtleTime layout
 * so the chrome feels familiar across all apps:
 * - app switcher + notification bell in a compact header
 * - workspace switcher at the top of the nav body
 * - primary nav items styled like the original NavLink
 * - avatar + optional logout in the footer
 */
export function SuiteSidebar({
  appSwitcher,
  contextSwitcher,
  navItems,
  secondaryNav,
  userMenu,
  notificationBell,
  footerExtras,
  collapsed = false,
  className,
  surface = false,
}: SuiteSidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full min-w-0 flex-col text-ph-ink",
        surface ? "bg-ph-surface" : "bg-ph-canvas",
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex shrink-0 border-b border-ph-border",
          surface ? "bg-ph-surface" : "bg-ph-canvas",
          collapsed
            ? "flex-col items-center gap-1 px-1 py-2"
            : "h-14 items-center justify-between gap-2 px-3",
        )}
      >
        <div className={cn("min-w-0", collapsed ? "shrink-0" : "flex-1")}>
          {renderNode(appSwitcher, collapsed)}
        </div>
        {collapsed ? null : (
          <div className="shrink-0">
            {renderNode(notificationBell, collapsed)}
          </div>
        )}
      </div>

      {/* Nav body */}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto",
          surface ? "bg-ph-surface" : "bg-ph-canvas",
          collapsed ? "px-1.5 py-2" : "p-2",
        )}
      >
        <nav aria-label="Pages" className="shrink-0 space-y-0.5">
          <div className={cn("mb-3", collapsed && "flex justify-center")}>
            {renderNode(contextSwitcher, collapsed)}
          </div>

          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = Boolean(item.active);
              const link = (
                <Link
                  key={item.label}
                  href={item.href}
                  id={item.id}
                  data-test={item.dataTest ?? "nav-link"}
                  aria-current={active ? "page" : undefined}
                  onClick={item.onClick}
                  className={cn(
                    "group relative flex min-h-11 touch-manipulation items-center gap-2.5 rounded-[var(--ph-radius-app)] text-sm font-medium transition-colors",
                    active
                      ? "bg-ph-muted"
                      : "text-ph-subtle hover:bg-ph-muted hover:text-ph-ink",
                    collapsed
                      ? "mx-auto size-11 shrink-0 justify-center gap-0 px-0 py-0"
                      : "w-full px-2.5 py-2",
                  )}
                >
                  <span
                    className={cn(
                      "relative flex h-4 w-4 shrink-0 items-center justify-center",
                      item.iconClassName,
                    )}
                    aria-hidden
                  >
                    <Icon
                      className="h-full w-full"
                      strokeWidth={active ? 2 : 1.75}
                    />
                  </span>
                  <span
                    className={cn(
                      "relative truncate",
                      active
                        ? "text-ph-ink"
                        : "text-ph-subtle group-hover:text-ph-ink",
                      collapsed && "sr-only",
                    )}
                  >
                    {item.label}
                  </span>
                  {!collapsed && item.badge ? (
                    <span className="relative ml-auto shrink-0">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
              return collapsed ? (
                <Tooltip key={item.label} content={item.label} side="right">
                  {link}
                </Tooltip>
              ) : (
                link
              );
            })}
          </div>
        </nav>

        {secondaryNav ? (
          <div
            className="min-h-0 flex-1"
            data-test="suite-sidebar-secondary-nav"
          >
            {secondaryNav}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div
        className={cn(
          "shrink-0 border-t border-ph-border",
          surface ? "bg-ph-surface" : "bg-ph-canvas",
          collapsed ? "p-1.5" : "p-3",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            collapsed ? "flex-col justify-center" : "min-w-0",
          )}
        >
          {renderNode(userMenu, collapsed)}
          {footerExtras ? (
            <div className={cn("shrink-0", collapsed ? "mt-2" : "ml-auto")}>
              {renderNode(footerExtras, collapsed)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

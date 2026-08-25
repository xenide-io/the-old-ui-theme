"use client";

import Link from "next/link";
import { useCallback, useEffect, type ReactNode } from "react";
import { NavArrowLeft, Sparks } from "iconoir-react";

import { Tooltip } from "../../components/ui/Tooltip";
import { cn } from "../lib/cn";
import {
  persistSuiteAskAiOpen,
  SUITE_OPEN_ASK_AI_EVENT,
} from "./ai-panel";
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
  /** When true, the nav body is replaced by `askAi`. */
  askAiOpen?: boolean;
  onAskAiOpenChange?: (open: boolean) => void;
  /** Chat column shown while Ask AI mode is open. */
  askAi?: ReactNode;
  /** Expand a collapsed rail before opening Ask AI. */
  onRequestExpand?: () => void;
}

function renderNode(
  node: CollapsedNode | undefined,
  collapsed: boolean,
): ReactNode {
  if (typeof node === "function") return node(collapsed);
  return node;
}

/**
 * Standardised ShellStack sidebar.
 * - app switcher + notification bell in a compact header
 * - workspace switcher at the top of the nav body
 * - primary nav items, optional secondary tree
 * - avatar + Ask AI in the footer (sign out lives on the avatar menu)
 * - Ask AI mode replaces the whole column (back + thread + composer)
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
  askAiOpen = false,
  onAskAiOpenChange,
  askAi,
  onRequestExpand,
}: SuiteSidebarProps) {
  const showAskAi = Boolean(onAskAiOpenChange && askAi);
  const chatOpen = showAskAi && askAiOpen && !collapsed;

  const setAskAi = useCallback(
    (next: boolean) => {
      persistSuiteAskAiOpen(next);
      onAskAiOpenChange?.(next);
    },
    [onAskAiOpenChange],
  );

  useEffect(() => {
    if (!onAskAiOpenChange) return;
    function onOpen() {
      onRequestExpand?.();
      setAskAi(true);
    }
    window.addEventListener(SUITE_OPEN_ASK_AI_EVENT, onOpen);
    return () => window.removeEventListener(SUITE_OPEN_ASK_AI_EVENT, onOpen);
  }, [onAskAiOpenChange, onRequestExpand, setAskAi]);

  useEffect(() => {
    if (!chatOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setAskAi(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen, setAskAi]);

  function toggleAskAi() {
    if (askAiOpen) {
      setAskAi(false);
      return;
    }
    if (collapsed) onRequestExpand?.();
    setAskAi(true);
  }

  const askAiButton = (
    <button
      type="button"
      data-test="suite-ask-ai-toggle"
      aria-pressed={askAiOpen}
      aria-label={askAiOpen ? "Back to navigation" : "Shelly AI"}
      onClick={toggleAskAi}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ph-focus-ring",
        askAiOpen
          ? "bg-ph-brand/10 text-ph-brand"
          : "text-ph-mutedtext hover:bg-ph-muted hover:text-ph-ink",
      )}
    >
      <Sparks className="h-4 w-4" aria-hidden />
    </button>
  );

  if (chatOpen) {
    return (
      <div
        data-suite-chat-open=""
        className={cn(
          "flex h-full w-full min-w-0 flex-col text-ph-ink",
          surface ? "bg-ph-surface" : "bg-ph-canvas",
          className,
        )}
      >
        <div
          className={cn(
            "flex h-14 shrink-0 items-center gap-1 border-b border-ph-border px-2",
            surface ? "bg-ph-surface" : "bg-ph-canvas",
          )}
        >
          <Tooltip content="Back to navigation">
            <button
              type="button"
              data-test="suite-ask-ai-back"
              aria-label="Back to navigation"
              onClick={() => setAskAi(false)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ph-subtle transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand"
            >
              <NavArrowLeft className="h-4 w-4" aria-hidden />
            </button>
          </Tooltip>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ph-ink">
            Shelly AI
          </span>
        </div>
        <div className="min-h-0 flex-1">{askAi}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full min-w-0 flex-col text-ph-ink",
        surface ? "bg-ph-surface" : "bg-ph-canvas",
        className,
      )}
    >
      {appSwitcher || notificationBell ? (
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
      ) : null}

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          surface ? "bg-ph-surface" : "bg-ph-canvas",
          chatOpen ? "min-h-0" : "overflow-y-auto",
          collapsed ? "px-1.5 py-2" : "p-2",
        )}
      >
        <div className={cn("mb-3 w-full shrink-0", collapsed && "flex justify-center")}>
          {renderNode(contextSwitcher, collapsed)}
        </div>

        {chatOpen ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="mb-2 flex shrink-0 items-center gap-1">
              <button
                type="button"
                data-test="suite-ask-ai-back"
                onClick={() => setAskAi(false)}
                className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium text-ph-subtle transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand"
              >
                <NavArrowLeft className="h-4 w-4" aria-hidden />
                Nav
              </button>
              <span className="truncate text-sm font-semibold text-ph-ink">
                Shelly AI
              </span>
            </div>
            <div className="min-h-0 flex-1">{askAi}</div>
          </div>
        ) : (
          <>
            <nav aria-label="Pages" className="shrink-0 space-y-0.5">
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
              <div className="shrink-0" data-test="suite-sidebar-secondary-nav">
                {secondaryNav}
              </div>
            ) : null}
          </>
        )}
      </div>

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
            collapsed
              ? "flex-col items-center justify-center [&>div]:w-auto"
              : "w-full min-w-0",
          )}
        >
          {renderNode(userMenu, collapsed)}
          {showAskAi ? (
            <div
              className={cn("shrink-0", collapsed ? "mt-2" : "ml-auto")}
            >
              <Tooltip content="Shelly AI" side={collapsed ? "right" : "top"}>
                {askAiButton}
              </Tooltip>
            </div>
          ) : footerExtras ? (
            <div className={cn("shrink-0", collapsed ? "mt-2" : "ml-auto")}>
              {renderNode(footerExtras, collapsed)}
            </div>
          ) : null}
          {showAskAi && footerExtras ? (
            <div className={cn("shrink-0", collapsed && "mt-2")}>
              {renderNode(footerExtras, collapsed)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

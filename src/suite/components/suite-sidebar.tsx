"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft as NavArrowLeft, Sparkles as Sparks } from 'lucide-react';

import { Tooltip } from "../../components/ui/Tooltip";
import { cn } from "../lib/cn";
import { useSuiteNavigation } from "../lib/navigation";
import { persistSuiteAskAiOpen, SUITE_OPEN_ASK_AI_EVENT } from "./ai-panel";
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
  contextSwitcher?: CollapsedNode;
  /** Extra nodes rendered after the nav item with this href. */
  insertAfter?: Record<string, CollapsedNode>;
  navItems: SuiteSidebarNavItem[];
  /** Optional secondary nav / tree rendered below primary nav. */
  secondaryNav?: ReactNode;
  userMenu: CollapsedNode;
  notificationBell?: CollapsedNode;
  /** Optional extra footer content placed next to the user menu. */
  footerExtras?: CollapsedNode;
  collapsed?: boolean;
  /** Called when Cmd/Ctrl+B asks to toggle the sidebar. */
  onCollapsedChange?: (collapsed: boolean) => void;
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
  insertAfter,
  navItems,
  secondaryNav,
  userMenu,
  notificationBell,
  footerExtras,
  collapsed = false,
  onCollapsedChange,
  className,
  surface = false,
  askAiOpen = false,
  onAskAiOpenChange,
  askAi,
  onRequestExpand,
}: SuiteSidebarProps) {
  const { Link } = useSuiteNavigation();
  const showAskAi = Boolean(onAskAiOpenChange && askAi);
  const chatOpen = showAskAi && askAiOpen && !collapsed;
  const navRef = useRef<HTMLElement>(null);
  const [activeIndicator, setActiveIndicator] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const askAiButtonRef = useRef<HTMLButtonElement>(null);
  const askAiBackRef = useRef<HTMLButtonElement>(null);
  const restoreAskAiFocusRef = useRef(false);

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
      if (event.key === "Escape") {
        restoreAskAiFocusRef.current = true;
        setAskAi(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen, setAskAi]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (chatOpen) {
        askAiBackRef.current?.focus();
      } else if (restoreAskAiFocusRef.current) {
        restoreAskAiFocusRef.current = false;
        askAiButtonRef.current?.focus();
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [chatOpen]);

  useEffect(() => {
    if (!onCollapsedChange) return;
    function onKey(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "b" || !(event.metaKey || event.ctrlKey)) {
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest(
          'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
        )
      ) {
        return;
      }
      event.preventDefault();
      onCollapsedChange?.(!collapsed);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [collapsed, onCollapsedChange]);

  const activeHref = navItems.find((item) => item.active)?.href;
  const effectiveActiveHref = pendingHref ?? activeHref;

  useEffect(() => {
    setPendingHref(null);
  }, [activeHref]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const active = nav.querySelector<HTMLElement>('a[aria-current="page"]');
      if (!active) {
        setActiveIndicator(null);
        return;
      }
      const navBox = nav.getBoundingClientRect();
      const linkBox = active.getBoundingClientRect();
      setActiveIndicator({
        left: linkBox.left - navBox.left,
        top: linkBox.top - navBox.top,
        width: linkBox.width,
        height: linkBox.height,
      });
    };
    measure();
    const frame = requestAnimationFrame(measure);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(nav);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [effectiveActiveHref, collapsed, navItems.length]);

  function closeAskAi() {
    restoreAskAiFocusRef.current = true;
    setAskAi(false);
  }

  function toggleAskAi() {
    if (askAiOpen) {
      closeAskAi();
      return;
    }
    if (collapsed) onRequestExpand?.();
    setAskAi(true);
  }

  const askAiButton = (
    <button
      ref={askAiButtonRef}
      type="button"
      data-test="suite-ask-ai-toggle"
      aria-pressed={askAiOpen}
      aria-label={askAiOpen ? "Back to navigation" : "Ask Shelly"}
      onClick={toggleAskAi}
      className={cn(
        "ph-btn ph-btn-ghost ph-btn-square h-10 w-10 shrink-0",
        askAiOpen
          ? "bg-ph-brand/10 text-ph-brand"
          : "text-ph-mutedtext hover:bg-ph-muted hover:text-ph-ink",
      )}
    >
      <Sparks className="suite-icon-motion suite-icon-pulse h-4 w-4" aria-hidden />
    </button>
  );

  if (chatOpen) {
    return (
      <div
        data-suite-chat-open=""
        data-surface={surface ? "true" : "false"}
        className={cn(
          "suite-sidebar flex h-full w-full min-w-0 flex-col text-ph-ink",
          className,
        )}
      >
        <div
          className="flex h-14 shrink-0 items-center gap-1 border-b border-ph-border px-2"
        >
          <button
            ref={askAiBackRef}
            type="button"
            data-test="suite-ask-ai-back"
            aria-label="Back to navigation"
            onClick={closeAskAi}
            className="ph-btn ph-btn-ghost ph-btn-square h-10 w-10 shrink-0 text-ph-subtle"
          >
            <NavArrowLeft className="h-4 w-4" aria-hidden />
          </button>
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
      data-surface={surface ? "true" : "false"}
      className={cn(
        "suite-sidebar flex h-full w-full min-w-0 flex-col text-ph-ink",
        className,
      )}
    >
      {appSwitcher || notificationBell ? (
        <div
          className={cn(
            "flex shrink-0 border-b border-ph-border",
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
          chatOpen ? "min-h-0" : "overflow-y-auto",
          collapsed ? "px-1.5 pt-2 pb-4" : "px-3 pt-3 pb-8",
        )}
      >
        {contextSwitcher ? (
          <div
            className={cn(
              "w-full shrink-0",
              collapsed ? "mb-2 flex justify-center" : "mb-3",
            )}
          >
            {renderNode(contextSwitcher, collapsed)}
          </div>
        ) : null}

        {chatOpen ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="mb-2 flex shrink-0 items-center gap-1">
              <button
                type="button"
                data-test="suite-ask-ai-back"
                onClick={closeAskAi}
                className="ph-btn ph-btn-ghost ph-btn-sm h-9 text-ph-subtle"
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
            <nav
              ref={navRef}
              aria-label="Pages"
              className="relative shrink-0 space-y-1"
            >
              {activeIndicator ? (
                <span
                  aria-hidden
                  data-suite-active-indicator
                  className="ph-nav-current pointer-events-none absolute left-0 top-0 z-0 rounded-[var(--ph-radius-control)] transition-[transform,width,height] duration-150 ease-out motion-reduce:transition-none"
                  style={{
                    transform: `translate(${activeIndicator.left}px, ${activeIndicator.top}px)`,
                    width: activeIndicator.width,
                    height: activeIndicator.height,
                  }}
                />
              ) : null}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    Boolean(item.active) || item.href === effectiveActiveHref;
                  const link = (
                    <Link
                      href={item.href}
                      id={item.id}
                      data-test={item.dataTest ?? "nav-link"}
                      aria-current={active ? "page" : undefined}
                      onClick={() => {
                        setPendingHref(item.href);
                        item.onClick?.();
                      }}
                      className={cn(
                        "suite-sidebar-link group relative flex min-h-11 touch-manipulation items-center gap-2.5 overflow-hidden rounded-[var(--ph-radius-control)] text-sm font-medium transition-[width,height,padding,background-color,color,transform] duration-150 ease-out active:scale-[0.98] active:duration-75",
                        active
                          ? "font-semibold text-[var(--ph-selected-text)]"
                          : "text-ph-subtle hover:bg-[var(--ph-surface-hover)] hover:text-ph-ink",
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
                          className={
                            active
                              ? "h-full w-full stroke-2"
                              : "h-full w-full stroke-[1.75]"
                          }
                        />
                      </span>
                      <span
                        className={cn(
                          "relative truncate",
                          active
                            ? "text-[var(--ph-selected-text)]"
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
                  const row = collapsed ? (
                    <Tooltip content={item.label} side="right">
                      {link}
                    </Tooltip>
                  ) : (
                    link
                  );
                  const extra = insertAfter?.[item.href];
                  return (
                    <div key={item.href}>
                      {row}
                      {extra ? (
                        <div
                          className={cn(
                            "py-2",
                            collapsed && "flex justify-center",
                          )}
                        >
                          {renderNode(extra, collapsed)}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </nav>

            {secondaryNav ? (
              <div
                className="flex-1 shrink-0"
                data-test="suite-sidebar-secondary-nav"
              >
                {secondaryNav}
              </div>
            ) : null}
          </>
        )}
      </div>

      <div
        className={cn(
          "shrink-0 border-t border-ph-border",
          collapsed
            ? "px-1.5 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
            : "px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
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
            <div className={cn("shrink-0", collapsed ? "mt-2" : "ml-auto")}>
              <Tooltip
                content={askAiOpen ? "Back to navigation" : "Ask Shelly"}
                side={collapsed ? "right" : "bottom"}
              >
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

"use client";

import type { ComponentType, ReactNode } from "react";
import { Menu } from "iconoir-react";

import { cn } from "../lib/cn";

type SuiteMenuIcon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/**
 * Suite mobile app bar — the standardized top of every app on phone/tablet.
 * Fixed slot order across the suite: [menu] [brand/context] … [actions].
 * Translucent + blurred (suite-skin.css `.suite-app-bar`), safe-area aware,
 * 44px minimum touch targets. Desktop chrome (rail/top bar) stays app-side.
 */
export function SuiteMobileHeader({
  onMenuClick,
  menuIcon: MenuIcon = Menu,
  title,
  actions,
  menuLabel = "Open navigation",
  menuId,
  menuDataTest,
  dataTest,
  className,
}: {
  /** Optional — omit to drop the hamburger (bottom-nav apps don't need one). */
  onMenuClick?: () => void;
  /** Leading button glyph — defaults to Menu; browse-style drawers can swap it. */
  menuIcon?: SuiteMenuIcon;
  /** Brand/context slot — app mark + title or app switcher. */
  title?: ReactNode;
  /** Right-hand slot — search, bell, avatar (keep this order). */
  actions?: ReactNode;
  menuLabel?: string;
  menuId?: string;
  menuDataTest?: string;
  dataTest?: string;
  className?: string;
}) {
  return (
    <header
      data-test={dataTest}
      className={cn(
        "suite-app-bar no-print sticky top-0 z-30 flex min-h-[56px] shrink-0 items-center gap-1 border-b border-ph-border px-2 lg:hidden",
        className,
      )}
    >
      {onMenuClick ? (
        <button
          type="button"
          id={menuId}
          data-test={menuDataTest}
          className="suite-press inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ph-ink transition-colors hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand"
          onClick={onMenuClick}
          aria-label={menuLabel}
        >
          <MenuIcon className="h-5 w-5" aria-hidden />
        </button>
      ) : null}
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center",
          !onMenuClick && "pl-2",
        )}
      >
        {title}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-1">{actions}</div>
      ) : null}
    </header>
  );
}

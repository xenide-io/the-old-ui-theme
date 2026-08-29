"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import {
  NavArrowDown as ChevronDown,
  OpenNewWindow,
} from "iconoir-react";

import { cn } from "../lib/cn";
import type {
  SuiteDropdownItemComponent,
  SuiteDropdownMenuComponent,
} from "../lib/injected";

export function appSwitcherTriggerClass(open: boolean, collapsed = false) {
  return cn(
    "group flex min-w-0 items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition-all duration-200",
    collapsed ? "h-11 w-11 justify-center px-0 py-0" : "w-full",
    open
      ? "border-ph-brand/30 bg-ph-muted shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-ph-brand/15"
      : "border-transparent hover:border-ph-border hover:bg-ph-muted/80 hover:shadow-sm",
  );
}

export function appSwitcherMarkClass() {
  return "h-8 w-8 shrink-0 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.06]";
}

export function appSwitcherMenuItemClass() {
  return "rounded-lg px-2 py-2 data-[highlighted]:bg-transparent hover:bg-ph-muted/80";
}

export function AppSwitcherMark({
  children,
  collapsed,
}: {
  children: ReactNode;
  collapsed?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative shrink-0",
        collapsed && "group-hover:scale-[1.02]",
      )}
    >
      {children}
    </span>
  );
}

export function AppSwitcherChevron({
  open,
  collapsed = false,
}: {
  open: boolean;
  collapsed?: boolean;
}) {
  if (collapsed) {
    return (
      <span
        className={cn(
          "absolute bottom-0 right-0 flex h-3 w-3 items-center justify-center rounded-full border border-ph-border bg-ph-surface shadow-sm transition-colors",
          open && "border-ph-brand/40 bg-ph-brand/10",
        )}
        aria-hidden
      >
        <ChevronDown
          className={cn(
            "h-2 w-2 text-ph-mutedtext transition-transform duration-200",
            open && "rotate-180 text-ph-brand",
          )}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "border-ph-border/80 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border bg-ph-canvas shadow-sm transition-all duration-200",
        open
          ? "border-ph-brand/35 bg-ph-brand/10 text-ph-brand"
          : "text-ph-mutedtext group-hover:border-ph-border group-hover:bg-ph-surface",
      )}
      aria-hidden
    >
      <ChevronDown
        className={cn(
          "h-3 w-3 transition-transform duration-200",
          open && "rotate-180",
        )}
      />
    </span>
  );
}

export interface SuiteAppEntry {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface SuiteAppSelectOptions {
  /** Open the handoff in a separate browser tab when requested by a caller. */
  newTab?: boolean;
}

/**
 * Suite app switcher dropdown. Apps inject their brand mark/title, the
 * visible app list, the cross-app navigation handler, and the theme
 * dropdown primitives.
 */
export function AppSwitcher({
  apps,
  currentApp,
  onSelect,
  mark,
  title,
  collapsed = false,
  dropdownMenu: DropdownMenu,
  dropdownItem: DropdownItem,
  triggerId,
  triggerDataTest,
}: {
  apps: SuiteAppEntry[];
  currentApp: string;
  onSelect: (app: SuiteAppEntry, options?: SuiteAppSelectOptions) => void;
  mark: ReactNode;
  title: ReactNode;
  collapsed?: boolean;
  dropdownMenu: SuiteDropdownMenuComponent;
  dropdownItem: SuiteDropdownItemComponent;
  triggerId?: string;
  triggerDataTest?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu
      aria-label="Switch application"
      triggerId={triggerId ?? "app-switcher-trigger"}
      triggerDataTest={triggerDataTest ?? "app-switcher-trigger"}
      className={collapsed ? "w-11 shrink-0" : "min-w-0 flex-1"}
      panelClassName="w-64"
      align="start"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <span
          className={appSwitcherTriggerClass(open, collapsed)}
          data-test="app-switcher-trigger"
          aria-expanded={open}
        >
          <AppSwitcherMark collapsed={collapsed}>
            {mark}
            {collapsed ? <AppSwitcherChevron open={open} collapsed /> : null}
          </AppSwitcherMark>
          {!collapsed ? title : null}
          {!collapsed ? <AppSwitcherChevron open={open} /> : null}
        </span>
      }
    >
      <div id="app-switcher-menu" className="p-1" data-test="app-switcher-menu">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ph-mutedtext">
          Switch application
        </p>
        {apps
          .filter((app) => app.slug !== currentApp)
          .map((app) => (
            <div key={app.slug} className="relative">
              <DropdownItem
                id={`switch-app-${app.slug}`}
                data-test={`switch-app-${app.slug}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setOpen(false);
                  onSelect(app);
                }}
                className={cn(appSwitcherMenuItemClass(), "pr-11")}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Image
                    src={app.icon}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0 rounded-md object-contain"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ph-ink">
                      {app.name}
                    </span>
                    <span className="block truncate text-xs text-ph-mutedtext">
                      {app.description}
                    </span>
                  </span>
                </span>
              </DropdownItem>
              <button
                type="button"
                id={`switch-app-${app.slug}-new-tab`}
                data-test={`switch-app-${app.slug}-new-tab`}
                aria-label={`Open ${app.name} in a new tab`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setOpen(false);
                  onSelect(app, { newTab: true });
                }}
                className="absolute right-1.5 top-1/2 z-[1] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ph-mutedtext transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ph-brand/35"
              >
                <OpenNewWindow className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
      </div>
    </DropdownMenu>
  );
}

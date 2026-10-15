"use client";

import { useEffect, useState, type ReactNode } from "react";
import { NavArrowDown as ChevronDown, OpenNewWindow } from "iconoir-react";

import { Tooltip } from "../../components/ui/Tooltip";
import { cn } from "../lib/cn";
import { useSuiteNavigation } from "../lib/navigation";
import { trackSuiteEvent } from "../../lib/suite-analytics";
import type {
  SuiteDropdownItemComponent,
  SuiteDropdownMenuComponent,
} from "../lib/injected";

export function appSwitcherTriggerClass(open: boolean, collapsed = false) {
  return cn(
    "group flex min-w-0 items-center gap-2 rounded-[var(--ph-radius-control)] border px-2 py-1.5 text-left transition-[color,background-color,border-color,box-shadow] duration-150",
    collapsed ? "h-11 w-11 justify-center px-0 py-0" : "w-full",
    open
      ? "border-[var(--ph-selected-border)] bg-[var(--ph-selected-bg)] shadow-[var(--ph-shadow-control)]"
      : "border-transparent hover:border-ph-border hover:bg-[var(--ph-surface-hover)]",
  );
}

export function appSwitcherMarkClass() {
  return "h-8 w-8 shrink-0 rounded-[var(--ph-radius-control)]";
}

export function appSwitcherMenuItemClass() {
  return "px-2 py-2";
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
          "absolute bottom-0 right-0 flex h-3 w-3 items-center justify-center rounded-full border border-ph-border bg-ph-surface transition-colors",
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
        "border-ph-border/80 flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--ph-radius-control)] border bg-ph-canvas transition-[color,background-color,border-color] duration-150",
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
  const { Image } = useSuiteNavigation();
  const [open, setOpen] = useState(false);
  const iconKey = apps.map((app) => app.icon).join("|");

  useEffect(() => {
    if (typeof window === "undefined") return;
    for (const src of iconKey.split("|")) {
      if (!src) continue;
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
    }
  }, [iconKey]);

  const trigger = (
    <span
      className={appSwitcherTriggerClass(open, collapsed)}
      data-test="app-switcher-trigger"
    >
      <AppSwitcherMark collapsed={collapsed}>
        {mark}
        {collapsed ? <AppSwitcherChevron open={open} collapsed /> : null}
      </AppSwitcherMark>
      {!collapsed ? title : null}
      {!collapsed ? <AppSwitcherChevron open={open} /> : null}
    </span>
  );

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
        collapsed ? (
          <Tooltip content="Switch application" side="right">
            {trigger}
          </Tooltip>
        ) : (
          trigger
        )
      }
    >
      <div id="app-switcher-menu" className="p-1" data-test="app-switcher-menu">
        <p className="px-3 py-2 text-[length:var(--ph-type-overline)] font-semibold uppercase tracking-[0.08em] text-ph-mutedtext">
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
                  trackSuiteEvent('App Launched', {
                    target_app: app.slug,
                    from_app: currentApp,
                    new_tab: false,
                    origin: 'app_switcher',
                  });
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
              <DropdownItem
                id={`switch-app-${app.slug}-new-tab`}
                data-test={`switch-app-${app.slug}-new-tab`}
                aria-label={`Open ${app.name} in a new tab`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setOpen(false);
                  trackSuiteEvent('App Launched', {
                    target_app: app.slug,
                    from_app: currentApp,
                    new_tab: true,
                    origin: 'app_switcher',
                  });
                  onSelect(app, { newTab: true });
                }}
                className="absolute right-1.5 top-1/2 z-[1] flex h-8 -translate-y-1/2 justify-center p-0 text-ph-mutedtext"
                style={{ width: "2rem" }}
              >
                <OpenNewWindow className="h-4 w-4" aria-hidden="true" />
              </DropdownItem>
            </div>
          ))}
      </div>
    </DropdownMenu>
  );
}

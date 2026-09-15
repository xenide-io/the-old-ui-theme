"use client";

import { useState, type ReactNode } from "react";
import { Building, Check, NavArrowDown } from "iconoir-react";

import { cn } from "../lib/cn";
import type {
  SuiteDropdownItemComponent,
  SuiteDropdownMenuComponent,
} from "../lib/injected";
import { appSwitcherMenuItemClass } from "./app-switcher";

export interface SuiteWorkspaceEntry {
  id: string;
  name: string;
  description?: string;
}

export interface SuiteWorkspaceGroup {
  id: string;
  label: string;
  workspaces: SuiteWorkspaceEntry[];
}

/**
 * Suite workspace switcher. Full-width bordered trigger; dropdown menu.
 * Apps inject workspace rows (or labelled groups) and the theme dropdown.
 */
export function SuiteWorkspaceSwitcher({
  workspaces = [],
  groups,
  currentId,
  onSelect,
  name,
  collapsed = false,
  emptyLabel = "No workspaces yet.",
  dropdownMenu: DropdownMenu,
  dropdownItem: DropdownItem,
  triggerId,
  triggerDataTest,
  footer,
}: {
  workspaces?: SuiteWorkspaceEntry[];
  groups?: SuiteWorkspaceGroup[];
  currentId?: string | null;
  onSelect: (workspace: SuiteWorkspaceEntry) => void;
  name: string;
  collapsed?: boolean;
  emptyLabel?: string;
  dropdownMenu: SuiteDropdownMenuComponent;
  dropdownItem: SuiteDropdownItemComponent;
  triggerId?: string;
  triggerDataTest?: string;
  footer?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const sections =
    groups?.filter((group) => group.workspaces.length > 0) ??
    (workspaces.length > 0
      ? [{ id: "workspaces", label: "Switch workspace", workspaces }]
      : []);

  return (
    <DropdownMenu
      aria-label="Switch workspace"
      triggerId={triggerId ?? "workspace-switcher-trigger"}
      triggerDataTest={triggerDataTest ?? "workspace-switcher-trigger"}
      className={
        collapsed
          ? "w-11 shrink-0"
          : "w-full min-w-0 max-w-full [&_.ph-dropdown-trigger]:w-full"
      }
      panelClassName="w-64 max-w-full"
      align="start"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <span
          className={cn(
            "flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-ph-border bg-ph-muted text-left transition-colors hover:bg-ph-muted",
            collapsed ? "h-10 w-10 justify-center p-0" : "w-full px-3 py-2",
            open && "border-ph-brand/40",
          )}
          data-test="workspace-switcher-trigger"
        >
          <Building className="h-4 w-4 shrink-0 text-ph-ink" aria-hidden />
          {!collapsed ? (
            <>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ph-ink">
                {name}
              </span>
              <NavArrowDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-ph-mutedtext transition-transform",
                  open && "rotate-180",
                )}
                aria-hidden
              />
            </>
          ) : null}
        </span>
      }
    >
      <div
        id="workspace-switcher-menu"
        className="p-1"
        data-test="workspace-switcher-menu"
      >
        {sections.length === 0 ? (
          <p className="px-3 py-2 text-sm text-ph-mutedtext">{emptyLabel}</p>
        ) : (
          sections.map((section) => (
            <div key={section.id}>
              <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ph-mutedtext">
                {section.label}
              </p>
              {section.workspaces.map((workspace) => (
                <DropdownItem
                  key={workspace.id}
                  id={`workspace-option-${workspace.id}`}
                  aria-current={
                    workspace.id === currentId ? "true" : undefined
                  }
                  data-test="workspace-option"
                  data-workspace-id={workspace.id}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setOpen(false);
                    onSelect(workspace);
                  }}
                  className={appSwitcherMenuItemClass()}
                >
                  <span className="flex min-w-0 w-full items-center gap-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ph-ink">
                        {workspace.name}
                      </span>
                      {workspace.description ? (
                        <span className="block truncate text-xs text-ph-mutedtext">
                          {workspace.description}
                        </span>
                      ) : null}
                    </span>
                    {workspace.id === currentId ? (
                      <Check
                        className="h-4 w-4 shrink-0 text-ph-brand"
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                </DropdownItem>
              ))}
            </div>
          ))
        )}
        {footer ? (
          <div className="mt-1 border-t border-ph-border pt-1">{footer}</div>
        ) : null}
      </div>
    </DropdownMenu>
  );
}

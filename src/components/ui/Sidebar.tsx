"use client";

import { type ReactNode, useState } from "react";
import { cn } from "@/lib/cn";

export interface SidebarGroup {
  label: string;
  items: SidebarItemDef[];
}

export interface SidebarItemDef {
  label: string;
  icon?: ReactNode;
  href?: string;
  badge?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export interface SidebarProps {
  groups: SidebarGroup[];
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ groups, className, header, footer, children, collapsed = false, onCollapse }: SidebarProps) {
  return (
    <nav className={cn("ph-sidebar flex flex-col h-full", collapsed && "ph-sidebar--collapsed", className)}>
      {header && <div className="ph-sidebar__header px-3 py-3 border-b border-ph-border-subtle">{header}</div>}
      <div className="ph-sidebar__body flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {groups.map((group) => (
          <div key={group.label} className="ph-sidebar__group">
            {!collapsed && (
              <h3 className="ph-sidebar__group-label px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-ph-mutedtext">
                {group.label}
              </h3>
            )}
            <div className="ph-sidebar__items space-y-0.5">
              {group.items.map((item) => (
                <SidebarItem key={item.label} {...item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {children}
      {footer && <div className="ph-sidebar__footer px-3 py-3 border-t border-ph-border-subtle">{footer}</div>}
    </nav>
  );
}

function SidebarItem({ label, icon, badge, active, onClick, collapsed }: SidebarItemDef & { collapsed: boolean }) {
  const Comp = onClick ? "button" : "a";
  return (
    <Comp
      type={onClick ? "button" as const : undefined}
      href={onClick ? undefined : undefined}
      onClick={onClick}
      className={cn(
        "ph-sidebar__item flex items-center gap-2.5 w-full rounded-md px-2.5 py-2 text-sm text-left transition",
        active
          ? "bg-ph-selected-bg text-ph-selected-text font-medium"
          : "text-ph-subtle hover:bg-ph-muted hover:text-ph-ink",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? label : undefined}
    >
      {icon && <span className="ph-sidebar__item-icon shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>}
      {!collapsed && <span className="ph-sidebar__item-label truncate flex-1">{label}</span>}
      {!collapsed && badge && <span className="ph-sidebar__item-badge shrink-0">{badge}</span>}
    </Comp>
  );
}

Sidebar.displayName = "Sidebar";

"use client";

import { Tooltip } from "../../components/ui/Tooltip";
import { cn } from "../lib/cn";
import { useSuiteNavigation } from "../lib/navigation";
import type { SuiteSidebarNavItem } from "./suite-sidebar";

/** Secondary navigation deliberately stays outside the primary active indicator. */
export function SuiteSidebarLinks({ items, collapsed = false, label = "Workspace tools", className, onNavigate }: {
  items: SuiteSidebarNavItem[];
  collapsed?: boolean;
  label?: string;
  className?: string;
  onNavigate?(): void;
}) {
  const { Link } = useSuiteNavigation();
  return (
    <nav aria-label={label} className={cn(collapsed ? "space-y-1" : "space-y-0.5", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const link = <Link key={item.href} href={item.href} id={item.id} data-test={item.dataTest ?? "nav-link"}
          aria-current={item.active ? "page" : undefined} onClick={() => { item.onClick?.(); onNavigate?.(); }}
          className={cn("suite-sidebar-link text-ph-subtle flex min-h-8 items-center gap-2.5 rounded-[var(--ph-radius-control)] text-sm font-medium focus-visible:outline focus-visible:outline-2 [@media(pointer:coarse)]:min-h-11", collapsed ? "mx-auto size-11 justify-center gap-0" : "px-2.5 py-1", item.active ? "ph-nav-highlight" : "hover:bg-[var(--ph-surface-hover)]")}>
          <Icon className={cn("h-4 w-4 shrink-0 stroke-[1.75]", item.iconClassName)} aria-hidden />
          <span className={cn("truncate", collapsed && "sr-only")}>{item.label}</span>
          {!collapsed && item.badge ? <span className="ml-auto">{item.badge}</span> : null}
        </Link>;
        return collapsed ? <Tooltip key={item.href} content={item.label} side="right">{link}</Tooltip> : link;
      })}
    </nav>
  );
}

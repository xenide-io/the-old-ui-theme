'use client';

import { type ReactNode } from 'react';
import Image from 'next/image';

import { Sidebar, type SidebarItemDef } from '@/components/ui';
import { cn } from '../lib/cn';
import {
  AppSwitcher,
  type SuiteAppEntry,
} from './app-switcher';
import { DropdownMenu, DropdownItem } from '@/components/ui/DropdownMenu';
import type { SuiteNavIcon } from './suite-bottom-nav';

type CollapsedNode = ReactNode | ((collapsed: boolean) => ReactNode);

export interface SuiteSidebarNavItem {
  href: string;
  label: string;
  icon: SuiteNavIcon;
  active?: boolean;
  onClick?: () => void;
  badge?: ReactNode;
}

export interface SuiteSidebarProps {
  /** Optional custom app switcher node, or a function of collapsed state. If omitted, a default AppSwitcher is rendered from `apps`/`currentApp`/`onAppSelect`. */
  appSwitcher?: CollapsedNode;
  apps?: SuiteAppEntry[];
  currentApp?: string;
  onAppSelect?: (app: SuiteAppEntry) => void;
  /** Workspace/org/project switcher rendered below the app switcher. */
  contextSwitcher: CollapsedNode;
  navItems: SuiteSidebarNavItem[];
  /** Optional secondary nav / tree rendered below primary nav (e.g. Tides projects, Kraken docs). */
  secondaryNav?: ReactNode;
  userMenu: CollapsedNode;
  notificationBell?: CollapsedNode;
  /** Optional extra footer content placed next to the user menu. */
  footerExtras?: CollapsedNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
}

function renderNode(node: CollapsedNode | undefined, collapsed: boolean): ReactNode {
  if (typeof node === 'function') return node(collapsed);
  return node;
}

/**
 * Standardised ShellStack sidebar — app switcher, context switcher,
 * primary navigation, optional secondary tree, and an account footer.
 * Built on top of the theme `Sidebar` and `AppSwitcher` so every app
 * shares the same chrome.
 */
export function SuiteSidebar({
  appSwitcher,
  apps,
  currentApp,
  onAppSelect,
  contextSwitcher,
  navItems,
  secondaryNav,
  userMenu,
  notificationBell,
  footerExtras,
  collapsed = false,
  onCollapse,
  className,
}: SuiteSidebarProps) {
  const current = apps?.find((a) => a.slug === currentApp);

  const defaultAppSwitcher =
    apps && currentApp && onAppSelect && current ? (
      <AppSwitcher
        apps={apps}
        currentApp={currentApp}
        onSelect={onAppSelect}
        mark={
          <div className="relative h-7 w-7 overflow-hidden rounded-lg">
            <Image
              src={current.icon}
              alt={current.name}
              width={28}
              height={28}
              className="h-full w-full"
              unoptimized
            />
          </div>
        }
        title={
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-ph-ink">{current.name}</span>
            <span className="truncate text-xs text-ph-mutedtext">ShellStack workspace</span>
          </span>
        }
        collapsed={collapsed}
        dropdownMenu={DropdownMenu}
        dropdownItem={DropdownItem}
      />
    ) : null;

  const header = (
    <div className={cn('flex flex-col gap-3', collapsed && 'items-center')}>
      <div
        className={cn(
          'flex items-center gap-2',
          collapsed ? 'flex-col' : 'justify-between',
        )}
      >
        <div className={collapsed ? undefined : 'min-w-0 flex-1'}>
          {renderNode(appSwitcher, collapsed) ?? defaultAppSwitcher}
        </div>
        {!collapsed && notificationBell ? (
          <div className="shrink-0">{renderNode(notificationBell, collapsed)}</div>
        ) : null}
      </div>
      <div className={cn(collapsed && 'flex justify-center')}>
        {renderNode(contextSwitcher, collapsed)}
      </div>
    </div>
  );

  const items: SidebarItemDef[] = navItems.map((item) => {
    const Icon = item.icon;
    return {
      label: item.label,
      href: item.href,
      active: item.active,
      onClick: item.onClick,
      badge: item.badge,
      icon: <Icon className="h-4 w-4" aria-hidden />,
    };
  });

  const groups: { label?: string; items: SidebarItemDef[] }[] = [{ items }];
  if (secondaryNav && !collapsed) {
    groups.push({ items: [] });
  }

  return (
    <Sidebar
      groups={groups}
      header={header}
      footer={
        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          {renderNode(userMenu, collapsed)}
          {!collapsed && footerExtras ? <div className="ml-auto shrink-0">{renderNode(footerExtras, collapsed)}</div> : null}
        </div>
      }
      collapsed={collapsed}
      onCollapse={onCollapse}
      className={className}
    >
      {secondaryNav && !collapsed ? (
        <div className="px-2 pb-3" data-test="suite-sidebar-secondary-nav">
          {secondaryNav}
        </div>
      ) : null}
    </Sidebar>
  );
}

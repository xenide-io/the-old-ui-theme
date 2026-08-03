'use client';

import { type ReactNode } from 'react';
import Image from 'next/image';

import { Sidebar, AppLayout, type SidebarItemDef } from '@/components/ui';
import { cn } from '../lib/cn';
import {
  AppSwitcher,
  AppSwitcherMark,
  AppSwitcherChevron,
  type SuiteAppEntry,
} from './app-switcher';
import { DropdownMenu, DropdownItem } from '@/components/ui/DropdownMenu';
import type { SuiteNavIcon } from './suite-bottom-nav';

export interface SuiteSidebarNavItem {
  href: string;
  label: string;
  icon: SuiteNavIcon;
  active?: boolean;
  onClick?: () => void;
  badge?: ReactNode;
}

export interface SuiteSidebarProps {
  apps: SuiteAppEntry[];
  currentApp: string;
  onAppSelect: (app: SuiteAppEntry) => void;
  workspaceSwitcher: ReactNode;
  navItems: SuiteSidebarNavItem[];
  userMenu: ReactNode;
  notificationBell?: ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
}

/**
 * Standardised ShellStack sidebar — app switcher, workspace switcher,
 * primary navigation, and an account footer. Built on top of the theme
 * `Sidebar` and `AppSwitcher` so every app shares the same chrome.
 */
export function SuiteSidebar({
  apps,
  currentApp,
  onAppSelect,
  workspaceSwitcher,
  navItems,
  userMenu,
  notificationBell,
  collapsed = false,
  onCollapse,
  className,
}: SuiteSidebarProps) {
  const current = apps.find((a) => a.slug === currentApp) ?? apps[0];

  const header = (
    <div className={cn('flex flex-col gap-3', collapsed && 'items-center')}>
      <div
        className={cn(
          'flex items-center gap-2',
          collapsed ? 'flex-col' : 'justify-between',
        )}
      >
        <AppSwitcher
          apps={apps}
          currentApp={currentApp}
          onSelect={onAppSelect}
          mark={
            current ? (
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
            ) : null
          }
          title={
            current ? (
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-ph-ink">
                  {current.name}
                </span>
                <span className="truncate text-xs text-ph-mutedtext">
                  ShellStack workspace
                </span>
              </span>
            ) : null
          }
          collapsed={collapsed}
          dropdownMenu={DropdownMenu}
          dropdownItem={DropdownItem}
        />
        {!collapsed && notificationBell ? (
          <div className="shrink-0">{notificationBell}</div>
        ) : null}
      </div>
      <div className={cn(collapsed && 'flex justify-center')}>{workspaceSwitcher}</div>
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

  return (
    <Sidebar
      groups={[{ label: 'Navigation', items }]}
      header={header}
      footer={
        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          {userMenu}
        </div>
      }
      collapsed={collapsed}
      onCollapse={onCollapse}
      className={className}
    />
  );
}

"use client";

import { ChevronsUpDown, LogOut, Settings } from 'lucide-react';
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { useSuiteNavigation } from "../lib/navigation";
import { DropdownMenu, DropdownItem } from "../../components/ui/DropdownMenu";
import { Tooltip } from "../../components/ui/Tooltip";
import { avatarColorClass, computeInitials } from "./suite-person-avatar";

export interface SuiteUserMenuProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  /** Destination for the "Profile settings" item. */
  settingsHref: string;
  onSignOut: () => void;
  /** Fallback letter(s) when there is no avatar image. */
  fallbackInitials?: string;
  /** Second line under the name: the active workspace (organisation in the portal). */
  subtitle?: string | null;
  /** Inline workspace choices, using the host app's existing selection flow. */
  workspaceMenu?: ReactNode;
  /** Show the name + subtitle beside the avatar, for the sidebar footer. */
  showDetails?: boolean;
  /** Show the old desktop sidebar sign-out action beside the avatar. */
  showSignOutAction?: boolean;
  dataTest?: string;
  triggerId?: string;
  triggerDataTest?: string;
  className?: string;
  /**
   * Host-injected menu items, rendered between "Profile settings" and
   * "Sign out". Lets an app add account-scoped actions without forking the menu.
   */
  extraMenuItems?: ReactNode;
}

/**
 * Suite account context menu — one tap on the avatar opens a small menu with
 * profile settings and sign out. Desktop sidebars can also expose the legacy
 * adjacent sign-out action without adding it to mobile chrome.
 */
export function SuiteUserMenu({
  name,
  email,
  image,
  settingsHref,
  onSignOut,
  fallbackInitials,
  subtitle,
  workspaceMenu,
  showDetails = false,
  showSignOutAction = false,
  dataTest = "suite-user-menu",
  triggerId,
  triggerDataTest,
  className,
  extraMenuItems,
}: SuiteUserMenuProps) {
  const { Image, useRouter } = useSuiteNavigation();
  const router = useRouter();
  const initials = fallbackInitials ?? computeInitials(name, email);
  const fallbackColor = avatarColorClass(email || name || "?");

  // Visual avatar is 32px (Avatar `xs`); the 40px trigger keeps a comfortable
  // tap target. Colour comes from theme `--ph-*` tokens.
  const avatar = (
    <span className="inline-flex h-10 w-10 items-center justify-center">
      <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-ph-border">
        {image ? (
          <Image
            src={image}
            alt=""
            width={32}
            height={32}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <span
            className={cn(
              "flex h-full w-full items-center justify-center text-xs font-semibold",
              fallbackColor,
            )}
          >
            {initials}
          </span>
        )}
      </span>
    </span>
  );

  // Sidebar footer shows who is signed in and the current workspace;
  // the mobile header keeps the bare avatar so its action row stays compact.
  const trigger = showDetails ? (
    <span className="flex w-full min-w-0 items-center gap-2">
      {avatar}
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="truncate text-sm font-medium text-ph-ink">
          {name || email || "Account"}
        </span>
        {subtitle ? (
          <span className="truncate text-xs text-ph-mutedtext">{subtitle}</span>
        ) : null}
      </span>
      <ChevronsUpDown className="mr-1 h-3.5 w-3.5 shrink-0 text-ph-mutedtext" aria-hidden />
    </span>
  ) : (
    avatar
  );

  const accountMenu = (
    <DropdownMenu
      trigger={trigger}
      triggerId={triggerId ?? `${dataTest}-trigger`}
      triggerDataTest={triggerDataTest ?? `${dataTest}-trigger`}
      aria-label="Account menu"
      align={showDetails ? "start" : "end"}
      side={showDetails ? "top" : "bottom"}
      sideOffset={6}
      collisionPadding={16}
      modal={false}
      panelClassName="w-80 max-w-[calc(100vw-2rem)] p-1.5 [&_.ph-dropdown-item]:min-h-11"
      className={cn(
        "[&_.ph-dropdown-trigger]:rounded-full",
        showDetails &&
          "min-w-0 flex-1 [&_.ph-dropdown-trigger]:w-full [&_.ph-dropdown-trigger]:justify-start [&_.ph-dropdown-trigger]:rounded-[var(--ph-radius-control)]",
        showSignOutAction ? undefined : className,
      )}
      data-test={dataTest}
    >
      <div className="flex min-w-0 items-center gap-2 px-2 py-3">
        <span className="shrink-0">{avatar}</span>
        <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ph-ink">
          {name || email || "Account"}
        </p>
        {email ? (
          <p className="truncate text-xs text-ph-mutedtext">{email}</p>
        ) : null}
        </div>
      </div>
      {workspaceMenu ? (
        <div className="mb-1 border-y border-ph-border py-1" data-test={`${dataTest}-workspaces`}>
          {workspaceMenu}
        </div>
      ) : <div className="my-1 border-t border-ph-border" />}
      <DropdownItem
        data-test={`${dataTest}-settings`}
        onClick={() => router.push(settingsHref)}
      >
        <Settings className="h-4 w-4 text-ph-mutedtext" aria-hidden />
        Profile settings
      </DropdownItem>
      {extraMenuItems}
      <DropdownItem data-test={`${dataTest}-sign-out`} onClick={onSignOut}>
        <LogOut className="h-4 w-4 text-ph-mutedtext" aria-hidden />
        Sign out
      </DropdownItem>
    </DropdownMenu>
  );

  if (!showSignOutAction) {
    return accountMenu;
  }

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-1 items-center justify-between gap-2",
        className,
      )}
    >
      <div className="shrink-0">{accountMenu}</div>
      <Tooltip content="Sign out" side="top">
        <button
          type="button"
          data-test={`${dataTest}-visible-sign-out`}
          aria-label="Sign out"
          className="ph-btn ph-btn-ghost ph-btn-square h-10 w-10 shrink-0 text-ph-mutedtext"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4" aria-hidden />
        </button>
      </Tooltip>
    </div>
  );
}

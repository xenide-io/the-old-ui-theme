"use client";

import { LogOut, Settings } from "iconoir-react";

import { cn } from "../lib/cn";
import { useSuiteNavigation } from "../lib/navigation";
import { DropdownMenu, DropdownItem } from "../../components/ui/DropdownMenu";
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
  /** Second line under the name, e.g. the workspace subscription ("Plus"). */
  subtitle?: string | null;
  /** Show the name + subtitle beside the avatar, for the sidebar footer. */
  showDetails?: boolean;
  /** Show the old desktop sidebar sign-out action beside the avatar. */
  showSignOutAction?: boolean;
  dataTest?: string;
  triggerId?: string;
  triggerDataTest?: string;
  className?: string;
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
  showDetails = false,
  showSignOutAction = false,
  dataTest = "suite-user-menu",
  triggerId,
  triggerDataTest,
  className,
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

  // Sidebar footer shows who is signed in and which plan the workspace is on;
  // the mobile header keeps the bare avatar so its action row stays compact.
  const trigger = showDetails ? (
    <span className="flex min-w-0 items-center gap-2">
      {avatar}
      <span className="flex min-w-0 flex-col text-left">
        <span className="truncate text-sm font-medium text-ph-ink">
          {name || email || "Account"}
        </span>
        {subtitle ? (
          <span className="truncate text-xs text-ph-mutedtext">{subtitle}</span>
        ) : null}
      </span>
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
      align="end"
      side="bottom"
      sideOffset={6}
      collisionPadding={16}
      modal={false}
      className={cn(
        "[&_.ph-dropdown-trigger]:rounded-full",
        showDetails &&
          "min-w-0 flex-1 [&_.ph-dropdown-trigger]:w-full [&_.ph-dropdown-trigger]:justify-start [&_.ph-dropdown-trigger]:rounded-[var(--ph-radius-control)]",
        showSignOutAction ? undefined : className,
      )}
      data-test={dataTest}
    >
      <div className="px-2 py-1.5">
        <p className="truncate text-sm font-medium text-ph-ink">
          {name || email || "Account"}
        </p>
        {email ? (
          <p className="truncate text-xs text-ph-mutedtext">{email}</p>
        ) : null}
      </div>
      <div className="my-1 border-t border-ph-border" />
      <DropdownItem
        data-test={`${dataTest}-settings`}
        onClick={() => router.push(settingsHref)}
      >
        <Settings className="h-4 w-4 text-ph-mutedtext" aria-hidden />
        Profile settings
      </DropdownItem>
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
      <button
        type="button"
        data-test={`${dataTest}-visible-sign-out`}
        title="Sign out"
        aria-label="Sign out"
        className="ph-btn ph-btn-ghost ph-btn-square h-10 w-10 shrink-0 text-ph-mutedtext"
        onClick={onSignOut}
      >
        <LogOut className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

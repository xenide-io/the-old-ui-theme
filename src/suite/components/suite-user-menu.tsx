"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Settings } from "iconoir-react";

import { cn } from "../lib/cn";
import { DropdownMenu, DropdownItem } from "../../components/ui/DropdownMenu";

export interface SuiteUserMenuProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  /** Destination for the "Profile settings" item. */
  settingsHref: string;
  onSignOut: () => void;
  /** Fallback letter(s) when there is no avatar image. */
  fallbackInitials?: string;
  /** Show the old desktop sidebar sign-out action beside the avatar. */
  showSignOutAction?: boolean;
  dataTest?: string;
  triggerId?: string;
  triggerDataTest?: string;
  className?: string;
}

function computeInitials(
  name: string | null | undefined,
  email: string | null | undefined,
): string {
  const source = (name || email || "?").trim();
  return source
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
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
  showSignOutAction = false,
  dataTest = "suite-user-menu",
  triggerId,
  triggerDataTest,
  className,
}: SuiteUserMenuProps) {
  const router = useRouter();
  const initials = fallbackInitials ?? computeInitials(name, email);

  const avatar = (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-2 ring-ph-border ring-offset-1 ring-offset-ph-canvas transition-colors hover:bg-ph-muted">
      {image ? (
        <Image
          src={image}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
          unoptimized
        />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ph-muted text-sm font-semibold text-ph-brand">
          {initials}
        </span>
      )}
    </span>
  );

  const accountMenu = (
    <DropdownMenu
      trigger={avatar}
      triggerId={triggerId ?? `${dataTest}-trigger`}
      triggerDataTest={triggerDataTest ?? `${dataTest}-trigger`}
      aria-label="Account menu"
      align="end"
      side="bottom"
      sideOffset={6}
      collisionPadding={16}
      modal={false}
      className={showSignOutAction ? undefined : className}
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
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      {accountMenu}
      <button
        type="button"
        data-test={`${dataTest}-visible-sign-out`}
        title="Sign out"
        aria-label="Sign out"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ph-mutedtext transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ph-focus-ring"
        onClick={onSignOut}
      >
        <LogOut className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

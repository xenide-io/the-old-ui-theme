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
 * Deterministic coloured fallback: derives a stable accent from the user's
 * email or name so avatars without a photo get a per-user colour instead of a
 * flat grey. Uses theme `--ph-*` tokens so it adapts to light and dark themes.
 */
const AVATAR_TOKENS: Array<[string, string]> = [
  ["bg-ph-brand", "text-[var(--ph-on-accent)]"],
  ["bg-ph-violet", "text-[var(--ph-on-violet)]"],
  ["bg-ph-info", "text-[var(--ph-on-info)]"],
  ["bg-ph-success", "text-[var(--ph-on-success)]"],
  ["bg-ph-danger", "text-[var(--ph-on-danger)]"],
];

function avatarColorClass(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [bg, ink] = AVATAR_TOKENS[Math.abs(hash) % AVATAR_TOKENS.length];
  return `${bg} ${ink}`;
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
      className={cn(
        "[&_.ph-dropdown-trigger]:rounded-full",
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
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ph-mutedtext transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ph-focus-ring"
        onClick={onSignOut}
      >
        <LogOut className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

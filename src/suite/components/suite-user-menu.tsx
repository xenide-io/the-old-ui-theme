'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, Settings } from 'iconoir-react';

import { cn } from '../lib/cn';
import { DropdownMenu, DropdownItem } from '../../components/ui/DropdownMenu';

export interface SuiteUserMenuProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  /** Destination for the "Profile settings" item. */
  settingsHref: string;
  onSignOut: () => void;
  /** Fallback letter(s) when there is no avatar image. */
  fallbackInitials?: string;
  dataTest?: string;
  className?: string;
}

function computeInitials(name: string | null | undefined, email: string | null | undefined): string {
  const source = (name || email || '?').trim();
  return source
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Suite account context menu — one tap on the avatar opens a small menu
 * with profile settings and sign out. Used in the mobile app bar of every
 * app so account actions behave identically across the suite (no dedicated
 * logout icon cluttering the mobile chrome).
 */
export function SuiteUserMenu({
  name,
  email,
  image,
  settingsHref,
  onSignOut,
  fallbackInitials,
  dataTest = 'suite-user-menu',
  className,
}: SuiteUserMenuProps) {
  const router = useRouter();
  const initials = fallbackInitials ?? computeInitials(name, email);

  const avatar = (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ph-muted">
      {image ? (
        <Image
          src={image}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
          unoptimized
        />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ph-muted text-sm font-semibold text-ph-brand">
          {initials}
        </span>
      )}
    </span>
  );

  return (
    <DropdownMenu
      trigger={avatar}
      aria-label="Account menu"
      align="end"
      side="bottom"
      sideOffset={6}
      collisionPadding={16}
      modal={false}
      className={className}
      data-test={dataTest}
    >
      <div className="px-2 py-1.5">
        <p className="truncate text-sm font-medium text-ph-ink">
          {name || email || 'Account'}
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
      <DropdownItem
        data-test={`${dataTest}-sign-out`}
        onClick={onSignOut}
      >
        <LogOut className="h-4 w-4 text-ph-mutedtext" aria-hidden />
        Sign out
      </DropdownItem>
    </DropdownMenu>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { LogOut, Settings } from 'iconoir-react';

import { cn } from '../lib/cn';

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
  const [open, setOpen] = useState(false);
  const initials = fallbackInitials ?? computeInitials(name, email);

  return (
    <div className={cn('relative', className)} data-test={dataTest}>
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        title="Account"
        onClick={() => setOpen((value) => !value)}
        className="suite-press inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand"
      >
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
      </button>
      {open ? (
        <>
          <button
            type="button"
            aria-label="Close account menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-ph-border bg-ph-surface p-1 shadow-xl"
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
            <Link
              role="menuitem"
              href={settingsHref}
              data-test={`${dataTest}-settings`}
              className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm text-ph-ink transition-colors hover:bg-ph-muted"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-4 w-4 text-ph-mutedtext" aria-hidden />
              Profile settings
            </Link>
            <button
              role="menuitem"
              type="button"
              data-test={`${dataTest}-sign-out`}
              className="flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-left text-sm text-ph-ink transition-colors hover:bg-ph-muted"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
            >
              <LogOut className="h-4 w-4 text-ph-mutedtext" aria-hidden />
              Sign out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

'use client';

import { type ReactNode } from 'react';

import { AppLayout } from '@/components/ui';
import { cn } from '../lib/cn';

export interface SuiteAppLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  mobileHeader?: ReactNode;
  bottomNav?: ReactNode;
  sidebarWidth?: number;
  className?: string;
}

/**
 * Responsive ShellStack app shell. On desktop it mirrors the theme `AppLayout`
 * (fixed-width sidebar + scrollable content). On mobile/tablet the same sidebar
 * is hidden and optional `mobileHeader` / `bottomNav` slots render the standard
 * suite chrome. This is the single layout primitive every app should use.
 */
export function SuiteAppLayout({
  sidebar,
  children,
  mobileHeader,
  bottomNav,
  sidebarWidth = 240,
  className,
}: SuiteAppLayoutProps) {
  return (
    <div className={cn('min-h-screen', className)}>
      <div className="hidden lg:block">
        <AppLayout sidebar={sidebar} sidebarWidth={sidebarWidth}>
          {children}
        </AppLayout>
      </div>

      <div className="flex min-h-screen flex-col lg:hidden">
        {mobileHeader ? <div className="shrink-0">{mobileHeader}</div> : null}
        <main className="min-w-0 flex-1 overflow-y-auto bg-ph-canvas">{children}</main>
        {bottomNav ? <div className="shrink-0">{bottomNav}</div> : null}
      </div>
    </div>
  );
}

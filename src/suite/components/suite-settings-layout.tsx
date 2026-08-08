"use client";

import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { SuitePage, SuitePageHeader } from "./suite-layout";

export interface SuiteSettingsLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  mobileNav?: ReactNode;
  loading?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  dataTest?: string;
  headerDataTest?: string;
  className?: string;
  contentClassName?: string;
}

/**
 * Canonical settings geometry for every suite app.
 * Apps own nav data and content; the suite owns spacing, scrolling and breakpoints.
 */
export function SuiteSettingsLayout({
  children,
  sidebar,
  mobileNav,
  loading,
  title = "Settings",
  description,
  header,
  dataTest = "settings-page",
  headerDataTest = "settings-page-header",
  className,
  contentClassName,
}: SuiteSettingsLayoutProps) {
  return (
    <SuitePage
      dataTest={dataTest}
      className={cn("flex h-full flex-col overflow-hidden", className)}
    >
      {header ?? (
        <SuitePageHeader
          sticky
          dataTest={headerDataTest}
          title={title}
          description={description}
        />
      )}

      {loading ?? (
        <div className="suite-page-body mt-6 flex min-h-0 flex-1 flex-col">
          {mobileNav ? (
            <div className="sticky top-0 z-20 mb-2 shrink-0 bg-ph-canvas/95 backdrop-blur lg:hidden">
              {mobileNav}
            </div>
          ) : null}

          <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row lg:gap-8">
            <aside
              aria-label="Settings"
              className="hidden w-56 shrink-0 bg-transparent lg:block lg:self-stretch lg:overflow-y-auto lg:overscroll-contain"
            >
              {sidebar}
            </aside>

            <div
              className={cn(
                "min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain pb-6",
                contentClassName,
              )}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </SuitePage>
  );
}

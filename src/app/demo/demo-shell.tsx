"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { Button, ThemeSwitcher } from "@/components/ui";
import { IconAreaChart } from "@/components/icons";
import {
  SuiteAppLayout,
  SuiteBottomNav,
  SuiteMobileHeader,
  SuiteSidebar,
  type SuiteSidebarNavItem,
  useSidebarWidth,
} from "@/suite";
import {
  Bell,
  Flash,
  Home,
  NavArrowDown,
  Settings,
  TriangleFlag,
  LogOut,
} from "iconoir-react";

const primaryRoutes: SuiteSidebarNavItem[] = [
  { label: "Overview", href: "/demo", icon: Home },
  { label: "Components", href: "/demo/components", icon: Flash },
  { label: "Patterns", href: "/demo/patterns", icon: Settings },
  { label: "Charts", href: "/demo/charts", icon: IconAreaChart },
  { label: "Suite", href: "/demo/suite", icon: TriangleFlag },
];

const secondaryGroups = [
  {
    label: "Demo pages",
    items: [
      {
        label: "Foundations & themes",
        href: "/demo/foundations",
      },
      { label: "Components", href: "/demo/components" },
      { label: "Patterns", href: "/demo/patterns" },
      { label: "Charts & data", href: "/demo/charts" },
      { label: "Suite chrome", href: "/demo/suite" },
    ],
  },
];

function isActiveRoute(pathname: string, href: string) {
  return href === "/demo" ? pathname === href : pathname.startsWith(href);
}

function DemoRouteLinks({ pathname }: { pathname: string }) {
  return (
    <div className="mt-4 space-y-4 border-t border-ph-border pt-4">
      {secondaryGroups.map((group) => (
        <section key={group.label}>
          <h2 className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ph-mutedtext">
            {group.label}
          </h2>
          <nav aria-label={group.label} className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-9 items-center rounded-[var(--ph-radius-app)] px-2.5 py-2 text-sm transition-colors ${
                    active
                      ? "bg-ph-muted font-medium text-ph-ink shadow-[inset_2px_0_0_var(--ph-accent)]"
                      : "text-ph-subtle hover:bg-ph-muted hover:text-ph-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </section>
      ))}
    </div>
  );
}

export default function DemoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/demo";
  const { width, collapsed, startResize, resizeBy, resetWidth } =
    useSidebarWidth("the-old-ui-demo-sidebar-width", 240);
  const activePrimaryRoutes = useMemo(
    () =>
      primaryRoutes.map((item) => ({
        ...item,
        active: isActiveRoute(pathname, item.href),
      })),
    [pathname],
  );

  return (
    <SuiteAppLayout
      sidebarWidth={width}
      collapsed={collapsed}
      onStartResize={startResize}
      onResizeBy={resizeBy}
      onResetWidth={resetWidth}
      sidebar={
        <SuiteSidebar
          surface
          collapsed={collapsed}
          appSwitcher={(isCollapsed) => (
            <Link
              href="/demo"
              className={
                isCollapsed ? "flex justify-center" : "flex items-center gap-2"
              }
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ph-brand text-xs font-bold text-[var(--ph-on-accent)] shadow-sm">
                T
              </span>
              {!isCollapsed ? (
                <span className="truncate text-sm font-bold text-ph-ink">
                  The Old UI
                </span>
              ) : null}
            </Link>
          )}
          contextSwitcher={(isCollapsed) =>
            isCollapsed ? (
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-ph-muted text-xs font-bold text-ph-brand">
                UI
              </span>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                sideIcon={<NavArrowDown className="h-4 w-4" aria-hidden />}
                className="w-full justify-between text-left"
              >
                Component library
              </Button>
            )
          }
          navItems={activePrimaryRoutes}
          secondaryNav={<DemoRouteLinks pathname={pathname} />}
          notificationBell={
            <Button
              variant="ghost"
              shape="circle"
              size="sm"
              icon={<Bell className="h-4 w-4" aria-hidden />}
              aria-label="View notifications"
            />
          }
          userMenu={(isCollapsed) => (
            <div
              className={
                isCollapsed
                  ? "flex justify-center"
                  : "flex min-w-0 items-center gap-2"
              }
            >
              <button
                type="button"
                aria-label="Account menu"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ph-muted text-sm font-bold text-ph-brand ring-2 ring-ph-border ring-offset-1 ring-offset-ph-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ph-focus-ring"
              >
                T
              </button>
              {!isCollapsed ? (
                <span className="min-w-0 truncate text-xs font-medium text-ph-subtle">
                  the-old-ui v0.5
                </span>
              ) : null}
            </div>
          )}
          footerExtras={
            <button
              type="button"
              data-test="sidebar-sign-out"
              title="Sign out"
              aria-label="Sign out"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ph-mutedtext transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ph-focus-ring"
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </button>
          }
        />
      }
      mobileHeader={
        <SuiteMobileHeader
          title={
            <Link href="/demo" className="flex min-w-0 items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ph-brand text-xs font-bold text-[var(--ph-on-accent)]">
                T
              </span>
              <span className="truncate text-sm font-bold text-ph-ink">
                The Old UI Demos
              </span>
            </Link>
          }
          actions={<ThemeSwitcher />}
        />
      }
      bottomNav={
        <SuiteBottomNav
          items={activePrimaryRoutes.slice(0, 5).map((item) => ({
            ...item,
            label: item.label === "Components" ? "Build" : item.label,
          }))}
        />
      }
    >
      {children}
    </SuiteAppLayout>
  );
}

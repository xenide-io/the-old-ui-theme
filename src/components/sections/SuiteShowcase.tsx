"use client";

import { useState, type ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import {
  NavArrowDown as ChevronDown,
  Home,
  Calendar,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  Xmark,
  Plus,
} from "iconoir-react";

import {
  Button,
  DropdownMenu,
  DropdownItem,
  CommandPalette,
  ShowcaseWrapper,
  Spinner,
} from "@/components/ui";
import {
  AppSwitcher,
  AppSwitcherMark,
  AppSwitcherChevron,
  type SuiteAppEntry,
} from "@/suite/components/app-switcher";
import { CommandPaletteHost } from "@/suite/components/command-palette-host";
import type { SuiteCommandItem } from "@/suite/lib/injected";
import { SuiteMobileHeader } from "@/suite/components/suite-mobile-header";
import {
  SuiteBottomNav,
  type SuiteBottomNavItem,
} from "@/suite/components/suite-bottom-nav";
import { SuiteUserMenu } from "@/suite/components/suite-user-menu";
import {
  SuiteNotificationBell,
  type SuiteNotification,
  type SuiteNotificationsResponse,
} from "@/suite/components/suite-notification-bell";
import { SuiteMobileDrawer } from "@/suite/components/suite-mobile-drawer";
import { SuiteSettingsMobileNav } from "@/suite/components/suite-settings-mobile-nav";
import {
  SuiteSkeleton,
  SuiteSkeletonCard,
  SuiteSkeletonList,
} from "@/suite/components/suite-skeleton";
import {
  SuitePage,
  SuitePageHeader,
  SuiteToolbar,
  SuiteTabList,
  SuiteSectionHeader,
} from "@/suite/components/suite-layout";
import { TodayPageFrame } from "@/suite/components/today-page-frame";
import { TodayCalibrating } from "@/suite/components/today-calibrating";
import {
  SuiteSidebar,
  type SuiteSidebarNavItem,
} from "@/suite/components/suite-sidebar";
import { SuiteAppLayout } from "@/suite/components/suite-app-layout";
import {
  SuiteIcon,
  SUITE_ICON_NAMES,
  APP_ACCENTS,
  type SuiteAccentSlug,
} from "@/suite/icons";

const REAL_APPS = [
  "kraken",
  "shellstack",
  "tides",
  "turtletime",
  "nakama",
] as const;
type RealAppSlug = (typeof REAL_APPS)[number];

const APP_ICON_SRC: Record<RealAppSlug, string> = {
  turtletime: "/turtletime-icon.svg",
  tides: "/tides-icon.svg",
  kraken: "/kraken-icon.svg",
  shellstack: "/shellstack-icon.svg",
  nakama: "/nakama-icon.svg",
};

const ICON_SIZE = 44;

const SUITE_APPS: SuiteAppEntry[] = REAL_APPS.map((app) => ({
  slug: app,
  name: APP_ACCENTS[app].label,
  description: `${APP_ACCENTS[app].label} app`,
  icon: APP_ICON_SRC[app],
}));

const BOTTOM_NAV_ITEMS: SuiteBottomNavItem[] = [
  { href: "#suite-today", label: "Today", icon: Home, active: true },
  { href: "#suite-track", label: "Track", icon: Calendar },
  { href: "#suite-reports", label: "Reports", icon: Search },
];

const SETTINGS_ITEMS = [
  { href: "#profile", label: "Profile", icon: User },
  { href: "#account", label: "Account", icon: Settings },
  { href: "#notifications", label: "Notifications", icon: Bell },
];

const SIDEBAR_NAV_ITEMS: SuiteSidebarNavItem[] = [
  { href: "#suite-today", label: "Today", icon: Home, active: true },
  { href: "#suite-track", label: "Tracker", icon: Calendar },
  { href: "#suite-reports", label: "Reports", icon: Search },
  { href: "#suite-settings", label: "Settings", icon: Settings },
];

const NOTIFICATIONS: SuiteNotification[] = [
  {
    id: "1",
    title: "New document shared",
    body: "Alex shared the Q3 roadmap with you.",
    href: "#",
    kind: "document",
    source_app: "kraken",
    read_at: null,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    workspace: "ShellStack",
    organisation: "Xenide",
  },
  {
    id: "2",
    title: "Task assigned",
    body: "Review TurtleTime weekly report.",
    href: "#",
    kind: "task",
    source_app: "tides",
    read_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    workspace: "ShellStack",
    organisation: "Xenide",
  },
];

const PALETTE_ITEMS: SuiteCommandItem[] = [
  {
    id: "today",
    label: "Go to Today",
    icon: <Home className="h-4 w-4" />,
    onSelect: () => {},
  },
  {
    id: "search",
    label: "Search",
    icon: <Search className="h-4 w-4" />,
    onSelect: () => {},
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
    onSelect: () => {},
  },
];

function DemoAppIcon({ app }: { app: RealAppSlug }) {
  return (
    <div className="relative h-8 w-8 overflow-hidden rounded-lg">
      <Image
        src={APP_ICON_SRC[app]}
        alt={APP_ACCENTS[app].label}
        width={32}
        height={32}
        className="h-full w-full"
        unoptimized
      />
    </div>
  );
}

function InjectedDropdownItem(props: ComponentPropsWithoutRef<"button">) {
  return <DropdownItem {...props} />;
}

export default function SuiteShowcase() {
  const [currentApp, setCurrentApp] = useState<string>("turtletime");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsHref, setSettingsHref] = useState("#profile");
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <ShowcaseWrapper
      id="suite"
      title="Suite"
      description="The shared ShellStack chrome — app switcher, mobile header, bottom nav, account menu, notification bell, command palette, drawer, settings nav, skeletons, page layout, and icon system."
      code={`import {
  AppSwitcher, SuiteMobileHeader, SuiteBottomNav,
  SuiteUserMenu, SuiteNotificationBell, CommandPaletteHost,
  SuiteMobileDrawer, SuiteSettingsMobileNav,
  SuiteSkeleton, SuitePage, SuitePageHeader,
} from "@xenide-io/the-old-ui-theme/suite";`}
      filename="SuiteExample.tsx"
    >
      <div className="space-y-8">
        {/* App icons */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Actual app icons
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              The real favicons shipped by each app — not generated suite
              glyphs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 rounded-lg border border-ph-border-subtle bg-ph-raised p-6">
            {REAL_APPS.map((app) => (
              <div key={app} className="flex flex-col items-center gap-2">
                <div className="relative h-11 w-11 overflow-hidden rounded-xl">
                  <Image
                    src={APP_ICON_SRC[app]}
                    alt={APP_ACCENTS[app].label}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    className="h-full w-full"
                    unoptimized
                  />
                </div>
                <span className="text-xs font-medium text-ph-subtle">
                  {APP_ACCENTS[app].label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* App switcher */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              App switcher
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              Dropdown app launcher with app mark, title, and collapsible rail
              mode.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-6 rounded-lg border border-ph-border-subtle bg-ph-raised p-6">
            <div className="w-64">
              <AppSwitcher
                apps={SUITE_APPS}
                currentApp={currentApp}
                onSelect={(entry) => setCurrentApp(entry.slug)}
                mark={<DemoAppIcon app={currentApp as RealAppSlug} />}
                title={
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold text-ph-ink">
                      {APP_ACCENTS[currentApp as RealAppSlug].label}
                    </span>
                    <span className="truncate text-xs text-ph-mutedtext">
                      ShellStack workspace
                    </span>
                  </span>
                }
                dropdownMenu={DropdownMenu}
                dropdownItem={InjectedDropdownItem}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-ph-mutedtext">Collapsed rail</span>
              <AppSwitcher
                apps={SUITE_APPS}
                currentApp={currentApp}
                onSelect={(entry) => setCurrentApp(entry.slug)}
                mark={<DemoAppIcon app={currentApp as RealAppSlug} />}
                title={null}
                collapsed
                dropdownMenu={DropdownMenu}
                dropdownItem={InjectedDropdownItem}
              />
            </div>
          </div>
        </section>

        {/* Sidebar + app layout */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Standardised app shell
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              SuiteSidebar + SuiteAppLayout — the same sidebar and responsive
              shell every app should use. TurtleTime-style: primary nav +
              account footer.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-ph-border-subtle bg-ph-raised h-[420px]">
            <div className="hidden lg:block h-full">
              <SuiteAppLayout
                sidebarWidth={220}
                sidebar={
                  <SuiteSidebar
                    appSwitcher={
                      <AppSwitcher
                        apps={SUITE_APPS}
                        currentApp={currentApp}
                        onSelect={(entry) => setCurrentApp(entry.slug)}
                        mark={<DemoAppIcon app={currentApp as RealAppSlug} />}
                        title={
                          <span className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-semibold text-ph-ink">
                              {APP_ACCENTS[currentApp as RealAppSlug].label}
                            </span>
                            <span className="truncate text-xs text-ph-mutedtext">
                              ShellStack workspace
                            </span>
                          </span>
                        }
                        dropdownMenu={DropdownMenu}
                        dropdownItem={InjectedDropdownItem}
                      />
                    }
                    contextSwitcher={
                      <div className="flex items-center gap-2 rounded-lg border border-ph-border bg-ph-surface px-2 py-1.5 text-sm text-ph-ink">
                        <span className="h-5 w-5 rounded bg-ph-brand text-[10px] font-bold text-[var(--ph-on-accent)] flex items-center justify-center">
                          S
                        </span>
                        ShellStack
                      </div>
                    }
                    navItems={SIDEBAR_NAV_ITEMS}
                    notificationBell={
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Bell className="h-4 w-4" />}
                        aria-label="Notifications"
                      />
                    }
                    userMenu={
                      <SuiteUserMenu
                        name="Jane Doe"
                        email="jane@xenide.io"
                        settingsHref="#settings"
                        onSignOut={() => {}}
                        showSignOutAction
                      />
                    }
                  />
                }
              >
                <div className="p-6 text-sm text-ph-subtle">
                  Main content area. On desktop the sidebar is fixed; on mobile
                  it collapses to the suite mobile chrome.
                </div>
              </SuiteAppLayout>
            </div>
            <div className="flex flex-col lg:hidden h-full">
              <SuiteMobileHeader
                onMenuClick={() => setDrawerOpen((v) => !v)}
                title={
                  <div className="flex items-center gap-2">
                    <DemoAppIcon app={currentApp as RealAppSlug} />
                    <span className="font-semibold text-ph-ink">
                      {APP_ACCENTS[currentApp as RealAppSlug].label}
                    </span>
                  </div>
                }
                actions={
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Bell className="h-4 w-4" />}
                      aria-label="Notifications"
                    />
                    <div className="h-8 w-8 rounded-full bg-ph-brand text-xs font-bold text-[var(--ph-on-accent)] flex items-center justify-center">
                      JD
                    </div>
                  </>
                }
              />
              <main className="flex-1 p-4 text-sm text-ph-subtle">
                Mobile content area.
              </main>
              <SuiteBottomNav items={BOTTOM_NAV_ITEMS} />
            </div>
          </div>
        </section>

        {/* Sidebar with secondary nav / project tree */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Sidebar with project tree
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              Tides / Kraken pattern: primary nav above, secondary
              project/document tree below, and a mobile browse button that opens
              the same tree in a drawer.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-ph-border-subtle bg-ph-raised h-[420px]">
            <div className="hidden lg:block h-full">
              <SuiteAppLayout
                sidebarWidth={240}
                sidebar={
                  <SuiteSidebar
                    appSwitcher={
                      <AppSwitcher
                        apps={SUITE_APPS}
                        currentApp={currentApp}
                        onSelect={(entry) => setCurrentApp(entry.slug)}
                        mark={<DemoAppIcon app={currentApp as RealAppSlug} />}
                        title={
                          <span className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-semibold text-ph-ink">
                              {APP_ACCENTS[currentApp as RealAppSlug].label}
                            </span>
                            <span className="truncate text-xs text-ph-mutedtext">
                              ShellStack workspace
                            </span>
                          </span>
                        }
                        dropdownMenu={DropdownMenu}
                        dropdownItem={InjectedDropdownItem}
                      />
                    }
                    contextSwitcher={
                      <div className="flex items-center gap-2 rounded-lg border border-ph-border bg-ph-surface px-2 py-1.5 text-sm text-ph-ink">
                        <span className="h-5 w-5 rounded bg-ph-brand text-[10px] font-bold text-[var(--ph-on-accent)] flex items-center justify-center">
                          W
                        </span>
                        Workspace
                      </div>
                    }
                    navItems={SIDEBAR_NAV_ITEMS}
                    secondaryNav={
                      <div className="space-y-1">
                        <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ph-mutedtext">
                          Projects
                        </p>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ph-subtle hover:bg-ph-muted"
                        >
                          <span className="h-2 w-2 rounded-full bg-ph-brand" />
                          Acme Corp
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ph-subtle hover:bg-ph-muted"
                        >
                          <span className="h-2 w-2 rounded-full bg-ph-accent" />
                          Globex
                        </button>
                      </div>
                    }
                    notificationBell={
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Bell className="h-4 w-4" />}
                        aria-label="Notifications"
                      />
                    }
                    userMenu={
                      <SuiteUserMenu
                        name="Jane Doe"
                        email="jane@xenide.io"
                        settingsHref="#settings"
                        onSignOut={() => {}}
                        showSignOutAction
                      />
                    }
                  />
                }
              >
                <div className="p-6 text-sm text-ph-subtle">
                  Desktop content area. The project tree lives inside the
                  sidebar via the{" "}
                  <code className="rounded bg-ph-muted px-1 py-0.5 text-xs">
                    secondaryNav
                  </code>{" "}
                  prop.
                </div>
              </SuiteAppLayout>
            </div>
            <div className="flex flex-col lg:hidden h-full">
              <SuiteMobileHeader
                title={
                  <div className="flex items-center gap-2">
                    <DemoAppIcon app={currentApp as RealAppSlug} />
                    <span className="font-semibold text-ph-ink">
                      {APP_ACCENTS[currentApp as RealAppSlug].label}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDrawerOpen(true)}
                      icon={<Search className="h-4 w-4" />}
                      aria-label="Browse projects"
                    />
                  </div>
                }
                actions={
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Bell className="h-4 w-4" />}
                      aria-label="Notifications"
                    />
                    <div className="h-8 w-8 rounded-full bg-ph-brand text-xs font-bold text-[var(--ph-on-accent)] flex items-center justify-center">
                      JD
                    </div>
                  </>
                }
              />
              <main className="flex-1 p-4 text-sm text-ph-subtle">
                Mobile content area. Tap the search icon in the header to open
                the project tree drawer.
              </main>
              <SuiteBottomNav items={BOTTOM_NAV_ITEMS} />
              <SuiteMobileDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                showCloseButton
                dialogLabel="Browse projects"
                side="right"
              >
                <div className="p-4 space-y-1">
                  <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ph-mutedtext">
                    Projects
                  </p>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ph-subtle hover:bg-ph-muted"
                  >
                    <span className="h-2 w-2 rounded-full bg-ph-brand" />
                    Acme Corp
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ph-subtle hover:bg-ph-muted"
                  >
                    <span className="h-2 w-2 rounded-full bg-ph-accent" />
                    Globex
                  </button>
                </div>
              </SuiteMobileDrawer>
            </div>
          </div>
        </section>

        {/* Mobile header + bottom nav */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Mobile chrome
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              SuiteMobileHeader and SuiteBottomNav — the standard mobile shell
              used by every app.
            </p>
          </div>
          <div className="space-y-4 rounded-lg border border-ph-border-subtle bg-ph-raised p-4">
            <SuiteMobileHeader
              onMenuClick={() => setDrawerOpen((v) => !v)}
              title={
                <div className="flex items-center gap-2">
                  <DemoAppIcon app="turtletime" />
                  <span className="font-semibold text-ph-ink">TurtleTime</span>
                </div>
              }
              actions={
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Bell className="h-4 w-4" />}
                    aria-label="Notifications"
                  />
                  <div className="h-8 w-8 rounded-full bg-ph-brand text-xs font-bold text-[var(--ph-on-accent)] flex items-center justify-center">
                    JD
                  </div>
                </>
              }
            />
            <div className="rounded-lg border border-ph-border bg-ph-surface p-4 text-sm text-ph-subtle">
              Page content area
            </div>
            <SuiteBottomNav items={BOTTOM_NAV_ITEMS} />
          </div>
        </section>

        {/* User menu + notification bell */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Account & notifications
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              SuiteUserMenu and SuiteNotificationBell with mock data.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-6 rounded-lg border border-ph-border-subtle bg-ph-raised p-6">
            <SuiteUserMenu
              name="Jane Doe"
              email="jane@xenide.io"
              settingsHref="#settings"
              onSignOut={() => {}}
            />
            <SuiteNotificationBell
              fetchNotifications={async () => ({
                notifications: NOTIFICATIONS,
                unread_count: 1,
              })}
              markRead={async () => {}}
              markAllRead={async () => {}}
              dropdownMenu={DropdownMenu}
            />
          </div>
        </section>

        {/* Command palette */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Command palette
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              Cmd/Ctrl+K host wired to the theme CommandPalette. Press the
              button below to open.
            </p>
          </div>
          <div className="rounded-lg border border-ph-border-subtle bg-ph-raised p-6">
            <CommandPaletteHost
              items={PALETTE_ITEMS}
              commandPalette={CommandPalette}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPaletteOpen(true)}
              className="mt-4"
            >
              Open command palette
            </Button>
            <CommandPalette
              items={PALETTE_ITEMS}
              isOpen={paletteOpen}
              onClose={() => setPaletteOpen(false)}
            />
          </div>
        </section>

        {/* Mobile drawer */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Mobile drawer
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              Slide-in panel with backdrop, Escape close, and body scroll-lock.
            </p>
          </div>
          <div className="rounded-lg border border-ph-border-subtle bg-ph-raised p-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDrawerOpen(true)}
            >
              Open drawer
            </Button>
            <SuiteMobileDrawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              showCloseButton
              dialogLabel="Demo navigation"
            >
              <div className="p-4 space-y-2">
                <a
                  href="#suite"
                  className="block rounded-lg px-3 py-2 text-sm text-ph-ink hover:bg-ph-muted"
                >
                  Today
                </a>
                <a
                  href="#suite"
                  className="block rounded-lg px-3 py-2 text-sm text-ph-ink hover:bg-ph-muted"
                >
                  Track time
                </a>
                <a
                  href="#suite"
                  className="block rounded-lg px-3 py-2 text-sm text-ph-ink hover:bg-ph-muted"
                >
                  Reports
                </a>
              </div>
            </SuiteMobileDrawer>
          </div>
        </section>

        {/* Settings mobile nav */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Settings mobile nav
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              Horizontal scrollable icon+label pills for mobile settings.
            </p>
          </div>
          <div className="rounded-lg border border-ph-border-subtle bg-ph-raised p-4">
            <SuiteSettingsMobileNav
              items={SETTINGS_ITEMS.map((item) => ({
                ...item,
                icon: item.icon,
              }))}
              activeHref={settingsHref}
              onSelect={(href) => setSettingsHref(href)}
            />
          </div>
        </section>

        {/* Skeletons */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Skeletons
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              Shared loading placeholders using the theme shimmer.
            </p>
          </div>
          <div className="grid gap-4 rounded-lg border border-ph-border-subtle bg-ph-raised p-6 sm:grid-cols-2 lg:grid-cols-3">
            <SuiteSkeleton lines={3} />
            <SuiteSkeletonCard rows={3} />
            <SuiteSkeletonList items={3} />
          </div>
        </section>

        {/* Page layout primitives */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Page layout primitives
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              SuitePage, SuitePageHeader, SuiteToolbar, SuiteTabList, and
              SuiteSectionHeader.
            </p>
          </div>
          <div className="rounded-lg border border-ph-border-subtle bg-ph-raised p-6">
            <SuitePage
              width="content"
              inset
              className="rounded-xl border border-ph-border bg-ph-surface shadow-sm"
            >
              <SuitePageHeader
                eyebrow="Workspace"
                title="Projects"
                description="Manage client work across the suite."
                actions={
                  <SuiteToolbar>
                    <Button variant="secondary" size="sm">
                      Filter
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Plus className="h-3.5 w-3.5" />}
                    >
                      New
                    </Button>
                  </SuiteToolbar>
                }
              />
              <SuiteTabList label="Project views" className="mt-6">
                <Button variant="ghost" size="sm">
                  Board
                </Button>
                <Button variant="ghost" size="sm">
                  List
                </Button>
                <Button variant="ghost" size="sm">
                  Calendar
                </Button>
              </SuiteTabList>
              <SuiteSectionHeader
                title="Active projects"
                description="3 projects with work this week"
                action={
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                }
                className="mt-6"
              />
            </SuitePage>
          </div>
        </section>

        {/* Today frame */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Today page chrome
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              TodayPageFrame and TodayCalibrating loading state.
            </p>
          </div>
          <div className="grid gap-4 rounded-lg border border-ph-border-subtle bg-ph-raised p-6 sm:grid-cols-2">
            <div className="h-48 overflow-hidden rounded-xl">
              <TodayPageFrame>
                <div className="p-6 text-sm text-ph-ink">
                  Today page content goes here.
                </div>
              </TodayPageFrame>
            </div>
            <div className="flex h-48 items-center justify-center rounded-xl border border-ph-border bg-ph-surface">
              <TodayCalibrating spinner={Spinner} />
            </div>
          </div>
        </section>

        {/* Suite glyphs */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Suite glyphs
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              24×24 strokes that inherit currentColor and accept a per-app
              accent tint.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {SUITE_ICON_NAMES.map((name) => (
              <div
                key={name}
                className="flex min-w-0 flex-col items-center gap-2 rounded-lg border border-ph-border-subtle bg-ph-raised p-3 text-center"
              >
                <div className="flex h-8 items-center text-ph-ink">
                  <SuiteIcon name={name} size={24} />
                </div>
                <span className="max-w-full break-words text-[10px] font-medium tracking-wide text-ph-mutedtext">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Accent tints */}
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">
              Accent tints
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              The same glyph with each app accent applied via CSS custom
              property.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 rounded-lg border border-ph-border-subtle bg-ph-raised p-6">
            {REAL_APPS.map((app) => (
              <div key={app} className="flex flex-col items-center gap-2">
                <SuiteIcon name="today-sun" accent={app} size={32} />
                <span className="text-xs font-medium text-ph-subtle">
                  {APP_ACCENTS[app].label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ShowcaseWrapper>
  );
}

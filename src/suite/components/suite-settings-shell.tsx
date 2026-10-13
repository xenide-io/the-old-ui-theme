"use client";

import {
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ComponentType,
  type ReactNode,
} from "react";

import { SettingsNav } from "../../components/ui/SettingsLayout";
import { SuiteSettingsLayout } from "./suite-settings-layout";
import { SuiteSettingsMobileNav } from "./suite-settings-mobile-nav";

export type SuiteSettingsSection = "account" | "organisation" | "developers";

export interface SuiteSettingsTabDef {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  section: SuiteSettingsSection;
  testId?: string;
  content: ReactNode;
}

const SECTION_LABELS: Record<SuiteSettingsSection, string> = {
  account: "Account",
  organisation: "Organisation",
  developers: "Developers",
};

const SECTION_ORDER: SuiteSettingsSection[] = ["account", "organisation", "developers"];

function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

const readHash = () => window.location.hash.replace("#", "");
const readHashServer = () => "";

export interface SuiteSettingsShellProps {
  tabs: SuiteSettingsTabDef[];
  defaultTab?: string;
  description?: string;
  dataTest?: string;
  mobileNavTestId?: string;
}

/**
 * Hash-routed settings page shared by every suite app: the same three nav groups,
 * mobile nav and geometry. Apps only supply their tab list.
 */
export function SuiteSettingsShell({
  tabs,
  defaultTab,
  description = "Manage your profile, workspace, app access and integrations.",
  dataTest = "settings-page",
  mobileNavTestId = "settings-nav-mobile",
}: SuiteSettingsShellProps) {
  const tabIds = tabs.map((tab) => tab.id).join("|");
  const known = useMemo(() => new Set(tabIds.split("|")), [tabIds]);
  const hashTab = useSyncExternalStore(subscribeHash, readHash, readHashServer);
  const fallback = defaultTab ?? tabs[0]?.id ?? "";
  const activeTab = known.has(hashTab) ? hashTab : fallback;

  // Deep links arrive as ?tab=x; normalise them onto the hash.
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("tab");
    if (!query || !known.has(query)) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("tab");
    window.history.replaceState({}, "", url.toString());
    window.location.hash = query;
  }, [known]);

  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  const navGroups = SECTION_ORDER.filter((section) =>
    tabs.some((tab) => tab.section === section),
  ).map((section) => ({
    label: SECTION_LABELS[section],
    items: tabs
      .filter((tab) => tab.section === section)
      .map((tab) => {
        const Icon = tab.icon;
        return {
          id: tab.id,
          label: tab.label,
          href: `#${tab.id}`,
          active: activeTab === tab.id,
          icon: <Icon className="h-4 w-4" aria-hidden />,
        };
      }),
  }));

  return (
    <SuiteSettingsLayout
      className="min-h-0 flex-1"
      dataTest={dataTest}
      description={description}
      mobileNav={
        <SuiteSettingsMobileNav
          dataTest={mobileNavTestId}
          items={tabs.map((tab) => ({
            label: tab.label,
            href: `#${tab.id}`,
            icon: tab.icon,
            testId: tab.testId,
          }))}
          activeHref={`#${activeTab}`}
          onSelect={(href) => {
            window.location.hash = href.slice(1);
          }}
        />
      }
      sidebar={<SettingsNav id="settings-nav" data-test="settings-nav" groups={navGroups} />}
    >
      <section data-test={`tab-${activeTab}`}>{active?.content}</section>
    </SuiteSettingsLayout>
  );
}

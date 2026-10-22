"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, Info as InfoCircle, Link, Minus, ChevronDown as NavArrowDown, ChevronLeft as NavArrowLeft, PlugZap, Plus, Search, Unplug } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Modal } from "@/components/ui/Modal";
import { Select, Toggle } from "@/components/ui/Input";
import { SuiteSkeletonList } from "./suite-skeleton";
import { BrandSpinner } from "@/components/ui/BrandSpinner";
import type { SuiteSpinnerComponent } from "../lib/injected";
import { SuitePage, SuitePageHeader } from "./suite-layout";

export interface BridgeObject {
  remote: string;
  local: string;
  direction: "both" | "import" | "export" | "action";
  target: string;
}

export interface BridgeChoice {
  key: string;
  label: string;
  target: string;
  source: "local_project" | "remote";
  required: boolean;
}

export interface BridgeProperty {
  path: string;
  label: string;
  group: string;
  note: string;
}

export interface BridgeField {
  remote: string;
  /** Their name lands on this path. A dot means it is nested. */
  path: string;
  /** Human label for the path, so a different remote name stays visible. */
  local: string;
  group: string;
  note: string;
  locked: boolean;
}

export interface BridgePair {
  key: string;
  remote: string;
  local: string;
  create: boolean;
}

export interface BridgeDefinition {
  slug: string;
  label: string;
  provider_id: string;
  kind: "sync" | "import" | "action";
  summary: string;
  targets: string[];
  push_blocked: string;
  ready?: boolean;
  match: { remote: string; local: string } | null;
  pairs: BridgePair[];
  properties?: BridgeProperty[];
  fields: BridgeField[];
  unmapped: string[];
  objects: BridgeObject[];
  choices: BridgeChoice[];
}

export interface BridgeConnection {
  id: string;
  provider: string;
  toolkit_slug: string;
  status: string;
  display_name: string;
  last_error?: string;
}

export interface BridgeBindingRow {
  toolkit_slug: string;
  key: string;
  value: string;
}

export interface BridgeProjectOption {
  id: string;
  name: string;
  clientName?: string;
}

export interface BridgeRecord {
  id: string;
  label: string;
  detail: string;
}

export interface BridgeConflictField {
  label: string;
  value: string;
}

export interface BridgeConflict {
  id: string;
  record_type: string;
  remote_id: string;
  local_id: string;
  direction: string;
  summary: string;
  can_push: boolean;
  local_fields: BridgeConflictField[];
  remote_fields: BridgeConflictField[];
}

const KIND_LABEL: Record<BridgeDefinition["kind"], string> = {
  sync: "Sync",
  import: "Import only",
  action: "On demand",
};

const GROUPS: BridgeDefinition["kind"][] = ["sync", "import", "action"];

const APP_MARK: Record<string, { label: string; icon: string }> = {
  turtletime: { label: "TurtleTime", icon: "/turtletime-icon.svg" },
  tides: { label: "Tides", icon: "/tides-icon.svg" },
  kraken: { label: "Kraken", icon: "/kraken-icon.svg" },
  shellstack: { label: "ShellStack", icon: "/icon-shellstack.svg" },
};

function logoUrl(slug: string) {
  return `https://logos.composio.dev/api/${slug.toLowerCase()}`;
}

function isConnected(connection: BridgeConnection | undefined) {
  return connection?.status === "active";
}

/**
 * Turn a stored connection error into something a user can act on. Toggl's
 * password screen now issues `toggl_sk_` keys for the new Focus API, which the
 * Toggl Track connector (legacy v9) cannot use — call that out explicitly.
 */
function connectionFailureReason(connection: BridgeConnection): string {
  const raw = connection.last_error?.trim() ?? "";
  const slug = connection.toolkit_slug.toUpperCase();
  if (
    slug.includes("TOGGL") &&
    /toggl_sk_|rejected the current-user|rejected this connection/i.test(raw)
  ) {
    return "Toggl Track rejected the API key. Toggl now issues toggl_sk_ keys for its new Focus API, but this connector still uses the older Tracks API and needs a 32-character personal API token from https://track.toggl.com/profile — not the toggl_sk_ key.";
  }
  return raw || "Connection failed. Reconnect the app and try again.";
}

export function BridgeScreen({
  bridges,
  connections,
  bindings,
  projects,
  canManage,
  loading,
  error,
  busy,
  onConnect,
  onDisconnect,
  onSaveChoice,
  initialSlug,
  localClients = [],
  localCategories = [],
  loadSetup,
  onSync,
  loadConflicts,
  onResolveConflict,
  apps = [],
  activeApp = "",
  onAppChange,
  target = "",
  workspaces = [],
  activeWorkspaceId = "",
  onWorkspaceChange,
  workspaceSwitcher,
  spinner: LoadingSpinner = BrandSpinner,
}: {
  spinner?: SuiteSpinnerComponent;
  bridges: BridgeDefinition[];
  connections: BridgeConnection[];
  bindings: BridgeBindingRow[];
  projects: BridgeProjectOption[];
  canManage: boolean;
  loading: boolean;
  error: string | null;
  busy: boolean;
  onConnect: (bridge: BridgeDefinition) => void;
  onDisconnect: (connection: BridgeConnection) => void;
  onSaveChoice: (slug: string, key: string, value: string) => Promise<void>;
  initialSlug?: string | null;
  localClients?: BridgeProjectOption[];
  localCategories?: BridgeProjectOption[];
  loadSetup?: (slug: string) => Promise<{
    clients: BridgeRecord[];
    projects: BridgeRecord[];
    tasks: BridgeRecord[];
  }>;
  onSync?: (
    slug: string,
    mode: string,
    since: string,
    scope: "properties" | "backfill",
    direction: "import" | "export" | "both",
    priority: "turtletime" | "harvest",
  ) => Promise<string>;
  loadConflicts?: (slug: string) => Promise<BridgeConflict[]>;
  onResolveConflict?: (
    slug: string,
    id: string,
    choice: "local" | "remote" | "skip",
  ) => Promise<void>;
  apps?: { id: string; name: string; icon: string }[];
  activeApp?: string;
  onAppChange?: (id: string) => void;
  target?: string;
  workspaces?: { id: string; name: string }[];
  activeWorkspaceId?: string;
  onWorkspaceChange?: (id: string) => void;
  workspaceSwitcher?: ReactNode;
}) {
  function bridgeId(bridge: { slug: string; label: string }) {
    return `${bridge.slug}:${bridge.label}`;
  }
  const appMark = APP_MARK[target] ?? {
    label: "ShellStack",
    icon: "/icon-shellstack.svg",
  };
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    initialSlug ?? null,
  );
  const [narrowDetail, setNarrowDetail] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setup, setSetup] = useState<{
    clients: BridgeRecord[];
    projects: BridgeRecord[];
    tasks: BridgeRecord[];
  } | null>(null);

  const [pendingSync, setPendingSync] = useState<
    "properties" | "backfill" | null
  >(null);
  const [syncing, setSyncing] = useState<"properties" | "backfill" | null>(
    null,
  );
  const [toast, setToast] = useState<string | null>(null);
  const [syncMode, setSyncMode] = useState("week");
  const [syncDirection, setSyncDirection] = useState<
    "import" | "export" | "both"
  >("both");
  const [syncPriority, setSyncPriority] = useState<"turtletime" | "harvest">(
    "turtletime",
  );
  const [syncSince, setSyncSince] = useState("");
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<BridgeConflict[]>([]);
  const [conflictsLoading, setConflictsLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return bridges;
    return bridges.filter((bridge) =>
      bridge.label.toLowerCase().includes(needle),
    );
  }, [bridges, query]);

  const selected =
    filtered.find((bridge) => bridgeId(bridge) === selectedSlug) ??
    filtered.find((bridge) => bridge.slug === selectedSlug) ??
    filtered[0] ??
    null;

  useEffect(() => {
    if (!selectedSlug && filtered[0]) setSelectedSlug(filtered[0].slug);
  }, [filtered, selectedSlug]);

  useEffect(() => {
    if (
      !selected ||
      !loadSetup ||
      !selected.ready ||
      selected.pairs.length === 0
    ) {
      setSetup(null);
      return;
    }
    const linked = connections.some(
      (item) =>
        item.status === "active" &&
        (item.toolkit_slug.toUpperCase() === selected.slug ||
          item.provider === selected.provider_id),
    );
    if (!linked) {
      setSetup(null);
      return;
    }
    let cancelled = false;
    setSetupLoading(true);
    setSetupError(null);
    loadSetup(selected.slug)
      .then((next) => {
        if (!cancelled) setSetup(next);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setSetupError(
            cause instanceof Error
              ? cause.message
              : `Could not load ${selected.label}.`,
          );
        }
      })
      .finally(() => {
        if (!cancelled) setSetupLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [connections, loadSetup, selected]);

  const connection = connections.find(
    (item) =>
      selected &&
      (item.toolkit_slug.toUpperCase() === selected.slug ||
        item.provider === selected.provider_id) &&
      !["inactive", "revoked"].includes(item.status),
  );

  function bindingValue(slug: string, key: string) {
    return (
      bindings.find((row) => row.toolkit_slug === slug && row.key === key)
        ?.value ?? ""
    );
  }

  useEffect(() => {
    if (!selected) return;
    const storedDirection = bindingValue(selected.slug, "sync:direction");
    setSyncMode(bindingValue(selected.slug, "sync:mode") || "week");
    setSyncDirection(
      storedDirection === "import" || storedDirection === "export"
        ? storedDirection
        : "both",
    );
    setSyncPriority(
      bindingValue(selected.slug, "sync:priority") === "harvest"
        ? "harvest"
        : "turtletime",
    );
    setSyncSince(bindingValue(selected.slug, "sync:since"));
  }, [bindings, selected]);

  useEffect(() => {
    if (!selected || !loadConflicts || !isConnected(connection)) {
      setConflicts([]);
      return;
    }
    let cancelled = false;
    setConflictsLoading(true);
    loadConflicts(selected.slug)
      .then((rows) => {
        if (!cancelled) setConflicts(rows);
      })
      .catch(() => {
        if (!cancelled) setConflicts([]);
      })
      .finally(() => {
        if (!cancelled) setConflictsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [connection, loadConflicts, selected]);

  async function changeChoice(slug: string, key: string, value: string) {
    setSaveError(null);
    try {
      await onSaveChoice(slug, key, value);
    } catch (cause) {
      setSaveError(
        cause instanceof Error ? cause.message : "Could not save that choice.",
      );
    }
  }

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function runSync(scope: "properties" | "backfill") {
    if (!onSync || !selected) return;
    setPendingSync(null);
    setSyncMessage(null);
    setSyncing(scope);
    try {
      const message = await onSync(
        selected.slug,
        syncMode,
        syncSince,
        scope,
        syncDirection,
        syncPriority,
      );
      setToast(message);
      window.dispatchEvent(new Event("tt-bridge-synced"));
      if (loadConflicts) {
        const rows = await loadConflicts(selected.slug).catch(() => []);
        setConflicts(rows);
      }
    } catch (cause) {
      setSyncMessage(cause instanceof Error ? cause.message : "Sync failed.");
    } finally {
      setSyncing(null);
    }
  }

  const SYNC_WINDOW_LABEL: Record<string, string> = {
    latest: "the latest window (yesterday and today)",
    week: "this week (from Monday)",
    since: syncSince ? `from ${syncSince}` : "from the start date you chose",
    all: "all history",
  };

  const list = (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-ph-border lg:border-r">
      <div className="shrink-0 border-b border-ph-border p-3">
        <label className="flex h-11 items-center gap-2 rounded-md border border-ph-border bg-ph-surface px-3 focus-within:ring-2 focus-within:ring-ph-brand">
          <span className="sr-only">Search bridges</span>
          <Search className="h-4 w-4 shrink-0 text-ph-subtle" aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="h-11 min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-ph-ink outline-none"
          />
        </label>
      </div>
      <div
        role="listbox"
        aria-label="Compatible apps"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
      >
        {GROUPS.map((kind) => {
          const items = filtered.filter((bridge) => bridge.kind === kind);
          if (items.length === 0) return null;
          return (
            <div key={kind} className="mb-3">
              <p className="px-2 py-1 text-xs font-semibold tracking-wide text-ph-subtle uppercase">
                {KIND_LABEL[kind]}
              </p>
              {items.map((bridge) => {
                const active = selected?.slug === bridge.slug;
                const linked = connections.some(
                  (item) =>
                    item.toolkit_slug.toUpperCase() === bridge.slug &&
                    item.status === "active",
                );
                return (
                  <button
                    key={bridgeId(bridge)}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setSelectedSlug(bridgeId(bridge));
                      setNarrowDetail(true);
                    }}
                    className={`flex min-h-9 w-full items-center gap-2 rounded-[var(--ph-radius-control)] px-2.5 py-2 text-left text-sm focus-visible:ring-2 focus-visible:ring-ph-brand ${
                      active
                        ? "bg-[var(--ph-selected-bg)] text-[var(--ph-selected-text)]"
                        : "text-ph-subtle hover:bg-[var(--ph-surface-hover)] hover:text-ph-ink"
                    }`}
                  >
                    <BridgeMark slug={bridge.slug} label={bridge.label} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {bridge.label}
                      </span>
                      <span className="block truncate text-xs font-normal text-ph-subtle">
                        {linked ? "Connected" : "Not connected"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
        {filtered.length === 0 ? (
          <p className="px-2 py-6 text-sm text-ph-subtle">
            No matching bridges.
          </p>
        ) : null}
      </div>
    </div>
  );

  const detail = selected ? (
    <div className="h-full min-h-0 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8">
      <button
        type="button"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ph-brand lg:hidden"
        onClick={() => setNarrowDetail(false)}
      >
        <NavArrowLeft className="h-4 w-4" aria-hidden />
        All apps
      </button>
      <div className="flex items-start gap-4">
        <BridgeMark slug={selected.slug} label={selected.label} large />
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-ph-ink">
            {selected.label}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-ph-subtle">
            {selected.summary}
          </p>
          <p className="mt-2 text-sm text-ph-ink">
            {isConnected(connection)
              ? `Connected${connection?.display_name ? ` as ${connection.display_name}` : ""}.`
              : connection?.status === "failed" || connection?.last_error
                ? "Connection failed."
                : "Not connected."}
          </p>
          {!isConnected(connection) && connection?.last_error ? (
            <div
              role="alert"
              className="mt-2 max-w-xl rounded-md border border-ph-danger/40 bg-ph-danger/10 px-3 py-2 text-sm text-ph-danger"
            >
              <p className="font-medium">Why it failed</p>
              <p className="mt-0.5">{connectionFailureReason(connection)}</p>
            </div>
          ) : null}
        </div>
      </div>

      <BridgeAlign
        objects={selected.objects}
        providerLabel={selected.label}
        targetLabel={appMark.label}
        target={target}
      />

      {isConnected(connection) ? (
        <BridgeConflictReview
          conflicts={conflicts}
          loading={conflictsLoading}
          resolvingId={resolvingId}
          providerLabel={selected.label}
          appLabel={appMark.label}
          canManage={canManage}
          onResolve={
            onResolveConflict
              ? async (id, choice) => {
                  setResolvingId(id);
                  setSyncMessage(null);
                  try {
                    await onResolveConflict(selected.slug, id, choice);
                    setConflicts((current) =>
                      current.filter((row) => row.id !== id),
                    );
                  } catch (cause) {
                    setSyncMessage(
                      cause instanceof Error
                        ? cause.message
                        : "Could not resolve that conflict.",
                    );
                  } finally {
                    setResolvingId(null);
                  }
                }
              : undefined
          }
        />
      ) : null}

      {isConnected(connection) &&
      selected.ready &&
      selected.pairs.length > 0 ? (
        <RecordPairing
          setup={setup}
          loading={setupLoading}
          error={setupError}
          clients={localClients}
          projects={projects}
          categories={localCategories}
          canManage={canManage}
          busy={busy || syncing !== null}
          syncing={syncing === "properties"}
          valueFor={(key) => bindingValue(selected.slug, key)}
          onChange={(key, value) =>
            void changeChoice(selected.slug, key, value)
          }
          providerLabel={selected.label}
          providerSlug={selected.slug}
          targetLabel={appMark.label}
          targetIcon={appMark.icon}
          pairs={selected.pairs}
          onSync={onSync ? async (scope) => setPendingSync(scope) : undefined}
        />
      ) : null}

      {isConnected(connection) && selected.kind !== "action" ? (
        <BridgeSyncPanel
          providerLabel={selected.label}
          providerSlug={selected.slug}
          appLabel={appMark.label}
          appIcon={appMark.icon}
          kind={selected.kind}
          ready={Boolean(selected.ready)}
          hasHandler={Boolean(onSync)}
          canManage={canManage}
          busy={busy || syncing !== null}
          syncing={syncing === "backfill"}
          syncMode={syncMode}
          syncSince={syncSince}
          syncDirection={syncDirection}
          syncMessage={syncMessage}
          onSyncMode={(value) => {
            setSyncMode(value);
            void changeChoice(selected.slug, "sync:mode", value);
          }}
          onSyncSince={(value) => {
            setSyncSince(value);
            void changeChoice(selected.slug, "sync:since", value);
          }}
          onSyncDirection={(value) => {
            setSyncDirection(value);
            void changeChoice(selected.slug, "sync:direction", value);
          }}
          onRun={() => setPendingSync("backfill")}
        />
      ) : null}

      {selected.fields.length > 0 ? (
        <PropertyMap
          fields={selected.fields}
          properties={selected.properties ?? []}
          providerLabel={selected.label}
          providerSlug={selected.slug}
          targetLabel={appMark.label}
          canManage={canManage}
          busy={busy}
          valueFor={(key) => bindingValue(selected.slug, key)}
          onChange={(key, value) =>
            void changeChoice(selected.slug, key, value)
          }
          unmapped={selected.unmapped}
        />
      ) : null}

      {selected.kind === "action" ? (
        <section className="mt-8" aria-labelledby="bridge-actions-heading">
          <h3
            id="bridge-actions-heading"
            className="text-sm font-semibold text-ph-ink"
          >
            Actions
          </h3>
          <p className="mt-1 max-w-xl text-sm text-ph-subtle">
            {isConnected(connection)
              ? "Connected once for this workspace. My Calendar stays on. Turn the other rows on only when you want that result."
              : `Connect ${selected.label} here. It is shared by the workspace, not set up inside each app.`}
          </p>
          <div className="mt-3 overflow-hidden rounded-lg border border-ph-border">
            <div className="grid grid-cols-2 gap-3 bg-ph-muted px-4 py-2 text-xs font-semibold tracking-wide text-ph-subtle uppercase">
              <span className="flex items-center gap-2">
                <BrandIcon
                  src={logoUrl(selected.slug)}
                  label={selected.label}
                />
                {selected.label}
              </span>
              <span className="flex items-center gap-2">
                <BrandIcon src={appMark.icon} label={appMark.label} />
                {appMark.label}
              </span>
            </div>
            {selected.objects.map((object) => {
              const feed = object.local === "My Calendar";
              const actionKey = `action:${object.local}`;
              const enabled = feed || bindingValue(selected.slug, actionKey) === "on";
              return (
                <div
                  key={`${object.remote}-${object.local}`}
                  className="flex items-center justify-between gap-3 border-t border-ph-border px-4 py-3"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-ph-ink">
                      {object.remote} → {object.local}
                    </span>
                    <span className="block text-xs text-ph-subtle">
                      {feed
                        ? "Always, from this connection"
                        : enabled
                          ? "On demand · on"
                          : "On demand · off"}
                    </span>
                  </span>
                  {feed ? null : (
                    <Toggle
                      label={enabled ? "On" : "Off"}
                      checked={enabled}
                      disabled={!canManage || busy || !isConnected(connection)}
                      onChange={(event) =>
                        void changeChoice(
                          selected.slug,
                          actionKey,
                          event.target.checked ? "on" : "off",
                        )
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : !selected.ready ? (
        <section className="mt-8" aria-labelledby="bridge-mapping-heading">
          <h3
            id="bridge-mapping-heading"
            className="text-sm font-semibold text-ph-ink"
          >
            Records this bridge pairs
          </h3>
          <p className="mt-1 max-w-xl text-sm text-ph-subtle">
            {isConnected(connection)
              ? `Pairing for ${selected.label} is not available yet. This is what the bridge will sync once its adapter lands.`
              : `Connect ${selected.label} to pair each record. Names do not have to match.`}
          </p>
          <div className="mt-3 overflow-hidden rounded-lg border border-ph-border">
            <div className="grid grid-cols-2 gap-3 bg-ph-muted px-4 py-2 text-xs font-semibold tracking-wide text-ph-subtle uppercase">
              <span className="flex items-center gap-2">
                <BrandIcon
                  src={logoUrl(selected.slug)}
                  label={selected.label}
                />
                {selected.label}
              </span>
              <span className="flex items-center gap-2">
                <BrandIcon src={appMark.icon} label={appMark.label} />
                {appMark.label}
              </span>
            </div>
            {selected.objects.map((object) => (
              <div
                key={`${object.remote}-${object.local}`}
                className="grid grid-cols-2 gap-3 border-t border-ph-border px-4 py-3"
              >
                <span className="truncate text-sm text-ph-ink">
                  {object.remote}
                </span>
                <span className="truncate text-sm text-ph-ink">
                  {object.local}
                  <span className="mt-0.5 block text-xs text-ph-subtle">
                    {object.direction === "both"
                      ? "Both ways"
                      : object.direction === "import"
                        ? "Pull only"
                        : object.direction === "export"
                          ? "Push only"
                          : "On demand"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {selected.push_blocked ? (
        <p className="mt-6 max-w-xl text-sm text-ph-subtle">
          {selected.push_blocked}
        </p>
      ) : null}
      {saveError ? (
        <p className="mt-4 text-sm text-ph-danger">{saveError}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-2">
        {isConnected(connection) && connection ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onDisconnect(connection)}
            className="inline-flex items-center gap-2 rounded-md border border-ph-border px-3 py-2 text-sm font-medium text-ph-ink hover:bg-ph-muted focus-visible:ring-2 focus-visible:ring-ph-brand disabled:opacity-60"
          >
            <Unplug className="h-4 w-4" aria-hidden />
            Disconnect
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => onConnect(selected)}
            className="inline-flex items-center gap-2 rounded-md bg-ph-brand px-3 py-2 text-sm font-medium text-[var(--ph-on-accent)] focus-visible:ring-2 focus-visible:ring-ph-brand disabled:opacity-60"
          >
            <PlugZap
              className="suite-icon-motion suite-icon-nudge h-4 w-4"
              aria-hidden
            />
            Connect {selected.label}
          </button>
        )}
      </div>
    </div>
  ) : (
    <div className="flex h-full items-center justify-center p-8 text-sm text-ph-subtle">
      No compatible apps.
    </div>
  );

  return (
    <section
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
      data-test="bridge-screen"
    >
      <SuitePage className="suite-bridge-header shrink-0 border-b border-ph-border">
        <SuitePageHeader
          title="Bridge"
          description="Connected apps that can be bridged. Each one has its own setup."
          dataTest="bridge-page-header"
          sticky={false}
          actions={workspaceSwitcher}
        />
        {apps.length > 0 || workspaces.length > 0 ? (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {apps.length > 0 ? (
              <SegmentedControl
                variant="tabs"
                aria-label="App"
                className="min-w-0"
                value={activeApp}
                onChange={(value) => onAppChange?.(value)}
                options={apps.map((app) => ({
                  value: app.id,
                  label: app.name,
                  icon: <img src={app.icon} alt="" className="h-4 w-4" />,
                }))}
              />
            ) : null}
            {workspaces.length > 0 ? (
              <div className="ml-auto w-full max-w-xs sm:w-auto sm:min-w-[12rem]">
                <Select
                  label="Workspace"
                  value={activeWorkspaceId}
                  onChange={(event) => onWorkspaceChange?.(event.target.value)}
                  wrapperClassName="w-full"
                >
                  {workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}
          </div>
        ) : null}
        {error ? <p className="mt-3 text-sm text-ph-danger">{error}</p> : null}
      </SuitePage>
      {loading ? (
        <div className="flex items-center justify-center px-8 py-10">
          <LoadingSpinner size="lg" label="Loading bridges…" />
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[20rem_minmax(0,1fr)]">
          <div
            className={`min-h-0 overflow-hidden ${narrowDetail ? "hidden lg:block" : ""}`}
          >
            {list}
          </div>
          <div
            className={`min-h-0 overflow-hidden ${narrowDetail ? "" : "hidden lg:block"}`}
          >
            {detail}
          </div>
        </div>
      )}
      <Modal
        open={pendingSync !== null}
        onClose={() => setPendingSync(null)}
        size="sm"
        title={
          pendingSync === "backfill"
            ? syncDirection === "import"
              ? `Import from ${selected?.label ?? "the app"}?`
              : syncDirection === "export"
                ? `Export to ${selected?.label ?? "the app"}?`
                : `Sync with ${selected?.label ?? "the app"}?`
            : "Sync properties?"
        }
        footer={
          <>
            <Button
              variant="secondary"
              disabled={syncing !== null}
              onClick={() => setPendingSync(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={syncing !== null}
              onClick={() => void runSync(pendingSync ?? "properties")}
            >
              <span className="inline-flex items-center gap-2">
                {syncing !== null ? <Spinner /> : null}
                {syncing !== null
                  ? "Working…"
                  : pendingSync === "properties"
                    ? "Sync properties"
                    : syncDirection === "import"
                      ? `Import from ${selected?.label ?? "the app"}`
                      : syncDirection === "export"
                        ? `Export to ${selected?.label ?? "the app"}`
                        : `Sync with ${selected?.label ?? "the app"}`}
              </span>
            </Button>
          </>
        }
      >
        <p className="text-sm text-ph-subtle">
          {pendingSync === "properties"
            ? 'ShellStack clients, projects, and categories set to "Add here if it does not exist" are created. Records you already paired stay as they are.'
            : syncDirection === "import"
              ? `Time entries from ${selected?.label ?? "the app"} for ${SYNC_WINDOW_LABEL[syncMode] ?? "the chosen window"} are imported. Entries already imported are matched by their ${selected?.label ?? "app"} id, so a repeat run updates instead of duplicating.`
              : syncDirection === "export"
                ? `Time entries are pushed to ${selected?.label ?? "the app"} for ${SYNC_WINDOW_LABEL[syncMode] ?? "the chosen window"}. Entries already pushed are skipped, so a repeat run does not duplicate.`
                : `Time entries are imported from and pushed to ${selected?.label ?? "the app"} for ${SYNC_WINDOW_LABEL[syncMode] ?? "the chosen window"}. Matched records are reused and already-synced rows are skipped, so a repeat run does not duplicate.`}
        </p>
      </Modal>

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[95] max-w-sm sm:right-6 sm:bottom-6"
        >
          <div className="ph-toast ph-toast-success">
            <Check className="h-4 w-4 shrink-0 text-ph-success" aria-hidden />
            <span>{toast}</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}

type SyncDirection = "import" | "export" | "both";

function RecordPairing({
  setup,
  loading,
  error,
  clients,
  projects,
  categories,
  canManage,
  busy,
  syncing,
  valueFor,
  onChange,
  providerLabel,
  providerSlug,
  targetLabel,
  targetIcon,
  pairs,
  onSync,
}: {
  setup: Record<string, BridgeRecord[]> | null;
  loading: boolean;
  error: string | null;
  clients: BridgeProjectOption[];
  projects: BridgeProjectOption[];
  categories: BridgeProjectOption[];
  canManage: boolean;
  busy: boolean;
  syncing: boolean;
  valueFor: (key: string) => string;
  onChange: (key: string, value: string) => void;
  providerLabel: string;
  providerSlug: string;
  targetLabel: string;
  targetIcon: string;
  pairs: BridgePair[];
  onSync?: (scope: "properties" | "backfill") => Promise<void>;
}) {
  const [lane, setLane] = useState(pairs[0]?.key ?? "client");
  const [pairOpen, setPairOpen] = useState(true);
  const rowsFor = (key: string) => setup?.[`${key}s`] ?? [];
  const localFor = (key: string) =>
    key === "client" ? clients : key === "task" ? categories : projects;
  const lanes = pairs.map((pair) => ({
    id: pair.key,
    label: pair.remote,
    rows: rowsFor(pair.key),
    options: localFor(pair.key),
  }));
  const active = lanes.find((item) => item.id === lane) ?? lanes[0];
  const providerLogo = logoUrl(providerSlug);
  if (!active) return null;

  const statusOf = (rowId: string) => {
    const value = valueFor(`${active.id}:${rowId}`) || "create";
    return value === "skip"
      ? "unmatched"
      : value === "create"
        ? "create"
        : "matched";
  };
  const counts = active.rows.reduce(
    (acc, row) => {
      acc[statusOf(row.id)] += 1;
      return acc;
    },
    { matched: 0, create: 0, unmatched: 0 },
  );

  if (error) {
    return (
      <section className="mt-8 rounded-xl border border-ph-danger/40 bg-ph-surface p-5">
        <h3 className="text-sm font-semibold text-ph-ink">
          Could not load {providerLabel}
        </h3>
        <p className="mt-1 text-sm text-ph-danger">{error}</p>
        <p className="mt-2 text-sm text-ph-subtle">
          Reconnect {providerLabel} in Settings → Integrate an app, then try
          again.
        </p>
      </section>
    );
  }

  return (
    <div className="mt-8 space-y-5">
      <section className="rounded-xl border border-ph-border bg-ph-surface">
        <button
          type="button"
          aria-expanded={pairOpen}
          onClick={() => setPairOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        >
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-ph-ink">
              Pair records
            </span>
            <span className="mt-0.5 block text-sm text-ph-subtle">
              {providerLabel} on the left, {targetLabel} on the right. Point
              either side at the other, even when the names differ.
            </span>
          </span>
          <NavArrowDown
            className={`h-4 w-4 shrink-0 text-ph-subtle transition-transform ${
              pairOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>
        {pairOpen ? (
          <div className="space-y-5 border-t border-ph-border p-5">
            <div
              className="flex flex-wrap gap-1"
              role="tablist"
              aria-label="Record type"
            >
              {lanes.map((item) => {
                const on = item.id === active.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setLane(item.id)}
                    className={`inline-flex min-h-9 items-center rounded-[var(--ph-radius-control)] px-2.5 text-sm ${
                      on
                        ? "bg-[var(--ph-selected-bg)] text-[var(--ph-selected-text)]"
                        : "text-ph-subtle hover:bg-[var(--ph-surface-hover)] hover:text-ph-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 rounded-xl border border-ph-info/30 bg-ph-info/5 p-4">
              <InfoCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-ph-info"
                aria-hidden
              />
              <div>
                <p className="text-sm font-medium text-ph-ink">
                  When a match is missing, choose what to do.
                </p>
                <p className="mt-0.5 text-sm text-ph-subtle">
                  Use &ldquo;Add here if it does not exist&rdquo; to create a
                  new record, or choose &ldquo;Leave unmatched&rdquo; to skip it
                  for now.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-center gap-3 px-1">
                <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-ph-ink">
                  <BrandIcon src={providerLogo} label={providerLabel} />
                  <span className="truncate">{providerLabel}</span>
                  <span className="shrink-0 text-xs font-normal text-ph-subtle">
                    {active.rows.length} records
                  </span>
                </span>
                <span />
                <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-ph-ink">
                  <BrandIcon src={targetIcon} label={targetLabel} />
                  <span className="truncate">{targetLabel}</span>
                  <span className="shrink-0 text-xs font-normal text-ph-subtle">
                    {active.options.length} records
                  </span>
                </span>
                <span />
              </div>

              {loading ? (
                <div role="status" aria-live="polite">
                  <span className="sr-only">
                    Loading {providerLabel} records
                  </span>
                  <SuiteSkeletonList items={4} />
                </div>
              ) : active.rows.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-ph-border px-4 py-6 text-sm text-ph-subtle">
                  Nothing came back from {providerLabel}.
                </p>
              ) : (
                active.rows.map((row) => {
                  const key = `${active.id}:${row.id}`;
                  const value = valueFor(key) || "create";
                  const status = statusOf(row.id);
                  return (
                    <div
                      key={row.id}
                      className={`grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-3 py-2 ${
                        status === "create"
                          ? "border-ph-warning/40 bg-ph-warning/5"
                          : status === "unmatched"
                            ? "border-ph-border bg-ph-canvas"
                            : "border-ph-border bg-ph-surface"
                      }`}
                    >
                      <span className="flex min-w-0 items-baseline gap-2">
                        <span className="truncate text-sm text-ph-ink">
                          {row.label}
                        </span>
                        {row.detail ? (
                          <span className="truncate text-xs text-ph-subtle">
                            · {row.detail}
                          </span>
                        ) : null}
                      </span>
                      <span className="text-ph-subtle" aria-hidden>
                        →
                      </span>
                      <Select
                        hideLabel
                        label={`Pair ${row.label}`}
                        value={value}
                        disabled={!canManage || busy}
                        onChange={(event) => onChange(key, event.target.value)}
                        wrapperClassName="min-w-0"
                      >
                        <option value="create">
                          Add here if it does not exist
                        </option>
                        <option value="skip">Leave unmatched</option>
                        {active.options.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.clientName
                              ? `${option.clientName} · ${option.name}`
                              : option.name}
                          </option>
                        ))}
                      </Select>
                      <StatusPill status={status} />
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ph-border pt-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-ph-subtle">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-ph-success"
                    aria-hidden
                  />
                  <span className="text-ph-ink">{counts.matched}</span> matched
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-ph-warning"
                    aria-hidden
                  />
                  <span className="text-ph-ink">{counts.create}</span> will
                  create
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-ph-subtle"
                    aria-hidden
                  />
                  <span className="text-ph-ink">{counts.unmatched}</span>{" "}
                  unmatched
                </span>
              </div>
              <button
                type="button"
                disabled={!onSync || busy}
                onClick={() => void onSync?.("properties")}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-ph-brand px-3 text-sm font-medium text-[var(--ph-on-accent)] disabled:opacity-60"
              >
                {syncing ? (
                  <Spinner />
                ) : (
                  <Link className="h-4 w-4" aria-hidden />
                )}
                {syncing ? "Working…" : "Sync properties"}
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function BridgeSyncPanel({
  providerLabel,
  providerSlug,
  appLabel,
  appIcon,
  kind,
  ready,
  hasHandler,
  canManage,
  busy,
  syncing,
  syncMode,
  syncSince,
  syncDirection,
  syncMessage,
  onSyncMode,
  onSyncSince,
  onSyncDirection,
  onRun,
}: {
  providerLabel: string;
  providerSlug: string;
  appLabel: string;
  appIcon: string;
  kind: BridgeDefinition["kind"];
  ready: boolean;
  hasHandler: boolean;
  canManage: boolean;
  busy: boolean;
  syncing: boolean;
  syncMode: string;
  syncSince: string;
  syncDirection: SyncDirection;
  syncMessage: string | null;
  onSyncMode: (value: string) => void;
  onSyncSince: (value: string) => void;
  onSyncDirection: (value: SyncDirection) => void;
  onRun: () => void;
}) {
  const providerLogo = logoUrl(providerSlug);
  const directions: {
    value: SyncDirection;
    title: string;
    hint: string;
    arrow: string;
  }[] =
    kind === "import"
      ? [
          {
            value: "import",
            title: `Import from ${providerLabel}`,
            hint: "One way",
            arrow: "→",
          },
        ]
      : [
          {
            value: "import",
            title: `Import from ${providerLabel}`,
            hint: "One way",
            arrow: "→",
          },
          {
            value: "export",
            title: `Export to ${providerLabel}`,
            hint: "One way",
            arrow: "←",
          },
          {
            value: "both",
            title: `Sync with ${providerLabel}`,
            hint: "Two way",
            arrow: "↔",
          },
        ];
  const runLabel =
    syncDirection === "import"
      ? `Import from ${providerLabel}`
      : syncDirection === "export"
        ? `Export to ${providerLabel}`
        : `Sync with ${providerLabel}`;
  const runEnabled = ready && hasHandler;
  return (
    <section className="mt-8 space-y-4 rounded-xl border border-ph-border bg-ph-surface p-5">
      <div>
        <h3 className="text-sm font-semibold text-ph-ink">Sync</h3>
        <p className="mt-1 text-sm text-ph-subtle">
          {runEnabled
            ? "Pick a direction, then run it. Manual only — nothing is scheduled."
            : `Syncing ${providerLabel} is not available yet. The direction it will use is shown below.`}
        </p>
      </div>

      <div
        className="grid gap-2 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Sync direction"
      >
        {directions.map((option) => {
          const on = option.value === syncDirection;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={!canManage || busy}
              onClick={() => onSyncDirection(option.value)}
              className={`flex flex-col items-start gap-2 rounded-lg border px-3 py-3 text-left disabled:opacity-60 ${
                on
                  ? "border-ph-brand bg-[var(--ph-selected-bg)]"
                  : "border-ph-border bg-ph-surface hover:bg-[var(--ph-surface-hover)]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <img
                  src={providerLogo}
                  alt=""
                  className="h-4 w-4 object-contain"
                />
                <span aria-hidden className="text-sm text-ph-subtle">
                  {option.arrow}
                </span>
                <img src={appIcon} alt="" className="h-4 w-4 object-contain" />
              </span>
              <span className="text-sm font-medium text-ph-ink">
                {option.title}
              </span>
              <span className="text-xs text-ph-subtle">{option.hint}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Select
          label="Window"
          value={syncMode}
          onChange={(event) => onSyncMode(event.target.value)}
          wrapperClassName="min-w-[12rem]"
        >
          <option value="latest">Latest</option>
          <option value="week">This week</option>
          <option value="since">From a date</option>
          <option value="all">All history</option>
        </Select>
        {syncMode === "since" ? (
          <div className="flex flex-col gap-1 text-sm text-ph-ink">
            <span>Start date</span>
            <DatePicker
              variant="field"
              aria-label="Start date"
              value={syncSince}
              onChange={onSyncSince}
            />
          </div>
        ) : null}
        {runEnabled ? (
          <button
            type="button"
            disabled={busy || syncing}
            onClick={onRun}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-ph-brand px-3 text-sm font-medium text-[var(--ph-on-accent)] disabled:opacity-60"
          >
            {syncing ? (
              <Spinner />
            ) : (
              <img
                src={providerLogo}
                alt=""
                className="h-4 w-4 object-contain"
              />
            )}
            {syncing ? "Working…" : runLabel}
          </button>
        ) : (
          <span className="inline-flex h-11 items-center rounded-md border border-dashed border-ph-border px-3 text-sm text-ph-subtle">
            Not available yet
          </span>
        )}
      </div>
      {syncMessage ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-ph-danger/30 bg-ph-danger/10 px-3 py-2 text-sm text-ph-ink"
        >
          <InfoCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-ph-danger"
            aria-hidden
          />
          <span>{syncMessage}</span>
        </div>
      ) : null}
      <p className="text-xs text-ph-subtle">
        Re-runs match {providerLabel} ids so nothing is duplicated. A row both
        sides changed is skipped and listed under Needs a decision.
      </p>
    </section>
  );
}

function PropertyMap({
  fields,
  properties,
  providerLabel,
  providerSlug,
  targetLabel,
  canManage,
  busy,
  valueFor,
  onChange,
  unmapped,
}: {
  fields: BridgeField[];
  properties: BridgeProperty[];
  providerLabel: string;
  providerSlug: string;
  targetLabel: string;
  canManage: boolean;
  busy: boolean;
  valueFor: (key: string) => string;
  onChange: (key: string, value: string) => void;
  unmapped: string[];
}) {
  const groups: string[] = [];
  for (const field of fields) {
    if (!groups.includes(field.group || "Other"))
      groups.push(field.group || "Other");
  }
  const choices = properties.length
    ? properties
    : fields.map((field) => ({
        path: field.path,
        label: field.local,
        group: field.group,
        note: field.note,
      }));
  const optionGroups: string[] = [];
  for (const choice of choices) {
    const name = choice.group || "Other";
    if (!optionGroups.includes(name)) optionGroups.push(name);
  }
  return (
    <section className="mt-6 rounded-xl border border-ph-border bg-ph-surface">
      <div className="border-b border-ph-border px-4 py-3">
        <h3 className="text-sm font-semibold text-ph-ink">Properties</h3>
        <p className="mt-0.5 text-sm text-ph-subtle">
          Point each {providerLabel} property at a {targetLabel} field. Nested
          fields are in their own group. Leave a property unmapped to skip it.
        </p>
      </div>
      {groups.map((group) => {
        const rows = fields.filter(
          (field) => (field.group || "Other") === group,
        );
        const note = rows.find((field) => field.note)?.note;
        return (
          <div
            key={group}
            className="border-b border-ph-border last:border-b-0"
          >
            <div className="px-4 pt-3">
              <h4 className="text-xs font-semibold tracking-wide text-ph-subtle uppercase">
                {group}
              </h4>
              {note ? (
                <p className="mt-0.5 text-xs text-ph-subtle">{note}</p>
              ) : null}
            </div>
            <ul>
              {rows.map((field) => {
                const key = `field:${field.remote}`;
                const stored = valueFor(key);
                const value =
                  stored === "skip" ||
                  choices.some((choice) => choice.path === stored)
                    ? stored
                    : field.path;
                return (
                  <li
                    key={field.remote}
                    className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,12rem)] items-center gap-3 px-4 py-2"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <BrandIcon
                        src={logoUrl(providerSlug)}
                        label={providerLabel}
                        className="h-4 w-4"
                      />
                      <span className="truncate text-sm text-ph-ink">
                        {field.remote}
                      </span>
                    </span>
                    <span className="text-sm text-ph-subtle" aria-hidden>
                      →
                    </span>
                    <Select
                      hideLabel
                      label={`${field.remote} lands on`}
                      value={value}
                      disabled={!canManage || busy}
                      onChange={(event) => onChange(key, event.target.value)}
                      wrapperClassName="min-w-0"
                    >
                      {optionGroups.map((name) => {
                        const options = choices.filter(
                          (choice) => (choice.group || "Other") === name,
                        );
                        if (options.length === 0) return null;
                        return (
                          <optgroup key={name} label={name}>
                            {options.map((choice) => (
                              <option key={choice.path} value={choice.path}>
                                {choice.label}
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                      <option value="skip">Don&apos;t map</option>
                    </Select>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      {unmapped.length > 0 ? (
        <p className="px-4 py-3 text-xs text-ph-subtle">
          No {targetLabel} field for {unmapped.join(", ")}. Those stay unmapped.
        </p>
      ) : null}
    </section>
  );
}

const DIRECTION_LABEL: Record<BridgeObject["direction"], string> = {
  both: "Both ways",
  import: "Import only",
  export: "Export only",
  action: "One at a time",
};

function BridgeAlign({
  objects,
  providerLabel,
  targetLabel,
  target,
}: {
  objects: BridgeObject[];
  providerLabel: string;
  targetLabel: string;
  target: string;
}) {
  if (objects.length === 0) return null;
  const note =
    target === "tides"
      ? "Pair the container with a Tides project first. Tasks, status, and comments only follow that pair."
      : target === "kraken"
        ? "Pages copy as plain text. A file bridge attaches files and does not build a second document tree."
        : "Pair clients, projects, and categories by id. Time entries follow the project pair.";
  return (
    <section className="mt-6 rounded-xl border border-ph-border bg-ph-surface">
      <div className="border-b border-ph-border px-4 py-3">
        <h3 className="text-sm font-semibold text-ph-ink">What lines up</h3>
        <p className="mt-0.5 text-sm text-ph-subtle">{note}</p>
      </div>
      <ul>
        {objects.map((item) => (
          <li
            key={`${item.remote}-${item.local}-${item.direction}`}
            className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-ph-border px-4 py-2 last:border-b-0"
          >
            <span className="truncate text-sm text-ph-ink">{item.remote}</span>
            <span className="text-sm text-ph-subtle" aria-hidden>
              {item.direction === "import"
                ? "→"
                : item.direction === "export"
                  ? "←"
                  : "↔"}
            </span>
            <span className="truncate text-sm text-ph-ink">{item.local}</span>
            <span className="text-xs text-ph-subtle">
              {DIRECTION_LABEL[item.direction]}
            </span>
          </li>
        ))}
      </ul>
      <p className="sr-only">
        {providerLabel} records on the left, {targetLabel} records on the right.
      </p>
    </section>
  );
}

function BridgeConflictReview({
  conflicts,
  loading,
  resolvingId,
  providerLabel,
  appLabel,
  canManage,
  onResolve,
}: {
  conflicts: BridgeConflict[];
  loading: boolean;
  resolvingId: string | null;
  providerLabel: string;
  appLabel: string;
  canManage: boolean;
  onResolve?: (
    id: string,
    choice: "local" | "remote" | "skip",
  ) => Promise<void>;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (!loading && conflicts.length === 0) return null;
  return (
    <section className="mt-6 rounded-xl border border-ph-warning/40 bg-ph-surface">
      <div className="border-b border-ph-border px-4 py-3">
        <h3 className="text-sm font-semibold text-ph-ink">Needs a decision</h3>
        <p className="mt-0.5 text-sm text-ph-subtle">
          These rows were skipped because both sides changed. Nothing was
          overwritten.
        </p>
      </div>
      {loading && conflicts.length === 0 ? (
        <p className="px-4 py-3 text-sm text-ph-subtle">Loading conflicts…</p>
      ) : (
        <ul>
          {conflicts.map((row) => {
            const open = openId === row.id;
            const busy = resolvingId === row.id;
            return (
              <li
                key={row.id}
                className="border-b border-ph-border last:border-b-0"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : row.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ph-ink">
                      {row.summary}
                    </span>
                    <span className="block truncate text-xs text-ph-subtle">
                      {row.record_type.replace(/_/g, " ")} · {row.remote_id}
                    </span>
                  </span>
                  <NavArrowDown
                    className={`h-4 w-4 shrink-0 text-ph-subtle transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {open ? (
                  <div className="space-y-3 px-4 pb-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ConflictSide
                        title={providerLabel}
                        fields={row.remote_fields}
                      />
                      <ConflictSide
                        title={appLabel}
                        fields={row.local_fields}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={!canManage || !onResolve || busy}
                        onClick={() => void onResolve?.(row.id, "remote")}
                        className="inline-flex h-9 items-center rounded-md border border-ph-border px-3 text-sm text-ph-ink disabled:opacity-60"
                      >
                        Use {providerLabel}
                      </button>
                      <button
                        type="button"
                        disabled={!canManage || !onResolve || busy}
                        onClick={() => void onResolve?.(row.id, "local")}
                        className="inline-flex h-9 items-center rounded-md bg-ph-brand px-3 text-sm font-medium text-[var(--ph-on-accent)] disabled:opacity-60"
                      >
                        {row.can_push
                          ? `Use ${appLabel}`
                          : `Keep ${appLabel} here`}
                      </button>
                      <button
                        type="button"
                        disabled={!canManage || !onResolve || busy}
                        onClick={() => void onResolve?.(row.id, "skip")}
                        className="inline-flex h-9 items-center rounded-md px-3 text-sm text-ph-subtle disabled:opacity-60"
                      >
                        Leave both
                      </button>
                    </div>
                    {!row.can_push ? (
                      <p className="text-xs text-ph-subtle">
                        Keep {appLabel} here stops the next import from
                        overwriting it. {providerLabel} is not changed.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function ConflictSide({
  title,
  fields,
}: {
  title: string;
  fields: BridgeConflictField[];
}) {
  return (
    <div className="rounded-lg border border-ph-border bg-ph-canvas px-3 py-2">
      <p className="text-xs font-semibold text-ph-subtle">{title}</p>
      <dl className="mt-2 space-y-1">
        {fields.map((field) => (
          <div
            key={field.label}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2"
          >
            <dt className="text-xs text-ph-subtle">{field.label}</dt>
            <dd className="truncate text-sm text-ph-ink">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function BridgeMark({
  slug,
  label,
  large = false,
}: {
  slug: string;
  label: string;
  large?: boolean;
}) {
  const size = large ? "h-12 w-12" : "h-8 w-8";
  return (
    <span
      className={`relative flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-md border border-ph-border bg-ph-surface text-xs font-semibold text-ph-subtle`}
    >
      <span aria-hidden>{label.charAt(0)}</span>
      <img
        src={logoUrl(slug)}
        alt=""
        className="absolute inset-0 h-full w-full object-contain p-1"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </span>
  );
}

/** Small square logo with a letter fallback, for headers and column titles. */
function BrandIcon({
  src,
  label,
  className = "h-5 w-5",
}: {
  src: string;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`relative flex ${className} shrink-0 items-center justify-center overflow-hidden rounded border border-ph-border bg-ph-surface text-[0.5625rem] font-semibold text-ph-subtle`}
    >
      <span aria-hidden>{label.charAt(0)}</span>
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-contain p-0.5"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </span>
  );
}

/** Minimal CSS spinner for in-button loading states. */
function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}

type PairStatus = "matched" | "create" | "unmatched";

function StatusPill({ status }: { status: PairStatus }) {
  if (status === "matched") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ph-success/10 px-2.5 py-1 text-xs font-medium text-ph-success">
        <Check className="h-3.5 w-3.5" aria-hidden />
        Matched
      </span>
    );
  }
  if (status === "create") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ph-warning/10 px-2.5 py-1 text-xs font-medium text-ph-warning">
        <Plus className="h-3.5 w-3.5" aria-hidden />
        Will create record
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ph-muted px-2.5 py-1 text-xs font-medium text-ph-subtle">
      <Minus className="h-3.5 w-3.5" aria-hidden />
      Unmatched
    </span>
  );
}

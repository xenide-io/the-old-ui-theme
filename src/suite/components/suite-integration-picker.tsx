"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  EvPlug as Plug,
  Filter,
  NavArrowDown,
  NavArrowUp,
  Search,
  Xmark,
} from "iconoir-react";
import { Button, Input, Modal } from "@/components/ui";
import { SUITE_APPS, SUITE_APP_MAP, type SuiteAppSlug } from "@/suite/lib/apps";
import { SuiteAppIcon } from "@/suite/icons";

export interface SuiteIntegrationPickerItem {
  id: string;
  label: string;
  description: string;
  icon?: ReactNode;
  categories?: string[];
  authSchemes?: string[];
  connecting?: boolean;
  unavailableReason?: string;
}

export interface SuiteIntegrationAuthField {
  name: string;
  label: string;
  type?: "password" | "text" | "url";
}

export interface SuiteIntegrationAuthDetails {
  fields: SuiteIntegrationAuthField[];
  auth_scheme: string | null;
  managed: boolean;
}

export interface SuiteIntegrationAuthSelection {
  auth_scheme: string;
  auth_fields?: Record<string, string>;
}

export interface SuiteIntegrationPickerProps {
  open: boolean;
  items: SuiteIntegrationPickerItem[];
  connectedItems?: SuiteIntegrationPickerItem[];
  loading?: boolean;
  catalogLoading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onEndReached?: () => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  category?: string;
  categories?: string[];
  onCategoryChange?: (value: string) => void;
  onClose: () => void;
  onConnect: (
    item: SuiteIntegrationPickerItem,
    auth?: SuiteIntegrationAuthSelection,
  ) => void | Promise<void>;
  onFetchAuthFields?: (
    item: SuiteIntegrationPickerItem,
    authScheme: string,
  ) => Promise<SuiteIntegrationAuthDetails>;
  onDisconnect?: (item: SuiteIntegrationPickerItem) => void;
  title?: string;
  description?: string;
  dataTest?: string;
}

const DESCRIPTION_LIMIT = 90;

function IntegrationSkeletonCard() {
  return (
    <div
      className="flex min-h-36 min-w-0 animate-pulse flex-col justify-between rounded-xl border border-ph-border bg-ph-surface p-4"
      aria-hidden="true"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-ph-muted" />
        <div className="min-w-0 flex-1 space-y-2 pt-1">
          <div className="h-4 w-3/5 rounded bg-ph-muted" />
          <div className="h-3 w-full rounded bg-ph-muted" />
          <div className="h-3 w-4/5 rounded bg-ph-muted" />
        </div>
      </div>
      <div className="mt-3 h-9 w-20 rounded bg-ph-muted" />
    </div>
  );
}

const SKELETON_COUNT = 6;

const AUTH_SCHEME_LABELS: Record<string, string> = {
  API_KEY: "API key",
  BASIC_AUTH: "Basic auth",
  BEARER_TOKEN: "Bearer token",
  OAUTH2: "OAuth 2.0",
};

function authSchemeLabel(scheme: string) {
  const normalised = scheme.trim().toUpperCase();
  return (
    AUTH_SCHEME_LABELS[normalised] ??
    normalised
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

function authSchemesFor(item: SuiteIntegrationPickerItem) {
  return Array.from(
    new Set(
      (item.authSchemes ?? [])
        .map((scheme) => scheme.trim().toUpperCase())
        .filter(Boolean),
    ),
  );
}

/**
 * Which ShellStack apps put a connected integration to work, per the deep
 * integration plan: calendar/mail feed TurtleTime time entries and Tides
 * tasks, code/chat/ticketing feed Tides tasks and Kraken runbooks, docs and
 * knowledge sources feed Kraken, CRM/finance feed the Portal. Unmapped
 * categories default to Kraken's authorised-source search.
 */
const CATEGORY_APP_AFFINITY: Record<string, readonly SuiteAppSlug[]> = {
  calendar: ["turtletime", "tides"],
  email: ["turtletime", "tides"],
  code: ["tides", "kraken"],
  chat: ["tides", "kraken"],
  documents: ["kraken"],
  notes: ["kraken"],
  knowledge: ["kraken"],
  file_storage: ["kraken"],
  crm: ["shellstack", "tides"],
  finance: ["shellstack", "tides"],
  payment: ["shellstack", "tides"],
  monitoring: ["tides", "kraken"],
  design: ["tides", "kraken"],
  support: ["tides", "shellstack"],
  ticketing: ["tides", "kraken"],
};

const DEFAULT_APP_AFFINITY: readonly SuiteAppSlug[] = ["tides", "kraken"];

export function suiteAppsForIntegration(
  categories: readonly string[] | undefined,
): SuiteAppSlug[] {
  const apps = new Set<SuiteAppSlug>();
  for (const category of categories ?? []) {
    for (const app of CATEGORY_APP_AFFINITY[category.trim().toLowerCase()] ??
      []) {
      apps.add(app);
    }
  }
  return apps.size > 0
    ? SUITE_APPS.filter((app) => apps.has(app.slug)).map((app) => app.slug)
    : [...DEFAULT_APP_AFFINITY];
}

export function SuiteIntegrationPicker({
  open,
  items,
  connectedItems = [],
  loading = false,
  catalogLoading = false,
  loadingMore = false,
  hasMore = false,
  onEndReached,
  search: controlledSearch,
  onSearchChange,
  category: controlledCategory,
  categories: controlledCategories,
  onCategoryChange,
  onClose,
  onConnect,
  onFetchAuthFields,
  onDisconnect,
  title = "Integrate an app",
  description = "Connect an app to this workspace securely.",
  dataTest = "suite-integration-picker",
}: SuiteIntegrationPickerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreInFlightRef = useRef(false);
  const authRequestRef = useRef(0);
  const [methodItem, setMethodItem] =
    useState<SuiteIntegrationPickerItem | null>(null);
  const [authItem, setAuthItem] = useState<{
    item: SuiteIntegrationPickerItem;
    scheme: string;
    fields: SuiteIntegrationAuthField[];
  } | null>(null);
  const [authValues, setAuthValues] = useState<Record<string, string>>({});
  const [authLoading, setAuthLoading] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const itemCategories = useMemo(
    () =>
      Array.from(
        new Set(items.flatMap((item) => item.categories ?? [])),
      ).sort(),
    [items],
  );
  const categories = controlledCategories ?? itemCategories;
  const activeSearch = controlledSearch ?? query;
  const activeCategory = controlledCategory ?? category;
  const categoryLabel = (value: string) =>
    value
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  const filtered =
    onSearchChange || onCategoryChange
      ? items
      : items.filter((item) => {
          return (
            item.label
              .toLowerCase()
              .includes(activeSearch.trim().toLowerCase()) &&
            (activeCategory === "all" ||
              (item.categories ?? []).includes(activeCategory))
          );
        });
  const visibleCategories = categories.filter((value) =>
    categoryLabel(value)
      .toLowerCase()
      .includes(categoryQuery.trim().toLowerCase()),
  );

  function resetAuthForm() {
    authRequestRef.current += 1;
    setAuthItem(null);
    setAuthValues({});
    setAuthLoading(false);
    setAuthError(null);
  }

  function closeAuthForm() {
    if (authSubmitting) return;
    resetAuthForm();
  }

  async function prepareConnection(
    item: SuiteIntegrationPickerItem,
    scheme: string,
  ) {
    setMethodItem(null);
    setAuthError(null);
    setAuthValues({});

    if (!onFetchAuthFields) {
      await onConnect(item, { auth_scheme: scheme });
      return;
    }

    const requestId = authRequestRef.current + 1;
    authRequestRef.current = requestId;
    setAuthItem({ item, scheme, fields: [] });
    setAuthLoading(true);
    try {
      const details = await onFetchAuthFields(item, scheme);
      if (requestId !== authRequestRef.current) return;
      const resolvedScheme = details.auth_scheme ?? scheme;
      if (details.managed) {
        setAuthItem(null);
        await onConnect(item, { auth_scheme: resolvedScheme });
      } else if (details.fields.length === 0) {
        setAuthItem(null);
        await onConnect(item, {
          auth_scheme: resolvedScheme,
          auth_fields: {},
        });
      } else {
        setAuthItem({ item, scheme: resolvedScheme, fields: details.fields });
      }
    } catch (cause) {
      if (requestId === authRequestRef.current) {
        setAuthError(
          cause instanceof Error
            ? cause.message
            : "Could not load authentication details.",
        );
      }
    } finally {
      if (requestId === authRequestRef.current) setAuthLoading(false);
    }
  }

  function connectItem(item: SuiteIntegrationPickerItem) {
    const schemes = authSchemesFor(item);
    if (schemes.length > 1) {
      setMethodItem(item);
      return;
    }
    if (schemes.length === 1) {
      void prepareConnection(item, schemes[0]);
      return;
    }
    void onConnect(item);
  }

  async function submitAuthForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!authItem) return;
    setAuthSubmitting(true);
    setAuthError(null);
    try {
      await onConnect(authItem.item, {
        auth_scheme: authItem.scheme,
        auth_fields: authValues,
      });
      resetAuthForm();
    } catch (cause) {
      setAuthError(
        cause instanceof Error ? cause.message : "Could not connect the app.",
      );
    } finally {
      setAuthSubmitting(false);
    }
  }

  useEffect(() => {
    if (!categoryMenuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!categoryMenuRef.current?.contains(event.target as Node)) {
        setCategoryMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCategoryMenuOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [categoryMenuOpen]);

  useEffect(() => {
    if (!loadingMore) loadMoreInFlightRef.current = false;
  }, [loadingMore]);

  useEffect(() => {
    const root = scrollViewportRef.current;
    const sentinel = loadMoreSentinelRef.current;
    if (
      !open ||
      !root ||
      !sentinel ||
      !hasMore ||
      !onEndReached ||
      loading ||
      catalogLoading ||
      loadingMore
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loadMoreInFlightRef.current) return;
        loadMoreInFlightRef.current = true;
        observer.unobserve(entry.target);
        onEndReached();
      },
      { root, rootMargin: "0px 0px 80px", threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [catalogLoading, hasMore, loading, loadingMore, onEndReached, open]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={title}
        description={description}
        size="xl"
        dataTest={dataTest}
        bodyClassName="!overflow-hidden"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-ph-subtle"
                aria-hidden
              />
              <Input
                value={activeSearch}
                onChange={(event) => {
                  setQuery(event.target.value);
                  onSearchChange?.(event.target.value);
                }}
                placeholder="Search apps..."
                aria-label="Search apps"
                className="pl-10"
              />
            </div>
            <div ref={categoryMenuRef} className="relative">
              <button
                id={`${dataTest}-category`}
                type="button"
                className="ph-input flex w-full items-center justify-between text-left"
                aria-haspopup="listbox"
                aria-expanded={categoryMenuOpen}
                aria-controls={`${dataTest}-category-options`}
                aria-label="Filter by category"
                onClick={() => setCategoryMenuOpen((open) => !open)}
              >
                <span className="flex items-center gap-2">
                  <Filter
                    className="h-4 w-4 shrink-0 text-ph-subtle"
                    aria-hidden
                  />
                  <span>
                    {activeCategory === "all"
                      ? "All apps"
                      : categoryLabel(activeCategory)}
                  </span>
                </span>
                <NavArrowDown
                  className={`h-4 w-4 transition-transform ${categoryMenuOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              {categoryMenuOpen ? (
                <div
                  id={`${dataTest}-category-options`}
                  role="listbox"
                  aria-label="Integration categories"
                  className="absolute z-20 mt-2 max-h-[min(22rem,calc(100dvh-12rem))] w-full max-w-full overflow-hidden rounded-lg border border-ph-border bg-ph-surface p-2 shadow-lg"
                >
                  <Input
                    value={categoryQuery}
                    onChange={(event) => setCategoryQuery(event.target.value)}
                    placeholder="Search categories..."
                    aria-label="Search categories"
                  />
                  <div
                    className="mt-2 max-h-52 overflow-y-auto"
                    data-test="integration-category-options"
                  >
                    {["all", ...visibleCategories].map((value) => (
                      <button
                        key={value}
                        type="button"
                        role="option"
                        aria-selected={activeCategory === value}
                        className={`flex w-full min-w-0 items-center rounded-md px-3 py-2 text-left text-sm break-words ${activeCategory === value ? "bg-ph-brand text-white" : "text-ph-ink hover:bg-ph-muted"}`}
                        onClick={() => {
                          setCategory(value);
                          onCategoryChange?.(value);
                          setCategoryMenuOpen(false);
                        }}
                      >
                        {value === "all" ? "All apps" : categoryLabel(value)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div
            ref={scrollViewportRef}
            className="min-h-0 max-h-[min(60vh,32rem)] w-full overflow-y-auto pr-1"
          >
            {loading || catalogLoading ? (
              <div
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                aria-label="Loading apps"
              >
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                  <IntegrationSkeletonCard key={index} />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => {
                  const isExpanded = expanded === item.id;
                  const longDescription =
                    item.description.length > DESCRIPTION_LIMIT;
                  const text =
                    isExpanded || !longDescription
                      ? item.description
                      : `${item.description.slice(0, DESCRIPTION_LIMIT).trimEnd()}...`;
                  return (
                    <div
                      key={item.id}
                      className="flex min-h-36 min-w-0 flex-col justify-between rounded-xl border border-ph-border bg-ph-surface p-4"
                    >
                      <button
                        type="button"
                        className="min-w-0 text-left"
                        onClick={() =>
                          longDescription &&
                          setExpanded(isExpanded ? null : item.id)
                        }
                        aria-expanded={isExpanded}
                      >
                        <span className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ph-muted text-ph-ink">
                            {item.icon ?? (
                              <Plug className="h-5 w-5" aria-hidden />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-medium text-ph-ink">
                              {item.label}
                            </span>
                            <span className="mt-1 block text-xs text-ph-subtle">
                              {text}
                            </span>
                            {longDescription ? (
                              <span className="mt-1 block text-xs font-medium text-ph-brand">
                                {isExpanded ? "See less" : "See more"}{" "}
                                {isExpanded ? (
                                  <NavArrowUp className="inline h-3 w-3" />
                                ) : (
                                  <NavArrowDown className="inline h-3 w-3" />
                                )}
                              </span>
                            ) : null}
                          </span>
                        </span>
                      </button>
                      {suiteAppsForIntegration(item.categories).length > 0 ? (
                        <div
                          className="mt-3 flex flex-wrap items-center gap-1.5"
                          aria-label="Works with ShellStack apps"
                        >
                          {suiteAppsForIntegration(item.categories).map(
                            (app) => (
                              <span
                                key={app}
                                data-test={`${dataTest}-${item.id}-app-${app}`}
                              >
                                <SuiteAppIcon
                                  app={app}
                                  size={16}
                                  label={`Works with ${SUITE_APP_MAP[app].name}`}
                                  className="rounded-[4px]"
                                />
                              </span>
                            ),
                          )}
                        </div>
                      ) : null}
                      {authSchemesFor(item).length > 0 ? (
                        <div
                          className="mt-3 flex flex-wrap gap-1.5"
                          aria-label="Connection methods"
                        >
                          {authSchemesFor(item).map((scheme) => (
                            <span
                              key={scheme}
                              className="rounded-full border border-ph-border bg-ph-muted px-2 py-1 text-[0.6875rem] font-medium text-ph-subtle"
                              data-test={`${dataTest}-${item.id}-auth-${scheme.toLowerCase()}`}
                            >
                              {authSchemeLabel(scheme)}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <Button
                        type="button"
                        variant="primary"
                        className="mt-3 self-start"
                        disabled={
                          Boolean(item.unavailableReason) || item.connecting
                        }
                        onClick={() => connectItem(item)}
                      >
                        <span className="flex items-center gap-1.5">
                          <Plug className="h-3.5 w-3.5" aria-hidden />
                          {item.connecting
                            ? "Connecting..."
                            : (item.unavailableReason ?? "Connect")}
                        </span>
                      </Button>
                    </div>
                  );
                })}
                {loadingMore
                  ? Array.from({ length: 3 }, (_, index) => (
                      <IntegrationSkeletonCard key={`loading-${index}`} />
                    ))
                  : null}
              </div>
            )}
            <div ref={loadMoreSentinelRef} className="h-1" aria-hidden="true" />
          </div>

          {connectedItems.length > 0 && onDisconnect ? (
            <div className="space-y-2 border-t border-ph-border pt-4">
              <h3 className="font-medium text-ph-ink">Connected apps</h3>
              {connectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-ph-border bg-ph-muted p-3"
                >
                  <span className="flex min-w-0 items-center gap-2 text-sm text-ph-ink">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </span>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => onDisconnect(item)}
                  >
                    <span className="flex items-center gap-1.5">
                      <Xmark className="h-4 w-4" aria-hidden />
                      Disconnect
                    </span>
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Modal>

      <Modal
        open={Boolean(methodItem)}
        onClose={() => setMethodItem(null)}
        title={
          methodItem
            ? `Connect ${methodItem.label}`
            : "Choose connection method"
        }
        description="Choose how you want to connect this app."
        size="sm"
        zIndex={200}
        dataTest={`${dataTest}-auth-method`}
      >
        {methodItem ? (
          <div className="space-y-2">
            {authSchemesFor(methodItem).map((scheme) => (
              <button
                key={scheme}
                type="button"
                className="flex w-full items-center justify-between rounded-lg border border-ph-border bg-ph-surface px-3 py-3 text-left text-sm text-ph-ink transition hover:border-ph-brand hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand"
                onClick={() => void prepareConnection(methodItem, scheme)}
                data-test={`${dataTest}-choose-${scheme.toLowerCase()}`}
              >
                <span className="font-medium">{authSchemeLabel(scheme)}</span>
                <span className="text-xs text-ph-subtle">Select</span>
              </button>
            ))}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(authItem)}
        onClose={closeAuthForm}
        title={
          authItem ? `${authItem.item.label} authentication` : "Authentication"
        }
        description="Enter the credentials required by Composio. They are sent securely to the ShellStack API."
        size="md"
        zIndex={210}
        dataTest={`${dataTest}-auth-form`}
      >
        {authLoading ? (
          <p className="text-sm text-ph-subtle">
            Loading authentication fields...
          </p>
        ) : authItem ? (
          <form
            className="space-y-4"
            onSubmit={(event) => void submitAuthForm(event)}
          >
            {authError ? (
              <p className="text-sm text-ph-danger" role="alert">
                {authError}
              </p>
            ) : null}
            {authItem.fields.length === 0 && authError ? (
              <Button
                type="button"
                variant="tertiary"
                onClick={() =>
                  void prepareConnection(authItem.item, authItem.scheme)
                }
              >
                Try again
              </Button>
            ) : null}
            {authItem.fields.map((field) => (
              <Input
                key={field.name}
                label={field.label}
                type={field.type ?? "password"}
                required
                value={authValues[field.name] ?? ""}
                onChange={(event) =>
                  setAuthValues((current) => ({
                    ...current,
                    [field.name]: event.target.value,
                  }))
                }
                autoComplete="off"
                data-test={`${dataTest}-auth-field-${field.name}`}
              />
            ))}
            <div className="flex justify-end gap-2 border-t border-ph-border pt-4">
              <Button
                type="button"
                variant="tertiary"
                onClick={closeAuthForm}
                disabled={authSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={authSubmitting}>
                {authSubmitting ? "Connecting..." : "Connect"}
              </Button>
            </div>
          </form>
        ) : null}
      </Modal>
    </>
  );
}

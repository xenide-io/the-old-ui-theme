"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ArrowLeft, Ellipsis as MoreHorizontal, Plus, Ban as Prohibition, Search, Trash2 as Trash } from 'lucide-react';
import {
  Alert,
  Button,
  DropdownItem,
  DropdownMenu,
  FileUpload,
  Input,
  Modal,
  Select,
  Tooltip,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { BrandSpinner } from "@/components/ui/BrandSpinner";
import type { SuiteSpinnerComponent } from "../lib/injected";
import { SuiteEntityIcon } from "./suite-entity-icon";
import { SuitePaletteLibrary } from "./suite-palette-library";

export interface SuiteDirectoryClient {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  icon_image?: string | null;
  /** ISO timestamp when archived; archived clients are hidden by default. */
  archived_at?: string | null;
  /** The Internal client can never be archived or deleted. */
  is_internal?: boolean;
}

export interface SuiteDirectoryProject {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  clientId?: string | null;
  isArchived?: boolean;
  icon_image?: string | null;
}

export interface SuiteDirectoryFields {
  name: string;
  icon: string;
  color: string;
  iconImageFile?: File | null;
  /** Icon chosen from a hosted library (e.g. Palette); wins over `iconImageFile`. */
  iconImageUrl?: string | null;
  clearIconImage?: boolean;
  /** Archive state; leave undefined to keep the current value. */
  isArchived?: boolean;
}

export interface SuiteDirectoryProjectFields extends SuiteDirectoryFields {
  clientId: string | null;
}

export interface SuiteClientsProjectsDirectoryProps {
  clients: SuiteDirectoryClient[];
  projects: SuiteDirectoryProject[];
  canEdit?: boolean;
  /** Dense embedded browser for settings panels. */
  compact?: boolean;
  loading?: boolean;
  spinner?: SuiteSpinnerComponent;
  error?: string | null;
  onCreateClient?: (
    fields: SuiteDirectoryFields,
  ) => Promise<SuiteDirectoryClient | void>;
  onUpdateClient?: (
    client: SuiteDirectoryClient,
    fields: SuiteDirectoryFields,
  ) => Promise<SuiteDirectoryClient | void>;
  onDeleteClient?: (client: SuiteDirectoryClient) => Promise<void>;
  onCreateProject?: (
    fields: SuiteDirectoryProjectFields,
  ) => Promise<SuiteDirectoryProject | void>;
  onUpdateProject?: (
    project: SuiteDirectoryProject,
    fields: SuiteDirectoryProjectFields,
  ) => Promise<SuiteDirectoryProject | void>;
  onDeleteProject?: (project: SuiteDirectoryProject) => Promise<void>;
  /**
   * Optional hosted icon library (e.g. Palette). When provided, the picker
   * shows a "Browse library" button; the render prop receives `onPick`, which
   * sets the chosen icon URL as the item's custom image.
   */
  renderIconLibrary?: (args: {
    onPick: (icon: { url: string; name?: string }) => void;
  }) => ReactNode;
  dataTest?: string;
}

const DEFAULT_ICON = "";
const DEFAULT_COLOR = "";
/** Shared swatch palette for entity/document icons. */
export const DIRECTORY_COLOURS: Array<[string, string]> = [
  ["#6366f1", "Indigo"],
  ["#0ea5e9", "Sky"],
  ["#10b981", "Green"],
  ["#f59e0b", "Amber"],
  ["#ef4444", "Red"],
  ["#a855f7", "Purple"],
  ["#64748b", "Slate"],
];

function DirectoryIconPicker({
  preview,
  label,
  color,
  onFileChange,
  onClear,
  onBrowse,
}: {
  preview?: string | null;
  label?: string;
  color?: string | null;
  onFileChange: (file: File | null) => void;
  onClear: () => void;
  onBrowse?: () => void;
}) {
  return (
    <div className="space-y-2">
      <span className="mb-1.5 block text-sm font-medium text-ph-ink">Icon</span>
      <div className="rounded-[var(--ph-radius-surface)] border border-ph-border bg-[var(--ph-surface-inset)] p-3">
        <div className="flex items-center gap-3">
          <SuiteEntityIcon
            imageUrl={preview}
            label={label}
            color={color}
            tinted
            className="h-9 w-9 text-base"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ph-ink">
              {preview ? "Custom image" : "No icon yet"}
            </p>
            <p className="text-xs text-ph-mutedtext">
              {preview
                ? "Shown on cards and lists."
                : "Browse the library or upload your own."}
            </p>
          </div>
          {onBrowse ? (
            <button
              type="button"
              onClick={onBrowse}
              className="rounded-md border border-ph-border px-3 py-1.5 text-xs font-medium text-ph-ink hover:border-ph-brand hover:bg-ph-surface"
            >
              Browse library
            </button>
          ) : null}
        </div>
        <div className="mt-3">
          <FileUpload
            accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,.svg"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          />
        </div>
        {preview ? (
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-ph-mutedtext hover:bg-ph-surface hover:text-ph-ink"
            onClick={onClear}
          >
            <Trash className="h-3.5 w-3.5" aria-hidden /> Remove image
          </button>
        ) : null}
      </div>
    </div>
  );
}

function DirectoryIcon({
  item,
  compact = false,
}: {
  item: SuiteDirectoryClient | SuiteDirectoryProject;
  compact?: boolean;
}) {
  return (
    <SuiteEntityIcon
      imageUrl={item.icon_image}
      label={item.name}
      color={item.color}
      tinted
      className={compact ? "h-6 w-6 text-xs" : "h-8 w-8 text-sm"}
      roundedClass="rounded-[var(--ph-radius-control)]"
    />
  );
}

type Editing =
  | { kind: "client"; item: SuiteDirectoryClient }
  | { kind: "project"; item: SuiteDirectoryProject }
  | { kind: "new-client" }
  | { kind: "new-project" }
  | null;

type Confirming = {
  item: SuiteDirectoryClient | SuiteDirectoryProject;
  kind: "client" | "project";
};

export function SuiteClientsProjectsDirectory({
  clients,
  projects,
  canEdit = false,
  compact = false,
  loading = false,
  spinner: LoadingSpinner = BrandSpinner,
  error,
  onCreateClient,
  onUpdateClient,
  onDeleteClient,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  renderIconLibrary,
  dataTest = "suite-clients-projects-directory",
}: SuiteClientsProjectsDirectoryProps) {
  const [query, setQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [editing, setEditing] = useState<Editing>(null);
  const [draft, setDraft] = useState<SuiteDirectoryFields>({
    name: "",
    icon: DEFAULT_ICON,
    color: DEFAULT_COLOR,
  });
  const [draftClientId, setDraftClientId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [draftArchived, setDraftArchived] = useState(false);
  const [confirming, setConfirming] = useState<Confirming | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const clientButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const backToClientsRef = useRef<HTMLButtonElement>(null);
  const mobileFocusTarget = useRef<"detail" | "list" | null>(null);

  const archivedCount = clients.filter((client) => client.archived_at).length;
  const listedClients = useMemo(
    () =>
      showArchived ? clients : clients.filter((client) => !client.archived_at),
    [clients, showArchived],
  );

  useEffect(() => {
    if (
      selectedClientId &&
      listedClients.some((client) => client.id === selectedClientId)
    )
      return;
    setSelectedClientId(listedClients[0]?.id ?? null);
  }, [listedClients, selectedClientId]);

  useEffect(() => {
    const target = mobileFocusTarget.current;
    if (!target) return;
    mobileFocusTarget.current = null;

    if (target === "detail") backToClientsRef.current?.focus();
    else if (selectedClientId)
      clientButtonRefs.current[selectedClientId]?.focus();
  }, [mobileDetail, selectedClientId]);

  const filteredClients = useMemo(() => {
    const value = query.trim().toLowerCase();
    return [...listedClients]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((client) => !value || client.name.toLowerCase().includes(value));
  }, [listedClients, query]);
  const selectedClient =
    clients.find((client) => client.id === selectedClientId) ?? null;
  const selectedProjects = projects
    .filter((project) => project.clientId === selectedClientId)
    .sort((a, b) => a.name.localeCompare(b.name));

  function isMobileDirectoryView() {
    return window.matchMedia?.("(max-width: 1023px)").matches ?? false;
  }

  function selectClient(client: SuiteDirectoryClient) {
    setSelectedClientId(client.id);
    setMobileDetail(true);
    if (isMobileDirectoryView()) mobileFocusTarget.current = "detail";
  }

  function moveClientSelection(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") {
      nextIndex = (index + 1) % filteredClients.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (index - 1 + filteredClients.length) % filteredClients.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = filteredClients.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    const client = filteredClients[nextIndex];
    selectClient(client);
    if (!isMobileDirectoryView()) clientButtonRefs.current[client.id]?.focus();
  }

  function openNew(kind: "client" | "project") {
    setMutationError(null);
    setDraft({
      name: "",
      icon: DEFAULT_ICON,
      color: DEFAULT_COLOR,
      iconImageFile: null,
      iconImageUrl: null,
      clearIconImage: false,
    });
    setPreview(null);
    setDraftArchived(false);
    setDraftClientId(kind === "project" ? selectedClientId : null);
    setEditing({ kind: kind === "client" ? "new-client" : "new-project" });
  }

  function openEdit(
    item: SuiteDirectoryClient | SuiteDirectoryProject,
    kind: "client" | "project",
  ) {
    setMutationError(null);
    setDraft({
      name: item.name,
      icon: item.icon ?? DEFAULT_ICON,
      color: item.color || DEFAULT_COLOR,
      iconImageFile: null,
      iconImageUrl: null,
      clearIconImage: false,
    });
    setPreview(item.icon_image || null);
    setDraftArchived(
      kind === "project" && Boolean((item as SuiteDirectoryProject).isArchived),
    );
    setDraftClientId(
      kind === "project"
        ? ((item as SuiteDirectoryProject).clientId ?? null)
        : null,
    );
    setEditing({ kind, item: item as never });
  }

  function chooseImage(file: File | null) {
    if (!file) return;
    if (file.size > 512 * 1024) {
      setMutationError("Icon must be 512 KB or smaller.");
      return;
    }
    setMutationError(null);
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setDraft((current) => ({
      ...current,
      iconImageFile: file,
      iconImageUrl: null,
      clearIconImage: false,
    }));
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(null);
    setDraft((current) => ({
      ...current,
      iconImageFile: null,
      iconImageUrl: null,
      clearIconImage: true,
    }));
  }

  function pickFromLibrary(icon: { url: string; name?: string }) {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setMutationError(null);
    setPreview(icon.url);
    setDraft((current) => ({
      ...current,
      iconImageFile: null,
      iconImageUrl: icon.url,
      clearIconImage: false,
    }));
    setLibraryOpen(false);
  }

  function closeEditor() {
    if (!saving) setEditing(null);
  }

  async function save() {
    if (!editing || !draft.name.trim() || saving) return;
    setSaving(true);
    setMutationError(null);
    try {
      const fields = { ...draft, name: draft.name.trim() };
      if (editing.kind === "new-client") await onCreateClient?.(fields);
      else if (editing.kind === "new-project")
        await onCreateProject?.({
          ...fields,
          clientId: draftClientId,
          isArchived: draftArchived,
        });
      else if (editing.kind === "client")
        await onUpdateClient?.(editing.item, fields);
      else
        await onUpdateProject?.(editing.item, {
          ...fields,
          clientId: draftClientId,
          isArchived: draftArchived,
        });
      setEditing(null);
    } catch (err) {
      setMutationError(
        err instanceof Error ? err.message : "Failed to save directory item.",
      );
    } finally {
      setSaving(false);
    }
  }

  function remove(
    item: SuiteDirectoryClient | SuiteDirectoryProject,
    kind: "client" | "project",
  ) {
    setConfirming({ item, kind });
  }

  async function toggleArchive(project: SuiteDirectoryProject) {
    if (!onUpdateProject) return;
    try {
      await onUpdateProject(project, {
        name: project.name,
        icon: project.icon ?? DEFAULT_ICON,
        color: project.color || DEFAULT_COLOR,
        clientId: project.clientId ?? null,
        isArchived: !project.isArchived,
      });
    } catch (err) {
      setMutationError(
        err instanceof Error ? err.message : "Failed to update project.",
      );
    }
  }

  async function toggleArchiveClient(client: SuiteDirectoryClient) {
    if (!onUpdateClient) return;
    try {
      await onUpdateClient(client, {
        name: client.name,
        icon: client.icon ?? DEFAULT_ICON,
        color: client.color || DEFAULT_COLOR,
        isArchived: !client.archived_at,
      });
    } catch (err) {
      setMutationError(
        err instanceof Error ? err.message : "Failed to update client.",
      );
    }
  }

  async function confirmRemove() {
    if (!confirming) return;
    const { item, kind } = confirming;
    setConfirming(null);
    try {
      if (kind === "client")
        await onDeleteClient?.(item as SuiteDirectoryClient);
      else await onDeleteProject?.(item as SuiteDirectoryProject);
    } catch (err) {
      setMutationError(
        err instanceof Error ? err.message : "Failed to delete directory item.",
      );
    }
  }

  return (
    <div
      data-test={dataTest}
      data-compact={compact || undefined}
      className="space-y-3"
    >
      {error || mutationError ? (
        <Alert status="danger" live="assertive">
          {error || mutationError}
        </Alert>
      ) : null}
      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="md" label="Loading directory…" />
        </div>
      ) : (
        <div
          className={cn(
            "overflow-hidden rounded-[var(--ph-radius-surface)] border border-ph-border bg-ph-surface lg:grid",
            compact
              ? "lg:min-h-[12rem] lg:grid-cols-[minmax(12rem,15rem)_1fr]"
              : "lg:min-h-[22rem] lg:grid-cols-[minmax(14rem,18rem)_1fr]",
          )}
        >
          <section
            className={cn(
              "border-ph-border lg:border-r",
              mobileDetail ? "hidden lg:block" : "block",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 border-b border-ph-border",
                compact ? "min-h-12 px-2 py-1.5" : "h-14 px-3",
              )}
            >
              <div className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ph-mutedtext"
                  aria-hidden
                />
                <Input
                  hideLabel
                  aria-label="Search clients"
                  placeholder="Search clients..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className={cn(
                    "pl-9",
                    compact &&
                      "h-8 min-h-8 text-sm [@media(pointer:coarse)]:h-11",
                  )}
                />
              </div>
              {canEdit && onCreateClient ? (
                <Button
                  size="sm"
                  variant={compact ? "tertiary" : "primary"}
                  aria-label="New client"
                  className={
                    compact
                      ? "h-8 w-8 min-h-8 shrink-0 px-0 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11"
                      : undefined
                  }
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => openNew("client")}
                >
                  <span className={compact ? "sr-only" : undefined}>
                    New client
                  </span>
                </Button>
              ) : null}
            </div>
            <ul
              role="listbox"
              aria-label="Clients"
              className={cn(
                "overflow-y-auto p-1.5",
                compact ? "max-h-80" : "max-h-[28rem]",
              )}
            >
              {filteredClients.length ? (
                filteredClients.map((client, index) => {
                  const selected = client.id === selectedClientId;
                  const count = projects.filter(
                    (project) => project.clientId === client.id,
                  ).length;
                  return (
                    <li key={client.id} role="none">
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => selectClient(client)}
                        onKeyDown={(event) => moveClientSelection(event, index)}
                        ref={(element) => {
                          clientButtonRefs.current[client.id] = element;
                        }}
                        className={cn(
                          "flex w-full items-center rounded-[var(--ph-radius-control)] text-left",
                          compact
                            ? "min-h-10 gap-2 px-2 py-1.5 [@media(pointer:coarse)]:min-h-11"
                            : "gap-2.5 px-2.5 py-2",
                          selected ? "bg-ph-muted" : "hover:bg-ph-canvas",
                        )}
                      >
                        <DirectoryIcon item={client} compact={compact} />
                        <span
                          className={cn(
                            "min-w-0 flex-1",
                            compact &&
                              "flex items-center justify-between gap-2",
                          )}
                        >
                          <span className="block truncate text-sm font-medium text-ph-ink">
                            {client.name}
                          </span>
                          <span className="shrink-0 text-xs text-ph-mutedtext">
                            {client.archived_at ? "Archived · " : ""}
                            {count}
                            <span className={compact ? "sr-only" : undefined}>
                              {" "}
                              project{count === 1 ? "" : "s"}
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })
              ) : (
                <li className="px-3 py-8 text-center text-sm text-ph-mutedtext">
                  {listedClients.length
                    ? "No matches."
                    : "Add a client to get started."}
                </li>
              )}
            </ul>
            {archivedCount ? (
              <div className="border-t border-ph-border p-1.5">
                <Button
                  size="sm"
                  variant="secondary"
                  className="ph-btn-ghost w-full justify-start text-ph-mutedtext"
                  data-test="directory-toggle-archived"
                  onClick={() => setShowArchived((current) => !current)}
                >
                  {showArchived
                    ? "Hide archived clients"
                    : `Show archived clients (${archivedCount})`}
                </Button>
              </div>
            ) : null}
          </section>
          <section
            className={cn(
              "flex min-w-0 flex-col",
              mobileDetail ? "flex" : "hidden lg:flex",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 border-b border-ph-border",
                compact ? "min-h-12 px-2 py-1.5" : "min-h-14 px-3 py-2",
              )}
            >
              {selectedClient ? (
                <>
                  <button
                    type="button"
                    ref={backToClientsRef}
                    className={cn(
                      "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ph-mutedtext hover:bg-ph-muted lg:hidden",
                      compact &&
                        "[@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11",
                    )}
                    onClick={() => {
                      mobileFocusTarget.current = "list";
                      setMobileDetail(false);
                    }}
                    aria-label="Back to clients"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <DirectoryIcon item={selectedClient} compact={compact} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-ph-ink">
                      {selectedClient.name}
                    </h3>
                    <p
                      className={
                        compact ? "sr-only" : "text-xs text-ph-mutedtext"
                      }
                    >
                      {selectedClient.archived_at ? "Archived · " : ""}
                      {selectedProjects.length} project
                      {selectedProjects.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  {canEdit && (onUpdateClient || onDeleteClient) ? (
                    <div onClick={(event) => event.stopPropagation()}>
                      <DropdownMenu
                        aria-label={`Actions for ${selectedClient.name}`}
                        align="end"
                        trigger={
                          <span
                            className={cn(
                              "inline-flex h-8 w-8 items-center justify-center rounded-md text-ph-mutedtext hover:bg-ph-muted hover:text-ph-ink",
                              compact &&
                                "[@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11",
                            )}
                          >
                            <MoreHorizontal className="h-4 w-4" aria-hidden />
                            <span className="sr-only">Client actions</span>
                          </span>
                        }
                      >
                        <div className="p-1">
                          {onUpdateClient ? (
                            <DropdownItem
                              onClick={() => openEdit(selectedClient, "client")}
                            >
                              Edit client
                            </DropdownItem>
                          ) : null}
                          {onUpdateClient && !selectedClient.is_internal ? (
                            <DropdownItem
                              onClick={() =>
                                void toggleArchiveClient(selectedClient)
                              }
                            >
                              {selectedClient.archived_at
                                ? "Unarchive client"
                                : "Archive client"}
                            </DropdownItem>
                          ) : null}
                          {onDeleteClient ? (
                            <DropdownItem
                              className="text-red-600"
                              onClick={() =>
                                void remove(selectedClient, "client")
                              }
                            >
                              Delete client
                            </DropdownItem>
                          ) : null}
                        </div>
                      </DropdownMenu>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="min-w-0 flex-1 text-sm text-ph-mutedtext">
                  Select a client
                </p>
              )}
              {compact && canEdit && onCreateProject ? (
                <Button
                  size="sm"
                  variant="secondary"
                  className="shrink-0 max-sm:w-8 max-sm:px-0 [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:min-w-11"
                  aria-label="Add project"
                  icon={<Plus className="h-3.5 w-3.5" aria-hidden />}
                  onClick={() => openNew("project")}
                >
                  <span className="hidden sm:inline">Add project</span>
                </Button>
              ) : null}
            </div>
            {!compact && canEdit && onCreateProject ? (
              <div className="border-b border-ph-border p-3">
                <Button
                  variant="primary"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => openNew("project")}
                >
                  Add project
                </Button>
              </div>
            ) : null}
            <ul className="flex-1 p-2">
              {selectedClient && selectedProjects.length ? (
                selectedProjects.map((project) => (
                  <li key={project.id}>
                    <div
                      className={cn(
                        "flex items-center rounded-[var(--ph-radius-control)] hover:bg-ph-canvas",
                        compact ? "gap-2 px-1" : "gap-3 px-2 py-1",
                      )}
                      onClick={() => openEdit(project, "project")}
                    >
                      <button
                        type="button"
                        className={cn(
                          "flex min-w-0 flex-1 items-center rounded-[var(--ph-radius-control)] text-left focus-visible:outline-hidden focus-visible:shadow-[var(--ph-focus-halo)]",
                          compact
                            ? "min-h-10 gap-2 py-1 [@media(pointer:coarse)]:min-h-11"
                            : "gap-3 py-1",
                        )}
                        onClick={() => openEdit(project, "project")}
                      >
                        <DirectoryIcon item={project} compact={compact} />
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block truncate text-sm font-medium",
                              project.isArchived
                                ? "text-ph-mutedtext line-through"
                                : "text-ph-ink",
                            )}
                          >
                            {project.name}
                          </span>
                          <span
                            className={cn(
                              "text-xs text-ph-mutedtext",
                              compact && !project.isArchived && "sr-only",
                            )}
                          >
                            {project.isArchived ? "Archived" : "Active"}
                          </span>
                        </span>
                      </button>
                      {canEdit && (onUpdateProject || onDeleteProject) ? (
                        <div onClick={(event) => event.stopPropagation()}>
                          <DropdownMenu
                            aria-label={`Actions for ${project.name}`}
                            align="end"
                            trigger={
                              <span
                                className={cn(
                                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ph-mutedtext hover:bg-ph-muted hover:text-ph-ink",
                                  compact &&
                                    "[@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11",
                                )}
                              >
                                <MoreHorizontal
                                  className="h-4 w-4"
                                  aria-hidden
                                />
                                <span className="sr-only">Project actions</span>
                              </span>
                            }
                          >
                            <div className="p-1">
                              {onUpdateProject ? (
                                <>
                                  <DropdownItem
                                    onClick={() => openEdit(project, "project")}
                                  >
                                    Edit project
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => void toggleArchive(project)}
                                  >
                                    {project.isArchived
                                      ? "Unarchive project"
                                      : "Archive project"}
                                  </DropdownItem>
                                </>
                              ) : null}
                              {onDeleteProject ? (
                                <DropdownItem
                                  className="text-red-600"
                                  onClick={() =>
                                    void remove(project, "project")
                                  }
                                >
                                  Delete project
                                </DropdownItem>
                              ) : null}
                            </div>
                          </DropdownMenu>
                        </div>
                      ) : null}
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-3 py-8 text-center text-sm text-ph-mutedtext">
                  {selectedClient
                    ? "No projects yet."
                    : "Select a client to see its projects."}
                </li>
              )}
            </ul>
          </section>
        </div>
      )}
      <Modal
        open={editing !== null}
        onClose={closeEditor}
        title={
          editing?.kind.includes("project")
            ? editing.kind === "new-project"
              ? "New project"
              : "Edit project"
            : editing?.kind === "new-client"
              ? "New client"
              : "Edit client"
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="tertiary" onClick={closeEditor} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => void save()}
              disabled={saving || !draft.name.trim()}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Input
            label="Name"
            autoFocus
            value={draft.name}
            onChange={(event) =>
              setDraft({ ...draft, name: event.target.value })
            }
          />
          <DirectoryIconPicker
            preview={preview}
            label={draft.name}
            color={
              draft.color ||
              (!preview && editing?.kind.includes("project")
                ? clients.find((client) => client.id === draftClientId)?.color
                : undefined)
            }
            onFileChange={chooseImage}
            onClear={clearImage}
            onBrowse={() => setLibraryOpen(true)}
          />
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ph-ink">
              Colour
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip content="Match the client colour" side="bottom">
              <button
                type="button"
                aria-label="Automatic colour"
                aria-pressed={!draft.color}
                onClick={() => setDraft({ ...draft, color: "" })}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border border-ph-border bg-ph-surface text-ph-mutedtext ring-offset-2",
                  !draft.color && "ring-2 ring-ph-brand",
                )}
              >
                <Prohibition className="h-4 w-4" aria-hidden />
              </button>
              </Tooltip>
              {DIRECTORY_COLOURS.map(([color, name]) => (
                <Tooltip key={color} content={name} side="bottom">
                  <button
                    type="button"
                    aria-label={name}
                    aria-pressed={draft.color === color}
                    onClick={() => setDraft({ ...draft, color })}
                    className={cn(
                      "h-8 w-8 rounded-full ring-offset-2",
                      draft.color === color && "ring-2 ring-ph-brand",
                    )}
                    style={{ backgroundColor: color }}
                  />
                </Tooltip>
              ))}
              <Tooltip content="Choose a custom colour" side="bottom">
              <label
                className={cn(
                  "relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ring-1 ring-ph-border ring-offset-2",
                  !DIRECTORY_COLOURS.some(([color]) => color === draft.color) &&
                    "ring-2 ring-ph-brand",
                )}
                style={{
                  background:
                    "conic-gradient(from 0deg, #ef4444, #f59e0b, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
                }}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ph-surface">
                  {DIRECTORY_COLOURS.some(([color]) => color === draft.color) ? (
                    <Plus className="h-3 w-3 text-ph-ink" aria-hidden />
                  ) : (
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: draft.color }}
                    />
                  )}
                </span>
                <input
                  type="color"
                  aria-label="Custom colour"
                  value={draft.color || "#6366f1"}
                  onChange={(event) =>
                    setDraft({ ...draft, color: event.target.value })
                  }
                  className="sr-only"
                />
              </label>
              </Tooltip>
            </div>
          </div>
          {editing?.kind.includes("project") ? (
            <Select
              label="Client"
              value={draftClientId ?? ""}
              onChange={(event) => setDraftClientId(event.target.value || null)}
            >
              <option value="">No client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Select>
          ) : null}
          {editing?.kind.includes("project") ? (
            <label className="flex items-center gap-2 text-sm text-ph-ink">
              <input
                type="checkbox"
                checked={draftArchived}
                onChange={(event) => setDraftArchived(event.target.checked)}
              />
              Archived
            </label>
          ) : null}
        </div>
      </Modal>
      {libraryOpen ? (
        <Modal open onClose={() => setLibraryOpen(false)} title="Icon library">
          {renderIconLibrary ? (
            renderIconLibrary({ onPick: pickFromLibrary })
          ) : (
            <SuitePaletteLibrary onPick={pickFromLibrary} />
          )}
        </Modal>
      ) : null}
      <Modal
        open={confirming !== null}
        onClose={() => setConfirming(null)}
        title="Confirm deletion"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="tertiary" onClick={() => setConfirming(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void confirmRemove()}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-ph-ink">
          Delete {confirming?.item.name}? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

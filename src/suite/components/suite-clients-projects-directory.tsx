"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  MediaImagePlus as ImagePlus,
  MoreHoriz as MoreHorizontal,
  Plus,
  Search,
  Trash,
} from "iconoir-react";
import {
  Alert,
  Button,
  DropdownItem,
  DropdownMenu,
  FileUpload,
  Input,
  Modal,
  Select,
} from "@/components/ui";
import { cn } from "@/lib/cn";

export interface SuiteDirectoryClient {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  icon_image?: string | null;
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
  clearIconImage?: boolean;
}

export interface SuiteDirectoryProjectFields extends SuiteDirectoryFields {
  clientId: string | null;
  isArchived?: boolean;
}

export interface SuiteClientsProjectsDirectoryProps {
  clients: SuiteDirectoryClient[];
  projects: SuiteDirectoryProject[];
  canEdit?: boolean;
  loading?: boolean;
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
  dataTest?: string;
}

const DEFAULT_ICON = "castle-emblem";
const DEFAULT_COLOR = "#6366f1";

const DIRECTORY_ICON_OPTIONS = [
  ["arena", "Arena"],
  ["bridge", "Bridge"],
  ["capitol", "Capitol"],
  ["castle-emblem", "Castle"],
  ["castle-flag", "Castle flag"],
  ["lighthouse", "Lighthouse"],
  ["tower", "Tower"],
  ["wooden-sign", "Sign"],
  ["anvil", "Anvil"],
  ["book", "Book"],
  ["chessboard", "Chessboard"],
  ["cog", "Settings"],
  ["hammer", "Build"],
  ["light-bulb", "Idea"],
  ["microphone", "Communication"],
  ["quill-ink", "Writing"],
  ["scroll-unfurled", "Notes"],
  ["hourglass", "Planning"],
  ["wrench", "Tools"],
  ["archer", "Archer"],
  ["archery-target", "Target"],
  ["axe", "Axe"],
  ["campfire", "Campfire"],
  ["compass", "Compass"],
  ["crossed-swords", "Battle"],
  ["knight-helmet", "Knight"],
  ["mountains", "Mountains"],
  ["shield", "Shield"],
  ["ship-emblem", "Voyage"],
  ["sword", "Sword"],
  ["trophy", "Trophy"],
  ["apple", "Apple"],
  ["butterfly", "Butterfly"],
  ["clover", "Clover"],
  ["dragon", "Dragon"],
  ["fire", "Fire"],
  ["flower", "Flower"],
  ["flowers", "Flowers"],
  ["grass", "Grass"],
  ["leaf", "Leaf"],
  ["pine-tree", "Pine tree"],
  ["sun", "Sun"],
  ["water-drop", "Water"],
  ["aura", "Aura"],
  ["crystal-ball", "Crystal ball"],
  ["diamond", "Diamond"],
  ["explosion", "Explosion"],
  ["fire-symbol", "Fire symbol"],
  ["gem", "Gem"],
  ["lightning-trio", "Lightning"],
  ["potion", "Potion"],
  ["rune-stone", "Rune stone"],
  ["skull", "Skull"],
  ["tentacle", "Tentacle"],
  ["wolf-head", "Wolf"],
  ["anchor", "Anchor"],
  ["beer", "Beer"],
  ["carrot", "Carrot"],
  ["cat", "Cat"],
  ["crown", "Crown"],
  ["gold-bar", "Gold bar"],
  ["helmet", "Helmet"],
  ["key", "Key"],
  ["three-keys", "Keys"],
] as const;

type DirectoryIconOption = (typeof DIRECTORY_ICON_OPTIONS)[number][0];

function isDirectoryIcon(value: string): value is DirectoryIconOption {
  return DIRECTORY_ICON_OPTIONS.some(([name]) => name === value);
}

function DirectoryIconPicker({
  value,
  preview,
  onFileChange,
  onClear,
  onChange,
}: {
  value: string;
  preview?: string | null;
  onFileChange: (file: File | null) => void;
  onClear: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="mb-1.5 block text-sm font-medium text-ph-ink">Icon</span>
      <div
        role="radiogroup"
        aria-label="Icon"
        className="grid grid-cols-6 gap-1.5 rounded-lg border border-ph-border p-1.5 sm:grid-cols-8"
      >
        {DIRECTORY_ICON_OPTIONS.map(([name, label]) => {
          const selected = value === name;
          return (
            <button
              key={name}
              type="button"
              role="radio"
              aria-label={label}
              aria-checked={selected}
              title={label}
              onClick={() => onChange(name)}
              className={cn(
                "flex h-9 items-center justify-center rounded-md text-ph-mutedtext hover:bg-ph-muted hover:text-ph-ink",
                selected &&
                  "bg-ph-muted text-ph-ink ring-2 ring-ph-brand ring-inset",
              )}
            >
              <i
                className={cn("ra", `ra-${name}`, "text-base leading-none")}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
      <div className="rounded-lg border border-ph-border bg-ph-muted p-2">
        <div className="flex items-center gap-2 text-sm font-medium text-ph-ink">
          <ImagePlus className="h-4 w-4" aria-hidden /> Custom image
        </div>
        <p className="mt-1 text-xs text-ph-mutedtext">
          PNG, JPG, GIF, WebP, or SVG — max 512 KB.
        </p>
        <FileUpload
          accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,.svg"
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
        {preview ? (
          <div className="mt-2 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt=""
              className="h-8 w-8 rounded object-cover"
            />
            <button
              type="button"
              className="text-xs text-ph-mutedtext hover:text-ph-ink"
              onClick={onClear}
            >
              <Trash className="mr-1 inline h-3.5 w-3.5" aria-hidden /> Remove
              custom image
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DirectoryIcon({
  item,
}: {
  item: SuiteDirectoryClient | SuiteDirectoryProject;
}) {
  const icon =
    item.icon && isDirectoryIcon(item.icon) ? item.icon : DEFAULT_ICON;
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
      style={{ backgroundColor: item.color || "var(--ph-brand)" }}
    >
      {item.icon_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.icon_image}
          alt=""
          className="h-full w-full rounded-lg object-cover"
        />
      ) : (
        <i
          className={cn("ra", `ra-${icon}`, "text-base leading-none")}
          aria-hidden
        />
      )}
    </span>
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
  loading = false,
  error,
  onCreateClient,
  onUpdateClient,
  onDeleteClient,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
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
  const [draftArchived, setDraftArchived] = useState(false);
  const [confirming, setConfirming] = useState<Confirming | null>(null);
  const [saving, setSaving] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  useEffect(() => {
    if (
      selectedClientId &&
      clients.some((client) => client.id === selectedClientId)
    )
      return;
    setSelectedClientId(clients[0]?.id ?? null);
  }, [clients, selectedClientId]);

  const filteredClients = useMemo(() => {
    const value = query.trim().toLowerCase();
    return [...clients]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((client) => !value || client.name.toLowerCase().includes(value));
  }, [clients, query]);
  const selectedClient =
    clients.find((client) => client.id === selectedClientId) ?? null;
  const selectedProjects = projects
    .filter((project) => project.clientId === selectedClientId)
    .sort((a, b) => a.name.localeCompare(b.name));

  function openNew(kind: "client" | "project") {
    setMutationError(null);
    setDraft({
      name: "",
      icon: DEFAULT_ICON,
      color: DEFAULT_COLOR,
      iconImageFile: null,
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
      icon: item.icon && isDirectoryIcon(item.icon) ? item.icon : DEFAULT_ICON,
      color: item.color || DEFAULT_COLOR,
      iconImageFile: null,
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
      clearIconImage: true,
    }));
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
        icon:
          project.icon && isDirectoryIcon(project.icon)
            ? project.icon
            : DEFAULT_ICON,
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
    <div data-test={dataTest} className="space-y-3">
      {error || mutationError ? (
        <Alert status="danger">{error || mutationError}</Alert>
      ) : null}
      {loading ? (
        <p className="text-sm text-ph-mutedtext">Loading directory...</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-ph-border bg-ph-surface lg:grid lg:min-h-[22rem] lg:grid-cols-[minmax(14rem,18rem)_1fr]">
          <section
            className={cn(
              "border-ph-border lg:border-r",
              mobileDetail ? "hidden lg:block" : "block",
            )}
          >
            <div className="flex h-14 items-center gap-2 border-b border-ph-border px-3">
              <div className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ph-mutedtext"
                  aria-hidden
                />
                <Input
                  hideLabel
                  placeholder="Search clients..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="pl-9"
                />
              </div>
              {canEdit && onCreateClient ? (
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => openNew("client")}
                >
                  New client
                </Button>
              ) : null}
            </div>
            <ul
              role="listbox"
              aria-label="Clients"
              className="max-h-[28rem] overflow-y-auto p-1.5"
            >
              {filteredClients.length ? (
                filteredClients.map((client) => {
                  const selected = client.id === selectedClientId;
                  const count = projects.filter(
                    (project) => project.clientId === client.id,
                  ).length;
                  return (
                    <li key={client.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          setSelectedClientId(client.id);
                          setMobileDetail(true);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left",
                          selected ? "bg-ph-muted" : "hover:bg-ph-canvas",
                        )}
                      >
                        <DirectoryIcon item={client} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ph-ink">
                            {client.name}
                          </span>
                          <span className="text-xs text-ph-mutedtext">
                            {count} project{count === 1 ? "" : "s"}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })
              ) : (
                <li className="px-3 py-8 text-center text-sm text-ph-mutedtext">
                  {clients.length
                    ? "No matches."
                    : "Add a client to get started."}
                </li>
              )}
            </ul>
          </section>
          <section
            className={cn(
              "flex min-w-0 flex-col",
              mobileDetail ? "flex" : "hidden lg:flex",
            )}
          >
            <div className="flex min-h-14 items-center gap-2 border-b border-ph-border px-3 py-2">
              {selectedClient ? (
                <>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ph-mutedtext hover:bg-ph-muted lg:hidden"
                    onClick={() => setMobileDetail(false)}
                    aria-label="Back to clients"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <DirectoryIcon item={selectedClient} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-ph-ink">
                      {selectedClient.name}
                    </h3>
                    <p className="text-xs text-ph-mutedtext">
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
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ph-mutedtext hover:bg-ph-muted hover:text-ph-ink">
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
                <p className="text-sm text-ph-mutedtext">Select a client</p>
              )}
            </div>
            {canEdit && onCreateProject ? (
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
                      className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-ph-canvas"
                      onClick={() => openEdit(project, "project")}
                    >
                      <button
                        type="button"
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand"
                        onClick={() => openEdit(project, "project")}
                      >
                        <DirectoryIcon item={project} />
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
                          <span className="text-xs text-ph-mutedtext">
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
                              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ph-mutedtext hover:bg-ph-muted hover:text-ph-ink">
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
            value={isDirectoryIcon(draft.icon) ? draft.icon : DEFAULT_ICON}
            preview={preview}
            onFileChange={chooseImage}
            onClear={clearImage}
            onChange={(icon) => {
              if (preview) clearImage();
              setDraft((current) => ({ ...current, icon }));
            }}
          />
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ph-ink">
              Colour
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "#6366f1",
                "#0ea5e9",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#a855f7",
                "#64748b",
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Colour ${color}`}
                  aria-pressed={draft.color === color}
                  onClick={() => setDraft({ ...draft, color })}
                  className={cn(
                    "h-8 w-8 rounded-full ring-offset-2",
                    draft.color === color && "ring-2 ring-ph-brand",
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
              <Input
                hideLabel
                label="Custom colour"
                type="color"
                value={draft.color}
                onChange={(event) =>
                  setDraft({ ...draft, color: event.target.value })
                }
                className="h-8 w-8 p-0"
              />
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

"use client";

import { useState, type ReactNode } from "react";
import {
  Calendar,
  Clock,
  Coins,
  Crown,
  EditPencil,
  Group,
  Lock,
  ShieldCheck,
  Suitcase,
  User,
  ViewGrid,
} from "iconoir-react";

import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Modal, ModalClose } from "@/components/ui/Modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import {
  Sheet,
  SheetMultiSelectCell,
  SheetNumberCell,
  SheetPill,
  SheetSelectCell,
  type SheetColumn,
  type SheetMultiOption,
  type SheetSelectOption,
} from "@/components/ui/Sheet";
import { cn } from "@/lib/cn";
import { SuiteAppIcon } from "../icons";
import { SuitePerson } from "./suite-person-avatar";

export type SuiteTeamApp = "turtletime" | "tides" | "kraken" | "shelly";
export type SuiteTeamRole = "owner" | "admin" | "editor" | "member";

/** One row of `GET /api/team/workspaces/<id>/`; the optional fields are admin-only. */
export interface SuiteTeamMember {
  id: string;
  user: { id: string; name: string; email: string; image: string | null };
  role: SuiteTeamRole;
  is_owner: boolean;
  apps: Record<SuiteTeamApp, boolean>;
  client_access_mode?: "all" | "restricted";
  client_ids?: string[];
  project_ids?: string[];
  hourly_rate?: number | null;
  monthly_rate?: number | null;
  monthly_hours_basis?: number | null;
  hours_per_day?: number;
  weekdays?: number[];
  client_rates?: Record<string, number | null>;
}

export interface SuiteTeam {
  workspace: { id: string; name: string };
  can_manage: boolean;
  members: SuiteTeamMember[];
  currency?: string;
  clients?: Array<{
    id: string;
    name: string;
    color: string | null;
    is_internal?: boolean;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    color: string | null;
    client_id: string | null;
  }>;
}

/** Body of `PATCH /api/team/workspaces/<id>/members/<member_id>/`. */
export interface SuiteTeamPatch {
  role?: Exclude<SuiteTeamRole, "owner">;
  apps?: Partial<Record<SuiteTeamApp, boolean>>;
  access?: {
    mode: "all" | "restricted";
    client_ids?: string[];
    project_ids?: string[];
  };
  hourly_rate?: number | null;
  monthly_rate?: number | null;
  monthly_hours_basis?: number;
  hours_per_day?: number;
  weekdays?: number[];
  client_rate?: { client_id: string; hourly_rate: number | null };
}

export const SUITE_TEAM_APPS: Array<{ key: SuiteTeamApp; label: string }> = [
  { key: "turtletime", label: "TurtleTime" },
  { key: "tides", label: "Tides" },
  { key: "kraken", label: "Kraken" },
  { key: "shelly", label: "Shelly" },
];

const ICON = "h-4 w-4";
const ROLES: Record<SuiteTeamRole, SheetSelectOption> = {
  owner: {
    value: "owner",
    label: "Owner",
    icon: <Crown className={cn(ICON, "text-ph-warning")} />,
  },
  admin: {
    value: "admin",
    label: "Admin",
    icon: <ShieldCheck className={cn(ICON, "text-ph-brand")} />,
    description: "Manages the team, access and rates",
  },
  editor: {
    value: "editor",
    label: "Editor",
    icon: <EditPencil className={cn(ICON, "text-ph-info")} />,
    description: "Creates and edits shared work",
  },
  member: {
    value: "member",
    label: "Member",
    icon: <User className={cn(ICON, "text-ph-mutedtext")} />,
    description: "Works on what they can access",
  },
};
const ROLE_OPTIONS = [ROLES.member, ROLES.editor, ROLES.admin];
const APP_OPTIONS: SheetMultiOption[] = SUITE_TEAM_APPS.map((app) => ({
  value: app.key,
  label: app.label,
  icon: <SuiteAppIcon app={app.key} size={16} />,
}));
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_OPTIONS: SheetMultiOption[] = DAYS.map((label, value) => ({
  value: String(value),
  label,
}));
const ALL = "__all__";

const name = (member: SuiteTeamMember) => member.user.name || member.user.email;
const isAdmin = (member: SuiteTeamMember) =>
  member.is_owner || member.role === "admin";
const enabledApps = (member: SuiteTeamMember) =>
  SUITE_TEAM_APPS.filter((app) => member.apps[app.key]);

/** "Mon–Fri" for a run of days, otherwise "Mon, Wed, Fri". */
export function weekdaySummary(days: number[]): string {
  const sorted = [...days].sort((a, b) => a - b);
  if (!sorted.length) return "No days";
  const run = sorted.every((day, i) => i === 0 || day === sorted[i - 1] + 1);
  if (run && sorted.length > 2)
    return `${DAYS[sorted[0]]}–${DAYS[sorted[sorted.length - 1]]}`;
  return sorted.map((day) => DAYS[day]).join(", ");
}

function RoleLabel({ member }: { member: SuiteTeamMember }) {
  const role = ROLES[member.is_owner ? "owner" : member.role];
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-ph-ink">
      <span aria-hidden className="inline-flex">
        {role.icon}
      </span>
      {role.label}
    </span>
  );
}

function AppIcons({ member }: { member: SuiteTeamMember }) {
  return (
    <span
      className="flex items-center gap-1"
      aria-label={`Apps: ${enabledApps(member)
        .map((a) => a.label)
        .join(", ")}`}
    >
      {enabledApps(member).map((app) => (
        <span key={app.key} title={app.label} className="inline-flex">
          <SuiteAppIcon app={app.key} size={20} />
        </span>
      ))}
    </span>
  );
}

export interface SuiteTeamListProps {
  team: SuiteTeam | undefined;
  loading?: boolean;
  /** Trailing controls for one member, e.g. remove. */
  rowActions?: (member: SuiteTeamMember) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
}

/** Everyone in the workspace as compact divider rows: avatar, role and apps. */
export function SuiteTeamList({
  team,
  loading,
  rowActions,
  emptyState = "No one on this team yet.",
  className,
}: SuiteTeamListProps) {
  if (loading && !team) {
    return <p className="py-6 text-sm text-ph-mutedtext">Loading team…</p>;
  }
  const members = team?.members ?? [];
  if (!members.length)
    return <p className="py-6 text-sm text-ph-mutedtext">{emptyState}</p>;
  return (
    <ul
      className={cn("divide-y divide-ph-border", className)}
      data-test="suite-team-list"
    >
      {members.map((member) => (
        <li
          key={member.id}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5"
          data-test={`suite-team-member-${member.id}`}
        >
          <SuitePerson
            name={member.user.name}
            email={member.user.email}
            image={member.user.image}
            detail={member.user.email}
            className="min-w-[14rem] flex-1"
          />
          <span className="w-24 shrink-0">
            <RoleLabel member={member} />
          </span>
          <AppIcons member={member} />
          {rowActions ? (
            <span className="ml-auto flex shrink-0 items-center gap-1">
              {rowActions(member)}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function accessOptions(team: SuiteTeam): SheetMultiOption[] {
  const options: SheetMultiOption[] = [
    {
      value: ALL,
      label: "All clients and projects",
      group: "Scope",
      icon: <ViewGrid className={ICON} />,
    },
  ];
  for (const client of team.clients ?? []) {
    if (client.is_internal) continue;
    options.push({
      value: `c:${client.id}`,
      label: client.name,
      group: "Clients and projects",
      color: client.color,
      impliedBy: [ALL],
    });
    for (const project of team.projects ?? []) {
      if (project.client_id !== client.id) continue;
      options.push({
        value: `p:${project.id}`,
        label: project.name,
        group: "Clients and projects",
        color: project.color,
        nested: true,
        impliedBy: [ALL, `c:${client.id}`],
      });
    }
  }
  return options;
}

function accessValues(member: SuiteTeamMember): string[] {
  if (member.client_access_mode !== "restricted") return [ALL];
  return [
    ...(member.client_ids ?? []).map((id) => `c:${id}`),
    ...(member.project_ids ?? []).map((id) => `p:${id}`),
  ];
}

function ClientRatesCell({
  member,
  team,
  onCommit,
}: {
  member: SuiteTeamMember;
  team: SuiteTeam;
  onCommit: (clientId: string, rate: number | null) => Promise<unknown>;
}) {
  const rates = member.client_rates ?? {};
  const overrides = Object.values(rates).filter((rate) => rate != null).length;
  const clients = (team.clients ?? []).filter((client) => !client.is_internal);
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        aria-label={`Client rates for ${name(member)}`}
        className="flex h-8 w-full items-center gap-1.5 rounded border border-transparent px-1.5 text-left hover:border-ph-border focus:border-ph-brand focus:outline-none"
      >
        {overrides ? (
          <SheetPill
            option={{
              label: `${overrides} client rate${overrides === 1 ? "" : "s"}`,
              icon: <Suitcase className={ICON} />,
            }}
          />
        ) : (
          <span className="text-ph-subtle">Default rate</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="max-h-80 w-80 overflow-y-auto p-2">
        <p className="px-1 pb-2 text-xs text-ph-mutedtext">
          Hourly rate per client for {name(member)}. Leave blank to use{" "}
          {member.hourly_rate != null
            ? `${member.hourly_rate}/h`
            : "their default"}
          .
        </p>
        {clients.length ? (
          <div className="divide-y divide-ph-border">
            {clients.map((client) => (
              <label key={client.id} className="flex items-center gap-2 py-1">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full bg-ph-subtle"
                  style={
                    client.color ? { background: client.color } : undefined
                  }
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate text-sm">
                  {client.name}
                </span>
                <span className="w-24">
                  <SheetNumberCell
                    column={`client-rate-${member.id}`}
                    nullable
                    label={`${client.name} rate for ${name(member)}`}
                    placeholder={
                      member.hourly_rate != null
                        ? String(member.hourly_rate)
                        : "—"
                    }
                    value={rates[client.id] ?? null}
                    onCommit={(value) =>
                      onCommit(client.id, value).then(() => undefined)
                    }
                  />
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="px-1 py-2 text-sm text-ph-subtle">No clients yet.</p>
        )}
      </PopoverContent>
    </Popover>
  );
}

export interface SuiteTeamSheetProps {
  open: boolean;
  onClose: () => void;
  team: SuiteTeam | undefined;
  loading?: boolean;
  loadError?: string | null;
  /** Saves one change; throw to mark the cell and show the message. */
  onPatch: (member: SuiteTeamMember, patch: SuiteTeamPatch) => Promise<unknown>;
  /** App-specific columns placed after Role, e.g. organisation role or AI credits. */
  extraColumns?: SheetColumn<SuiteTeamMember>[];
  /** Controls beside the title, e.g. a workspace picker. */
  toolbar?: ReactNode;
}

/**
 * Team management: one large sheet for the whole workspace. Admins edit role, apps,
 * client and project access, rates and capacity in place; everyone else sees who is on
 * the team and which apps they use.
 */
export function SuiteTeamSheet({
  open,
  onClose,
  team,
  loading,
  loadError,
  onPatch,
  extraColumns = [],
  toolbar,
}: SuiteTeamSheetProps) {
  const [error, setError] = useState<string | null>(null);
  const manage = Boolean(team?.can_manage);
  const currency = team?.currency ?? "";
  const label = (member: SuiteTeamMember, what: string) =>
    `${what} for ${name(member)}`;
  const save = async (member: SuiteTeamMember, patch: SuiteTeamPatch) => {
    setError(null);
    try {
      await onPatch(member, patch);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save that change.",
      );
      throw err;
    }
  };

  const columns: SheetColumn<SuiteTeamMember>[] = [
    {
      key: "member",
      header: "Member",
      icon: <Group />,
      pinned: true,
      width: 280,
      cell: (member) => (
        <span
          className="flex items-center gap-2 py-1"
          data-test={`team-sheet-row-${member.id}`}
        >
          <SuitePerson
            name={member.user.name}
            email={member.user.email}
            image={member.user.image}
            detail={member.user.email}
            className="min-w-0 flex-1"
          />
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      icon: <ShieldCheck />,
      width: 150,
      cell: (member) =>
        manage && !member.is_owner ? (
          <SheetSelectCell
            label={label(member, "Role")}
            value={member.role}
            options={ROLE_OPTIONS}
            onCommit={(role) =>
              save(member, { role: role as SuiteTeamPatch["role"] })
            }
          />
        ) : (
          <span className="px-1.5">
            <RoleLabel member={member} />
          </span>
        ),
    },
    ...extraColumns,
    {
      key: "apps",
      header: "Apps",
      icon: <ViewGrid />,
      width: 280,
      cell: (member) =>
        manage && !member.is_owner ? (
          <SheetMultiSelectCell
            label={label(member, "App access")}
            values={enabledApps(member).map((app) => app.key)}
            options={APP_OPTIONS}
            pills
            maxPills={2}
            emptyLabel="No apps"
            onCommit={(values) => {
              if (!values.length) {
                setError("Each member needs at least one app.");
                throw new Error("Each member needs at least one app.");
              }
              return save(member, {
                apps: Object.fromEntries(
                  SUITE_TEAM_APPS.map((app) => [
                    app.key,
                    values.includes(app.key),
                  ]),
                ),
              });
            }}
          />
        ) : (
          <span className="flex items-center gap-1 overflow-hidden px-1.5">
            {APP_OPTIONS.filter((o) => member.apps[o.value as SuiteTeamApp])
              .slice(0, 2)
              .map((option) => (
                <SheetPill key={option.value} option={option} />
              ))}
            {enabledApps(member).length > 2 ? (
              <span className="text-xs text-ph-mutedtext">
                +{enabledApps(member).length - 2}
              </span>
            ) : null}
          </span>
        ),
    },
  ];

  if (manage && team) {
    const options = accessOptions(team);
    const rate = (
      key: "hourly_rate" | "monthly_rate",
      header: string,
    ): SheetColumn<SuiteTeamMember> => ({
      key,
      header: currency ? `${header} (${currency})` : header,
      icon: <Coins />,
      width: 140,
      align: "right",
      cell: (member) => (
        <SheetNumberCell
          column={key}
          nullable
          label={label(member, header)}
          placeholder="—"
          value={member[key] ?? null}
          onCommit={(value) => save(member, { [key]: value })}
        />
      ),
    });
    columns.push(
      {
        key: "access",
        header: "Clients and projects",
        icon: <Suitcase />,
        width: 320,
        cell: (member) =>
          isAdmin(member) ? (
            <span className="flex items-center gap-1.5 px-1.5 text-ph-mutedtext">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Everything ({member.is_owner ? "owner" : "admin"})
            </span>
          ) : (
            <SheetMultiSelectCell
              label={label(member, "Client and project access")}
              values={accessValues(member)}
              options={options}
              pills
              maxPills={2}
              emptyLabel="Internal only"
              onCommit={(values) => {
                if (values.includes(ALL))
                  return save(member, { access: { mode: "all" } });
                const client_ids = values
                  .filter((v) => v.startsWith("c:"))
                  .map((v) => v.slice(2));
                const project_ids = values
                  .filter((v) => v.startsWith("p:"))
                  .map((v) => v.slice(2));
                if (!client_ids.length && !project_ids.length) {
                  setError(
                    "Choose at least one client or project, or all clients.",
                  );
                  throw new Error("Choose at least one client or project.");
                }
                return save(member, {
                  access: { mode: "restricted", client_ids, project_ids },
                });
              }}
            />
          ),
      },
      rate("hourly_rate", "Hourly"),
      rate("monthly_rate", "Monthly"),
      {
        key: "client_rates",
        header: "Client rates",
        icon: <Coins />,
        width: 170,
        cell: (member) => (
          <ClientRatesCell
            member={member}
            team={team}
            onCommit={(client_id, hourly_rate) =>
              save(member, { client_rate: { client_id, hourly_rate } })
            }
          />
        ),
      },
      {
        key: "hours_per_day",
        header: "Hours / day",
        icon: <Clock />,
        width: 130,
        align: "right",
        cell: (member) => (
          <SheetNumberCell
            column="hours_per_day"
            max={24}
            label={label(member, "Hours per day")}
            value={member.hours_per_day ?? 8}
            onCommit={(value) => save(member, { hours_per_day: value ?? 0 })}
          />
        ),
      },
      {
        key: "weekdays",
        header: "Working days",
        icon: <Calendar />,
        width: 170,
        cell: (member) => {
          const days = member.weekdays ?? [0, 1, 2, 3, 4];
          return (
            <SheetMultiSelectCell
              label={label(member, "Working days")}
              values={days.map(String)}
              options={DAY_OPTIONS}
              summary={<span className="truncate">{weekdaySummary(days)}</span>}
              onCommit={(values) => {
                if (!values.length) {
                  setError("Choose at least one working day.");
                  throw new Error("Choose at least one working day.");
                }
                return save(member, { weekdays: values.map(Number).sort() });
              }}
            />
          );
        },
      },
      {
        key: "capacity",
        header: "Capacity",
        width: 110,
        align: "right",
        cell: (member) => (
          <span className="px-1.5 text-ph-mutedtext">
            {Number(
              (
                (member.hours_per_day ?? 8) *
                (member.weekdays ?? [0, 1, 2, 3, 4]).length
              ).toFixed(1),
            )}
            h / wk
          </span>
        ),
      },
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="full"
      customLayout
      aria-label="Team management"
      dataTest="team-sheet-modal"
      className="!flex !h-[calc(100dvh-4rem)] !max-h-[calc(100dvh-4rem)] !w-[min(110rem,calc(100vw-2rem))] !max-w-none flex-col gap-4 !overflow-hidden !p-5 sm:!p-6"
    >
      <header className="flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2
              className="text-xl font-semibold text-ph-ink"
              data-test="team-sheet-title"
            >
              Team management
            </h2>
            {team ? (
              <Badge size="sm" variant="neutral">
                {team.members.length}{" "}
                {team.members.length === 1 ? "person" : "people"}
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 max-w-3xl text-sm text-ph-mutedtext">
            {manage
              ? `Everyone in ${team?.workspace.name ?? "this workspace"}, across every app. Changes save as you go; a client grants all of its projects.`
              : `Everyone in ${team?.workspace.name ?? "this workspace"}. Only workspace admins can change roles, access and rates.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {toolbar}
          <ModalClose />
        </div>
      </header>
      {error || loadError ? (
        <Alert
          status="danger"
          description={error ?? loadError ?? undefined}
          onDismiss={error ? () => setError(null) : undefined}
          data-test="team-sheet-error"
        />
      ) : null}
      {loading && !team ? (
        <p className="text-sm text-ph-mutedtext">Loading team…</p>
      ) : (
        <Sheet
          caption="Team management"
          className="min-h-0 flex-1"
          columns={columns}
          groups={[{ key: "team", label: null, rows: team?.members ?? [] }]}
          getRowKey={(member) => member.id}
          emptyState="No one on this team yet."
        />
      )}
    </Modal>
  );
}

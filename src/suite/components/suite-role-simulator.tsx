"use client";

import { Eye, Check } from "iconoir-react";

import { cn } from "../lib/cn";
import {
  SIMULATED_ROLES,
  SIMULATED_ROLE_LABELS,
  setSimulatedRole,
  useSimulatedRole,
  type SimulatedRole,
} from "../lib/role-simulation";
import { DropdownItem } from "../../components/ui/DropdownMenu";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";

const ROLE_DESCRIPTIONS: Record<SimulatedRole, string> = {
  owner: "Everything an admin sees, plus billing and ownership.",
  admin: "Everything an editor sees, plus people, workspace settings, and reports.",
  editor:
    "Everything a member sees, plus clients, projects, invoices, and shared documents.",
  member:
    "Today, tasks, time, and documents. No client, project, people, or billing management.",
};

/**
 * Owner-only role preview modal. Client-side only: the API still sees the real
 * membership, so nothing is actually granted. The choice is stored in a cookie
 * shared by every suite app.
 */
export function SuiteRoleSimulator({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const activeRole = useSimulatedRole();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Simulate access"
      description="Preview every suite app as another workspace role. This only changes what you see — your real permissions are unchanged."
      size="md"
      dataTest="simulate-role-modal"
      footer={
        <div className="flex w-full justify-end gap-2">
          {activeRole ? (
            <Button
              type="button"
              variant="tertiary"
              data-test="simulate-role-stop"
              onClick={() => {
                setSimulatedRole(null);
                onClose();
              }}
            >
              Stop simulating
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            data-test="simulate-role-close"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-ph-ink">
          <Eye className="h-4 w-4 text-ph-mutedtext" aria-hidden />
          <span className="text-sm font-medium">
            {activeRole
              ? `Viewing as ${SIMULATED_ROLE_LABELS[activeRole]} in every app`
              : "Viewing your real access"}
          </span>
        </div>
        <ul className="space-y-2">
          {SIMULATED_ROLES.map((role) => {
            const selected = activeRole === role;
            return (
              <li key={role}>
                <button
                  type="button"
                  data-test={`simulate-role-option-${role}`}
                  aria-pressed={selected}
                  onClick={() => {
                    setSimulatedRole(role);
                    onClose();
                  }}
                  className={cn(
                    "border-ph-border hover:bg-ph-muted flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition",
                    selected && "border-ph-brand bg-ph-muted",
                  )}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center pt-0.5">
                    {selected ? (
                      <Check className="text-ph-brand h-4 w-4" aria-hidden />
                    ) : null}
                  </span>
                  <span className="min-w-0">
                    <span className="text-ph-ink block text-sm font-medium">
                      {SIMULATED_ROLE_LABELS[role]}
                    </span>
                    <span className="text-ph-mutedtext block text-xs">
                      {ROLE_DESCRIPTIONS[role]}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <span className="text-ph-mutedtext text-xs">
          Actions your real role allows still succeed on the server, so use this
          only to check what other people see.
        </span>
      </div>
    </Modal>
  );
}

/**
 * Account-menu entry plus its modal. Drop this into a user menu with
 * `extraMenuItems`; it reads and writes the shared cookie itself.
 */
export function SuiteRoleSimulatorMenuItem({ onOpen }: { onOpen: () => void }) {
  const activeRole = useSimulatedRole();
  return (
    <DropdownItem data-test="simulate-role-menu-item" onClick={onOpen}>
      <Eye className="h-4 w-4 text-ph-mutedtext" aria-hidden />
      {activeRole
        ? `Simulating: ${SIMULATED_ROLE_LABELS[activeRole]}`
        : "Simulate access"}
    </DropdownItem>
  );
}

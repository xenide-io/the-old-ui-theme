"use client";

import { useState, type FormEvent } from "react";
import { Plus, Xmark } from "iconoir-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Toggle,
} from "@/components/ui";

export type SuiteIntegrationRuleActionType =
  "create_tides_task" | "draft_time_entry" | "create_suite_notification";

export interface SuiteIntegrationRule {
  id: string;
  name: string;
  trigger_event_type: string;
  action_type: string;
  action_config: Record<string, unknown>;
  enabled: boolean;
  last_fired_at: string | null;
}

export interface SuiteIntegrationEvent {
  id: string;
  provider: string;
  event_type: string;
  processed_at: string | null;
  created_at: string;
}

export interface SuiteIntegrationRuleProject {
  id: string;
  name: string;
}

export interface SuiteIntegrationRuleInput {
  name: string;
  trigger_event_type: string;
  action_type: SuiteIntegrationRuleActionType;
  action_config: Record<string, string>;
}

export interface SuiteIntegrationRulesProps {
  canManage: boolean;
  projects: SuiteIntegrationRuleProject[];
  rules: SuiteIntegrationRule[];
  events: SuiteIntegrationEvent[];
  loading?: boolean;
  error?: string | null;
  onCreate?: (input: SuiteIntegrationRuleInput) => Promise<void>;
  onUpdate?: (id: string, patch: { enabled?: boolean }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onRefresh?: () => void;
  dataTest?: string;
}

const ACTION_LABELS: Record<SuiteIntegrationRuleActionType, string> = {
  create_tides_task: "Create a Tides task",
  draft_time_entry: "Draft a time entry",
  create_suite_notification: "Send a suite notification",
};

function actionLabel(actionType: string) {
  return (
    ACTION_LABELS[actionType as SuiteIntegrationRuleActionType] ?? actionType
  );
}

function formatDateTime(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function SuiteIntegrationRules({
  canManage,
  projects,
  rules,
  events,
  loading = false,
  error = null,
  onCreate,
  onUpdate,
  onDelete,
  onRefresh,
  dataTest = "integration-rules",
}: SuiteIntegrationRulesProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [actionType, setActionType] =
    useState<SuiteIntegrationRuleActionType>("create_tides_task");
  const [projectId, setProjectId] = useState("");
  const [minutes, setMinutes] = useState("");
  const [priority, setPriority] = useState("low");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [ruleToDelete, setRuleToDelete] =
    useState<SuiteIntegrationRule | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const needsProject =
    actionType === "create_tides_task" || actionType === "draft_time_entry";

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onCreate) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const actionConfig: Record<string, string> = {};
      if (projectId) actionConfig.project_id = projectId;
      if (actionType === "draft_time_entry" && minutes)
        actionConfig.minutes = minutes;
      if (actionType === "create_tides_task" && priority !== "low")
        actionConfig.priority = priority;
      await onCreate({
        name: name.trim(),
        trigger_event_type: trigger.trim(),
        action_type: actionType,
        action_config: actionConfig,
      });
      setName("");
      setTrigger("");
      setProjectId("");
      setMinutes("");
      setPriority("low");
      setFormOpen(false);
      onRefresh?.();
    } catch (cause) {
      setFormError(
        cause instanceof Error ? cause.message : "Could not create the rule.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleRule(rule: SuiteIntegrationRule) {
    if (!onUpdate) return;
    setBusyId(rule.id);
    try {
      await onUpdate(rule.id, { enabled: !rule.enabled });
      onRefresh?.();
    } finally {
      setBusyId(null);
    }
  }

  function requestDelete(rule: SuiteIntegrationRule) {
    setDeleteError(null);
    setRuleToDelete(rule);
  }

  async function deleteRule() {
    if (!onDelete || !ruleToDelete) return;
    setBusyId(ruleToDelete.id);
    setDeleteError(null);
    try {
      await onDelete(ruleToDelete.id);
      onRefresh?.();
      setRuleToDelete(null);
    } catch (cause) {
      setDeleteError(
        cause instanceof Error ? cause.message : "Could not delete the rule.",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="space-y-4" data-test={dataTest}>
      <Card
        variant="outlined"
        bodyClassName="p-5"
        data-test={`${dataTest}-card`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-medium text-ph-ink">Automation rules</h3>
            <p className="mt-1 text-sm text-ph-subtle">
              Turn incoming integration events into tasks, time entries, or
              notifications for this workspace.
            </p>
          </div>
          {canManage && onCreate ? (
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={() => setFormOpen((open) => !open)}
              data-test={`${dataTest}-new`}
            >
              <span className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" aria-hidden />
                New rule
              </span>
            </Button>
          ) : null}
        </div>

        {error ? (
          <Alert
            status="danger"
            title="Could not load rules"
            description={error}
          />
        ) : null}

        {loading ? (
          <p className="mt-4 text-sm text-ph-subtle">Loading rules...</p>
        ) : rules.length === 0 ? (
          <div
            className="mt-4 rounded-lg border border-dashed border-ph-border px-4 py-6 text-center"
            data-test={`${dataTest}-empty`}
          >
            <p className="text-sm text-ph-subtle">
              No automation rules yet.
              {canManage ? " Create one to get started." : ""}
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2" data-test={`${dataTest}-list`}>
            {rules.map((rule) => (
              <li
                key={rule.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-ph-border bg-ph-muted px-3 py-3"
                data-test={`${dataTest}-rule-${rule.id}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ph-ink">
                    {rule.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-ph-subtle">
                    {rule.trigger_event_type} → {actionLabel(rule.action_type)}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-ph-subtle">
                    Last fired: {formatDateTime(rule.last_fired_at)}
                  </p>
                </div>
                {canManage ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <Toggle
                      checked={rule.enabled}
                      disabled={busyId === rule.id}
                      onChange={() => void toggleRule(rule)}
                      aria-label={`Enable ${rule.name}`}
                    />
                    <Button
                      type="button"
                      variant="tertiary"
                      size="sm"
                      disabled={busyId === rule.id}
                      onClick={() => requestDelete(rule)}
                      aria-label={`Delete ${rule.name}`}
                    >
                      <Xmark className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant={rule.enabled ? "success" : "neutral"}
                    size="sm"
                  >
                    {rule.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        )}

        {canManage && formOpen && onCreate ? (
          <form
            className="mt-4 space-y-3 rounded-lg border border-ph-border bg-ph-surface p-4"
            onSubmit={(event) => void submitForm(event)}
            data-test={`${dataTest}-form`}
          >
            {formError ? (
              <p className="text-sm text-ph-danger" role="alert">
                {formError}
              </p>
            ) : null}
            <Input
              label="Rule name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="GitHub issues to tasks"
              data-test={`${dataTest}-name`}
            />
            <Input
              label="Trigger event type"
              required
              value={trigger}
              onChange={(event) => setTrigger(event.target.value)}
              placeholder="github.issue_assigned"
              helperText="Provider event type, for example github.issue_assigned or googlecalendar.event_ended."
              data-test={`${dataTest}-trigger`}
            />
            <Select
              label="Action"
              value={actionType}
              onChange={(event) =>
                setActionType(
                  event.target.value as SuiteIntegrationRuleActionType,
                )
              }
              data-test={`${dataTest}-action`}
            >
              {(
                Object.entries(ACTION_LABELS) as [
                  SuiteIntegrationRuleActionType,
                  string,
                ][]
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            {needsProject ? (
              <Select
                label="Project"
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                data-test={`${dataTest}-project`}
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            ) : null}
            {actionType === "draft_time_entry" ? (
              <Input
                label="Minutes (optional)"
                type="number"
                min="1"
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
                data-test={`${dataTest}-minutes`}
              />
            ) : null}
            {actionType === "create_tides_task" ? (
              <Select
                label="Priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                data-test={`${dataTest}-priority`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            ) : null}
            <div className="flex justify-end gap-2 border-t border-ph-border pt-3">
              <Button
                type="button"
                variant="tertiary"
                onClick={() => setFormOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Creating..." : "Create rule"}
              </Button>
            </div>
          </form>
        ) : null}
      </Card>

      <Modal
        open={ruleToDelete !== null}
        onClose={() => {
          if (busyId !== ruleToDelete?.id) setRuleToDelete(null);
        }}
        title="Delete automation rule"
        description="This action cannot be undone."
        dataTest={`${dataTest}-delete-confirmation`}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="tertiary"
              onClick={() => setRuleToDelete(null)}
              disabled={busyId === ruleToDelete?.id}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => void deleteRule()}
              disabled={busyId === ruleToDelete?.id}
              data-test={`${dataTest}-delete-confirm`}
            >
              {busyId === ruleToDelete?.id ? "Deleting..." : "Delete rule"}
            </Button>
          </div>
        }
      >
        {deleteError ? (
          <p className="text-sm text-ph-danger" role="alert">
            {deleteError}
          </p>
        ) : null}
        <p className="text-sm text-ph-ink">
          Delete {ruleToDelete?.name}? This cannot be undone.
        </p>
      </Modal>

      <Card
        variant="outlined"
        bodyClassName="p-5"
        data-test={`${dataTest}-events-card`}
      >
        <h3 className="font-medium text-ph-ink">Recent events</h3>
        <p className="mt-1 text-sm text-ph-subtle">
          The latest events received from your connected apps.
        </p>
        {events.length === 0 ? (
          <p
            className="mt-4 rounded-lg border border-dashed border-ph-border px-4 py-6 text-center text-sm text-ph-subtle"
            data-test={`${dataTest}-events-empty`}
          >
            No integration events yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-2" data-test={`${dataTest}-events-list`}>
            {events.map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-ph-border bg-ph-muted px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-ph-ink">
                    {event.provider} · {event.event_type}
                  </p>
                  <p className="mt-0.5 text-xs text-ph-subtle">
                    {formatDateTime(event.created_at)}
                  </p>
                </div>
                <Badge
                  variant={event.processed_at ? "success" : "warning"}
                  size="sm"
                >
                  {event.processed_at ? "Processed" : "Pending"}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}

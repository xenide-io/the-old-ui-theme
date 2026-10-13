"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { SuiteAppSlug } from "./apps";

/** A one-click Shelly prompt shown in the sidebar Workflows menu. */
export interface SuiteWorkflow {
  label: string;
  prompt: string;
}

export interface SuiteCustomWorkflow extends SuiteWorkflow {
  id: string;
}

/** What a person changed from an app's built-in workflows. */
export interface SuiteWorkflowPrefs {
  /** Labels of built-in workflows the person removed. */
  hidden: string[];
  custom: SuiteCustomWorkflow[];
}

const EMPTY: SuiteWorkflowPrefs = { hidden: [], custom: [] };
const changeEvent = "suite-workflows-change";
const storageKey = (app: string) => `suite-workflows:v1:${app}`;

/** Tolerant parse: storage is user-editable, so never trust its shape. */
export function parseWorkflowPrefs(raw: string | null): SuiteWorkflowPrefs {
  if (!raw) return EMPTY;
  try {
    const value = JSON.parse(raw) as Partial<SuiteWorkflowPrefs> | null;
    const hidden = Array.isArray(value?.hidden)
      ? value.hidden.filter((item): item is string => typeof item === "string")
      : [];
    const custom = Array.isArray(value?.custom)
      ? value.custom.filter(
          (item): item is SuiteCustomWorkflow =>
            !!item &&
            typeof item.id === "string" &&
            typeof item.label === "string" &&
            typeof item.prompt === "string",
        )
      : [];
    return { hidden, custom };
  } catch {
    return EMPTY;
  }
}

export function resolveWorkflows(
  defaults: SuiteWorkflow[],
  prefs: SuiteWorkflowPrefs,
): SuiteWorkflow[] {
  return [
    ...defaults.filter((workflow) => !prefs.hidden.includes(workflow.label)),
    ...prefs.custom.map(({ label, prompt }) => ({ label, prompt })),
  ];
}

function subscribe(callback: () => void) {
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener("storage", callback);
  };
}

function write(app: string, prefs: SuiteWorkflowPrefs) {
  try {
    window.localStorage.setItem(storageKey(app), JSON.stringify(prefs));
  } catch {
    // Private mode or a full quota: the change simply won't persist.
  }
  window.dispatchEvent(new Event(changeEvent));
}

/**
 * Per-app Shelly workflows: the app's built-ins minus anything removed, plus
 * custom ones. Stored in this browser's localStorage.
 * ponytail: per-browser, not per-account. Upgrade path is a user-preference
 * endpoint on the API behind this same hook.
 */
export function useSuiteWorkflows(
  app: SuiteAppSlug,
  defaults: SuiteWorkflow[],
) {
  const raw = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(storageKey(app)),
    () => null,
  );
  const prefs = useMemo(() => parseWorkflowPrefs(raw), [raw]);
  const presets = useMemo(
    () => resolveWorkflows(defaults, prefs),
    [defaults, prefs],
  );

  const toggleDefault = useCallback(
    (label: string) =>
      write(app, {
        ...prefs,
        hidden: prefs.hidden.includes(label)
          ? prefs.hidden.filter((item) => item !== label)
          : [...prefs.hidden, label],
      }),
    [app, prefs],
  );
  const saveCustom = useCallback(
    (workflow: Omit<SuiteCustomWorkflow, "id"> & { id?: string }) => {
      const next: SuiteCustomWorkflow = {
        id: workflow.id ?? crypto.randomUUID(),
        label: workflow.label.trim(),
        prompt: workflow.prompt.trim(),
      };
      write(app, {
        ...prefs,
        custom: workflow.id
          ? prefs.custom.map((item) => (item.id === next.id ? next : item))
          : [...prefs.custom, next],
      });
    },
    [app, prefs],
  );
  const removeCustom = useCallback(
    (id: string) =>
      write(app, {
        ...prefs,
        custom: prefs.custom.filter((item) => item.id !== id),
      }),
    [app, prefs],
  );
  const reset = useCallback(() => write(app, EMPTY), [app]);

  return { presets, prefs, toggleDefault, saveCustom, removeCustom, reset };
}

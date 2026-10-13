"use client";

import { useSyncExternalStore } from "react";

/**
 * Debug helper: a workspace owner can preview any role across every suite app.
 *
 * Stored in a cookie (not localStorage) because each app runs on its own origin
 * — different ports locally, different subdomains in production — and cookies
 * are the only storage shared across them. Preview only: the API keeps using
 * the real membership, so nothing is granted or revoked.
 */
export const SIMULATED_ROLES = ["owner", "admin", "editor", "member"] as const;

export type SimulatedRole = (typeof SIMULATED_ROLES)[number];

export const SIMULATED_ROLE_LABELS: Record<SimulatedRole, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  member: "Member",
};

const COOKIE = "suite_simulated_role";

const listeners = new Set<() => void>();

function parseRole(value: string | null | undefined): SimulatedRole | null {
  return SIMULATED_ROLES.includes(value as SimulatedRole)
    ? (value as SimulatedRole)
    : null;
}

/** Host-only on localhost; shared across subdomains on a real domain. */
function cookieDomain(): string | null {
  if (typeof window === "undefined") return null;
  const host = window.location.hostname;
  const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(host);
  if (isIp || !host.includes(".")) return null;
  return `.${host.split(".").slice(-2).join(".")}`;
}

function readCookie(): SimulatedRole | null {
  if (typeof document === "undefined") return null;
  const prefix = `${COOKIE}=`;
  const found = document.cookie
    .split("; ")
    .find((row) => row.startsWith(prefix));
  return found ? parseRole(decodeURIComponent(found.slice(prefix.length))) : null;
}

let currentRole: SimulatedRole | null = readCookie();

function notify(): void {
  for (const listener of listeners) listener();
}

/** The role being previewed, or null when the real role is in use. */
export function getSimulatedRole(): SimulatedRole | null {
  return currentRole;
}

/** Sets (or clears) the previewed role everywhere and notifies subscribers. */
export function setSimulatedRole(role: SimulatedRole | null): void {
  currentRole = role;
  if (typeof document !== "undefined") {
    const domain = cookieDomain();
    const attrs = `path=/; max-age=${role ? 31536000 : 0}; samesite=lax${
      domain ? `; domain=${domain}` : ""
    }`;
    document.cookie = `${COOKIE}=${role ? encodeURIComponent(role) : ""}; ${attrs}`;
  }
  notify();
}

export function subscribeSimulatedRole(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Another tab or another app (same cookie) may change the value while this one
 * sits in the background, so re-read whenever it is looked at again.
 */
function refreshFromCookie(): void {
  const next = readCookie();
  if (next === currentRole) return;
  currentRole = next;
  notify();
}

let listening = false;

function ensureCrossAppListeners(): void {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("focus", refreshFromCookie);
  window.addEventListener("storage", refreshFromCookie);
  window.addEventListener("pageshow", refreshFromCookie);
  document.addEventListener("visibilitychange", refreshFromCookie);
}

function getServerRole(): SimulatedRole | null {
  return null;
}

/** Reactive read of the previewed role. */
export function useSimulatedRole(): SimulatedRole | null {
  ensureCrossAppListeners();
  return useSyncExternalStore(
    subscribeSimulatedRole,
    getSimulatedRole,
    getServerRole,
  );
}

/**
 * The role an app should behave as. Only a workspace owner may preview, and a
 * previewed role never keeps owner or admin powers.
 */
export function resolveSimulatedRole({
  realRole,
  canSimulate,
  simulatedRole,
}: {
  realRole: string | null;
  canSimulate: boolean;
  simulatedRole: SimulatedRole | null;
}): { role: string | null; isSimulating: boolean } {
  const isSimulating = Boolean(simulatedRole) && canSimulate;
  return {
    role: isSimulating ? simulatedRole : realRole,
    isSimulating,
  };
}

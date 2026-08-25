import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  persistSidebarWidth,
  readSidebarWidth,
  resetSuiteSidebarWidth,
  SUITE_SIDEBAR_WIDTH_COOKIE,
  SUITE_SIDEBAR_WIDTH_KEY,
} from "./use-sidebar-width";

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  });
  document.cookie.split(";").forEach((part) => {
    const name = part.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; Path=/; Max-Age=0`;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("suite sidebar width", () => {
  it("shares one width across app keys via cookie", () => {
    persistSidebarWidth("tides-sidebar-width", 412);

    expect(readSidebarWidth("kraken-sidebar-width")).toBe(412);
    expect(readSidebarWidth("tt-sidebar-width")).toBe(412);
    expect(readSidebarWidth(SUITE_SIDEBAR_WIDTH_KEY)).toBe(412);
    expect(localStorage.getItem(SUITE_SIDEBAR_WIDTH_KEY)).toBe("412");
    expect(document.cookie).toContain(`${SUITE_SIDEBAR_WIDTH_COOKIE}=412`);
  });

  it("prefers the cookie over a stale per-app localStorage value", () => {
    localStorage.setItem("kraken-sidebar-width", "240");
    persistSidebarWidth("tides-sidebar-width", 480);

    expect(readSidebarWidth("kraken-sidebar-width")).toBe(480);
  });

  it("migrates a legacy per-app width when nothing shared is stored", () => {
    localStorage.setItem("tt-sidebar-width", "360");

    expect(readSidebarWidth("tides-sidebar-width")).toBe(360);
  });

  it("does not write the suite cookie for a demo-only key", () => {
    persistSidebarWidth("the-old-ui-demo-sidebar-width", 220);

    expect(document.cookie).not.toContain(SUITE_SIDEBAR_WIDTH_COOKIE);
    expect(localStorage.getItem(SUITE_SIDEBAR_WIDTH_KEY)).toBeNull();
    expect(readSidebarWidth("tides-sidebar-width")).toBeNull();
  });

  it("clears the shared cookie and legacy keys", () => {
    persistSidebarWidth("kraken-sidebar-width", 400);
    resetSuiteSidebarWidth();

    expect(readSidebarWidth("tides-sidebar-width")).toBeNull();
    expect(localStorage.getItem("kraken-sidebar-width")).toBeNull();
    expect(document.cookie).not.toContain(`${SUITE_SIDEBAR_WIDTH_COOKIE}=400`);
  });
});

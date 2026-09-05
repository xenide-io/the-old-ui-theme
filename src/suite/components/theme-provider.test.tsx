import { act, cleanup, render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SUITE_THEME_COOKIE } from "../lib/theme-cookie";
import { suiteThemeBootScript } from "../lib/theme-boot";
import {
  SuiteThemeProvider,
  useSuiteTheme,
  type SuiteThemeConfig,
  type SuiteThemeContextValue,
} from "./theme-provider";

const config: SuiteThemeConfig = {
  storageKey: "test-theme",
  lightThemeId: "test-light",
  darkThemeId: "test-dark",
  fallbackTheme: "light",
  themeColorLight: "#fafafa",
  themeColorDark: "#191919",
};

beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: () => "dark",
    setItem: vi.fn(),
  });
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({
        matches: query.includes("prefers-color-scheme: dark"),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      }) satisfies MediaQueryList,
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.cookie = `${SUITE_THEME_COOKIE}=; Path=/; Max-Age=0`;
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-suite-lock-page-zoom");
  document.documentElement.classList.remove("dark");
  document.getElementById("theme-color-meta")?.remove();
});

describe("SuiteThemeProvider", () => {
  it("syncs the initial theme colour after mounting", async () => {
    document.documentElement.setAttribute("data-theme", config.darkThemeId);
    const meta = document.createElement("meta");
    meta.id = "theme-color-meta";
    meta.content = config.themeColorLight!;
    document.head.append(meta);

    render(
      <SuiteThemeProvider config={config}>
        <div />
      </SuiteThemeProvider>,
    );

    await waitFor(() =>
      expect(meta).toHaveAttribute("content", config.themeColorDark),
    );
  });

  it("adopts a shared-cookie preference from another suite app", async () => {
    document.cookie = `${SUITE_THEME_COOKIE}=light; Path=/`;
    document.documentElement.setAttribute("data-theme", config.darkThemeId);

    render(
      <SuiteThemeProvider config={config}>
        <div />
      </SuiteThemeProvider>,
    );

    await waitFor(() =>
      expect(document.documentElement.getAttribute("data-theme")).toBe(
        config.lightThemeId,
      ),
    );
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists setTheme to the shared cookie for other suite apps", async () => {
    document.cookie = `${SUITE_THEME_COOKIE}=system; Path=/`;
    document.documentElement.setAttribute("data-theme", config.lightThemeId);

    let captured: SuiteThemeContextValue | null = null;
    function Probe() {
      const ctx = useSuiteTheme();
      useEffect(() => {
        captured = ctx;
      }, [ctx]);
      return null;
    }

    render(
      <SuiteThemeProvider config={config}>
        <Probe />
      </SuiteThemeProvider>,
    );

    await waitFor(() => expect(captured).not.toBeNull());
    act(() => captured!.setTheme("dark"));

    expect(document.documentElement.getAttribute("data-theme")).toBe(
      config.darkThemeId,
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.cookie).toContain(`${SUITE_THEME_COOKIE}=dark`);
  });
});

describe("suiteThemeBootScript", () => {
  it("applies the shared cookie mode before the OS preference", () => {
    document.cookie = `${SUITE_THEME_COOKIE}=light; Path=/`;
    const script = suiteThemeBootScript({
      lightThemeId: "x-light",
      darkThemeId: "x-dark",
      storageKey: "legacy",
    });
    new Function(script)();
    expect(document.documentElement.getAttribute("data-theme")).toBe(
      "x-light",
    );
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("falls back to the OS preference when no cookie or stored mode exists", () => {
    const script = suiteThemeBootScript({
      lightThemeId: "x-light",
      darkThemeId: "x-dark",
      storageKey: "legacy",
      fallback: "light",
    });
    // The stubbed localStorage returns a legacy "dark" preference.
    new Function(script)();
    expect(document.documentElement.getAttribute("data-theme")).toBe("x-dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});

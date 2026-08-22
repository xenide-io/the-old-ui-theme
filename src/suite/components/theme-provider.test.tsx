import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SuiteThemeProvider, type SuiteThemeConfig } from "./theme-provider";

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
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute("data-theme");
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
});

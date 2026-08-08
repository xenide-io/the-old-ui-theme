import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import SuiteAiBlockNoteMessage from "./ai-message-blocknote";
import { SuiteThemeProvider } from "./theme-provider";

const themeConfig = {
  storageKey: "suite-ai-test-theme",
  lightThemeId: "test-light",
  darkThemeId: "test-dark",
  fallbackTheme: "light" as const,
};

describe("SuiteAiBlockNoteMessage", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: () => "light",
      setItem: vi.fn(),
    });
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders Markdown as restricted read-only BlockNote content", async () => {
    const { container } = render(
      <SuiteThemeProvider config={themeConfig}>
        <SuiteAiBlockNoteMessage markdown={"## Summary\n\n- First item"} />
      </SuiteThemeProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText("Summary")).toBeInTheDocument(),
    );
    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(container.querySelector('[contenteditable="false"]')).toBeTruthy();
    expect(container.querySelector("img")).toBeNull();
  });
});

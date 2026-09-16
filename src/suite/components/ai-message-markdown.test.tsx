import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import SuiteAiMarkdownMessage from "./ai-message-markdown";
import { SuiteThemeProvider } from "./theme-provider";

const themeConfig = {
  storageKey: "suite-ai-test-theme",
  lightThemeId: "test-light",
  darkThemeId: "test-dark",
  fallbackTheme: "light" as const,
};

describe("SuiteAiMarkdownMessage", () => {
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

  it("renders safe, semantic Markdown", () => {
    const { container } = render(
      <SuiteThemeProvider config={themeConfig}>
        <SuiteAiMarkdownMessage
          markdown={"## Summary\n\n- First item\n\n![Ignored](https://example.test/image.png)"}
        />
      </SuiteThemeProvider>,
    );

    expect(screen.getByRole("heading", { name: "Summary" })).toBeInTheDocument();
    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(container.querySelector("ul")).toBeTruthy();
    expect(container.querySelector('[contenteditable]')).toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });
});

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

  it("leaves words untouched unless animate is set", () => {
    const { container } = render(
      <SuiteThemeProvider config={themeConfig}>
        <SuiteAiMarkdownMessage markdown={"Hello there world"} />
      </SuiteThemeProvider>,
    );

    expect(container.querySelectorAll(".suite-word-in")).toHaveLength(0);
    expect(container.textContent).toContain("Hello there world");
  });

  it("staggers each word when animate is set", () => {
    const { container } = render(
      <SuiteThemeProvider config={themeConfig}>
        <SuiteAiMarkdownMessage markdown={"Hello there world"} animate />
      </SuiteThemeProvider>,
    );

    const words = container.querySelectorAll<HTMLElement>(".suite-word-in");
    expect(words).toHaveLength(3);
    expect(words[0].textContent).toBe("Hello");
    expect(words[0].style.animationDelay).toBe("0ms");
    expect(words[1].style.animationDelay).toBe("18ms");
    expect(words[2].style.animationDelay).toBe("36ms");
    // Copy still yields the original prose.
    expect(container.textContent).toBe("Hello there world");
  });

  it("does not stagger code spans", () => {
    const { container } = render(
      <SuiteThemeProvider config={themeConfig}>
        <SuiteAiMarkdownMessage markdown={"Run `npm run dev` now"} animate />
      </SuiteThemeProvider>,
    );

    const code = container.querySelector("code");
    expect(code).toBeTruthy();
    expect(code?.querySelector(".suite-word-in")).toBeNull();
  });
});

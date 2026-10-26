import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  persistSidebarWidth,
  SUITE_SIDEBAR_WIDTH_KEY,
  useSidebarWidth,
} from "./use-sidebar-width";

function WidthProbe() {
  const { width, resetWidth } = useSidebarWidth();
  return (
    <div>
      <span data-testid="width">{width}</span>
      <button onClick={resetWidth}>Reset width</button>
    </div>
  );
}

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
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      }) satisfies MediaQueryList,
  );
  document.cookie.split(";").forEach((part) => {
    const name = part.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; Path=/; Max-Age=0`;
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useSidebarWidth app-switch sync", () => {
  it("defaults to 280px and preserves saved widths until reset", () => {
    const { unmount } = render(<WidthProbe />);
    expect(screen.getByTestId("width")).toHaveTextContent("280");
    unmount();

    persistSidebarWidth(SUITE_SIDEBAR_WIDTH_KEY, 360);
    render(<WidthProbe />);
    expect(screen.getByTestId("width")).toHaveTextContent("360");
    fireEvent.click(screen.getByRole("button", { name: "Reset width" }));
    expect(screen.getByTestId("width")).toHaveTextContent("280");
    expect(localStorage.getItem(SUITE_SIDEBAR_WIDTH_KEY)).toBe("280");
  });

  it("picks up a cookie written by another app after pageshow", async () => {
    persistSidebarWidth(SUITE_SIDEBAR_WIDTH_KEY, 280);
    render(<WidthProbe />);
    expect(document.querySelector("[data-testid=width]")?.textContent).toBe(
      "280",
    );

    persistSidebarWidth("tides-sidebar-width", 480);
    window.dispatchEvent(new Event("pageshow"));

    await waitFor(() =>
      expect(document.querySelector("[data-testid=width]")?.textContent).toBe(
        "480",
      ),
    );
  });
});

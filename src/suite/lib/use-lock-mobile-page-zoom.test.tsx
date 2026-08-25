import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useLockMobilePageZoom } from "./use-lock-mobile-page-zoom";

function Probe() {
  useLockMobilePageZoom();
  return null;
}

function stubMedia(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({
        matches: query.includes("pointer: coarse") ? matches : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      }) satisfies MediaQueryList,
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute("data-suite-lock-page-zoom");
  document.head.innerHTML = "";
});

describe("mobile page zoom lock", () => {
  it("locks the viewport on phones and tablets", () => {
    document.head.innerHTML =
      '<meta name="viewport" content="width=device-width, initial-scale=1">';
    stubMedia(true);

    render(<Probe />);

    expect(document.documentElement).toHaveAttribute(
      "data-suite-lock-page-zoom",
    );
    expect(
      document.querySelector('meta[name="viewport"]')?.getAttribute("content"),
    ).toContain("user-scalable=no");
  });

  it("leaves desktop page zoom alone", () => {
    document.head.innerHTML =
      '<meta name="viewport" content="width=device-width, initial-scale=1">';
    stubMedia(false);

    render(<Probe />);

    expect(document.documentElement).not.toHaveAttribute(
      "data-suite-lock-page-zoom",
    );
    expect(
      document.querySelector('meta[name="viewport"]')?.getAttribute("content"),
    ).toBe("width=device-width, initial-scale=1");
  });
});

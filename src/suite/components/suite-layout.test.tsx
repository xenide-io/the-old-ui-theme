import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { sidebarColumnWidth } from "../lib/use-sidebar-width";
import { SuiteAppLayout } from "./suite-app-layout";
import { SuitePageHeader } from "./suite-layout";

afterEach(cleanup);

describe("sidebarColumnWidth", () => {
  it("uses the persisted nav width, including while Ask AI is open", () => {
    expect(sidebarColumnWidth(320, false, false)).toBe(320);
    expect(sidebarColumnWidth(320, false, true)).toBe(320);
    expect(sidebarColumnWidth(56, true, true)).toBe(56);
  });
});

describe("sidebar resize handle", () => {
  it("stays above Ask AI contents so the column can still be dragged", () => {
    render(
      <SuiteAppLayout
        sidebarWidth={320}
        onStartResize={() => {}}
        sidebar={
          <div data-suite-chat-open="" className="relative z-[999] h-full">
            Chat
          </div>
        }
      >
        Page
      </SuiteAppLayout>,
    );

    const handle = document.querySelector('[data-test="sidebar-resize-handle"]');
    expect(handle).not.toBeNull();
    expect(handle?.previousElementSibling).toHaveClass("isolate");
    expect(handle).toHaveClass("z-20");
  });
});

describe("suite scroll ownership", () => {
  it("keeps mobile chrome outside the main scrollport and locks only on request", () => {
    render(
      <SuiteAppLayout
        sidebar={<div>Sidebar</div>}
        mobileHeader={<header>Mobile chrome</header>}
        lockMainScroll
      >
        <div>Page content</div>
      </SuiteAppLayout>,
    );

    const main = screen.getByRole("main");
    const mobileHeader = screen.getByText("Mobile chrome").closest("header");

    expect(main).toHaveAttribute("data-lock-scroll", "true");
    expect(main).toHaveClass("overflow-hidden");
    expect(main).not.toContainElement(mobileHeader);
    expect(within(main).getByText("Page content")).toBeInTheDocument();
  });

  it("lets page headers and actions reflow without clipping narrow screens", () => {
    render(
      <SuitePageHeader
        title="A very long responsive page title"
        actions={<button type="button">Export report</button>}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "A very long responsive page title",
      }),
    ).toHaveClass("break-words", "text-balance");
    expect(screen.getByRole("button", { name: "Export report" }).parentElement)
      .toHaveClass("max-w-full", "overflow-x-auto");
    expect(
      screen.getByRole("heading", {
        name: "A very long responsive page title",
      }).closest("header"),
    ).toHaveClass("shrink-0");
  });
});

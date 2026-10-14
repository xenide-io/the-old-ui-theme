import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_RAIL_WIDTH,
  sidebarColumnWidth,
} from "../lib/use-sidebar-width";
import { SuiteAppLayout } from "./suite-app-layout";
import { SuitePageHeader } from "./suite-layout";
import { BridgeScreen } from "./suite-bridge-screen";
import { BrandSpinner } from "@/components/ui/BrandSpinner";

afterEach(cleanup);

describe("sidebarColumnWidth", () => {
  it("uses the persisted nav width, including while Ask AI is open", () => {
    expect(sidebarColumnWidth(320, false, false)).toBe(320);
    expect(sidebarColumnWidth(320, false, true)).toBe(320);
    expect(sidebarColumnWidth(56, true, true)).toBe(56);
  });
});

describe("Bridge page header", () => {
  it("uses the host app loader rather than inline Shelly for page loading", () => {
    render(
      <BridgeScreen
        bridges={[]}
        connections={[]}
        bindings={[]}
        projects={[]}
        canManage
        loading
        error={null}
        busy={false}
        onConnect={vi.fn()}
        onDisconnect={vi.fn()}
        onSaveChoice={vi.fn()}
        spinner={(props) => <BrandSpinner {...props} variant="columns" />}
      />,
    );
    expect(screen.getByRole("status", { name: "Loading bridges…" })).toHaveAttribute("data-variant", "columns");
    expect(document.querySelector('[data-test="shelly-walking"]')).toBeNull();
  });
  it("uses the shared header without losing app and workspace controls", () => {
    const onAppChange = vi.fn();
    const onWorkspaceChange = vi.fn();
    render(
      <BridgeScreen
        bridges={[]}
        connections={[]}
        bindings={[]}
        projects={[]}
        canManage
        loading={false}
        error="Could not load bridges."
        busy={false}
        onConnect={vi.fn()}
        onDisconnect={vi.fn()}
        onSaveChoice={vi.fn()}
        apps={[
          { id: "turtletime", name: "TurtleTime", icon: "/turtletime.svg" },
          { id: "tides", name: "Tides", icon: "/tides.svg" },
        ]}
        activeApp="turtletime"
        onAppChange={onAppChange}
        workspaces={[
          { id: "one", name: "First workspace" },
          { id: "two", name: "Second workspace" },
        ]}
        activeWorkspaceId="one"
        onWorkspaceChange={onWorkspaceChange}
      />,
    );

    const header = screen.getByRole("heading", { name: "Bridge" }).closest("header");
    expect(header).toHaveClass("suite-page-header");
    // The split panes own scrolling; this title is already fixed above them.
    expect(header).not.toHaveClass("suite-page-header-sticky");
    expect(screen.getByText("Could not load bridges.")).toBeVisible();
    fireEvent.click(screen.getByRole("tab", { name: "Tides" }));
    expect(onAppChange).toHaveBeenCalledWith("tides");
    fireEvent.change(screen.getByRole("combobox", { name: "Workspace" }), {
      target: { value: "two" },
    });
    expect(onWorkspaceChange).toHaveBeenCalledWith("two");
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

  it("supports range-style keyboard minimum, maximum, and steps", () => {
    const onResizeBy = vi.fn();
    render(
      <SuiteAppLayout
        sidebarWidth={240}
        onStartResize={() => {}}
        onResizeBy={onResizeBy}
        sidebar={<div>Sidebar</div>}
      >
        Page
      </SuiteAppLayout>,
    );

    const handle = screen.getByRole("separator", { name: "Resize sidebar" });
    fireEvent.keyDown(handle, { key: "Home" });
    fireEvent.keyDown(handle, { key: "End" });
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    fireEvent.keyDown(handle, { key: "ArrowRight" });

    expect(onResizeBy).toHaveBeenNthCalledWith(1, SIDEBAR_RAIL_WIDTH - 240);
    expect(onResizeBy).toHaveBeenNthCalledWith(2, SIDEBAR_MAX_WIDTH - 240);
    expect(onResizeBy).toHaveBeenNthCalledWith(3, -16);
    expect(onResizeBy).toHaveBeenNthCalledWith(4, 16);
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

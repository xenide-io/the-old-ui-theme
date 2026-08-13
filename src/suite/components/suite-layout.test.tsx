import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SuiteAppLayout } from "./suite-app-layout";
import { SuitePageHeader } from "./suite-layout";

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
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SidePanel } from "./SidePanel";

afterEach(cleanup);

describe("SidePanel", () => {
  it("places the close button in the header after the title", () => {
    render(
      <SidePanel title="Revision history" label="Revision history" onClose={vi.fn()}>
        Body
      </SidePanel>,
    );

    const header = screen.getByRole("banner");
    const children = Array.from(header.children);

    expect(children[0].tagName).toBe("H2");
    expect(children[children.length - 1].querySelector("button")).toBeTruthy();
  });

  it("closes from the ✕ and from Escape", async () => {
    const onClose = vi.fn();
    render(
      <SidePanel title="Page info" label="Page info" onClose={onClose}>
        Body
      </SidePanel>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Close page info" }));
    await userEvent.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

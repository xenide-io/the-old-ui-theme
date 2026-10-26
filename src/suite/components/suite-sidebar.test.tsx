import { useState } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Clock, House as Home } from 'lucide-react';
import { afterEach, describe, expect, it, vi } from "vitest";

import { SuiteSidebar } from "./suite-sidebar";

afterEach(cleanup);

describe("SuiteSidebar Ask AI", () => {
  it("moves focus into chat and restores it after Escape", async () => {
    const user = userEvent.setup();

    function Fixture() {
      const [open, setOpen] = useState(false);
      return (
        <SuiteSidebar
          navItems={[]}
          userMenu={<span>Account</span>}
          askAiOpen={open}
          onAskAiOpenChange={setOpen}
          askAi={<div>Chat</div>}
        />
      );
    }

    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Ask Shelly" });
    await user.click(trigger);

    const back = screen.getByRole("button", { name: "Back to navigation" });
    await waitFor(() => expect(back).toHaveFocus());
    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Ask Shelly" })).toHaveFocus(),
    );
  });

  it("marks the active route and supports the collapse shortcut", () => {
    const onCollapsedChange = vi.fn();
    render(
      <SuiteSidebar
        navItems={[
          { href: "/today", label: "Today", icon: Home, active: true },
          { href: "/tracker", label: "Tracker", icon: Clock },
        ]}
        userMenu={<span>Account</span>}
        onCollapsedChange={onCollapsedChange}
      />,
    );

    expect(screen.getByRole("link", { name: "Today" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(document.querySelector("[data-suite-active-indicator]")).toHaveClass(
      "ph-nav-highlight",
    );
    const active = screen.getByRole("link", { name: "Today" });
    const inactive = screen.getByRole("link", { name: "Tracker" });
    expect(active).toHaveClass("font-medium", "text-ph-subtle");
    expect(inactive).toHaveClass("font-medium", "text-ph-subtle");
    expect(active).not.toHaveClass("font-semibold", "text-[var(--ph-selected-text)]");

    fireEvent.keyDown(window, { key: "b", metaKey: true });
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it("uses compact expanded rows with small gaps, retaining larger touch and rail targets", () => {
    const props = {
      navItems: [{ href: "/today", label: "Today", icon: Home }],
      userMenu: <span>Account</span>,
    };
    const { rerender } = render(<SuiteSidebar {...props} />);
    const link = screen.getByRole("link", { name: "Today" });
    expect(link).toHaveClass("min-h-8", "py-1", "[@media(pointer:coarse)]:min-h-11");
    expect(link.parentElement?.parentElement).toHaveClass("space-y-0.5");
    expect(link.closest("nav")?.parentElement).toHaveClass("px-2");

    rerender(<SuiteSidebar {...props} collapsed />);
    expect(screen.getByRole("link", { name: "Today" })).toHaveClass("size-11", "py-0");
    expect(screen.getByRole("link", { name: "Today" }).parentElement?.parentElement?.parentElement).toHaveClass("space-y-1");
  });
});

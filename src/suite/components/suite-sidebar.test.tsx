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

    fireEvent.keyDown(window, { key: "b", metaKey: true });
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });
});

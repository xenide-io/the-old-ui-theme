import { useState } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

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
});

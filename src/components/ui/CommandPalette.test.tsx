import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandPalette } from "@/components/ui/CommandPalette";

describe("command palette", () => {
  it("behaves as a modal dialog and restores focus when dismissed", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    function Fixture() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open commands
          </button>
          <CommandPalette
            isOpen={open}
            onClose={() => setOpen(false)}
            items={[
              { id: "reports", label: "Open reports", onSelect },
            ]}
          />
        </>
      );
    }

    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Open commands" });
    await user.click(trigger);

    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search commands" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

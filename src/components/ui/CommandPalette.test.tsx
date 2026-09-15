import { useState } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CommandPalette } from "@/components/ui/CommandPalette";

describe("command palette", () => {
  afterEach(cleanup);

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
            dataTest="command-palette-overlay"
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

    const dialog = screen.getByRole("dialog", { name: "Command palette" });
    const input = screen.getByRole("combobox", { name: "Search commands" });
    expect(dialog.parentElement).toBe(document.body);
    expect(trigger.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(input).toHaveFocus();

    await user.tab();
    expect(input).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("dismisses through the Radix overlay and restores focus", async () => {
    const user = userEvent.setup();

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
            dataTest="command-palette-overlay"
            items={[{ id: "reports", label: "Open reports", onSelect: vi.fn() }]}
          />
        </>
      );
    }

    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Open commands" });
    await user.click(trigger);

    await user.click(document.querySelector('[data-test="command-palette-overlay"]')!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps focus on the search input while navigating and selecting listbox options", async () => {
    const user = userEvent.setup();
    const onReports = vi.fn();
    const onSettings = vi.fn();

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
              { id: "reports", label: "Open reports", onSelect: onReports },
              { id: "settings", label: "Open settings", onSelect: onSettings },
            ]}
          />
        </>
      );
    }

    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Open commands" });
    await user.click(trigger);

    const input = screen.getByRole("combobox", { name: "Search commands" });
    const listbox = screen.getByRole("listbox", { name: "Commands" });
    const reports = screen.getByRole("option", { name: "Open reports" });
    const settings = screen.getByRole("option", { name: "Open settings" });

    expect(input).toHaveAttribute("aria-controls", listbox.id);
    expect(input).toHaveAttribute("aria-activedescendant", reports.id);
    expect(reports).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowDown}");
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute("aria-activedescendant", settings.id);
    expect(settings).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Enter}");
    expect(onSettings).toHaveBeenCalledTimes(1);
    expect(onReports).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

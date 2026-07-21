import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DropdownButton, DropdownItem } from "@/components/ui/DropdownMenu";
import { FilterMenu } from "@/components/ui/FilterBar";
import { FilterChips } from "@/components/ui/FilterChips";

describe("adaptive dropdown", () => {
  it("supports keyboard navigation, selection, closing, and focus restoration", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <DropdownButton label="Actions">
        <DropdownItem onClick={onSelect}>Export report</DropdownItem>
        <DropdownItem>Duplicate</DropdownItem>
      </DropdownButton>,
    );

    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("exposes filter choices as a controlled radio menu", async () => {
    const user = userEvent.setup();

    function Fixture() {
      const [value, setValue] = useState("active");
      return (
        <FilterMenu
          label="Status"
          value={value}
          onValueChange={setValue}
          options={[
            { value: "active", label: "Active" },
            { value: "draft", label: "Draft" },
          ]}
        />
      );
    }

    render(<Fixture />);
    await user.click(screen.getByRole("button", { name: "Status: Active" }));
    expect(screen.getByRole("menuitemradio", { name: "Active" })).toHaveAttribute("data-state", "checked");
    await user.click(screen.getByRole("menuitemradio", { name: "Draft" }));
    expect(screen.getByRole("button", { name: "Status: Draft" })).toBeInTheDocument();
  });
});

describe("filter chips", () => {
  it("keeps toggle and removal as independent keyboard controls", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onRemove = vi.fn();

    render(
      <FilterChips
        chips={[{ id: "status", label: "Status", value: "Active", active: true }]}
        onToggle={onToggle}
        onRemove={onRemove}
      />,
    );

    const toggle = screen.getByRole("button", { name: "Status Active" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Remove Status: Active filter" }));
    expect(onRemove).toHaveBeenCalledWith("status");
    expect(onToggle).not.toHaveBeenCalled();
  });
});

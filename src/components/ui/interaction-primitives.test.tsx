import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DropdownButton, DropdownItem } from "@/components/ui/DropdownMenu";
import { FilterMenu } from "@/components/ui/FilterBar";
import { FilterChips } from "@/components/ui/FilterChips";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Chip } from "@/components/ui/Chip";

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
    expect(
      screen.getByRole("menuitemradio", { name: "Active" }),
    ).toHaveAttribute("data-state", "checked");
    await user.click(screen.getByRole("menuitemradio", { name: "Draft" }));
    expect(
      screen.getByRole("button", { name: "Status: Draft" }),
    ).toBeInTheDocument();
  });
});

describe("filter chips", () => {
  it("keeps toggle and removal as independent keyboard controls", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onRemove = vi.fn();

    render(
      <FilterChips
        chips={[
          { id: "status", label: "Status", value: "Active", active: true },
        ]}
        onToggle={onToggle}
        onRemove={onRemove}
      />,
    );

    const toggle = screen.getByRole("button", { name: "Status Active" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    await user.click(
      screen.getByRole("button", { name: "Remove Status: Active filter" }),
    );
    expect(onRemove).toHaveBeenCalledWith("status");
    expect(onToggle).not.toHaveBeenCalled();
  });
});

describe("chip", () => {
  it("keeps selection and removal as separate keyboard controls", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onRemove = vi.fn();

    render(
      <Chip onClick={onClick} onRemove={onRemove}>
        React
      </Chip>,
    );

    await user.click(screen.getByRole("button", { name: "Remove React" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("segmented control", () => {
  it("supports app tabs with icons, counts and roving keyboard focus", async () => {
    const user = userEvent.setup();
    function Fixture() {
      const [value, setValue] = useState("all");
      return (
        <SegmentedControl
          variant="tabs"
          aria-label="Calendar sources"
          aria-controls="calendar-panel"
          value={value}
          onChange={setValue}
          options={[
            {
              value: "all",
              label: "All apps",
              id: "all-apps",
              dataTest: "calendar-tab-all",
            },
            {
              value: "tides",
              label: "Tides",
              icon: (
                <svg aria-hidden="true" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="6" />
                </svg>
              ),
              badge: 12,
            },
            { value: "kraken", label: "Kraken" },
          ]}
        />
      );
    }
    render(<Fixture />);
    expect(
      screen.getByRole("tablist", { name: "Calendar sources" }),
    ).toBeInTheDocument();
    const all = screen.getByRole("tab", { name: "All apps" });
    expect(all).toHaveAttribute("id", "all-apps");
    expect(all).toHaveAttribute("data-test", "calendar-tab-all");
    expect(all).toHaveAttribute("aria-controls", "calendar-panel");
    await user.click(all);
    await user.keyboard("{ArrowRight}");
    const tides = screen.getByRole("tab", { name: "Tides 12" });
    expect(tides).toHaveAttribute("aria-selected", "true");
    expect(tides).not.toHaveAttribute("aria-checked");
    expect(tides).toHaveFocus();
    expect(all).toHaveAttribute("tabindex", "-1");
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Kraken" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(all).toHaveFocus();
  });
  it("exposes a radio group and moves selection with arrow keys", async () => {
    const user = userEvent.setup();

    function Fixture() {
      const [value, setValue] = useState("board");
      return (
        <SegmentedControl
          aria-label="View"
          value={value}
          onChange={setValue}
          options={[
            { value: "board", label: "Board" },
            { value: "list", label: "List" },
          ]}
        />
      );
    }

    render(<Fixture />);
    expect(
      screen.getByRole("radiogroup", { name: "View" }),
    ).toBeInTheDocument();
    const board = screen.getByRole("radio", { name: "Board" });
    expect(board).toHaveAttribute("aria-checked", "true");

    await user.click(board);
    await user.keyboard("{ArrowRight}");
    const list = screen.getByRole("radio", { name: "List" });
    expect(list).toHaveAttribute("aria-checked", "true");
    expect(list).toHaveFocus();
  });
});

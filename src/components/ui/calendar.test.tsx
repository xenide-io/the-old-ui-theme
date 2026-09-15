import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Calendar } from "./Calendar";

describe("Calendar", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows the month containing a controlled value update", () => {
    const { rerender } = render(
      <Calendar value={new Date(2026, 0, 15)} />,
    );
    expect(screen.getByText("January 2026")).toBeInTheDocument();

    rerender(<Calendar value={new Date(2026, 1, 15)} />);
    expect(screen.getByText("February 2026")).toBeInTheDocument();
  });

  it("provides full date names and marks today separately from selection", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 12));

    render(<Calendar value={new Date(2026, 0, 14)} />);

    expect(
      screen.getByRole("button", { name: "Thursday, 15 January 2026" }),
    ).toHaveAttribute("aria-current", "date");
    expect(
      screen.getByRole("button", { name: "Wednesday, 14 January 2026" })
        .parentElement,
    ).toHaveAttribute("aria-selected", "true");
  });

  it("uses date-grid keyboard navigation without changing controlled selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Calendar value={new Date(2026, 0, 15)} onChange={onChange} />);

    const selectedDate = screen.getByRole("button", {
      name: "Thursday, 15 January 2026",
    });
    expect(selectedDate.parentElement).toHaveAttribute("aria-selected", "true");

    await user.click(selectedDate);
    onChange.mockClear();
    await user.keyboard("{ArrowRight}");

    const focusedDate = screen.getByRole("button", {
      name: "Friday, 16 January 2026",
    });
    expect(focusedDate).toHaveFocus();
    expect(selectedDate.parentElement).toHaveAttribute("aria-selected", "true");
    expect(onChange).not.toHaveBeenCalled();

    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 0, 16));
  });

  it("moves focus by week boundaries and months", async () => {
    const user = userEvent.setup();

    render(<Calendar value={new Date(2026, 0, 15)} />);
    await user.click(
      screen.getByRole("button", { name: "Thursday, 15 January 2026" }),
    );

    await user.keyboard("{Home}");
    expect(
      screen.getByRole("button", { name: "Sunday, 11 January 2026" }),
    ).toHaveFocus();

    await user.keyboard("{End}");
    expect(
      screen.getByRole("button", { name: "Saturday, 17 January 2026" }),
    ).toHaveFocus();

    await user.keyboard("{PageDown}");
    expect(screen.getByText("February 2026")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tuesday, 17 February 2026" }),
    ).toHaveFocus();
  });
});

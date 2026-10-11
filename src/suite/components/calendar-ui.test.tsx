import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  SuiteCalendarAgenda,
  SuiteCalendarRecord,
  calendarRecordColour,
} from "./calendar-ui";

afterEach(cleanup);

describe("calendar records", () => {
  it("uses the full host data palette with stable category colours", () => {
    const colours = new Set(
      Array.from({ length: 50 }, (_, i) =>
        calendarRecordColour(`project-${i}`),
      ),
    );
    expect(colours.size).toBe(7);
    expect(calendarRecordColour("project-a")).toBe(
      calendarRecordColour("project-a"),
    );
  });

  it("shows full details on hover and remains keyboard-openable", async () => {
    const user = userEvent.setup();
    const open = vi.fn();
    render(
      <SuiteCalendarRecord
        title="Design review"
        detail="1:30 · Design"
        preview="09:00 – 10:30"
        colour="var(--ph-data-3)"
        onOpen={open}
      />,
    );
    const record = screen.getByRole("button", {
      name: "Design review 1:30 · Design",
    });
    expect(record).toHaveAttribute("aria-disabled", "false");
    await user.hover(record);
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "09:00 – 10:30",
    );
    await user.tab();
    expect(screen.getByRole("tooltip").style.backgroundColor).toContain(
      "var(--ph-surface-raised",
    );
    await user.keyboard("{Enter}");
    expect(open).toHaveBeenCalledOnce();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
  it("does not open an editor when releasing a drag", async () => {
    const user = userEvent.setup();
    const open = vi.fn();
    render(<SuiteCalendarRecord title="Drag me" onOpen={open} />);
    const record = screen.getByRole("button", { name: "Drag me" });
    await user.pointer([
      {
        keys: "[MouseLeft>]",
        target: record,
        coords: { clientX: 10, clientY: 10 },
      },
      { target: record, coords: { clientX: 150, clientY: 10 } },
      {
        keys: "[/MouseLeft]",
        target: record,
        coords: { clientX: 150, clientY: 10 },
      },
    ]);
    expect(open).not.toHaveBeenCalled();
  });
});

describe("calendar agenda", () => {
  const value = (day: number, hour = 0) => ({
    toDate: () => new Date(2026, 9, day, hour),
  });

  it("groups multi-day records using exclusive end dates and opens the original record", async () => {
    const user = userEvent.setup();
    const open = vi.fn();
    const record = {
      id: "memo",
      title: "Release note",
      start: value(12),
      end: value(14),
      allDay: true,
      data: { colour: "var(--ph-data-2)" },
    };
    render(
      <SuiteCalendarAgenda
        events={[record]}
        start={value(12).toDate()}
        end={value(15).toDate()}
        onOpen={open}
      />,
    );
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
    await user.click(
      screen.getAllByRole("button", { name: "Release note" })[0],
    );
    expect(open).toHaveBeenCalledWith(record);
  });

  it("shows an empty state without taking away period navigation", () => {
    render(
      <SuiteCalendarAgenda
        events={[]}
        start={value(12).toDate()}
        end={value(15).toDate()}
        onOpen={vi.fn()}
      />,
    );
    expect(screen.getByTestId("agenda-empty")).toHaveTextContent(
      "Try another date or clear your filters",
    );
  });
});

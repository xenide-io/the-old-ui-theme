import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { calendarTimeGroups } from "../lib/calendar-layout";
import { SuiteCalendarTimeGrid } from "./calendar-time-grid";

afterEach(cleanup);
const day = new Date(2026, 9, 12);
const at = (hour: number, minute = 0) => ({
  toDate: () => new Date(2026, 9, 12, hour, minute),
});
const record = (id: string, from: number, to: number) => ({
  id,
  title: `Entry ${id}`,
  start: at(from),
  end: at(to),
  data: { colour: "var(--ph-data-2)" },
});

it("partitions actual concurrency, reuses touching lanes and resets disconnected groups", () => {
  const groups = calendarTimeGroups([
    { event: "later", start: 600, end: 660 },
    { event: "a", start: 480, end: 540 },
    { event: "b", start: 510, end: 570 },
    { event: "c", start: 540, end: 600 },
    { event: "invalid", start: 500, end: 499 },
    { event: "invalid", start: 500, end: Infinity },
  ]);
  expect(groups.map((group) => group.lanes)).toEqual([2, 1]);
  expect(groups[0].entries.map(({ event, lane }) => [event, lane])).toEqual([
    ["a", 0],
    ["b", 1],
    ["c", 0],
  ]);
  for (const group of groups)
    for (const a of group.entries)
      for (const b of group.entries) {
        if (a !== b && a.lane === b.lane)
          expect(a.end <= b.start || b.end <= a.start).toBe(true);
      }
});

it("shows two concurrent records side by side without icons and keeps record and day actions", async () => {
  const user = userEvent.setup(),
    open = vi.fn(),
    select = vi.fn();
  const events = [record("a", 9, 11), record("b", 10, 12)];
  const { container } = render(
    <SuiteCalendarTimeGrid
      events={events}
      start={day}
      end={new Date(2026, 9, 18, 23)}
      onOpen={open}
      onSelectDay={select}
      onMore={vi.fn()}
    />,
  );
  const blocks = container.querySelectorAll<HTMLElement>(
    ".suite-calendar-timed-event",
  );
  expect([...blocks].map((el) => [el.style.left, el.style.width])).toEqual([
    ["0%", "50%"],
    ["50%", "50%"],
  ]);
  expect(
    container.querySelectorAll(".suite-calendar-record-icon"),
  ).toHaveLength(0);
  await user.click(
    screen.getByRole("button", { name: "Entry a 09:00 – 11:00" }),
  );
  expect(open).toHaveBeenCalledWith(events[0]);
  await user.click(
    screen.getByRole("button", { name: "View Monday, 12 October" }),
  );
  expect(select).toHaveBeenCalledWith(day);
});

it("collapses crowded overlaps into one readable action; list layout exposes every entry", async () => {
  const user = userEvent.setup(),
    more = vi.fn();
  const events = Array.from({ length: 12 }, (_, i) => record(String(i), 9, 11));
  const props = {
    events,
    start: day,
    end: new Date(2026, 9, 18, 23),
    onOpen: vi.fn(),
    onSelectDay: vi.fn(),
    onMore: more,
  };
  const { container, rerender } = render(<SuiteCalendarTimeGrid {...props} />);
  const summary = screen.getByRole("button", {
    name: /12 overlapping entries/,
  });
  expect(
    container.querySelectorAll(".suite-calendar-timed-event"),
  ).toHaveLength(0);
  await user.click(summary);
  expect(more).toHaveBeenCalledWith(day);
  rerender(<SuiteCalendarTimeGrid {...props} layout="list" />);
  expect(container.querySelectorAll(".suite-calendar-record")).toHaveLength(12);
  expect(
    screen.queryByRole("button", { name: /overlapping entries/ }),
  ).not.toBeInTheDocument();
});

it("clips overnight events at day boundaries and uses exclusive end dates", () => {
  const overnight = {
    id: "night",
    title: "Night shift",
    start: { toDate: () => new Date(2026, 9, 11, 23) },
    end: at(1),
  };
  const allDay = {
    ...record("all-day", 0, 0),
    allDay: true,
    end: { toDate: () => new Date(2026, 9, 13) },
  };
  const { container } = render(
    <SuiteCalendarTimeGrid
      events={[overnight, allDay]}
      start={day}
      end={new Date(2026, 9, 13, 23)}
      onOpen={vi.fn()}
      onSelectDay={vi.fn()}
      onMore={vi.fn()}
    />,
  );
  const block = container.querySelector<HTMLElement>(
    ".suite-calendar-timed-event",
  )!;
  expect(block.style.top).toBe("0px");
  expect(block.style.height).toBe("64px");
  expect(screen.getAllByRole("button", { name: "Entry all-day" })).toHaveLength(
    1,
  );
});

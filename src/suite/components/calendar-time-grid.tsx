"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { date } from "../lib/dates";
import { calendarTimeGroups } from "../lib/calendar-layout";
import { SuiteCalendarRecord, type AgendaRecord } from "./calendar-ui";

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const HOUR_HEIGHT = 64;
const clock = (minute: number) =>
  `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;

/** Read-only day/week presentation. Hosts retain navigation, scoping and record
 * actions; month and editable calendars can keep their native grid engine. */
export function SuiteCalendarTimeGrid<T extends AgendaRecord>({
  events,
  start,
  end,
  layout = "time",
  onOpen,
  onSelectDay,
  onMore,
}: {
  events: T[];
  start: Date;
  end: Date;
  layout?: "time" | "list";
  onOpen: (event: T) => void;
  onSelectDay: (day: Date) => void;
  onMore: (day: Date) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => new Date());
  const rangeKey = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = layout === "time" ? 8 * HOUR_HEIGHT : 0;
  }, [rangeKey, layout]);

  const days: Date[] = [];
  for (
    const day = new Date(start);
    day <= end;
    day.setDate(day.getDate() + 1)
  ) {
    days.push(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
  }
  const rows = days.map((day) => {
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    const records = events
      .filter(
        (event) => event.start.toDate() < next && event.end.toDate() > day,
      )
      .toSorted(
        (a, b) => a.start.toDate().getTime() - b.start.toDate().getTime(),
      );
    const allDay = records.filter((event) => event.allDay);
    const spans = records
      .filter((event) => !event.allDay)
      .map((event) => {
        const from = event.start.toDate(),
          to = event.end.toDate();
        return {
          event,
          start: from < day ? 0 : from.getHours() * 60 + from.getMinutes(),
          end: to >= next ? 1440 : to.getHours() * 60 + to.getMinutes(),
        };
      });
    return { day, records, allDay, spans, groups: calendarTimeGroups(spans) };
  });
  const today = date(now).format("YYYY-MM-DD");
  const renderRecord = (event: T, time?: string) => (
    <SuiteCalendarRecord
      title={event.title}
      detail={event.description}
      time={time}
      colour={
        typeof event.data?.colour === "string" ? event.data.colour : undefined
      }
      preview={
        typeof event.data?.preview === "string" ? event.data.preview : undefined
      }
      avatars={event.data?.avatars as ReactNode}
      onOpen={() => onOpen(event)}
    />
  );
  const positioning = (from: number, to: number): CSSProperties => ({
    top: (from / 60) * HOUR_HEIGHT,
    height: ((to - from) / 60) * HOUR_HEIGHT,
  });

  return (
    <div
      className="suite-calendar-time-view"
      data-testid="suite-time-grid"
      data-layout={layout}
      style={
        {
          "--calendar-days": days.length,
          "--calendar-hour-height": `${HOUR_HEIGHT}px`,
        } as CSSProperties
      }
    >
      <div className="suite-calendar-time-scroll" ref={scrollRef}>
        <div className="suite-calendar-time-canvas">
          <div
            className="suite-calendar-time-header"
            data-testid="week-view-header"
          >
            <span className="suite-calendar-time-gutter">
              {layout === "time" ? "Time" : ""}
            </span>
            {rows.map(({ day }) => (
              <button
                key={day.toISOString()}
                type="button"
                className="suite-calendar-time-day"
                data-today={date(day).format("YYYY-MM-DD") === today}
                onClick={() => onSelectDay(day)}
                aria-label={`View ${date(day).format("dddd, D MMMM")}`}
              >
                <span>{date(day).format("ddd")}</span>
                <strong>{day.getDate()}</strong>
              </button>
            ))}
          </div>
          {layout === "time" ? (
            <>
              <div className="suite-calendar-all-day">
                <span className="suite-calendar-time-gutter">All day</span>
                {rows.map(({ day, allDay }) => (
                  <div
                    key={day.toISOString()}
                    className="suite-calendar-all-day-cell"
                  >
                    {allDay.slice(0, 2).map((event) => (
                      <div key={event.id}>{renderRecord(event)}</div>
                    ))}
                    {allDay.length > 2 ? (
                      <button
                        type="button"
                        className="suite-calendar-more"
                        onClick={() => onMore(day)}
                        aria-label={`Show all ${allDay.length} records on ${date(day).format("D MMM")}`}
                      >
                        +{allDay.length - 2} more
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="suite-calendar-time-body">
                <div className="suite-calendar-hours" aria-hidden="true">
                  {HOURS.map((hour) => (
                    <span key={hour}>{clock(hour * 60)}</span>
                  ))}
                </div>
                {rows.map(({ day, groups }) => (
                  <div
                    key={day.toISOString()}
                    className="suite-calendar-time-column"
                    data-day={date(day).format("YYYY-MM-DD")}
                  >
                    {groups.map((group) =>
                      group.lanes > (days.length === 1 ? 6 : 2) ? (
                        <button
                          key={`overlap-${group.start}`}
                          type="button"
                          className="suite-calendar-overlap"
                          data-test="calendar-overlap"
                          style={
                            {
                              ...positioning(group.start, group.end),
                              "--suite-calendar-record-accent":
                                group.entries[0]?.event.data?.colour,
                            } as CSSProperties
                          }
                          onClick={() => onMore(day)}
                        >
                          <span
                            className="suite-calendar-overlap-colours"
                            aria-hidden="true"
                          >
                            {[
                              ...new Set(
                                group.entries
                                  .map(({ event }) => event.data?.colour)
                                  .filter(
                                    (colour): colour is string =>
                                      typeof colour === "string",
                                  ),
                              ),
                            ].map((colour) => (
                              <span
                                key={colour}
                                style={{ background: colour }}
                              />
                            ))}
                          </span>
                          <strong>
                            {group.entries.length} overlapping entries
                          </strong>
                          <span>
                            {clock(group.start)} – {clock(group.end)}
                          </span>
                          <span className="suite-calendar-overlap-titles">
                            {group.entries
                              .slice(0, 2)
                              .map(({ event }) => event.title)
                              .join(" · ")}
                          </span>
                          <span className="suite-calendar-overlap-action">
                            View entries
                          </span>
                        </button>
                      ) : (
                        group.entries.map(
                          ({ event, start: from, end: to, lane }) => (
                            <div
                              key={event.id}
                              className="suite-calendar-timed-event"
                              data-test="calendar-timed-event"
                              style={{
                                ...positioning(from, to),
                                left: `${(lane / group.lanes) * 100}%`,
                                width: `${100 / group.lanes}%`,
                              }}
                            >
                              {renderRecord(
                                event,
                                `${clock(from)} – ${clock(to)}`,
                              )}
                            </div>
                          ),
                        )
                      ),
                    )}
                    {date(day).format("YYYY-MM-DD") === today ? (
                      <div
                        className="suite-calendar-now"
                        aria-label={`Current time ${date(now).format("HH:mm")}`}
                        style={{
                          top:
                            (now.getHours() + now.getMinutes() / 60) *
                            HOUR_HEIGHT,
                        }}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="suite-calendar-week-list">
              <span />
              {rows.map(({ day, records }) => (
                <section
                  key={day.toISOString()}
                  className="suite-calendar-week-list-day"
                  aria-label={date(day).format("dddd, D MMMM")}
                >
                  {!records.length ? (
                    <p className="suite-calendar-list-empty">No entries</p>
                  ) : null}
                  {records.map((event) => (
                    <div key={event.id}>
                      {renderRecord(
                        event,
                        event.allDay
                          ? "All day"
                          : `${date(event.start.toDate()).format("HH:mm")} – ${date(event.end.toDate()).format("HH:mm")}`,
                      )}
                    </div>
                  ))}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

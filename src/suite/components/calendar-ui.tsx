"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import { Button } from "../../components/ui/Button";
import { SegmentedControl } from "../../components/ui/SegmentedControl";
import { Tooltip } from "../../components/ui/Tooltip";
import { date } from "../lib/dates";

/** Stable category colours from the host theme's full data palette. */
export function calendarRecordColour(key: string): string {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `var(--ph-data-${(hash % 7) + 1})`;
}

export interface AgendaRecord {
  id: string | number;
  title: string;
  description?: string;
  start: { toDate: () => Date };
  end: { toDate: () => Date };
  allDay?: boolean;
  data?: Record<string, unknown>;
}

/** Date-grouped presentation; the host calendar owns ranges and item actions. */
export function SuiteCalendarAgenda<T extends AgendaRecord>({
  events,
  start,
  end,
  onOpen,
  renderIcon,
}: {
  events: T[];
  start: Date;
  end: Date;
  onOpen: (event: T) => void;
  renderIcon?: (event: T) => ReactNode;
}) {
  const days: { key: string; day: Date; records: T[] }[] = [];
  for (
    const day = new Date(start);
    day <= end;
    day.setDate(day.getDate() + 1)
  ) {
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    const records = events
      .filter(
        (event) => event.start.toDate() < next && event.end.toDate() > day,
      )
      .sort(
        (a, b) =>
          Number(Boolean(b.allDay)) - Number(Boolean(a.allDay)) ||
          a.start.toDate().getTime() - b.start.toDate().getTime(),
      );
    if (records.length)
      days.push({ key: day.toISOString(), day: new Date(day), records });
  }
  return (
    <div className="suite-calendar-agenda" data-testid="agenda-view">
      {!days.length ? (
        <p className="suite-calendar-agenda-empty" data-testid="agenda-empty">
          No dated items in this period. Try another date or clear your filters.
        </p>
      ) : null}
      {days.map(({ key, day, records }) => (
        <section className="suite-calendar-agenda-day" key={key}>
          <h3>
            <span>{date(day).format("ddd")}</span>
            <strong>{day.getDate()}</strong>
            <span>{date(day).format("MMM")}</span>
          </h3>
          <div className="suite-calendar-agenda-items">
            {records.map((event) => (
              <div className="suite-calendar-agenda-row" key={event.id}>
                <span className="suite-calendar-agenda-time">
                  {event.allDay
                    ? "All day"
                    : date(event.start.toDate()).format("HH:mm")}
                </span>
                <SuiteCalendarRecord
                  title={event.title}
                  detail={event.description}
                  colour={
                    typeof event.data?.colour === "string"
                      ? event.data.colour
                      : undefined
                  }
                  preview={
                    typeof event.data?.preview === "string"
                      ? event.data.preview
                      : undefined
                  }
                  icon={renderIcon?.(event)}
                  avatars={event.data?.avatars as ReactNode}
                  onOpen={() => onOpen(event)}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Presentation only: host apps supply their calendar's navigation and actions. */
export function SuiteCalendarToolbar({
  title,
  subtitle,
  onPrevious,
  onNext,
  onToday,
  view,
  views,
  onViewChange,
  children,
}: {
  title: string;
  subtitle?: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  view?: string;
  views?: { value: string; label: string }[];
  onViewChange?: (view: string) => void;
  children?: ReactNode;
}) {
  const period =
    view === "week"
      ? "week"
      : view === "day"
        ? "day"
        : view === "agenda"
          ? "agenda"
          : view === "month"
            ? "month"
            : "period";
  return (
    <div className="suite-calendar-toolbar" data-test="calendar-toolbar">
      <div className="suite-calendar-navigation">
        <Button variant="secondary" size="sm" onClick={onToday}>
          Today
        </Button>
        <Button
          variant="tertiary"
          size="sm"
          shape="square"
          aria-label={`Previous ${period}`}
          tooltipSide="bottom"
          onClick={onPrevious}
          icon={<NavArrowLeft />}
        />
        <Button
          variant="tertiary"
          size="sm"
          shape="square"
          aria-label={`Next ${period}`}
          tooltipSide="bottom"
          onClick={onNext}
          icon={<NavArrowRight />}
        />
        <div className="suite-calendar-title">
          <h2>{title}</h2>
          {subtitle ? <p className="sr-only">{subtitle}</p> : null}
        </div>
      </div>
      <div className="suite-calendar-controls">
        {views && view && onViewChange ? (
          <SegmentedControl
            options={views}
            value={view}
            onChange={onViewChange}
            aria-label="Calendar view"
            className="suite-calendar-views"
          />
        ) : null}
        {children}
      </div>
    </div>
  );
}

/** Native button keeps records keyboard-accessible when dragging is disabled. */
export function SuiteCalendarRecord({
  title,
  detail,
  icon,
  colour,
  preview,
  time,
  avatars,
  onOpen,
}: {
  title: string;
  detail?: string;
  icon?: ReactNode;
  colour?: string;
  preview?: ReactNode;
  time?: string;
  /** People chips shown before the title (team calendars). */
  avatars?: ReactNode;
  onOpen: () => void;
}) {
  const pointerStart = useRef({ x: 0, y: 0 });
  return (
    <span className="suite-calendar-record-frame">
      <Tooltip
        side="bottom"
        delayDuration={250}
        className="suite-calendar-preview"
        style={{
          display: "block",
          width: "min(21.25rem, calc(100vw - 1.5rem))",
          backgroundColor: "var(--ph-surface-raised, var(--ph-surface, #fff))",
          color: "var(--ph-text-primary, #222)",
          border: "1px solid var(--ph-border, #ddd)",
          borderRadius: "0.625rem",
          padding: "0.75rem 0.875rem",
          boxShadow: "0 0.5rem 1.75rem rgb(0 0 0 / 15%)",
        }}
        content={
          <span className="suite-calendar-preview-copy">
            <strong>{title}</strong>
            {detail ? <span>{detail}</span> : null}
            {preview ? (
              <span className="suite-calendar-preview-extra">{preview}</span>
            ) : null}
            <span className="suite-calendar-preview-hint">
              Click or press Enter to open
            </span>
          </span>
        }
      >
        <button
          type="button"
          // ilamy's drag wrapper has aria-disabled=true even for clickable records.
          aria-disabled={false}
          className="suite-calendar-record"
          onPointerDown={(event) => {
            pointerStart.current = { x: event.clientX, y: event.clientY };
          }}
          style={
            colour
              ? ({ "--suite-calendar-record-accent": colour } as CSSProperties)
              : undefined
          }
          onClick={(event) => {
            event.stopPropagation();
            // Releasing a drag must not also open the native editor.
            if (
              event.detail > 0 &&
              Math.hypot(
                event.clientX - pointerStart.current.x,
                event.clientY - pointerStart.current.y,
              ) > 5
            )
              return;
            onOpen();
          }}
        >
          {icon ? (
            <span className="suite-calendar-record-icon" aria-hidden>
              {icon}
            </span>
          ) : null}
          {avatars ? (
            <span className="suite-calendar-record-avatars" aria-hidden>
              {avatars}
            </span>
          ) : null}
          <span className="suite-calendar-record-copy">
            <span className="suite-calendar-record-title">{title}</span>
            {time ? (
              <span className="suite-calendar-record-time">{time}</span>
            ) : null}
            {detail ? (
              <span className="suite-calendar-record-detail">{detail}</span>
            ) : null}
          </span>
        </button>
      </Tooltip>
    </span>
  );
}

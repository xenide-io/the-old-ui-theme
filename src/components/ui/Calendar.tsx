"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";
import { cn } from "@/lib/cn";

export interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const fullWeekDays = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function addMonths(date: Date, amount: number) {
  const targetMonth = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth() + 1,
    0,
  ).getDate();

  return new Date(
    targetMonth.getFullYear(), targetMonth.getMonth(), Math.min(date.getDate(), lastDay));
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function dateLabel(date: Date) {
  return `${fullWeekDays[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function Calendar({ value, onChange, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(value ?? new Date()));
  const [focusedDate, setFocusedDate] = useState(() => startOfDay(value ?? new Date()));
  const gridRef = useRef<HTMLDivElement>(null);
  const shouldFocusDateRef = useRef(false);
  const monthLabelId = useId();
  const today = startOfDay(new Date());

  useEffect(() => {
    if (!value) return;
    const nextDate = startOfDay(value);
    setCurrentMonth(startOfMonth(nextDate));
    setFocusedDate(nextDate);
  }, [value]);

  useEffect(() => {
    if (!shouldFocusDateRef.current) return;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-date="${dateKey(focusedDate)}"]`)
      ?.focus();
    shouldFocusDateRef.current = false;
  }, [currentMonth, focusedDate]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const changeMonth = (amount: number) => {
    const nextDate = addMonths(focusedDate, amount);
    setFocusedDate(nextDate);
    setCurrentMonth(startOfMonth(nextDate));
  };

  const moveFocus = (nextDate: Date) => {
    shouldFocusDateRef.current = true;
    setFocusedDate(nextDate);
    setCurrentMonth(startOfMonth(nextDate));
  };

  const handleSelect = (date: Date) => {
    setFocusedDate(date);
    onChange?.(startOfDay(date));
  };

  const handleDayKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    date: Date,
  ) => {
    let nextDate: Date | undefined;

    switch (event.key) {
      case "ArrowLeft":
        nextDate = addDays(date, -1);
        break;
      case "ArrowRight":
        nextDate = addDays(date, 1);
        break;
      case "ArrowUp":
        nextDate = addDays(date, -7);
        break;
      case "ArrowDown":
        nextDate = addDays(date, 7);
        break;
      case "Home":
        nextDate = addDays(date, -date.getDay());
        break;
      case "End":
        nextDate = addDays(date, 6 - date.getDay());
        break;
      case "PageUp":
        nextDate = addMonths(date, event.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        nextDate = addMonths(date, event.shiftKey ? 12 : 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        handleSelect(date);
        return;
      default:
        return;
    }

    event.preventDefault();
    moveFocus(nextDate);
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Array<Date | null> = Array.from({ length: firstDay }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }
  while (days.length < 42) {
    days.push(null);
  }

  return (
    <div className={cn("w-[280px] rounded-xl border border-ph-border bg-ph-surface p-4 shadow-ph", className)}>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          aria-label="Previous month"
          className="rounded-lg p-1 text-ph-subtle transition hover:bg-ph-muted hover:text-ph-ink"
        >
          <IconChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <span id={monthLabelId} aria-live="polite" className="text-sm font-semibold text-ph-ink">
          {monthNames[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Next month"
          className="rounded-lg p-1 text-ph-subtle transition hover:bg-ph-muted hover:text-ph-ink"
        >
          <IconChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div ref={gridRef} role="grid" aria-labelledby={monthLabelId}>
        <div role="row" className="grid grid-cols-7 gap-1">
          {weekDays.map((day, index) => (
            <div
              key={day}
              role="columnheader"
              aria-label={fullWeekDays[index]}
              className="py-1 text-center text-xs font-medium text-ph-mutedtext"
            >
              {day}
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, week) => {
          const weekDates = days.slice(week * 7, week * 7 + 7);
          if (weekDates.length === 0 || weekDates.every((date) => !date)) return null;
          return (
          <div key={week} role="row" className="grid grid-cols-7 gap-1">
            {weekDates.map((date, day) =>
              date ? (
                <div
                  key={dateKey(date)}
                  role="gridcell"
                  aria-selected={value ? isSameDay(value, date) : false}
                  className="aspect-square"
                >
                  <button
                    type="button"
                    data-date={dateKey(date)}
                    aria-label={dateLabel(date)}
                    aria-current={isSameDay(today, date) ? "date" : undefined}
                    tabIndex={isSameDay(focusedDate, date) ? 0 : -1}
                    onClick={() => handleSelect(date)}
                    onKeyDown={(event) => handleDayKeyDown(event, date)}
                    className={cn(
                      "flex h-full w-full items-center justify-center rounded-lg text-sm transition-colors",
                      value && isSameDay(value, date)
                        ? "bg-ph-brand font-semibold text-[var(--ph-on-accent)] shadow-ph"
                        : isSameDay(today, date)
                          ? "bg-ph-muted font-semibold text-ph-brand ring-1 ring-ph-brand/30"
                          : "text-ph-ink hover:bg-ph-muted",
                    )}
                  >
                    {date.getDate()}
                  </button>
                </div>
              ) : (
                <div key={`empty-${week}-${day}`} role="gridcell" aria-hidden="true" className="aspect-square" />
              ),
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";
import { cn } from "@/lib/cn";

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

export function Calendar({ value, onChange, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const today = new Date();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const isSelected = (day: number) => {
    if (!value) return false;
    return (
      value.getDate() === day &&
      value.getMonth() === month &&
      value.getFullYear() === year
    );
  };

  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const handleSelect = (day: number) => {
    onChange?.(new Date(year, month, day));
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className={cn("w-[280px] rounded-xl border border-ph-border bg-ph-surface p-4 shadow-ph", className)}>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="rounded-lg p-1 text-ph-subtle transition hover:bg-ph-muted hover:text-ph-ink"
        >
          <IconChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <span className="text-sm font-semibold text-ph-ink">
          {monthNames[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="rounded-lg p-1 text-ph-subtle transition hover:bg-ph-muted hover:text-ph-ink"
        >
          <IconChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="py-1 text-center text-xs font-medium text-ph-mutedtext">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day && (
              <button
                type="button"
                onClick={() => handleSelect(day)}
                className={cn(
                  "flex h-full w-full items-center justify-center rounded-lg text-sm transition-colors",
                  isSelected(day)
                    ? "bg-ph-brand font-semibold text-[var(--ph-on-accent)] shadow-ph"
                    : isToday(day)
                    ? "bg-ph-muted font-semibold text-ph-brand ring-1 ring-ph-brand/30"
                    : "text-ph-ink hover:bg-ph-muted"
                )}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

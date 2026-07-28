"use client";

import { useState, useMemo, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value?: Date;
  onChange?: (date: Date) => void;
}

export function DatePicker({ value, onChange, className, ...props }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ?? new Date());
  const selected = value;

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const first = new Date(year, month, 1).getDay();
    const last = new Date(year, month + 1, 0).getDate();
    const prevLast = new Date(year, month, 0).getDate();
    const cells: { day: number; month: "prev" | "current" | "next" }[] = [];
    for (let i = first - 1; i >= 0; i--) cells.push({ day: prevLast - i, month: "prev" });
    for (let d = 1; d <= last; d++) cells.push({ day: d, month: "current" });
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) cells.push({ day: d, month: "next" });
    return cells;
  }, [viewDate]);

  const isSelected = (d: number, m: "prev" | "current" | "next") => {
    if (!selected || m !== "current") return false;
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    return date.toDateString() === selected.toDateString();
  };

  const selectDay = (d: number, m: string) => {
    const month = m === "prev" ? viewDate.getMonth() - 1 : m === "next" ? viewDate.getMonth() + 1 : viewDate.getMonth();
    const year = month < 0 ? viewDate.getFullYear() - 1 : month > 11 ? viewDate.getFullYear() + 1 : viewDate.getFullYear();
    const adjustedMonth = ((month % 12) + 12) % 12;
    const date = new Date(year, adjustedMonth, d);
    onChange?.(date);
    setOpen(false);
  };

  const nav = (delta: number) => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));

  return (
    <div className={cn("ph-datepicker relative", className)}>
      <input
        type="text"
        readOnly
        value={selected ? `${MONTHS[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}` : ""}
        onFocus={() => setOpen(true)}
        placeholder="Pick a date"
        className="ph-input w-full cursor-pointer"
        {...props}
      />
      {open && (
        <div className="ph-datepicker__dropdown">
          <div className="ph-datepicker__nav">
            <button type="button" onClick={() => nav(-1)} className="ph-datepicker__nav-btn" aria-label="Previous month">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 3L4 6l3 3"/></svg>
            </button>
            <span className="ph-datepicker__nav-label">{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
            <button type="button" onClick={() => nav(1)} className="ph-datepicker__nav-btn" aria-label="Next month">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 3l3 3-3 3"/></svg>
            </button>
          </div>
          <div className="ph-datepicker__grid">
            {DAYS.map((d) => <div key={d} className="ph-datepicker__day-header">{d}</div>)}
            {days.map((d, i) => (
              <button
                key={i}
                type="button"
                disabled={d.month !== "current"}
                onClick={() => selectDay(d.day, d.month)}
                className={cn(
                  "ph-datepicker__day",
                  d.month !== "current" && "ph-datepicker__day--other",
                  isSelected(d.day, d.month) && "ph-datepicker__day--selected"
                )}
              >
                {d.day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

DatePicker.displayName = "DatePicker";

"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Xmark } from "iconoir-react";
import { Calendar } from "@/components/ui/Calendar";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { date as dateOf, formatDate } from "@/suite/lib/dates";
import { cn } from "@/lib/cn";

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

/** Local calendar day as `YYYY-MM-DD` (never UTC — a note made at 1am is still "today"). */
export function toDateKey(value: Date): string {
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
}

export function todayDateKey(): string {
  return toDateKey(new Date());
}

function fromDateKey(key: string): Date | undefined {
  if (!DATE_KEY.test(key)) return undefined;
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** "Today", "Tomorrow", "Yesterday", "Tue, 13 Oct", or "13 Oct 2027" once it leaves this year. */
export function describeDateKey(key: string, placeholder: string): string {
  const parsed = fromDateKey(key);
  if (!parsed) return placeholder;
  const target = dateOf(parsed);
  const now = dateOf();
  if (target.isSame(now, "day")) return "Today";
  if (target.isSame(now.add(1, "day"), "day")) return "Tomorrow";
  if (target.isSame(now.subtract(1, "day"), "day")) return "Yesterday";
  return target.isSame(now, "year") ? target.format("ddd, D MMM") : formatDate(parsed);
}

export interface DatePickerProps {
  /** `YYYY-MM-DD`, or empty for no date. */
  value: string;
  onChange: (value: string) => void;
  /** Shows an inline ✕ on the chip while a date is set. */
  clearable?: boolean;
  placeholder?: string;
  /** `chip` is a compact pill; `field` is a full-width control that matches `Input`. */
  variant?: "chip" | "field";
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  dataTest?: string;
}

/**
 * One-line date chip. Click to open a calendar; the ✕ on the chip clears it.
 * Replaces native `<input type="date">`, which looks different on every OS.
 */
export function DatePicker({
  value,
  onChange,
  clearable = true,
  placeholder = "Add date",
  variant = "chip",
  id,
  disabled,
  className,
  "aria-label": ariaLabel = "Date",
  dataTest,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = fromDateKey(value);
  const canClear = clearable && Boolean(selected);

  const pick = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div
      className={cn(
        variant === "field" ? "ph-input ph-date-field" : "ph-chip-field",
        selected && "ph-chip-field--set",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
      data-test={dataTest}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            disabled={disabled}
            className="ph-chip-field__main"
            aria-label={`${ariaLabel}: ${describeDateKey(value, "none")}`}
          >
            <CalendarIcon className="h-4 w-4 shrink-0" aria-hidden />
            <span>{describeDateKey(value, placeholder)}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="ph-popover-panel--flush">
          <Calendar
            value={selected}
            onChange={(next) => pick(toDateKey(next))}
            className="ph-calendar--bare"
          />
          <div className="ph-popover-footer">
            <PopoverClose asChild>
              <button
                type="button"
                className="ph-popover-footer__action"
                onClick={() => onChange(todayDateKey())}
              >
                Today
              </button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
      {canClear ? (
        <button
          type="button"
          className="ph-chip-field__clear"
          aria-label={`Clear ${ariaLabel.toLowerCase()}`}
          onClick={() => onChange("")}
        >
          <Xmark className="h-3.5 w-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

export interface DateTimePickerProps extends Omit<DatePickerProps, "value" | "onChange"> {
  /** `YYYY-MM-DDTHH:mm`, or empty. */
  value: string;
  onChange: (value: string) => void;
}

/** Date picker plus a time field; emits `YYYY-MM-DDTHH:mm` like `datetime-local`. */
export function DateTimePicker({ value, onChange, variant = "field", ...rest }: DateTimePickerProps) {
  const [day = "", time = ""] = value.split("T");
  return (
    <div className="ph-datetime">
      <DatePicker
        {...rest}
        variant={variant}
        value={day}
        onChange={(next) => onChange(next ? `${next}T${time || "09:00"}` : "")}
      />
      <input
        type="time"
        className="ph-input ph-datetime__time"
        aria-label={`${rest["aria-label"] ?? "Date"} time`}
        disabled={rest.disabled || !day}
        value={time}
        onChange={(event) => day && onChange(`${day}T${event.target.value || "00:00"}`)}
      />
    </div>
  );
}

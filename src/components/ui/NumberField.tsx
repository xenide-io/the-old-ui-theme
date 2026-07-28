"use client";

import { useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export function NumberField({
  value: controlledValue,
  onChange,
  min,
  max,
  step = 1,
  label,
  className,
  disabled,
  defaultValue,
  ...inputProps
}: NumberFieldProps) {
  const [internal, setInternal] = useState(controlledValue ?? 0);
  const value = controlledValue ?? internal;

  const set = (v: number) => {
    const clamped = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, v));
    setInternal(clamped);
    onChange?.(clamped);
  };

  return (
    <div className={cn("ph-number-field", className)}>
      {label && <label className="ph-label">{label}</label>}
      <div className="ph-number-field__control">
        <button
          type="button"
          disabled={disabled || (min !== undefined && value <= min)}
          onClick={() => set(value - step)}
          className="ph-number-field__btn"
          aria-label="Decrease"
        >
          <svg width="12" height="2" viewBox="0 0 12 2" fill="currentColor"><rect y="0" width="12" height="2" rx="1" /></svg>
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => set(Number(e.target.value))}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className="ph-number-field__input"
          {...inputProps}
        />
        <button
          type="button"
          disabled={disabled || (max !== undefined && value >= max)}
          onClick={() => set(value + step)}
          className="ph-number-field__btn"
          aria-label="Increase"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 2v8M2 6h8" />
          </svg>
        </button>
      </div>
    </div>
  );
}

NumberField.displayName = "NumberField";

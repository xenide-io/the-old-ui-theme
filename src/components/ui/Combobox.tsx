"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  value = [],
  onChange,
  placeholder = "Search...",
  className,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedSet = new Set(value);

  const toggle = (val: string) => {
    const next = selectedSet.has(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange?.(next);
  };

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div ref={containerRef} className={cn("ph-combobox relative", className)}>
      <div className="ph-combobox__input-wrap">
        {value.length > 0 && (
          <div className="ph-combobox__chips">
            {value.map((v) => {
              const opt = options.find((o) => o.value === v);
              return (
                <span key={v} className="ph-combobox__chip">
                  {opt?.label ?? v}
                  <button
                    type="button"
                    onClick={() => toggle(v)}
                    className="ph-combobox__chip-remove"
                    aria-label={`Remove ${opt?.label ?? v}`}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M2 2l6 6M8 2l-6 6" />
                    </svg>
                  </button>
                </span>
              );
            })}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="ph-combobox__input"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="ph-combobox__dropdown">
          {filtered.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={cn(
                "ph-combobox__option",
                selectedSet.has(opt.value) && "ph-combobox__option--selected"
              )}
            >
              {selectedSet.has(opt.value) && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6l2.5 2.5 4.5-5" />
                </svg>
              )}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Combobox.displayName = "Combobox";

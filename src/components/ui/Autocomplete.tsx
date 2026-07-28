"use client";

import { useState, useRef, useEffect, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface AutocompleteOption {
  value: string;
  label: string;
}

export interface AutocompleteProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onSelect"> {
  options: AutocompleteOption[];
  onSelect?: (option: AutocompleteOption) => void;
}

export function Autocomplete({
  options,
  onSelect,
  className,
  value: controlledValue,
  onChange,
  placeholder = "Type to search...",
  ...inputProps
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (opt: AutocompleteOption) => {
    setSearch(opt.label);
    setOpen(false);
    onSelect?.(opt);
  };

  useEffect(() => {
    if (!open) { setActiveIndex(-1); return; }
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)); e.preventDefault(); }
      if (e.key === "ArrowUp") { setActiveIndex((i) => Math.max(i - 1, 0)); e.preventDefault(); }
      if (e.key === "Enter" && activeIndex >= 0) { handleSelect(filtered[activeIndex]); e.preventDefault(); }
      if (e.key === "Escape") { setOpen(false); }
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, filtered, activeIndex]);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div ref={containerRef} className={cn("ph-autocomplete relative", className)}>
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setOpen(true); onChange?.(e); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="ph-input w-full"
        {...inputProps}
      />
      {open && filtered.length > 0 && (
        <div ref={listRef} className="ph-autocomplete__dropdown" role="listbox">
          {filtered.map((opt, i) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={() => handleSelect(opt)}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                "ph-autocomplete__option",
                i === activeIndex && "ph-autocomplete__option--active"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Autocomplete.displayName = "Autocomplete";

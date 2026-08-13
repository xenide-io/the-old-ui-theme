"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { IconSearch } from "@/components/icons";

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

interface CommandPaletteProps {
  items: CommandItem[];
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  className?: string;
  id?: string;
  dataTest?: string;
  inputId?: string;
  inputDataTest?: string;
}

export function CommandPalette({
  items,
  isOpen,
  onClose,
  placeholder = "Type a command or search...",
  className,
  id,
  dataTest,
  inputId,
  inputDataTest,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setQuery("");
    setSelectedIndex(0);
    inputRef.current?.focus();

    return () => previousFocusRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          if (!filtered.length) break;
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % filtered.length);
          break;
        case "ArrowUp":
          if (!filtered.length) break;
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
          break;
        case "Enter":
          e.preventDefault();
          filtered[selectedIndex]?.onSelect();
          onClose();
          break;
        case "Escape":
          onClose();
          break;
        case "Tab": {
          const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
            'input, button, [href], [tabindex]:not([tabindex="-1"])',
          );
          if (!focusable?.length) break;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id={id}
      data-test={dataTest}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[20vh] backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className={cn(
          "w-full max-w-xl overflow-hidden rounded-xl border border-ph-border bg-ph-surface shadow-ph-md",
          className,
        )}
      >
        <div className="flex items-center gap-3 border-b border-ph-border px-4 py-3">
          <IconSearch className="h-5 w-5 text-ph-mutedtext" />
          <input
            ref={inputRef}
            id={inputId}
            data-test={inputDataTest}
            type="text"
            aria-label="Search commands"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-ph-ink outline-none placeholder:text-ph-mutedtext"
          />
          <kbd className="rounded border border-ph-border bg-ph-muted px-1.5 py-0.5 text-xs text-ph-mutedtext">
            ESC
          </kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-ph-mutedtext">
              No results found.
            </div>
          ) : (
            filtered.map((item, index) => (
              <button
                key={item.id}
                type="button"
                id={`command-${item.id}`}
                data-test={`command-${item.id}`}
                onClick={() => {
                  item.onSelect();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                  index === selectedIndex
                    ? "bg-ph-muted text-ph-ink"
                    : "text-ph-subtle",
                )}
              >
                {item.icon && <span className="h-5 w-5">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <kbd className="rounded border border-ph-border bg-ph-surface px-1.5 py-0.5 text-xs text-ph-mutedtext">
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

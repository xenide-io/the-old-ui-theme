"use client";

import { useEffect, useId, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";
import { IconSearch } from "@/components/icons";

export interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps {
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
  const listboxRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const generatedId = useId();
  const listboxId = `${id ?? `command-palette-${generatedId}`}-listbox`;

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );
  const activeIndex = filtered.length
    ? Math.min(selectedIndex, filtered.length - 1)
    : 0;
  const activeItem = filtered[activeIndex];

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setSelectedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex((current) => Math.min(current, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  useEffect(() => {
    if (!isOpen || !activeItem) return;
    listboxRef.current
      ?.querySelectorAll<HTMLElement>('[role="option"]')
      [activeIndex]
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, activeItem, isOpen]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        if (!filtered.length) return;
        event.preventDefault();
        setSelectedIndex((current) => (current + 1) % filtered.length);
        return;
      case "ArrowUp":
        if (!filtered.length) return;
        event.preventDefault();
        setSelectedIndex((current) =>
          (current - 1 + filtered.length) % filtered.length,
        );
        return;
      case "Enter":
        if (!activeItem) return;
        event.preventDefault();
        activeItem.onSelect();
        onClose();
        return;
      default:
        return;
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          id={id}
          data-test={dataTest}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-[20vh] z-50 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-ph-border bg-ph-surface shadow-ph-md",
            className,
          )}
          onOpenAutoFocus={(event) => {
            restoreFocusRef.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
            event.preventDefault();
            inputRef.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            restoreFocusRef.current?.focus();
          }}
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-ph-border px-4 py-3">
            <IconSearch className="h-5 w-5 text-ph-mutedtext" />
            <input
              ref={inputRef}
              id={inputId}
              data-test={inputDataTest}
              type="text"
              role="combobox"
              aria-label="Search commands"
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-expanded="true"
              aria-activedescendant={activeItem ? `command-${activeItem.id}` : undefined}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-ph-ink outline-none placeholder:text-ph-mutedtext"
            />
            <kbd aria-hidden="true" className="rounded border border-ph-border bg-ph-muted px-1.5 py-0.5 text-xs text-ph-mutedtext">
              ESC
            </kbd>
          </div>
          <div ref={listboxRef} id={listboxId} role="listbox" aria-label="Commands" className="max-h-[50vh] overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div role="status" className="px-4 py-8 text-center text-sm text-ph-mutedtext">
                No results found.
              </div>
            ) : (
              filtered.map((item, index) => (
                <div
                  key={item.id}
                  id={`command-${item.id}`}
                  data-test={`command-${item.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => {
                    item.onSelect();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                    index === activeIndex
                      ? "bg-ph-muted text-ph-ink"
                      : "text-ph-subtle",
                  )}
                >
                  {item.icon && <span aria-hidden="true" className="h-5 w-5">{item.icon}</span>}
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && (
                    <kbd aria-hidden="true" className="rounded border border-ph-border bg-ph-surface px-1.5 py-0.5 text-xs text-ph-mutedtext">
                      {item.shortcut}
                    </kbd>
                  )}
                </div>
              ))
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

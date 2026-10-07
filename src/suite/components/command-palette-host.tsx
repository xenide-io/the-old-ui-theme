"use client";

import { useEffect, useMemo, useState } from "react";

import { trackSuiteEvent } from "../../lib/suite-analytics";
import type {
  SuiteCommandItem,
  SuiteCommandPaletteComponent,
} from "../lib/injected";

function isEditableTarget(): boolean {
  if (typeof document === "undefined") return false;
  const el = document.activeElement;
  return (
    el instanceof HTMLElement &&
    Boolean(
      el.closest(
        "input, textarea, select, [contenteditable='true'], [role='textbox']",
      ),
    )
  );
}

/**
 * Cmd/Ctrl+K command palette host. Apps build the item list and inject the
 * theme CommandPalette primitive.
 */
export function CommandPaletteHost({
  items,
  isAuthenticated = true,
  placeholder = "Type a command or search…",
  id,
  dataTest,
  inputId,
  inputDataTest,
  commandPalette: CommandPalette,
}: {
  items: SuiteCommandItem[];
  isAuthenticated?: boolean;
  placeholder?: string;
  id?: string;
  dataTest?: string;
  inputId?: string;
  inputDataTest?: string;
  commandPalette: SuiteCommandPaletteComponent;
}) {
  const [open, setOpen] = useState(false);

  // Wrap selection so a palette pick reports the chosen action. Apps own the
  // item list, so the id is the most stable `target` available here.
  const trackedItems = useMemo<SuiteCommandItem[]>(
    () =>
      items.map((item) => ({
        ...item,
        onSelect: () => {
          trackSuiteEvent("Command Palette Action", {
            action_kind: "command",
            target: item.id,
          });
          item.onSelect();
        },
      })),
    [items],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) return;
      // Leave editable fields alone unless the palette is open.
      if (!open && isEditableTarget()) return;
      e.preventDefault();
      setOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!isAuthenticated) return null;

  return (
    <CommandPalette
      items={trackedItems}
      isOpen={open}
      onClose={() => setOpen(false)}
      placeholder={placeholder}
      id={id}
      dataTest={dataTest}
      inputId={inputId}
      inputDataTest={inputDataTest}
    />
  );
}

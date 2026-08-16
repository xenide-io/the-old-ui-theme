"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) return;
      // Leave editors (BlockNote uses Cmd/Ctrl+K for links) alone unless the palette is open.
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
      items={items}
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

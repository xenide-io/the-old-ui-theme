"use client";

import { useState, useRef, useEffect, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface ContextMenuItem {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean;
  icon?: ReactNode;
}

export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  items: ContextMenuItem[];
  children: ReactNode;
}

export function ContextMenu({ items, children, className, ...props }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div
      className={cn("ph-context-menu", className)}
      onContextMenu={(e) => {
        e.preventDefault();
        setPos({ x: e.clientX, y: e.clientY });
        setOpen(true);
      }}
      {...props}
    >
      {children}
      {open && (
        <div
          ref={menuRef}
          className="ph-context-menu__panel"
          style={{ left: pos.x, top: pos.y }}
        >
          {items.map((item, i) =>
            item.separator ? (
              <div key={i} className="ph-context-menu__separator" />
            ) : (
              <button
                key={i}
                type="button"
                disabled={item.disabled}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                className="ph-context-menu__item"
              >
                {item.icon && <span className="ph-context-menu__icon">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

ContextMenu.displayName = "ContextMenu";

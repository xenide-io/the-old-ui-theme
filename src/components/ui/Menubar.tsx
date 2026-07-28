"use client";

import { useState, useRef, useEffect, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface MenubarItem {
  label: string;
  items?: { label: string; onClick?: () => void; disabled?: boolean; separator?: boolean }[];
}

export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
  items: MenubarItem[];
}

export function Menubar({ items, className, ...props }: MenubarProps) {
  const [openIndex, setOpenIndex] = useState(-1);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openIndex < 0) return;
    const handle = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenIndex(-1);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [openIndex]);

  return (
    <div ref={barRef} className={cn("ph-menubar", className)} {...props}>
      {items.map((item, i) => (
        <div key={i} className="ph-menubar__item">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            className={cn("ph-menubar__trigger", openIndex === i && "ph-menubar__trigger--open")}
          >
            {item.label}
          </button>
          {openIndex === i && item.items && (
            <div className="ph-menubar__dropdown">
              {item.items.map((sub, j) =>
                sub.separator ? (
                  <div key={j} className="ph-menubar__separator" />
                ) : (
                  <button
                    key={j}
                    type="button"
                    disabled={sub.disabled}
                    onClick={() => { sub.onClick?.(); setOpenIndex(-1); }}
                    className="ph-menubar__sub-item"
                  >
                    {sub.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

Menubar.displayName = "Menubar";

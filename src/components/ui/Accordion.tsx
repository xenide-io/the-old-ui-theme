"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { IconChevronDown } from "@/components/icons";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn("divide-y divide-ph-border rounded-xl border border-ph-border bg-ph-surface", className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        return (
          <div key={item.id} className="first:rounded-t-xl last:rounded-b-xl">
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-ph-muted"
            >
              <span className="font-semibold text-ph-ink">{item.title}</span>
              <IconChevronDown
                className={cn(
                  "h-5 w-5 text-ph-mutedtext transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-200",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-4 text-ph-subtle">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

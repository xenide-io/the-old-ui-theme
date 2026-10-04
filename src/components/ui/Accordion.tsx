"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { IconChevronDown } from "@/components/icons";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
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
  const idPrefix = useId();

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
    <div
      className={cn("ph-accordion", className)}
    >
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const contentId = `accordion-${idPrefix}-${item.id}-content`;
        return (
          <div key={item.id} className="ph-accordion__item">
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              aria-controls={contentId}
              className="ph-accordion__trigger"
            >
              <span className="font-semibold text-ph-ink">{item.title}</span>
              <IconChevronDown
                className={cn(
                  "h-5 w-5 text-ph-mutedtext transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              id={contentId}
              aria-hidden={!isOpen}
              ref={(node) => {
                if (node) node.toggleAttribute("inert", !isOpen);
              }}
              className={cn(
                "grid transition-[grid-template-rows] duration-200",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
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

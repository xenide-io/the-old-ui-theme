"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function HoverCard({ trigger, children, className }: HoverCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {trigger}
      <div
        className={cn(
          "absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-lg border border-ph-border bg-ph-surface p-4 shadow-ph-md transition-all duration-150",
          isVisible
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0",
          className
        )}
      >
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-ph-border bg-ph-surface" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

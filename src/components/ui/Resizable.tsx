"use client";

import { useState, useRef, useCallback, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface ResizableProps extends HTMLAttributes<HTMLDivElement> {
  left: ReactNode;
  right: ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  minRightWidth?: number;
}

export function Resizable({
  left,
  right,
  defaultLeftWidth = 50,
  minLeftWidth = 20,
  minRightWidth = 20,
  className,
  ...props
}: ResizableProps) {
  const [leftPercent, setLeftPercent] = useState(defaultLeftWidth);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    const startX = e.clientX;
    const startPercent = leftPercent;

    const handleMove = (ev: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const delta = ((ev.clientX - startX) / rect.width) * 100;
      const newVal = Math.max(minLeftWidth, Math.min(100 - minRightWidth, startPercent + delta));
      setLeftPercent(newVal);
    };

    const handleUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }, [leftPercent, minLeftWidth, minRightWidth]);

  return (
    <div
      ref={containerRef}
      className={cn("ph-resizable flex overflow-hidden", className)}
      {...props}
    >
      <div className="ph-resizable__left overflow-auto" style={{ width: `${leftPercent}%` }}>
        {left}
      </div>
      <div
        className="ph-resizable__handle cursor-col-resize shrink-0"
        onMouseDown={handleMouseDown}
      />
      <div className="ph-resizable__right flex-1 overflow-auto">
        {right}
      </div>
    </div>
  );
}

Resizable.displayName = "Resizable";

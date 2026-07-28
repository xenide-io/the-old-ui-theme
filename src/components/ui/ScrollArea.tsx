"use client";

import { useRef, useState, useEffect, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  orientation?: "vertical" | "horizontal" | "both";
}

export function ScrollArea({
  children,
  orientation = "vertical",
  className,
  ...props
}: ScrollAreaProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => {
      setShowTop(el.scrollTop > 4);
      setShowBottom(el.scrollTop < el.scrollHeight - el.clientHeight - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, []);

  return (
    <div
      className={cn(
        "ph-scroll-area relative overflow-hidden",
        orientation === "horizontal" && "overflow-x-auto",
        orientation === "both" && "overflow-auto",
        className
      )}
      {...props}
    >
      {showTop && <div className="ph-scroll-area__shadow-top" />}
      <div ref={viewportRef} className="ph-scroll-area__viewport overflow-y-auto overscroll-contain">
        {children}
      </div>
      {showBottom && <div className="ph-scroll-area__shadow-bottom" />}
    </div>
  );
}

ScrollArea.displayName = "ScrollArea";

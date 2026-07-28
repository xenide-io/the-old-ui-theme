import { useState, useRef, useEffect, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: "top" | "bottom" | "left" | "right";
  matchTriggerWidth?: boolean;
  padded?: boolean;
}

export function Popover({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  placement = "bottom",
  matchTriggerWidth = false,
  padded = true,
  className,
  ...props
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        panelRef.current && !panelRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, setOpen]);

  return (
    <div className={cn("ph-popover relative inline-flex", className)} {...props}>
      <div
        ref={triggerRef}
        onClick={() => setOpen(!isOpen)}
        className="ph-popover__trigger"
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={panelRef}
          className={cn(
            "ph-popover__panel",
            `ph-popover--${placement}`,
            padded && "ph-popover__panel--padded",
            matchTriggerWidth && "ph-popover__panel--match"
          )}
          style={matchTriggerWidth ? { width: triggerRef.current?.offsetWidth } : undefined}
        >
          {children}
        </div>
      )}
    </div>
  );
}

Popover.displayName = "Popover";

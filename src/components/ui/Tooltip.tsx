"use client";

import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";

export interface TooltipProviderProps {
  children: ReactNode;
  delayDuration?: number;
}

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement<HTMLAttributes<HTMLElement>>;
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  collisionPadding?: number;
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  disableHoverableContent?: boolean;
}

const TooltipDelayContext = createContext(0);

export function TooltipProvider({
  children,
  delayDuration = 0,
}: TooltipProviderProps) {
  return (
    <TooltipDelayContext.Provider value={delayDuration}>
      {children}
    </TooltipDelayContext.Provider>
  );
}

function tooltipPosition(
  trigger: DOMRect,
  side: TooltipSide,
  align: TooltipAlign,
  offset: number,
) {
  const horizontal =
    align === "start"
      ? trigger.left
      : align === "end"
        ? trigger.right
        : trigger.left + trigger.width / 2;
  const vertical =
    align === "start"
      ? trigger.top
      : align === "end"
        ? trigger.bottom
        : trigger.top + trigger.height / 2;
  if (side === "top")
    return {
      left: horizontal,
      top: trigger.top - offset,
      transform: "translate(-50%, -100%)",
    };
  if (side === "bottom")
    return {
      left: horizontal,
      top: trigger.bottom + offset,
      transform: "translate(-50%, 0)",
    };
  if (side === "left")
    return {
      left: trigger.left - offset,
      top: vertical,
      transform: "translate(-100%, -50%)",
    };
  return {
    left: trigger.right + offset,
    top: vertical,
    transform: "translate(0, -50%)",
  };
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 7,
  className,
  open,
  defaultOpen = false,
  onOpenChange,
  delayDuration,
}: TooltipProps) {
  const providerDelay = useContext(TooltipDelayContext);
  const generatedId = useId().replace(/:/g, "");
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<ReturnType<
    typeof tooltipPosition
  > | null>(null);
  const isOpen = open ?? internalOpen;
  const triggerId = children.props.id;
  const tooltipId = triggerId
    ? `${triggerId}-tooltip`
    : `ph-tooltip-${generatedId}`;

  function setOpen(next: boolean) {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  }

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function updatePosition() {
    if (!triggerRef.current) return;
    setPosition(
      tooltipPosition(
        triggerRef.current.getBoundingClientRect(),
        side,
        align,
        sideOffset,
      ),
    );
  }

  function show(immediate: boolean) {
    clearTimer();
    updatePosition();
    const delay = immediate ? 0 : (delayDuration ?? providerDelay);
    if (!delay) setOpen(true);
    else timerRef.current = setTimeout(() => setOpen(true), delay);
  }

  function hide() {
    clearTimer();
    setOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;
    const reposition = () => updatePosition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  });

  useEffect(() => () => clearTimer(), []);

  const describedBy = [children.props["aria-describedby"], tooltipId]
    .filter(Boolean)
    .join(" ");
  const trigger = cloneElement(children, { "aria-describedby": describedBy });

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={() => show(false)}
        onMouseLeave={hide}
        onFocusCapture={() => show(true)}
        onBlurCapture={hide}
        onKeyDown={(event) => {
          if (event.key === "Escape") hide();
        }}
      >
        {trigger}
      </span>
      {isOpen && position && typeof document !== "undefined"
        ? createPortal(
            <span
              style={{ position: "fixed", ...position }}
              className="pointer-events-none z-[200]"
            >
              <span
                id={tooltipId}
                role="tooltip"
                data-side={side}
                className={cn("ph-tooltip-content", className)}
              >
                {content}
              </span>
            </span>,
            document.body,
          )
        : null}
    </>
  );
}

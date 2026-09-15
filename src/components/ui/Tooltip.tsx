"use client";

import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
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
  /** Minimum distance between the tooltip and the viewport edge. */
  collisionPadding?: number;
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  /** Prevents the pointer from keeping the tooltip open over its content. */
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
  content: DOMRect,
  side: TooltipSide,
  align: TooltipAlign,
  offset: number,
  collisionPadding: number,
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
  const position =
    side === "top"
      ? { left: horizontal - content.width / 2, top: trigger.top - offset - content.height }
      : side === "bottom"
        ? { left: horizontal - content.width / 2, top: trigger.bottom + offset }
        : side === "left"
          ? { left: trigger.left - offset - content.width, top: vertical - content.height / 2 }
          : { left: trigger.right + offset, top: vertical - content.height / 2 };
  const maxLeft = Math.max(collisionPadding, window.innerWidth - content.width - collisionPadding);
  const maxTop = Math.max(collisionPadding, window.innerHeight - content.height - collisionPadding);

  return {
    left: Math.min(Math.max(position.left, collisionPadding), maxLeft),
    top: Math.min(Math.max(position.top, collisionPadding), maxTop),
  };
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 7,
  collisionPadding = 8,
  className,
  open,
  defaultOpen = false,
  onOpenChange,
  delayDuration,
  disableHoverableContent = false,
}: TooltipProps) {
  const providerDelay = useContext(TooltipDelayContext);
  const generatedId = useId().replace(/:/g, "");
  const triggerRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
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

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;
    setPosition(
      tooltipPosition(
        triggerRef.current.getBoundingClientRect(),
        contentRef.current.getBoundingClientRect(),
        side,
        align,
        sideOffset,
        collisionPadding,
      ),
    );
  }, [align, collisionPadding, side, sideOffset]);

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

  function hideFromTrigger() {
    if (disableHoverableContent) {
      hide();
      return;
    }

    clearTimer();
    timerRef.current = setTimeout(() => setOpen(false), 100);
  }

  useLayoutEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const reposition = () => updatePosition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [isOpen, updatePosition]);

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
        onMouseLeave={hideFromTrigger}
        onFocusCapture={() => show(true)}
        onBlurCapture={hide}
        onKeyDown={(event) => {
          if (event.key === "Escape") hide();
        }}
      >
        {trigger}
      </span>
      {isOpen && typeof document !== "undefined"
        ? createPortal(
            <span
              style={{ position: "fixed", ...position, visibility: position ? undefined : "hidden" }}
              className="pointer-events-none z-[200]"
            >
              <span
                ref={contentRef}
                id={tooltipId}
                role="tooltip"
                data-side={side}
                className={cn(
                  "ph-tooltip-content",
                  !disableHoverableContent && "pointer-events-auto",
                  className,
                )}
                onMouseEnter={disableHoverableContent ? undefined : clearTimer}
                onMouseLeave={disableHoverableContent ? undefined : hide}
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

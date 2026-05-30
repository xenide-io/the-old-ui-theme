import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ChatBubbleVariant = "from" | "self";

export interface ChatBubbleProps extends ComponentPropsWithoutRef<"div"> {
  /** Message content */
  children?: ReactNode;
  /** Avatar or icon */
  avatar?: ReactNode;
  /** Sender name */
  name?: string;
  /** Timestamp */
  time?: string;
  /** "from" = left/grey, "self" = right/brand */
  variant?: ChatBubbleVariant;
  /** Footer text (e.g. "Synced with...") */
  footer?: ReactNode;
}

export function ChatBubble({
  children,
  avatar,
  name,
  time,
  variant = "from",
  footer,
  className,
  ...props
}: ChatBubbleProps) {
  const isSelf = variant === "self";

  return (
    <div
      className={cn(
        "flex gap-3",
        isSelf && "flex-row-reverse",
        className,
      )}
      {...props}
    >
      {avatar && (
        <div className="shrink-0">{avatar}</div>
      )}
      <div className={cn("min-w-0 flex-1", isSelf && "text-right")}>
        {(name || time) && (
          <header
            className={cn(
              "flex gap-2 text-xs text-ph-mutedtext",
              isSelf && "flex-row-reverse justify-end",
            )}
          >
            {name && <span className="font-semibold text-ph-ink">{name}</span>}
            {time && <span>{time}</span>}
          </header>
        )}
        <div
          className={cn(
            "mt-2 inline-block text-left shadow-ph",
            isSelf ? "ph-chat-self" : "ph-chat-from",
          )}
        >
          {children}
        </div>
        {footer && (
          <footer className="mt-2 text-[11px] text-ph-mutedtext">{footer}</footer>
        )}
      </div>
    </div>
  );
}

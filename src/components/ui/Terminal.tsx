import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TerminalProps extends ComponentPropsWithoutRef<"div"> {
  /** Window title */
  title?: string;
  /** Terminal lines — array of { text, color? } or plain strings */
  lines?: Array<{ text: string; color?: string } | string>;
  /** Custom content instead of lines */
  children?: ReactNode;
}

export function Terminal({
  title = "sandbox",
  lines,
  children,
  className,
  ...props
}: TerminalProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-ph-border shadow-ph-md",
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-2 border-b border-ph-border bg-ph-muted px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-400" />
        <div className="h-3 w-3 rounded-full bg-amber-400" />
        <div className="h-3 w-3 rounded-full bg-emerald-400" />
        {title && (
          <span className="text-xs font-medium text-ph-mutedtext">{title}</span>
        )}
      </header>
      <div className="ph-code rounded-none border-x-0 border-b-0 text-[13px] leading-relaxed">
        {children || (
          <>
            {lines?.map((line, i) => {
              const text = typeof line === "string" ? line : line.text;
              const color = typeof line === "string" ? undefined : line.color;
              return (
                <span key={i}>
                  <span className={color || "text-neutral-600"}>{text}</span>
                  {i < lines.length - 1 && <br />}
                </span>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

import type { ComponentPropsWithoutRef } from "react";
import type { RibbonColour } from "./types";
import { cn } from "@/lib/cn";

export interface InsightShellProps extends ComponentPropsWithoutRef<"article"> {
  /**
   * Left ribbon fill; omit or pass empty string for a flat card (no ribbon column).
   * Prefer `var(--ph-product-*)` or `var(--ph-data-*)` tokens from `globals.css`.
   */
  ribbonColour?: RibbonColour | null;
  /** Extra classes on the padded body column (e.g. `gap-4`). */
  bodyClassName?: string;
}

export function InsightShell({
  ribbonColour,
  bodyClassName,
  className,
  children,
  ...props
}: InsightShellProps) {
  const ribbon =
    ribbonColour != null && String(ribbonColour).trim() !== "" ? String(ribbonColour).trim() : null;

  return (
    <article className={cn("ph-insight-shell flex-row", className)} {...props}>
      {ribbon != null ? (
        <div
          className="ph-insight-shell__ribbon min-h-[7rem] shrink-0 self-stretch"
          style={{ background: ribbon }}
          aria-hidden
        />
      ) : null}
      <div className={cn("flex min-w-0 flex-1 flex-col gap-3 p-4", bodyClassName)}>{children}</div>
    </article>
  );
}

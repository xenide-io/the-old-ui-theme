import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  dashed?: boolean;
  thick?: boolean;
  label?: string;
}

export function Divider({
  vertical = false,
  dashed = false,
  thick = false,
  label,
  className,
  ...props
}: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      className={cn(
        "ph-divider",
        vertical && "ph-divider--vertical",
        thick && "ph-divider--thick",
        dashed && "ph-divider--dashed",
        !!label && "ph-divider--with-label",
        !className && (vertical ? "mx-2 self-stretch" : "my-2"),
        className
      )}
      {...props}
    >
      {label && <span className="ph-divider__label">{label}</span>}
    </div>
  );
}

Divider.displayName = "Divider";

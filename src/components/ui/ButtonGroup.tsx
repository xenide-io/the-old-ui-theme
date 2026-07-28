import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function ButtonGroup({ children, className, ...props }: ButtonGroupProps) {
  return (
    <div className={cn("ph-btn-group", className)} {...props}>
      {children}
    </div>
  );
}

ButtonGroup.displayName = "ButtonGroup";

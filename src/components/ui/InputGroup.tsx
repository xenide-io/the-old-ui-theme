import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function InputGroup({ children, className, ...props }: InputGroupProps) {
  return (
    <div className={cn("ph-input-group", className)} {...props}>
      {children}
    </div>
  );
}

InputGroup.displayName = "InputGroup";

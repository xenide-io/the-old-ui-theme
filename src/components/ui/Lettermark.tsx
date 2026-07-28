import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface LettermarkProps extends HTMLAttributes<HTMLDivElement> {
  name?: string | number | null;
  index?: number;
  rounded?: boolean;
  outlined?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}

export const Lettermark = forwardRef<HTMLDivElement, LettermarkProps>(function Lettermark({
  name,
  index,
  outlined = false,
  rounded = false,
  size = "md",
  className,
  ...props
}, ref) {
  const letter = name
    ? typeof name === "number"
      ? String(Math.floor(name))
      : String.fromCodePoint(name.codePointAt(0)!).toLocaleUpperCase()
    : "?";

  return (
    <div
      ref={ref}
      className={cn(
        "ph-lettermark",
        `ph-lettermark--${size}`,
        typeof index === "number" && `ph-lettermark--v-${(index % 8) + 1}`,
        outlined && "ph-lettermark--outlined",
        rounded && "ph-lettermark--rounded",
        letter === "?" && "ph-lettermark--unknown",
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {letter}
    </div>
  );
});

Lettermark.displayName = "Lettermark";

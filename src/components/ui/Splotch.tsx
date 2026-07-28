import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type SplotchColor = "purple" | "blue" | "green" | "black" | "white" | "orange" | "red" | "yellow";

export interface SplotchProps extends HTMLAttributes<HTMLDivElement> {
  color: SplotchColor;
}

const colorMap: Record<SplotchColor, string> = {
  purple: "ph-splotch--purple",
  blue: "ph-splotch--blue",
  green: "ph-splotch--green",
  black: "ph-splotch--black",
  white: "ph-splotch--white",
  orange: "ph-splotch--orange",
  red: "ph-splotch--red",
  yellow: "ph-splotch--yellow",
};

export function Splotch({ color, className, ...props }: SplotchProps) {
  return (
    <div
      className={cn("ph-splotch", colorMap[color], className)}
      aria-hidden="true"
      {...props}
    >
      <div className="ph-splotch__paint" />
    </div>
  );
}

Splotch.displayName = "Splotch";

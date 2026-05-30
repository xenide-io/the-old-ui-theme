import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TextTone =
  | "default"
  | "muted"
  | "subtle"
  | "brand"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "inherit";

export type TextWeight =
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold";

export interface TextBaseProps {
  tone?: TextTone;
  weight?: TextWeight;
  className?: string;
  children?: ReactNode;
  truncate?: boolean;
}

const toneMap: Record<TextTone, string> = {
  default: "text-ph-ink",
  muted: "text-ph-mutedtext",
  subtle: "text-ph-subtle",
  brand: "text-ph-brand",
  danger: "text-ph-danger",
  success: "text-ph-success",
  warning: "text-ph-warning",
  info: "text-ph-info",
  inherit: "",
};

const weightMap: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

function textClass(
  base: string,
  tone: TextTone,
  weight?: TextWeight,
  truncate?: boolean,
  className?: string
) {
  return cn(base, toneMap[tone], weight && weightMap[weight], truncate && "truncate", className);
}

/** Display text — largest heading, use once per page */
export function Display({
  children,
  tone = "default",
  weight,
  truncate,
  className,
}: TextBaseProps) {
  return <h1 className={textClass("text-4xl font-extrabold tracking-tight md:text-5xl", tone, weight, truncate, className)}>{children}</h1>;
}

/** H1 — page title */
export function H1({ children, tone = "default", weight, truncate, className }: TextBaseProps) {
  return <h1 className={textClass("text-3xl font-bold tracking-tight md:text-4xl", tone, weight, truncate, className)}>{children}</h1>;
}

/** H2 — section title */
export function H2({ children, tone = "default", weight, truncate, className }: TextBaseProps) {
  return <h2 className={textClass("text-2xl font-bold tracking-tight", tone, weight, truncate, className)}>{children}</h2>;
}

/** H3 — subsection title */
export function H3({ children, tone = "default", weight, truncate, className }: TextBaseProps) {
  return <h3 className={textClass("text-xl font-semibold", tone, weight, truncate, className)}>{children}</h3>;
}

/** H4 — card / panel title */
export function H4({ children, tone = "default", weight, truncate, className }: TextBaseProps) {
  return <h4 className={textClass("text-lg font-semibold", tone, weight, truncate, className)}>{children}</h4>;
}

/** H5 — small heading */
export function H5({ children, tone = "default", weight, truncate, className }: TextBaseProps) {
  return <h5 className={textClass("text-base font-semibold", tone, weight, truncate, className)}>{children}</h5>;
}

/** Body — default paragraph text */
export function P({ children, tone = "default", weight, truncate, className }: TextBaseProps) {
  return <p className={textClass("text-base leading-relaxed", tone, weight, truncate, className)}>{children}</p>;
}

/** Small body text */
export function Small({ children, tone = "default", weight, truncate, className }: TextBaseProps) {
  return <span className={textClass("text-sm leading-relaxed", tone, weight, truncate, className)}>{children}</span>;
}

/** Extra small text — captions, meta */
export function Caption({ children, tone = "muted", weight, truncate, className }: TextBaseProps) {
  return <span className={textClass("text-[11px] font-medium uppercase tracking-wider", tone, weight, truncate, className)}>{children}</span>;
}

/** Overline — tiny eyebrow text */
export function Overline({ children, tone = "muted", weight, truncate, className }: TextBaseProps) {
  return <span className={textClass("text-[10px] font-bold uppercase tracking-[0.15em]", tone, weight, truncate, className)}>{children}</span>;
}

/** Lead — intro paragraph, larger and muted */
export function Lead({ children, tone = "subtle", weight, truncate, className }: TextBaseProps) {
  return <p className={textClass("text-lg leading-relaxed", tone, weight, truncate, className)}>{children}</p>;
}

/** Mono — code, data, technical text */
export function Mono({ children, tone = "default", weight, truncate, className }: TextBaseProps) {
  return <code className={textClass("text-sm font-mono leading-relaxed", tone, weight, truncate, className)}>{children}</code>;
}

/** Label — form labels, tags */
export function Label({ children, tone = "default", weight, truncate, className }: TextBaseProps) {
  return <label className={textClass("text-sm font-medium", tone, weight, truncate, className)}>{children}</label>;
}

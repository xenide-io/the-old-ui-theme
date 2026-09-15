import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
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

type TypographyProps<T extends ElementType> = TextBaseProps &
  Omit<ComponentPropsWithoutRef<T>, keyof TextBaseProps>;

export type DisplayProps = TypographyProps<"h1">;
export type SectionTitleProps = TypographyProps<"h2">;
export type H1Props = TypographyProps<"h1">;
export type H2Props = TypographyProps<"h2">;
export type H3Props = TypographyProps<"h3">;
export type H4Props = TypographyProps<"h4">;
export type H5Props = TypographyProps<"h5">;
export type PProps = TypographyProps<"p">;
export type SmallProps = TypographyProps<"span">;
export type CaptionProps = TypographyProps<"span">;
export type OverlineProps = TypographyProps<"span">;
export type LeadProps = TypographyProps<"p">;
export type MonoProps = TypographyProps<"code">;
export type LabelProps = TypographyProps<"label">;

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

/**
 * Display — the marketing hero: fluid size, tight tracking, one per page.
 * Product page titles use H1/`SuitePageHeader` instead.
 */
export const Display = forwardRef<HTMLHeadingElement, DisplayProps>(function Display(
  { children, tone = "default", weight, truncate, className, ...props },
  ref,
) {
  return <h1 ref={ref} {...props} className={textClass("ph-hero-title", tone, weight, truncate, className)}>{children}</h1>;
});

/** Section title — fluid; pairs with Display on public pages. */
export const SectionTitle = forwardRef<HTMLHeadingElement, SectionTitleProps>(function SectionTitle(
  { children, tone = "default", weight, truncate, className, ...props },
  ref,
) {
  return <h2 ref={ref} {...props} className={textClass("ph-section-title", tone, weight, truncate, className)}>{children}</h2>;
});

/** H1 — page title */
export const H1 = forwardRef<HTMLHeadingElement, H1Props>(function H1(
  { children, tone = "default", weight, truncate, className, ...props },
  ref,
) {
  return <h1 ref={ref} {...props} className={textClass("text-3xl font-bold tracking-tight md:text-4xl", tone, weight, truncate, className)}>{children}</h1>;
});

/** H2 — section title */
export const H2 = forwardRef<HTMLHeadingElement, H2Props>(function H2(
  { children, tone = "default", weight, truncate, className, ...props },
  ref,
) {
  return <h2 ref={ref} {...props} className={textClass("text-2xl font-bold tracking-tight", tone, weight, truncate, className)}>{children}</h2>;
});

/** H3 — subsection title */
export const H3 = forwardRef<HTMLHeadingElement, H3Props>(function H3(
  { children, tone = "default", weight, truncate, className, ...props },
  ref,
) {
  return <h3 ref={ref} {...props} className={textClass("text-xl font-semibold", tone, weight, truncate, className)}>{children}</h3>;
});

/** H4 — card / panel title */
export const H4 = forwardRef<HTMLHeadingElement, H4Props>(function H4(
  { children, tone = "default", weight, truncate, className, ...props },
  ref,
) {
  return <h4 ref={ref} {...props} className={textClass("text-lg font-semibold", tone, weight, truncate, className)}>{children}</h4>;
});

/** H5 — small heading */
export const H5 = forwardRef<HTMLHeadingElement, H5Props>(function H5(
  { children, tone = "default", weight, truncate, className, ...props },
  ref,
) {
  return <h5 ref={ref} {...props} className={textClass("text-base font-semibold", tone, weight, truncate, className)}>{children}</h5>;
});

/** Body — default paragraph text */
export const P = forwardRef<HTMLParagraphElement, PProps>(function P(
  { children, tone = "default", weight, truncate, className, ...props },
  ref,
) {
  return <p ref={ref} {...props} className={textClass("text-base leading-relaxed", tone, weight, truncate, className)}>{children}</p>;
});

/** Small body text */
export const Small = forwardRef<HTMLSpanElement, SmallProps>(function Small(
  { children, tone = "default", weight, truncate, className, ...props },
  ref,
) {
  return <span ref={ref} {...props} className={textClass("text-sm leading-relaxed", tone, weight, truncate, className)}>{children}</span>;
});

/** Extra small text — captions, meta */
export const Caption = forwardRef<HTMLSpanElement, CaptionProps>(function Caption(
  { children, tone = "muted", weight, truncate, className, ...props },
  ref,
) {
  return <span ref={ref} {...props} className={textClass("text-[11px] font-medium uppercase tracking-wider", tone, weight, truncate, className)}>{children}</span>;
});

/** Overline — tiny eyebrow text */
export const Overline = forwardRef<HTMLSpanElement, OverlineProps>(function Overline(
  { children, tone = "muted", weight, truncate, className, ...props },
  ref,
) {
  return <span ref={ref} {...props} className={textClass("text-[10px] font-bold uppercase tracking-[0.15em]", tone, weight, truncate, className)}>{children}</span>;
});

/** Lead — intro paragraph under a Display/SectionTitle; measure-capped for readability */
export const Lead = forwardRef<HTMLParagraphElement, LeadProps>(function Lead(
  { children, tone = "subtle", weight, truncate, className, ...props },
  ref,
) {
  return <p ref={ref} {...props} className={textClass("ph-lead", tone, weight, truncate, className)}>{children}</p>;
});

/** Mono — code, data, technical text */
export const Mono = forwardRef<HTMLElement, MonoProps>(function Mono(
  { children, tone = "default", weight, truncate, className, ...props },
  ref,
) {
  return <code ref={ref} {...props} className={textClass("text-sm font-mono leading-relaxed", tone, weight, truncate, className)}>{children}</code>;
});

/** Label — form labels, tags */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { children, tone = "default", weight, truncate, className, ...props },
  ref,
) {
  return <label ref={ref} {...props} className={textClass("text-sm font-medium", tone, weight, truncate, className)}>{children}</label>;
});

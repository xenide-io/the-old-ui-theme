import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEventHandler,
  type Ref,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "default" | "outlined" | "elevated" | "highlighted";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onClick"> {
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
  variant?: CardVariant;
  className?: string;
  bodyClassName?: string;
  /**
   * Applies interactive chrome to a card containing its own semantic control.
   * This alone does not make the card clickable; use `href` or `onClick` for a
   * full-card action.
   */
  interactive?: boolean;
  /** Renders the full card as a semantic link. Do not combine with nested controls. */
  href?: string;
  /** Renders the full card as a semantic button. Do not combine with nested controls. */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Link target, used when `href` is provided. */
  target?: string;
  /** Link relationship, used when `href` is provided. */
  rel?: string;
  /** Button behaviour, used when `onClick` is provided without `href`. */
  type?: "button" | "submit" | "reset";
  titleAs?: "h2" | "h3" | "h4";
}

const variantMap: Record<CardVariant, string> = {
  default: "",
  outlined: "border-2 border-ph-border",
  elevated: "ph-card-elevated",
  highlighted: "ph-card-highlighted",
};

export const Card = forwardRef<HTMLElement, CardProps>(function Card({
  children,
  title,
  description,
  actions,
  footer,
  media,
  variant = "default",
  className,
  bodyClassName,
  interactive = false,
  href,
  onClick,
  target,
  rel,
  type,
  titleAs: Title = "h3",
  ...props
}, ref) {
  const isLink = href !== undefined;
  const isButton = onClick !== undefined && !isLink;
  const cardClassName = cn(
    "ph-card",
    variantMap[variant],
    (interactive || isLink || isButton) && "ph-card-interactive",
    className,
  );
  const cardContent = (
    <>
      {media && <div className="ph-card-media">{media}</div>}
      <div className={cn("ph-card-body", bodyClassName)}>
        {title && (
          <Title className="ph-card-title">{title}</Title>
        )}
        {description && (
          <p className="text-sm text-ph-subtle">{description}</p>
        )}
        {children}
        {actions && <div className="ph-card-actions">{actions}</div>}
      </div>
      {footer && (
        <div className="border-t border-ph-border px-6 py-4 text-xs text-ph-subtle">{footer}</div>
      )}
    </>
  );

  if (isLink) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        className={cardClassName}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {cardContent}
      </a>
    );
  }

  if (isButton) {
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type={type ?? "button"}
        className={cardClassName}
        onClick={onClick}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div ref={ref as Ref<HTMLDivElement>} className={cardClassName} {...props}>
      {cardContent}
    </div>
  );
});

Card.displayName = "Card";

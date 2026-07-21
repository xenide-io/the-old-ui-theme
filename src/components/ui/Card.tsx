import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "default" | "outlined" | "elevated" | "highlighted";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
  variant?: CardVariant;
  className?: string;
  bodyClassName?: string;
  interactive?: boolean;
  titleAs?: "h2" | "h3" | "h4";
}

const variantMap: Record<CardVariant, string> = {
  default: "",
  outlined: "border-2 border-ph-border",
  elevated: "ph-card-elevated",
  highlighted: "ph-card-highlighted",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({
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
  titleAs: Title = "h3",
  ...props
}, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "ph-card",
        variantMap[variant],
        interactive && "ph-card-interactive",
        className
      )}
      {...props}
    >
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
    </div>
  );
});

Card.displayName = "Card";

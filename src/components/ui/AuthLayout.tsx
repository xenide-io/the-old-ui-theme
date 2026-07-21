import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface AuthLayoutProps extends ComponentPropsWithoutRef<"div"> {
  brand?: ReactNode;
  footer?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}

export interface AuthCardProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export interface AuthDividerProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
}

export function AuthLayout({ brand, footer, aside, children, className, ...props }: AuthLayoutProps) {
  return (
    <div className={cn("ph-auth-layout", aside != null && "ph-auth-layout--split", className)} {...props}>
      {aside ? <aside className="ph-auth-layout__aside">{aside}</aside> : null}
      <div className="ph-auth-layout__main">
        <div className="ph-auth-layout__column">
          {brand ? <div className="ph-auth-layout__brand">{brand}</div> : null}
          {children}
          {footer ? <footer className="ph-auth-layout__footer">{footer}</footer> : null}
        </div>
      </div>
    </div>
  );
}

export function AuthCard({ title, description, footer, children, className, ...props }: AuthCardProps) {
  const titleId = useId();

  return (
    <section className={cn("ph-auth-card", className)} aria-labelledby={titleId} {...props}>
      <header className="ph-auth-card__header">
        <h1 id={titleId}>{title}</h1>
        {description ? <p>{description}</p> : null}
      </header>
      <div className="ph-auth-card__body">{children}</div>
      {footer ? <footer className="ph-auth-card__footer">{footer}</footer> : null}
    </section>
  );
}

export function AuthDivider({ children = "or continue with", className, ...props }: AuthDividerProps) {
  return (
    <div className={cn("ph-auth-divider", className)} {...props}>
      <span>{children}</span>
    </div>
  );
}

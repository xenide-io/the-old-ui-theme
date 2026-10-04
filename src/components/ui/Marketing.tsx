"use client";

import {
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Pause, Play } from "iconoir-react";
import { ButtonChrome } from "@/components/ui/ButtonChrome";
import { cn } from "@/lib/cn";

/** Pure presentation slots: every product owns its links and authentication state. */
export function MarketingHeader({
  brand,
  navigation,
  actions,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  brand: ReactNode;
  navigation: ReactNode;
  actions: ReactNode;
}) {
  return (
    <header {...props} className={cn("marketing-header", className)}>
      <div className="marketing-header__inner">
        <div className="marketing-header__brand">{brand}</div>
        <nav
          className="marketing-header__navigation"
          aria-label="Product navigation"
        >
          {navigation}
        </nav>
        <div className="marketing-header__actions">{actions}</div>
      </div>
    </header>
  );
}

export function MarketingLink({
  variant = "secondary",
  icon,
  sideIcon,
  children,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "secondary" | "accent";
  icon?: ReactNode;
  sideIcon?: ReactNode;
}) {
  return (
    <a
      {...props}
      className={cn(
        "ph-btn ph-btn-raised marketing-button",
        `ph-btn-${variant}`,
        className,
      )}
    >
      <ButtonChrome label={children} icon={icon} sideIcon={sideIcon} />
    </a>
  );
}

/** Keep animated artwork controllable without taking space away from the nav. */
export function MarketingMotionControl() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    document.documentElement.toggleAttribute("data-marketing-paused", paused);
    return () =>
      document.documentElement.removeAttribute("data-marketing-paused");
  }, [paused]);
  return (
    <button
      type="button"
      className="marketing-motion-control"
      onClick={() => setPaused((value) => !value)}
      aria-pressed={paused}
      aria-label={
        paused ? "Play landing animations" : "Pause landing animations"
      }
    >
      {paused ? (
        <Play className="h-4 w-4" aria-hidden />
      ) : (
        <Pause className="h-4 w-4" aria-hidden />
      )}
      <span>{paused ? "Play motion" : "Pause motion"}</span>
    </button>
  );
}

/** Native scroll reveal; content remains visible when JavaScript is unavailable. */
export function MarketingReveal({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.add("marketing-reveal--entered");
        observer.disconnect();
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div {...props} ref={ref} className={cn("marketing-reveal", className)}>
      {children}
    </div>
  );
}

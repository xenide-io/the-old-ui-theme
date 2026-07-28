import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface WidgetProps {
  title: ReactNode;
  onClose?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Widget({ title, onClose, actions, children, className }: WidgetProps) {
  return (
    <div className={cn("ph-widget", className)}>
      <div className="ph-widget__header">
        <span className="ph-widget__title">{title}</span>
        {actions}
        {onClose && (
          <button type="button" onClick={onClose} className="ph-widget__close" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3l8 8M11 3l-8 8" />
            </svg>
          </button>
        )}
      </div>
      <div className="ph-widget__content">{children}</div>
    </div>
  );
}

Widget.displayName = "Widget";

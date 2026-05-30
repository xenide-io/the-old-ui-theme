import type { ReactNode } from "react";
import {
  IconCancel,
  IconCheckCircle,
  IconClose,
  IconErrorOutline,
  IconExclamation,
} from "@/components/icons";
import { cn } from "@/lib/cn";

export type ToastStatus = "info" | "success" | "warning" | "danger";

export interface ToastProps {
  status?: ToastStatus;
  title: string;
  description?: string;
  onDismiss?: () => void;
  className?: string;
}

const statusConfig: Record<ToastStatus, { icon: typeof IconErrorOutline; color: string; bg: string } > = {
  info: { icon: IconErrorOutline, color: "text-ph-info", bg: "ph-toast-info" },
  success: { icon: IconCheckCircle, color: "text-ph-success", bg: "ph-toast-success" },
  warning: { icon: IconExclamation, color: "text-ph-warning", bg: "ph-toast-warning" },
  danger: { icon: IconCancel, color: "text-ph-danger", bg: "ph-toast-danger" },
};

export function Toast({
  status = "info",
  title,
  description,
  onDismiss,
  className,
}: ToastProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("ph-toast", config.bg, className)}>
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.color)} aria-hidden />
      <div className="pr-8">
        <div className="font-semibold">{title}</div>
        {description && <p className="mt-1 text-xs text-ph-subtle">{description}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label={`Dismiss ${title}`}
          className="absolute right-2 top-2 ph-btn ph-btn-ghost ph-btn-xs ph-btn-circle"
          onClick={onDismiss}
        >
          <IconClose className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export interface ToastStackProps {
  children?: ReactNode;
  className?: string;
}

export function ToastStack({ children, className }: ToastStackProps) {
  return (
    <div className={cn("ph-toast-stack", className)}>
      {children}
    </div>
  );
}

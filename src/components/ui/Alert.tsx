import type { ReactNode } from "react";
import { IconCancel, IconCheckCircle, IconErrorOutline, IconExclamation } from "@/components/icons";
import { cn } from "@/lib/cn";

export type AlertStatus = "info" | "success" | "warning" | "danger";

export interface AlertProps {
  status?: AlertStatus;
  title?: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  onDismiss?: () => void;
}

const statusConfig: Record<AlertStatus, { icon: typeof IconErrorOutline; color: string } > = {
  info: { icon: IconErrorOutline, color: "text-ph-info" },
  success: { icon: IconCheckCircle, color: "text-ph-success" },
  warning: { icon: IconExclamation, color: "text-ph-warning" },
  danger: { icon: IconCancel, color: "text-ph-danger" },
};

const statusClassMap: Record<AlertStatus, string > = {
  info: "ph-alert-info",
  success: "ph-alert-success",
  warning: "ph-alert-warning",
  danger: "ph-alert-danger",
};

export function Alert({
  status = "info",
  title,
  description,
  icon,
  children,
  className,
  onDismiss,
}: AlertProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn("ph-alert", statusClassMap[status], className)}
    >
      {icon ?? <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.color)} />}
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {description && <p className="mt-1 text-sm text-ph-subtle">{description}</p>}
        {children}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md p-1 text-ph-subtle hover:bg-black/5 hover:text-ph-ink"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

import { forwardRef, type AriaAttributes, type HTMLAttributes, type ReactNode } from "react";
import { IconCancel, IconCheckCircle, IconClose, IconExclamation, IconInfo } from "@/components/icons";
import { cn } from "@/lib/cn";

export type AlertStatus = "info" | "success" | "warning" | "danger";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  status?: AlertStatus;
  title?: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  onDismiss?: () => void;
  live?: AriaAttributes["aria-live"];
  dismissLabel?: string;
}

const statusConfig: Record<AlertStatus, { icon: typeof IconInfo } > = {
  info: { icon: IconInfo },
  success: { icon: IconCheckCircle },
  warning: { icon: IconExclamation },
  danger: { icon: IconCancel },
};

const statusClassMap: Record<AlertStatus, string > = {
  info: "ph-alert-info",
  success: "ph-alert-success",
  warning: "ph-alert-warning",
  danger: "ph-alert-danger",
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert({
  status = "info",
  title,
  description,
  icon,
  children,
  className,
  onDismiss,
  live,
  dismissLabel = "Dismiss notification",
  role,
  ...props
}, ref) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      ref={ref}
      role={role ?? (live === "assertive" ? "alert" : live === "polite" ? "status" : undefined)}
      aria-live={live}
      className={cn("ph-alert", statusClassMap[status], className)}
      {...props}
    >
      {icon ?? <Icon className="ph-alert-icon mt-0.5 h-5 w-5 shrink-0" aria-hidden />}
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {description && <p className="mt-1 text-sm text-ph-subtle">{description}</p>}
        {children}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ph-alert-dismiss"
          aria-label={dismissLabel}
        >
          <IconClose className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
});

Alert.displayName = "Alert";

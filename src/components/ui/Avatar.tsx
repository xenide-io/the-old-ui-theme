import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "offline" | "away" | "busy";

export interface AvatarProps extends ComponentPropsWithoutRef<"div"> {
  /** Text initials or label (e.g. "JD") */
  label?: string;
  /** Optional icon or image */
  icon?: ReactNode;
  /** Size preset */
  size?: AvatarSize;
  /** Background colour class */
  color?: string;
  /** Status indicator dot */
  status?: AvatarStatus;
  /** Badge count or text */
  badge?: string;
}

const sizeMap: Record<AvatarSize, string> = {
  xs: "h-8 w-8 text-[10px]",
  sm: "h-10 w-10 text-xs",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
};

const statusMap: Record<AvatarStatus, string> = {
  online: "bg-emerald-500",
  offline: "bg-ph-mutedtext",
  away: "bg-amber-400",
  busy: "bg-ph-danger",
};

export function Avatar({
  label,
  icon,
  size = "md",
  color = "bg-ph-brand text-white",
  status,
  badge,
  className,
  ...props
}: AvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)} {...props}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full border border-ph-border font-bold shadow-ph",
          sizeMap[size],
          color,
        )}
      >
        {icon || label}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-1 h-2.5 w-2.5 rounded-full border-2 border-white",
            statusMap[status],
          )}
        />
      )}
      {badge && (
        <span className="absolute -bottom-1 -right-1 flex min-w-[22px] items-center justify-center rounded-full bg-ph-brand px-1.5 py-px text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </div>
  );
}

export interface AvatarGroupProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
  max?: number;
}

export function AvatarGroup({ children, max, className, ...props }: AvatarGroupProps) {
  const items = Array.isArray(children) ? children : [children];
  const visible = max ? items.slice(0, max) : items;
  const remaining = max ? items.length - max : 0;

  return (
    <div className={cn("-space-x-3 flex rtl:space-x-reverse", className)} {...props}>
      {visible}
      {remaining > 0 && (
        <Avatar
          label={`+${remaining}`}
          size="md"
          color="bg-ph-toolbar text-ph-subtle"
        />
      )}
    </div>
  );
}

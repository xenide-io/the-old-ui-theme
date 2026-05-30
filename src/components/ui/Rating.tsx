import type { ComponentPropsWithoutRef } from "react";
import { IconStar } from "@/components/icons";
import { cn } from "@/lib/cn";

export interface RatingProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  label?: string;
  value?: number;
  max?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  wrapperClassName?: string;
}

export function Rating({
  label,
  value = 0,
  max = 5,
  readOnly = true,
  onChange,
  className,
  wrapperClassName,
  ...props
}: RatingProps) {
  const stars = Array.from({ length: max }, (_, index) => index + 1);

  return (
    <div className={cn("ph-field", wrapperClassName)}>
      {label && <span className="ph-label">{label}</span>}
      <div
        className={cn("ph-rating flex", className)}
        role={readOnly ? "img" : "radiogroup"}
        aria-label={label ?? `Rating: ${value} out of ${max}`}
        {...props}
      >
        {stars.map((star) => {
          const active = star <= value;

          if (readOnly) {
            return (
              <IconStar
                key={star}
                className={cn("h-6 w-6", active ? "text-amber-500" : "text-ph-border")}
                aria-hidden
              />
            );
          }

          return (
            <button
              key={star}
              type="button"
              className="rounded p-0.5 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ph-brand"
              role="radio"
              aria-checked={active}
              aria-label={`${star} out of ${max}`}
              onClick={() => onChange?.(star)}
            >
              <IconStar className={cn("h-6 w-6", active ? "text-amber-500" : "text-ph-border")} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

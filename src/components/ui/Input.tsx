import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "ghost";

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  label?: string;
  hideLabel?: boolean;
  error?: string;
  helperText?: string;
  size?: InputSize;
  variant?: InputVariant;
  wrapperClassName?: string;
}

const sizeMap: Record<InputSize, string> = {
  sm: "ph-input-sm",
  md: "",
  lg: "ph-input-lg",
};

export function Input({
  id: idProp,
  label,
  hideLabel = false,
  error,
  helperText,
  size = "md",
  variant = "default",
  className,
  wrapperClassName,
  disabled,
  ...props
}: InputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hasError = Boolean(error);

  return (
    <div className={cn("ph-field", wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "ph-label",
            hideLabel && "sr-only",
            disabled && "opacity-50"
          )}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        className={cn(
          "ph-input w-full",
          sizeMap[size],
          variant === "ghost" && "ph-input-ghost",
          hasError && "ph-input-error",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
        {...props}
      />
      {helperText && !hasError && (
        <p className="mt-1 text-xs text-ph-subtle">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs font-medium text-ph-danger">{error}</p>
      )}
    </div>
  );
}

export interface SelectProps extends Omit<ComponentPropsWithoutRef<"select">, "size"> {
  label?: string;
  hideLabel?: boolean;
  error?: string;
  helperText?: string;
  size?: InputSize;
  wrapperClassName?: string;
  children: ReactNode;
}

export function Select({
  id: idProp,
  label,
  hideLabel = false,
  error,
  helperText,
  size = "md",
  className,
  wrapperClassName,
  disabled,
  children,
  ...props
}: SelectProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hasError = Boolean(error);

  return (
    <div className={cn("ph-field", wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cn("ph-label", hideLabel && "sr-only", disabled && "opacity-50")}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        className={cn(
          "ph-select w-full",
          sizeMap[size],
          hasError && "border-ph-danger focus:border-ph-danger focus:ring-ph-danger/20",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {helperText && !hasError && (
        <p className="mt-1 text-xs text-ph-subtle">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs font-medium text-ph-danger">{error}</p>
      )}
    </div>
  );
}

export interface TextareaProps extends Omit<ComponentPropsWithoutRef<"textarea">, "size"> {
  label?: string;
  hideLabel?: boolean;
  error?: string;
  helperText?: string;
  size?: InputSize;
  wrapperClassName?: string;
}

export function Textarea({
  id: idProp,
  label,
  hideLabel = false,
  error,
  helperText,
  size = "md",
  className,
  wrapperClassName,
  disabled,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hasError = Boolean(error);

  return (
    <div className={cn("ph-field", wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cn("ph-label", hideLabel && "sr-only", disabled && "opacity-50")}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        className={cn(
          "ph-textarea w-full",
          sizeMap[size],
          hasError && "border-ph-danger focus:border-ph-danger focus:ring-ph-danger/20",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
        {...props}
      />
      {helperText && !hasError && (
        <p className="mt-1 text-xs text-ph-subtle">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs font-medium text-ph-danger">{error}</p>
      )}
    </div>
  );
}

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: ReactNode;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
}

export function Checkbox({
  id: idProp,
  label,
  error,
  helperText,
  className,
  wrapperClassName,
  disabled,
  ...props
}: CheckboxProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hasError = Boolean(error);

  return (
    <div className={cn("ph-control-row", wrapperClassName)}>
      <input
        id={id}
        type="checkbox"
        disabled={disabled}
        aria-invalid={hasError || undefined}
        className={cn(
          "ph-checkbox",
          hasError && "border-ph-danger",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
        {...props}
      />
      <label htmlFor={id} className={cn("cursor-pointer", disabled && "opacity-60")}>
        {label}
      </label>
      {helperText && !hasError && (
        <p className="mt-0.5 text-xs text-ph-subtle">{helperText}</p>
      )}
      {error && (
        <p className="mt-0.5 text-xs font-medium text-ph-danger">{error}</p>
      )}
    </div>
  );
}

export interface RadioProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: ReactNode;
  wrapperClassName?: string;
}

export function Radio({
  id: idProp,
  label,
  className,
  wrapperClassName,
  disabled,
  ...props
}: RadioProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <div className={cn("ph-control-row", wrapperClassName, disabled && "opacity-60")}>
      <input
        id={id}
        type="radio"
        disabled={disabled}
        className={cn("ph-radio", disabled && "cursor-not-allowed", className)}
        {...props}
      />
      <label htmlFor={id} className={cn("cursor-pointer", disabled && "opacity-60")}>
        {label}
      </label>
    </div>
  );
}

export interface ToggleProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: ReactNode;
  wrapperClassName?: string;
}

export function Toggle({
  id: idProp,
  label,
  className,
  wrapperClassName,
  disabled,
  ...props
}: ToggleProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <label className={cn("ph-control-row-between", wrapperClassName, disabled && "opacity-60")}>
      <span className={disabled ? "opacity-60" : undefined}>{label}</span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        disabled={disabled}
        className={cn("ph-toggle", disabled && "cursor-not-allowed", className)}
        {...props}
      />
    </label>
  );
}

export interface RangeProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: string;
  minLabel?: string;
  maxLabel?: string;
  valueLabel?: string;
  wrapperClassName?: string;
}

export function Range({
  label,
  minLabel,
  maxLabel,
  valueLabel,
  wrapperClassName,
  className,
  ...props
}: RangeProps) {
  return (
    <div className={cn("ph-field", wrapperClassName)}>
      {label && <label className="ph-label">{label}</label>}
      <input type="range" className={cn("ph-range", className)} {...props} />
      {(minLabel || valueLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-ph-mutedtext">
          <span>{minLabel}</span>
          <span>{valueLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

export interface FileUploadProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: string;
  prompt?: string;
  wrapperClassName?: string;
}

export function FileUpload({ label, prompt = "Drop file or browse", wrapperClassName, className, ...props }: FileUploadProps) {
  return (
    <div className={cn("ph-field", wrapperClassName)}>
      {label && <label className="ph-label">{label}</label>}
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-ph-border bg-ph-surface px-4 py-6 text-sm text-ph-subtle transition hover:bg-ph-muted/60">
        <input type="file" className={cn("sr-only", className)} {...props} />
        {prompt}
      </label>
    </div>
  );
}

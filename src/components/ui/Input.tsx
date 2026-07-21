import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { FormField } from "@/components/ui/FormField";
import { IconCheck } from "@/components/icons";
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

function joinIds(...ids: Array<string | undefined>) {
  const value = ids.filter(Boolean).join(" ");
  return value || undefined;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
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
  required,
  "aria-describedby": ariaDescribedBy,
  ...props
}, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hasError = Boolean(error);

  return (
    <FormField
      controlId={id}
      label={label}
      hideLabel={hideLabel}
      helperText={helperText}
      error={error}
      required={required}
      disabled={disabled}
      className={wrapperClassName}
    >
      {(fieldProps) => (
        <input
          {...fieldProps}
          ref={ref}
          disabled={disabled}
          required={required}
          aria-describedby={joinIds(ariaDescribedBy, fieldProps["aria-describedby"])}
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
      )}
    </FormField>
  );
});

Input.displayName = "Input";

export interface SelectProps extends Omit<ComponentPropsWithoutRef<"select">, "size"> {
  label?: string;
  hideLabel?: boolean;
  error?: string;
  helperText?: string;
  size?: InputSize;
  wrapperClassName?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({
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
  required,
  "aria-describedby": ariaDescribedBy,
  ...props
}, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hasError = Boolean(error);

  return (
    <FormField controlId={id} label={label} hideLabel={hideLabel} helperText={helperText} error={error} required={required} disabled={disabled} className={wrapperClassName}>
      {(fieldProps) => (
        <select
          {...fieldProps}
          ref={ref}
          disabled={disabled}
          required={required}
          aria-describedby={joinIds(ariaDescribedBy, fieldProps["aria-describedby"])}
          className={cn(
            "ph-select w-full",
            sizeMap[size],
            hasError && "ph-input-error",
            disabled && "cursor-not-allowed opacity-60",
            className
          )}
          {...props}
        >
          {children}
        </select>
      )}
    </FormField>
  );
});

Select.displayName = "Select";

export interface TextareaProps extends Omit<ComponentPropsWithoutRef<"textarea">, "size"> {
  label?: string;
  hideLabel?: boolean;
  error?: string;
  helperText?: string;
  size?: InputSize;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  id: idProp,
  label,
  hideLabel = false,
  error,
  helperText,
  size = "md",
  className,
  wrapperClassName,
  disabled,
  required,
  "aria-describedby": ariaDescribedBy,
  ...props
}, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hasError = Boolean(error);

  return (
    <FormField controlId={id} label={label} hideLabel={hideLabel} helperText={helperText} error={error} required={required} disabled={disabled} className={wrapperClassName}>
      {(fieldProps) => (
        <textarea
          {...fieldProps}
          ref={ref}
          disabled={disabled}
          required={required}
          aria-describedby={joinIds(ariaDescribedBy, fieldProps["aria-describedby"])}
          className={cn(
            "ph-textarea w-full",
            sizeMap[size],
            hasError && "ph-input-error",
            disabled && "cursor-not-allowed opacity-60",
            className
          )}
          {...props}
        />
      )}
    </FormField>
  );
});

Textarea.displayName = "Textarea";

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: ReactNode;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({
  id: idProp,
  label,
  error,
  helperText,
  className,
  wrapperClassName,
  disabled,
  "aria-describedby": ariaDescribedBy,
  ...props
}, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hasError = Boolean(error);
  const descriptionId = helperText && !hasError ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn("ph-control-row", wrapperClassName)}>
      <span className="ph-checkbox-wrap">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={joinIds(ariaDescribedBy, descriptionId)}
          aria-errormessage={errorId}
          className={cn(
            "ph-checkbox",
            hasError && "border-ph-danger",
            disabled && "cursor-not-allowed opacity-60",
            className
          )}
          {...props}
        />
        <IconCheck className="ph-checkbox-icon" aria-hidden />
      </span>
      <div className="ph-control-copy">
        <label htmlFor={id} className={cn("cursor-pointer", disabled && "opacity-60")}>
          {label}
        </label>
        {descriptionId ? <p id={descriptionId} className="text-xs text-ph-subtle">{helperText}</p> : null}
        {errorId ? <p id={errorId} className="text-xs font-medium text-ph-danger">{error}</p> : null}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export interface RadioProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: ReactNode;
  wrapperClassName?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({
  id: idProp,
  label,
  className,
  wrapperClassName,
  disabled,
  ...props
}, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <div className={cn("ph-control-row", wrapperClassName, disabled && "opacity-60")}>
      <input
        ref={ref}
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
});

Radio.displayName = "Radio";

export interface ToggleProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: ReactNode;
  wrapperClassName?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle({
  id: idProp,
  label,
  className,
  wrapperClassName,
  disabled,
  ...props
}, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <label className={cn("ph-control-row-between", wrapperClassName, disabled && "opacity-60")}>
      <span className={disabled ? "opacity-60" : undefined}>{label}</span>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        role="switch"
        disabled={disabled}
        className={cn("ph-toggle", disabled && "cursor-not-allowed", className)}
        {...props}
      />
    </label>
  );
});

Toggle.displayName = "Toggle";

export interface RangeProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: string;
  minLabel?: string;
  maxLabel?: string;
  valueLabel?: string;
  wrapperClassName?: string;
}

export const Range = forwardRef<HTMLInputElement, RangeProps>(function Range({
  id: idProp,
  label,
  minLabel,
  maxLabel,
  valueLabel,
  wrapperClassName,
  className,
  ...props
}, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <div className={cn("ph-field", wrapperClassName)}>
      {label && <label htmlFor={id} className="ph-label">{label}</label>}
      <input ref={ref} id={id} type="range" className={cn("ph-range", className)} {...props} />
      {(minLabel || valueLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-ph-mutedtext">
          <span>{minLabel}</span>
          <span>{valueLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
});

Range.displayName = "Range";

export interface FileUploadProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: string;
  prompt?: string;
  wrapperClassName?: string;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload({
  id: idProp,
  label,
  prompt = "Drop file or browse",
  wrapperClassName,
  className,
  ...props
}, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <div className={cn("ph-field", wrapperClassName)}>
      {label && <label htmlFor={id} className="ph-label">{label}</label>}
      <label htmlFor={id} className="ph-file-upload">
        <input ref={ref} id={id} type="file" className={cn("sr-only", className)} {...props} />
        {prompt}
      </label>
    </div>
  );
});

FileUpload.displayName = "FileUpload";

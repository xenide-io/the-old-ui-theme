import { forwardRef, useId, useRef, useState, type ChangeEvent, type ComponentPropsWithoutRef, type Ref, type ReactNode } from "react";
import { Eye, EyeOff as EyeClosed } from 'lucide-react';
import { FormField } from "@/components/ui/FormField";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { DatePicker, DateTimePicker } from "@/components/ui/DatePicker";
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

/** Pickers have no real <input>, so hand callers an event-shaped value for their existing onChange. */
function pickerEvent(name: string | undefined, value: string) {
  return { target: { name, value }, currentTarget: { name, value } } as ChangeEvent<HTMLInputElement>;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  id: idProp,
  label,
  hideLabel = false,
  error,
  helperText,
  size = "md",
  variant = "default",
  type = "text",
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
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);
  // Native date/colour inputs look different on every OS; use the shared pickers instead.
  const pickerValue = String(props.value ?? props.defaultValue ?? "");
  const emit = (next: string) => props.onChange?.(pickerEvent(props.name, next));

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
      {(fieldProps) =>
        type === "date" ? (
          <DatePicker
            id={id}
            variant="field"
            value={pickerValue}
            onChange={emit}
            clearable={!required}
            placeholder="Select date"
            aria-label={label ?? "Date"}
            disabled={disabled}
            className={className}
          />
        ) : type === "datetime-local" ? (
          <DateTimePicker
            id={id}
            value={pickerValue}
            onChange={emit}
            clearable={!required}
            placeholder="Select date"
            aria-label={label ?? "Date and time"}
            disabled={disabled}
            className={className}
          />
        ) : type === "color" ? (
          <ColorPicker
            value={pickerValue}
            onChange={emit}
            label={pickerValue || "Default"}
            aria-label={label ?? "Colour"}
          />
        ) : (
        <div className="relative">
          <input
            {...fieldProps}
            ref={ref}
            type={isPassword && revealed ? "text" : type}
            disabled={disabled}
            required={required}
            aria-describedby={joinIds(ariaDescribedBy, fieldProps["aria-describedby"])}
            className={cn(
              "ph-input w-full",
              isPassword && "pr-10",
              sizeMap[size],
              variant === "ghost" && "ph-input-ghost",
              hasError && "ph-input-error",
              disabled && "cursor-not-allowed opacity-60",
              className
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setRevealed((current) => !current)}
              aria-label={revealed ? "Hide password" : "Show password"}
              aria-pressed={revealed}
              disabled={disabled}
              className="ph-field-icon-button"
            >
              {revealed ? (
                <EyeClosed className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          ) : null}
        </div>
        )
      }
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
  /** Leading icon for the selected value. Native options cannot contain SVG. */
  icon?: ReactNode;
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
  icon,
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
        <span className="relative block">
          {icon ? (
            <span
              className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-ph-mutedtext [&_svg]:h-4 [&_svg]:w-4"
              aria-hidden
            >
              {icon}
            </span>
          ) : null}
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
              icon ? "pl-9" : undefined,
              className
            )}
            {...props}
          >
            {children}
          </select>
        </span>
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
          aria-describedby={joinIds(ariaDescribedBy, descriptionId, errorId)}
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

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as { current: T | null }).current = node;
    }
  };
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
  const innerRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  // A dropped file never reaches the input on its own — push it through the
  // input's file list and fire `change` so the caller's onChange still runs.
  function assignDroppedFiles(files: FileList | null) {
    const input = innerRef.current;
    if (!input || !files?.length) return;
    const transfer = new DataTransfer();
    for (const file of Array.from(files)) transfer.items.add(file);
    input.files = transfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  return (
    <div className={cn("ph-field", wrapperClassName)}>
      {label && <label htmlFor={id} className="ph-label">{label}</label>}
      <label
        htmlFor={id}
        data-dragging={dragging || undefined}
        className={cn("ph-file-upload", dragging && "ph-file-upload--active")}
        onDragOver={(event) => {
          event.preventDefault();
          if (!dragging) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          assignDroppedFiles(event.dataTransfer?.files ?? null);
        }}
      >
        <input ref={mergeRefs(innerRef, ref)} id={id} type="file" className={cn("sr-only", className)} {...props} />
        {prompt}
      </label>
    </div>
  );
});

FileUpload.displayName = "FileUpload";

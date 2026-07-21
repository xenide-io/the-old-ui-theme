import { useId, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface FormFieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-errormessage"?: string;
  "aria-invalid"?: true;
}

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  controlId?: string;
  label?: ReactNode;
  hideLabel?: boolean;
  helperText?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  children: ReactNode | ((controlProps: FormFieldControlProps) => ReactNode);
}

export function FormField({
  controlId,
  label,
  hideLabel = false,
  helperText,
  error,
  required = false,
  disabled = false,
  children,
  className,
  ...props
}: FormFieldProps) {
  const generatedId = useId();
  const id = controlId ?? generatedId;
  const descriptionId = helperText && !error ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const controlProps: FormFieldControlProps = {
    id,
    "aria-describedby": descriptionId,
    "aria-errormessage": errorId,
    "aria-invalid": error ? true : undefined,
  };

  return (
    <div className={cn("ph-field", className)} {...props}>
      {label ? (
        <label
          htmlFor={id}
          className={cn("ph-label", hideLabel && "sr-only", disabled && "opacity-50")}
        >
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
      ) : null}
      {typeof children === "function" ? children(controlProps) : children}
      {descriptionId ? (
        <p id={descriptionId} className="mt-1 text-xs text-ph-subtle">
          {helperText}
        </p>
      ) : null}
      {errorId ? (
        <p id={errorId} className="mt-1 text-xs font-medium text-ph-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

import type { ReactNode } from "react";
import { IconClose } from "@/components/icons";
import { cn } from "@/lib/cn";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  className?: string;
  showCloseButton?: boolean;
}

const sizeMap: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100%-2rem)]",
};

export function Modal({
  open = false,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  showCloseButton = true,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="ph-modal-overlay" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal
        className={cn(
          "ph-modal-panel",
          sizeMap[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <header className="flex items-start justify-between gap-4">
            <div>
              {title && <h3 className="text-lg font-bold text-ph-ink">{title}</h3>}
              {description && <p className="mt-1 text-sm text-ph-subtle">{description}</p>}
            </div>
            {showCloseButton && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-md p-1 text-ph-subtle hover:bg-black/5 hover:text-ph-ink"
                aria-label="Close"
              >
                <IconClose className="h-5 w-5" />
              </button>
            )}
          </header>
        )}
        <div className="mt-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2 border-t border-ph-border pt-5">{footer}</div>}
      </div>
    </div>
  );
}

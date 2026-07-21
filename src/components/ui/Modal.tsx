"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRef, type ReactNode } from "react";
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
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  "aria-label"?: string;
}

const sizeMap: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-none",
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
  closeOnOutsideClick = true,
  closeOnEscape = true,
  "aria-label": ariaLabel,
}: ModalProps) {
  const canDismiss = Boolean(onClose);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose?.();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="ph-modal-overlay" />
        <Dialog.Content
          className={cn("ph-modal-panel", sizeMap[size], className)}
          aria-label={ariaLabel}
          {...(description ? {} : { "aria-describedby": undefined })}
          onOpenAutoFocus={() => {
            restoreFocusRef.current = document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            restoreFocusRef.current?.focus();
          }}
          onEscapeKeyDown={(event) => {
            if (!canDismiss || !closeOnEscape) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (!canDismiss || !closeOnOutsideClick) event.preventDefault();
          }}
        >
          {title ? null : <Dialog.Title className="sr-only">{ariaLabel ?? "Dialog"}</Dialog.Title>}
          {(title || description || (showCloseButton && canDismiss)) ? (
            <header className="ph-modal-header">
              <div className="min-w-0">
                {title ? <Dialog.Title className="text-lg font-bold text-ph-ink">{title}</Dialog.Title> : null}
                {description ? (
                  <Dialog.Description className="mt-1 text-sm text-ph-subtle">
                    {description}
                  </Dialog.Description>
                ) : null}
              </div>
              {showCloseButton && canDismiss ? (
                <Dialog.Close asChild>
                  <button type="button" className="ph-modal-close" aria-label="Close dialog">
                    <IconClose className="h-5 w-5" aria-hidden />
                  </button>
                </Dialog.Close>
              ) : null}
            </header>
          ) : null}
          <div className="ph-modal-body">{children}</div>
          {footer ? <div className="ph-modal-footer">{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

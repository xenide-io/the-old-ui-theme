"use client";

import { createContext, useContext, useId, type ReactNode } from "react";
import { IconClose } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Modal, type ModalSize } from "@/components/ui/Modal";
import { P } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

export type ModalMaxWidth = "sm" | "md" | "lg" | "xl";

const SIZE: Record<ModalMaxWidth, ModalSize> = {
  sm: "sm",
  md: "md",
  lg: "md",
  xl: "lg",
};

const ModalTitleContext = createContext<string | undefined>(undefined);

export interface ModalFrameProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: ModalMaxWidth;
  zIndex?: number;
  panelClassName?: string;
  dataTest?: string;
  /** Strips panel padding so header, body and footer can run edge to edge. */
  flush?: boolean;
  preventOverlayClose?: boolean;
  ariaLabelledBy?: string;
  id?: string;
}

/**
 * Dialog shell for header / body / footer layouts. The header's ✕ sits in the
 * top-right corner (Windows / Fluent), the footer carries Cancel + primary.
 */
export function ModalFrame({
  open,
  onClose,
  children,
  maxWidth = "sm",
  zIndex,
  panelClassName,
  dataTest,
  flush = true,
  preventOverlayClose = false,
  ariaLabelledBy,
  id,
}: ModalFrameProps) {
  const autoTitleId = useId();
  const titleId = ariaLabelledBy ?? autoTitleId;

  return (
    <ModalTitleContext.Provider value={titleId}>
      <Modal
        id={id}
        open={open}
        onClose={onClose}
        size={SIZE[maxWidth]}
        customLayout
        showCloseButton={false}
        closeOnOutsideClick={!preventOverlayClose}
        dataTest={dataTest ?? "modal"}
        panelDataTest={dataTest ? `${dataTest}-panel` : "modal-panel"}
        zIndex={zIndex}
        aria-label="Dialog"
        aria-labelledby={titleId}
        className={cn(
          maxWidth === "md" && "max-w-md",
          flush &&
            "flex max-h-[min(100svh_-_2rem,900px)] flex-col overflow-hidden p-0",
          panelClassName,
        )}
      >
        {children}
      </Modal>
    </ModalTitleContext.Provider>
  );
}

export interface ModalHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  onClose: () => void;
  className?: string;
}

export function ModalHeader({
  title,
  description,
  icon,
  onClose,
  className,
}: ModalHeaderProps) {
  const titleId = useContext(ModalTitleContext);
  return (
    <div
      data-test="modal-header"
      className={cn(
        "flex items-start justify-between gap-3 border-b border-ph-border px-5 py-4",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="mb-0.5 flex items-center gap-2">
          {icon}
          <h2 id={titleId} className="text-lg font-semibold text-ph-ink">
            {title}
          </h2>
        </div>
        {description ? (
          <P tone="subtle" className="text-sm">
            {description}
          </P>
        ) : null}
      </div>
      <Button
        type="button"
        variant="secondary"
        shape="square"
        aria-label="Close"
        onClick={onClose}
        className="min-h-[44px] min-w-[44px] sm:min-h-[2.3125rem] sm:min-w-[2.3125rem]"
      >
        <IconClose className="h-3.5 w-3.5" aria-hidden />
      </Button>
    </div>
  );
}

export function ModalBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-test="modal-body"
      className={cn(
        "min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4",
        // A bare <form> is the usual single child — give its fields the same rhythm.
        "[&>form:not([class])]:flex [&>form:not([class])]:flex-col [&>form:not([class])]:gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-test="modal-footer"
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-ph-border bg-ph-canvas px-5 py-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface ModalActionsProps {
  onCancel: () => void;
  onSave: () => void;
  cancelLabel?: string;
  saveLabel?: ReactNode;
  saveIcon?: ReactNode;
  saving?: boolean;
  saveDisabled?: boolean;
  cancelDisabled?: boolean;
}

/** Standard footer: Cancel (secondary) then the primary action. */
export function ModalActions({
  onCancel,
  onSave,
  cancelLabel = "Cancel",
  saveLabel = "Save changes",
  saveIcon,
  saving = false,
  saveDisabled = false,
  cancelDisabled = false,
}: ModalActionsProps) {
  return (
    <ModalFooter>
      <Button
        data-test="modal-cancel"
        variant="secondary"
        onClick={onCancel}
        disabled={cancelDisabled || saving}
        className="min-h-[44px] sm:min-h-[2.3125rem]"
      >
        {cancelLabel}
      </Button>
      <Button
        data-test="modal-save"
        variant="primary"
        onClick={onSave}
        disabled={saveDisabled || saving}
        loading={saving}
        icon={!saving ? saveIcon : undefined}
        className="min-h-[44px] min-w-[7rem] sm:min-h-[2.3125rem]"
      >
        {saveLabel}
      </Button>
    </ModalFooter>
  );
}

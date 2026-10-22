"use client";

import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red confirm button for destructive actions. */
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmDataTest?: string;
  confirmDisabled?: boolean;
  /** Extra content under the description, e.g. a typed-name confirmation field. */
  children?: ReactNode;
  /** Override the default destructive/confirm glyph. */
  icon?: ReactNode;
}

/**
 * Alert-style confirmation (macOS / iOS): narrow, centred, one sentence of
 * context and two equal buttons. Cancel sits first so Return never deletes.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
  confirmDataTest,
  confirmDisabled = false,
  children,
  icon,
}: ConfirmDialogProps) {
  const resolvedIcon =
    icon ??
    (destructive ? <TriangleAlert className="h-5 w-5" aria-hidden /> : null);
  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onCancel}
      customLayout
      aria-label={title}
      className="ph-confirm-dialog"
    >
      <div className="ph-confirm-dialog__body">
        {resolvedIcon ? (
          <span
            className={
              destructive
                ? "ph-confirm-dialog__icon ph-confirm-dialog__icon--danger"
                : "ph-confirm-dialog__icon"
            }
            aria-hidden
          >
            {resolvedIcon}
          </span>
        ) : null}
        <h2 className="ph-confirm-dialog__title">{title}</h2>
        {description ? (
          <p className="ph-confirm-dialog__text">{description}</p>
        ) : null}
        {children}
      </div>
      <div className="ph-confirm-dialog__actions">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          data-autofocus
        >
          {cancelLabel}
        </Button>
        <Button
          variant={destructive ? "danger" : "primary"}
          onClick={() => void onConfirm()}
          loading={loading}
          disabled={confirmDisabled}
          data-test={confirmDataTest}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

import { useState, type ReactNode } from "react";
import { Modal, type ModalProps } from "@/components/ui/Modal";
import { Button, type ButtonProps } from "@/components/ui/Button";

export interface DialogProps extends Omit<ModalProps, "onClose"> {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  confirmProps?: Partial<ButtonProps>;
  cancelProps?: Partial<ButtonProps>;
  children?: ReactNode;
}

export function Dialog({
  isOpen: openProp,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmProps,
  cancelProps,
  children,
  title,
  ...modalProps
}: DialogProps) {
  const [loading, setLoading] = useState(false);
  const isOpen = openProp ?? true;

  const handleConfirm = async () => {
    if (!onConfirm) return;
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
    onClose?.();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" {...cancelProps} onClick={onClose}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              variant="primary"
              loading={loading}
              {...confirmProps}
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          )}
        </div>
      }
      {...modalProps}
    >
      {children}
    </Modal>
  );
}

Dialog.displayName = "Dialog";

export function confirmDialog(props: DialogProps) {
  return <Dialog {...props} />;
}

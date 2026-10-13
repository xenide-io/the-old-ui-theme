"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const SESSION_ENDED_COPY =
  "Your session has ended. Sign in again to continue. (Reference: E-AUTH-002)";

export interface SuiteSessionExpiredModalProps {
  open: boolean;
  onSignIn: () => void;
}

/**
 * Blocking "session ended" notice. Render it only inside an app's
 * authenticated layout: public pages (landing, sign-in) must never show it.
 */
export function SuiteSessionExpiredModal({
  open,
  onSignIn,
}: SuiteSessionExpiredModalProps) {
  return (
    <Modal
      open={open}
      size="sm"
      title="Session ended"
      description={SESSION_ENDED_COPY}
      showCloseButton={false}
      closeOnOutsideClick={false}
      closeOnEscape={false}
      dataTest="session-expired-modal"
      panelDataTest="session-expired-modal-panel"
      footer={
        <Button variant="primary" onClick={onSignIn}>
          Sign in again
        </Button>
      }
    />
  );
}

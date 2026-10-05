"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Card } from "@/components/ui";

export type SuiteWebPushState =
  | "unsupported"
  | "unconfigured"
  | "default"
  | "granted"
  | "denied"
  | "subscribed";

/** Structural contract matching `createWebPushClient` from @xenide-io/suite-client. */
export interface SuiteWebPushController {
  supported(): boolean;
  getState(): Promise<SuiteWebPushState>;
  enable(): Promise<void>;
  disable(): Promise<void>;
}

export interface SuiteNotificationSettingsProps {
  controller: SuiteWebPushController;
  title?: string;
  description?: string;
  dataTest?: string;
  className?: string;
}

const STATUS_COPY: Record<SuiteWebPushState, string> = {
  unsupported: "This browser does not support browser notifications.",
  unconfigured: "Browser notifications are not configured on the server yet.",
  default: "Get notified on this device when a suite notification arrives.",
  granted: "Permission granted — turn on browser notifications for this device.",
  denied:
    "Notifications are blocked for this site. Allow them in your browser's site settings, then try again.",
  subscribed: "This device receives browser notifications.",
};

/**
 * Settings card that lets a user enable or disable browser notifications for
 * this device. State and delivery live in the app's suite-client web push
 * controller; this component is presentational.
 */
export function SuiteNotificationSettings({
  controller,
  title = "Notifications",
  description = "Get suite notifications — tasks, documents and AI runs — as OS notifications on this device, even when the app is closed.",
  dataTest = "suite-notification-settings",
  className,
}: SuiteNotificationSettingsProps) {
  const [state, setState] = useState<SuiteWebPushState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setState(await controller.getState());
  }, [controller]);

  useEffect(() => {
    let active = true;
    controller.getState().then((next) => {
      if (active) setState(next);
    });
    return () => {
      active = false;
    };
  }, [controller]);

  const handleEnable = async () => {
    setBusy(true);
    setError("");
    try {
      await controller.enable();
      await refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not enable notifications.",
      );
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async () => {
    setBusy(true);
    setError("");
    try {
      await controller.disable();
      await refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not disable notifications.",
      );
    } finally {
      setBusy(false);
    }
  };

  const subscribed = state === "subscribed";
  const canEnable = state === "default" || state === "granted";

  return (
    <div className={className}>
      <div>
        <h2 className="text-xl font-semibold text-ph-ink">{title}</h2>
        <p className="mt-1 text-sm text-ph-subtle">{description}</p>
      </div>

      {error ? (
        <Alert
          id={`${dataTest}-error`}
          data-test={`${dataTest}-error`}
          className="mt-4"
          status="danger"
          title="Notifications unavailable"
          description={error}
          live="assertive"
        />
      ) : null}

      <Card
        id={`${dataTest}-card`}
        data-test={`${dataTest}-card`}
        variant="outlined"
        bodyClassName="p-5"
        className="mt-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-ph-ink">
              Browser notifications
            </p>
            {subscribed ? <Badge variant="success">On</Badge> : null}
          </div>

          {controller.supported() && canEnable ? (
            <Button
              id={`${dataTest}-enable`}
              data-test={`${dataTest}-enable`}
              variant="primary"
              size="sm"
              disabled={busy}
              onClick={handleEnable}
            >
              {busy ? "Enabling…" : "Enable on this device"}
            </Button>
          ) : null}

          {subscribed ? (
            <Button
              id={`${dataTest}-disable`}
              data-test={`${dataTest}-disable`}
              variant="secondary"
              size="sm"
              disabled={busy}
              onClick={handleDisable}
            >
              {busy ? "Disabling…" : "Disable"}
            </Button>
          ) : null}
        </div>

        <p className="mt-3 text-sm text-ph-subtle">
          {state === null ? "Checking this device…" : STATUS_COPY[state]}
        </p>
      </Card>
    </div>
  );
}

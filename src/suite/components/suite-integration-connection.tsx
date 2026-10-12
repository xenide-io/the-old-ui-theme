"use client";

import type { ReactNode } from "react";
import { Check, WarningTriangle } from "iconoir-react";
import { Badge } from "@/components/ui/Badge";

export interface SuiteIntegrationConnectionProps {
  label: string;
  icon?: string;
  account?: string;
  status?: string;
  statusVariant?: "neutral" | "success" | "warning" | "danger";
  detail?: ReactNode;
  error?: string;
  actions: ReactNode;
  children?: ReactNode;
  dataTest?: string;
}

/** Shared connected-account face; hosts keep authentication and actions. */
export function SuiteIntegrationConnection({
  label,
  icon,
  account,
  status = "Connected",
  statusVariant = "success",
  detail,
  error,
  actions,
  children,
  dataTest,
}: SuiteIntegrationConnectionProps) {
  const title = /[A-Z]/.test(label)
    ? label
    : label
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <li className="suite-integration-connection" data-test={dataTest}>
      <div className="suite-integration-connection__identity">
        <span className="suite-integration-connection__logo" aria-hidden="true">
          <span>{title.charAt(0)}</span>
          {icon?.startsWith("http") ? (
            <img
              key={icon}
              src={icon}
              alt=""
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : null}
        </span>
        <div className="suite-integration-connection__name">
          <h4>{title}</h4>
          <p>{account || "Workspace connection"}</p>
        </div>
      </div>
      {detail ? (
        <div className="suite-integration-connection__detail">{detail}</div>
      ) : null}
      {error ? (
        <p className="suite-integration-connection__error">
          <WarningTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
      <div className="suite-integration-connection__footer">
        <Badge variant={statusVariant}>
          {statusVariant === "success" ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : statusVariant === "danger" || statusVariant === "warning" ? (
            <WarningTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          ) : null}
          {status}
        </Badge>
        <div className="suite-integration-connection__actions">{actions}</div>
      </div>
      {children}
    </li>
  );
}

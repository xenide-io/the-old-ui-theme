"use client";

import type { ReactNode } from "react";

/** Heading every settings tab opens with, so tab content starts at the same position in every app. */
export function SuiteSettingsHeader({
  title,
  description,
  actions,
  dataTest,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  dataTest?: string;
}) {
  return (
    <div
      className="flex flex-wrap items-start justify-between gap-4"
      data-test={dataTest}
    >
      <div>
        {typeof title === "string" ? (
          <h2 className="text-xl font-semibold text-ph-ink">{title}</h2>
        ) : (
          title
        )}
        {typeof description === "string" ? (
          <p className="mt-1 text-sm text-ph-mutedtext">{description}</p>
        ) : (
          description
        )}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

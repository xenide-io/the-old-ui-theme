"use client";

import { useState } from "react";
import {
  ComponentDocs,
  Button,
  ShowcaseWrapper,
  Toast,
  ToastStack,
} from "@/components/ui";

const toasts = [
  {
    id: 1,
    status: "info" as const,
    title: "New deploy",
    text: "Warehouse sync node rotated without downtime.",
  },
  {
    id: 2,
    status: "success" as const,
    title: "Exports healthy",
    text: "Snowflake incremental finished in 41s.",
  },
  {
    id: 3,
    status: "warning" as const,
    title: "Approaching quota",
    text: "Session replay capture at 92% monthly allocation.",
  },
  {
    id: 4,
    status: "danger" as const,
    title: "Batch failed",
    text: "Stripe connector returned HTTP 524 — backing off.",
  },
];

export default function ToastShowcase() {
  const [visible, setVisible] = useState<number[]>(toasts.map((t) => t.id));

  const code = `import { Button, Toast, ToastStack } from "the-old-ui";

<div className="ph-panel">
  <div className="mb-4 flex items-center justify-between">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Snack stack demo</h3>
    <Button variant="ghost" size="sm" onClick={() => setVisible(toasts.map((t) => t.id))}>
      Restore all
    </Button>
  </div>
  <ToastStack className="max-w-xl">
    {toasts.map((toast) => {
      if (!visible.includes(toast.id)) return null;
      return (
        <Toast
          key={toast.id}
          status={toast.status}
          title={toast.title}
          description={toast.text}
          onDismiss={() => setVisible((v) => v.filter((x) => x !== toast.id))}
        />
      );
    })}
  </ToastStack>
</div>`;

  return (
    <ShowcaseWrapper
      title="Toasts"
      description="Snack stack notifications with semantic colour variants and dismiss actions."
      code={code}
      filename="ToastExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "status", type: "info | success | warning | danger", defaultValue: "info", description: "Controls icon and colour treatment." },
            { name: "title", type: "string", description: "Required toast heading." },
            { name: "description", type: "string", description: "Optional supporting copy." },
            { name: "onDismiss", type: "() => void", description: "Shows a close button when provided." },
          ]}
        />
      }
    >
      <div className="ph-panel">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Snack stack demo</h3>
          <Button variant="ghost" size="sm" onClick={() => setVisible(toasts.map((t) => t.id))}>
            Restore all
          </Button>
        </div>
        <ToastStack className="max-w-xl">
          {toasts.map((toast) => {
            if (!visible.includes(toast.id)) return null;
            return (
              <Toast
                key={toast.id}
                status={toast.status}
                title={toast.title}
                description={toast.text}
                onDismiss={() => setVisible((v) => v.filter((x) => x !== toast.id))}
              />
            );
          })}
        </ToastStack>
      </div>
    </ShowcaseWrapper>
  );
}

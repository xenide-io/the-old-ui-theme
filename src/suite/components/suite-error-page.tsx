"use client";

import { FileQuestion, TriangleAlert } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { cn } from "../lib/cn";

export interface SuiteErrorPageProps {
  kind?: "error" | "not-found";
  title?: string;
  description?: string;
  code?: string;
  onRetry?: () => void;
  retryLabel?: string;
  homeHref?: string;
  homeLabel?: string;
  className?: string;
  dataTest?: string;
}

/**
 * Shared full-page error / not-found surface for every suite app.
 * Rendered outside the app shell, so it owns its own centring and material.
 */
export function SuiteErrorPage({
  kind = "error",
  title,
  description,
  code,
  onRetry,
  retryLabel = "Try again",
  homeHref,
  homeLabel = "Back to app",
  className,
  dataTest,
}: SuiteErrorPageProps) {
  const notFound = kind === "not-found";
  const Icon = notFound ? FileQuestion : TriangleAlert;
  const heading = title ?? (notFound ? "Page not found" : "Something went wrong");
  const copy =
    description ??
    (notFound
      ? "The address may be wrong, or the page may have moved."
      : "We hit an unexpected problem. Nothing was lost — try again.");

  return (
    <main
      data-test={dataTest ?? (notFound ? "not-found-page" : "error-page")}
      className={cn(
        "flex min-h-dvh items-center justify-center bg-ph-canvas px-5 py-12 text-ph-ink",
        className,
      )}
    >
      <div className="w-full max-w-md rounded-[var(--ph-radius-surface)] border border-ph-border-control bg-ph-surface p-8 text-center shadow-[var(--ph-shadow-floating)]">
        <span
          className={cn(
            "mx-auto flex h-14 w-14 items-center justify-center rounded-full",
            notFound
              ? "bg-ph-muted text-ph-mutedtext"
              : "bg-ph-danger/10 text-ph-danger",
          )}
          aria-hidden
        >
          <Icon className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <h1 className="mt-5 font-display text-[length:var(--ph-type-subsection)] font-semibold text-ph-ink">
          {heading}
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-[length:var(--ph-type-small)] leading-[var(--ph-leading-body)] text-ph-subtle">
          {copy}
        </p>
        {code ? (
          <p className="mt-4 text-[length:var(--ph-type-overline)] font-medium uppercase tracking-[0.08em] text-ph-mutedtext">
            Reference: {code}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {onRetry ? (
            <Button variant="primary" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : null}
          {homeHref ? (
            <Button
              variant={onRetry ? "secondary" : "primary"}
              onClick={() => window.location.assign(homeHref)}
            >
              {homeLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export function SuiteNotFoundPage(props: Omit<SuiteErrorPageProps, "kind">) {
  return <SuiteErrorPage kind="not-found" {...props} />;
}

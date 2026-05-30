"use client";

import { cn } from "@/lib/cn";

interface Step {
  id: string;
  label: string;
  description?: string;
  status?: "pending" | "current" | "completed" | "error";
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex items-start gap-2", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;
        const isError = step.status === "error";

        return (
          <div key={step.id} className="flex flex-1 items-start gap-2">
            <div className="flex flex-1 flex-col items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  isCompleted && "bg-ph-success text-white",
                  isCurrent && !isError && "bg-ph-brand text-white ring-4 ring-ph-brand/20",
                  isCurrent && isError && "bg-ph-danger text-white",
                  isPending && "bg-ph-muted text-ph-mutedtext"
                )}
              >
                {isCompleted ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isCurrent && "text-ph-ink",
                    !isCurrent && "text-ph-mutedtext"
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-xs text-ph-mutedtext">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mt-4 h-0.5 flex-1 rounded-full transition-colors",
                  isCompleted ? "bg-ph-success" : "bg-ph-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

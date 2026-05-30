import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  time?: string;
  icon?: ReactNode;
  color?: string;
}

export interface TimelineProps extends ComponentPropsWithoutRef<"ol"> {
  events: TimelineEvent[];
  /** Alternate left/right layout on large screens */
  alternate?: boolean;
}

export function Timeline({
  events,
  alternate = false,
  className,
  ...props
}: TimelineProps) {
  return (
    <ol
      className={cn("relative space-y-8", className)}
      {...props}
    >
      {events.map((event, idx) => {
        const align = alternate && idx % 2 !== 0 ? "lg:flex-row-reverse" : "";
        return (
          <li key={event.id} className={cn("relative flex gap-6", align)}>
            <div
              className={cn(
                "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-8 ring-ph-muted shadow-md",
                event.color || "bg-ph-brand text-white",
              )}
            >
              {event.icon}
            </div>
            <article className="flex-1 rounded-xl border border-ph-border bg-ph-surface p-4 shadow-ph">
              <div className="flex flex-wrap items-baseline gap-3">
                <h4 className="text-base font-semibold text-ph-ink">{event.title}</h4>
                {event.time && (
                  <time className="text-[11px] font-semibold uppercase tracking-wide text-ph-mutedtext">
                    {event.time}
                  </time>
                )}
              </div>
              {event.description && (
                <p className="mt-2 text-sm text-ph-subtle">{event.description}</p>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}

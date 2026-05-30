import { cn } from "@/lib/cn";

export interface TabItem {
  value: string;
  label: string;
}

export type TabsVariant = "pill" | "underline";

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  variant?: TabsVariant;
  className?: string;
}

export function Tabs({ items, value, onChange, variant = "pill", className }: TabsProps) {
  if (variant === "underline") {
    return (
      <div className={cn("flex gap-6 border-b border-ph-border", className)}>
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              "-mb-px border-b-2 pb-2 text-sm font-semibold transition",
              value === item.value ? "border-ph-brand text-ph-ink" : "border-transparent text-ph-mutedtext hover:text-ph-ink"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("ph-tabs-row inline-flex", className)}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn("ph-tab", value === item.value && "ph-tab-active")}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

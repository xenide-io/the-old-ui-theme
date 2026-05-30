import type { ReactNode } from "react";
import { IconClose } from "@/components/icons";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

export type DrawerSide = "left" | "right";
export type DrawerSize = "sm" | "md" | "lg";

export interface DrawerProps {
  open?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  side?: DrawerSide;
  size?: DrawerSize;
  className?: string;
  showCloseButton?: boolean;
}

const sideMap: Record<DrawerSide, string> = {
  left: "left-0 border-r",
  right: "right-0 border-l",
};

const sizeMap: Record<DrawerSize, string> = {
  sm: "w-[min(100%,18rem)]",
  md: "w-[min(100%,22rem)]",
  lg: "w-[min(100%,30rem)]",
};

export function Drawer({
  open = false,
  onClose,
  title,
  children,
  footer,
  side = "right",
  size = "md",
  className,
  showCloseButton = true,
}: DrawerProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-[2px]" role="presentation" onClick={onClose} />
      <aside
        className={cn(
          "fixed inset-y-0 z-[130] flex flex-col overflow-y-auto border-ph-border bg-ph-surface shadow-ph-md",
          sideMap[side],
          sizeMap[size],
          className
        )}
      >
        {(title || showCloseButton) && (
          <header className="flex items-center justify-between border-b border-ph-border px-4 py-3">
            <span className="text-sm font-bold text-ph-ink">{title}</span>
            {showCloseButton && onClose && (
              <Button variant="ghost" className="ph-btn-circle" onClick={onClose} aria-label="Close drawer">
                <IconClose className="h-5 w-5" />
              </Button>
            )}
          </header>
        )}
        <div className="flex-1">{children}</div>
        {footer && <footer className="border-t border-ph-border px-4 py-3">{footer}</footer>}
      </aside>
    </>
  );
}

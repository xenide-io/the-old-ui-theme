import type { ReactNode } from "react";

export interface ButtonChromeProps {
  label?: ReactNode;
  icon?: ReactNode;
  sideIcon?: ReactNode;
  split?: boolean;
}

/** Inner face for Lemon primary/secondary — keeps labels above ::after ridge. */
export function ButtonChrome({ label, icon, sideIcon, split }: ButtonChromeProps) {
  return (
    <span className="ph-btn-chrome">
      {icon != null ? <span className="ph-btn-icon">{icon}</span> : null}
      {label != null ? <span className="ph-btn-label">{label}</span> : null}
      {split ? <span className="ph-btn-split-divider" aria-hidden /> : null}
      {sideIcon != null ? <span className="ph-btn-side-icon">{sideIcon}</span> : null}
    </span>
  );
}

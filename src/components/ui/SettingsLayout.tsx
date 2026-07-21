import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { IconTuning } from "@/components/icons";
import { cn } from "@/lib/cn";

export interface SettingsNavItem {
  id: string;
  label: ReactNode;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  badge?: ReactNode;
}

export interface SettingsNavGroup {
  label: ReactNode;
  items: readonly SettingsNavItem[];
}

export interface SettingsNavProps extends ComponentPropsWithoutRef<"div"> {
  groups: readonly SettingsNavGroup[];
}

export interface SettingsLayoutProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  navigation: ReactNode;
  navigationLabel?: string;
  children: ReactNode;
}

export function SettingsNav({ groups, className, ...props }: SettingsNavProps) {
  return (
    <div className={cn("ph-settings-nav", className)} {...props}>
      {groups.map((group, index) => (
        <div className="ph-settings-nav__group" key={index}>
          <h3>{group.label}</h3>
          <div className="ph-settings-nav__items">
            {group.items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={cn("ph-settings-nav__item", item.active && "ph-settings-nav__item--active")}
                aria-current={item.active ? "page" : undefined}
              >
                {item.icon ? <span className="ph-settings-nav__icon">{item.icon}</span> : null}
                <span>{item.label}</span>
                {item.badge ? <span className="ph-settings-nav__badge">{item.badge}</span> : null}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SettingsLayout({
  title,
  description,
  actions,
  navigation,
  navigationLabel = "Settings",
  children,
  className,
  ...props
}: SettingsLayoutProps) {
  return (
    <section className={cn("ph-settings-layout", className)} {...props}>
      <header className="ph-settings-layout__header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div className="ph-settings-layout__actions">{actions}</div> : null}
      </header>

      <details className="ph-settings-layout__mobile-nav">
        <summary>
          <IconTuning className="h-4 w-4" aria-hidden />
          Settings menu
        </summary>
        <nav aria-label={navigationLabel}>{navigation}</nav>
      </details>

      <div className="ph-settings-layout__grid">
        <aside className="ph-settings-layout__sidebar">
          <nav aria-label={navigationLabel}>{navigation}</nav>
        </aside>
        <div className="ph-settings-layout__content">{children}</div>
      </div>
    </section>
  );
}

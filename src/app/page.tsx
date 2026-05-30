import IconShowcase from "@/components/sections/IconShowcase";
import ColorPalette from "@/components/sections/ColorPalette";
import SetupThemeShowcase from "@/components/sections/SetupThemeShowcase";
import ButtonShowcase from "@/components/sections/ButtonShowcase";
import BadgeShowcase from "@/components/sections/BadgeShowcase";
import AlertShowcase from "@/components/sections/AlertShowcase";
import CardShowcase from "@/components/sections/CardShowcase";
import FormShowcase from "@/components/sections/FormShowcase";
import TableShowcase from "@/components/sections/TableShowcase";
import ChartShowcase from "@/components/sections/ChartShowcase";
import DashboardShowcase from "@/components/sections/DashboardShowcase";
import ModalShowcase from "@/components/sections/ModalShowcase";
import DropdownShowcase from "@/components/sections/DropdownShowcase";
import TabShowcase from "@/components/sections/TabShowcase";
import NavigationShowcase from "@/components/sections/NavigationShowcase";
import ProgressShowcase from "@/components/sections/ProgressShowcase";
import TooltipShowcase from "@/components/sections/TooltipShowcase";
import AvatarShowcase from "@/components/sections/AvatarShowcase";
import StatShowcase from "@/components/sections/StatShowcase";
import ToastShowcase from "@/components/sections/ToastShowcase";
import TimelineShowcase from "@/components/sections/TimelineShowcase";
import DrawerShowcase from "@/components/sections/DrawerShowcase";
import CountdownShowcase from "@/components/sections/CountdownShowcase";
import KbdShowcase from "@/components/sections/KbdShowcase";
import SwapShowcase from "@/components/sections/SwapShowcase";
import StackShowcase from "@/components/sections/StackShowcase";
import DiffShowcase from "@/components/sections/DiffShowcase";
import IndicatorShowcase from "@/components/sections/IndicatorShowcase";
import UtilityShowcase from "@/components/sections/UtilityShowcase";
import CodeMockupShowcase from "@/components/sections/CodeMockupShowcase";
import AccordionShowcase from "@/components/sections/AccordionShowcase";
import StepperShowcase from "@/components/sections/StepperShowcase";
import SegmentedControlShowcase from "@/components/sections/SegmentedControlShowcase";
import CommandPaletteShowcase from "@/components/sections/CommandPaletteShowcase";
import CalendarShowcase from "@/components/sections/CalendarShowcase";
import HoverCardShowcase from "@/components/sections/HoverCardShowcase";
import EmptyStateShowcase from "@/components/sections/EmptyStateShowcase";
import FilterChipsShowcase from "@/components/sections/FilterChipsShowcase";
import { ThemeSwitcher, CollapsibleSection } from "@/components/ui";

  const navGroups = [
  {
    label: "Foundation",
    links: [
      { label: "Setup & Theme", href: "#setup-theme" },
      { label: "Icons", href: "#icons" },
      { label: "Colours", href: "#colors" },
    ],
  },
  {
    label: "Components",
    links: [
      { label: "Buttons", href: "#buttons" },
      { label: "Badges", href: "#badges" },
      { label: "Alerts", href: "#alerts" },
      { label: "Toasts", href: "#toasts" },
      { label: "Cards", href: "#cards" },
      { label: "Inputs & Forms", href: "#forms" },
      { label: "Tables", href: "#tables" },
      { label: "Accordion", href: "#accordion" },
      { label: "Calendar", href: "#calendar" },
      { label: "Hover Card", href: "#hovercard" },
    ],
  },
  {
    label: "Patterns",
    links: [
      { label: "Modals", href: "#modals" },
      { label: "Drawers", href: "#drawers" },
      { label: "Navigation", href: "#navigation" },
      { label: "Utilities", href: "#utilities" },
      { label: "Stepper", href: "#stepper" },
      { label: "Command", href: "#command" },
      { label: "Filters", href: "#filters" },
      { label: "Empty State", href: "#emptystate" },
    ],
  },
  {
    label: "Data",
    links: [
      { label: "Charts", href: "#charts" },
      { label: "Dashboard", href: "#dashboard" },
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-ph-border bg-ph-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
          <a href="/" className="shrink-0 text-lg font-bold tracking-tight text-ph-ink">
            The Old UI
          </a>

          <div className="flex flex-1 items-center justify-end gap-4">
            <nav className="hidden items-center gap-1 lg:flex">
              {navGroups.map((group) => (
                <div key={group.label} className="group relative">
                  <button className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-ph-subtle transition hover:bg-ph-muted hover:text-ph-ink">
                    {group.label}
                    <svg className="h-3.5 w-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-ph-border bg-ph-surface p-1.5 shadow-ph-md opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                    {group.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="block rounded-md px-3 py-2 text-sm text-ph-subtle transition hover:bg-ph-muted hover:text-ph-ink"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="h-6 w-px bg-ph-border hidden lg:block" />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <section className="border-b border-ph-border bg-ph-muted py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ph-mutedtext">Component library</p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-ph-ink md:text-5xl">
            The Old UI <span className="text-ph-brand">Lab</span>
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-ph-subtle">
            A curated set of UI primitives with swappable themes, bespoke icons, and dashboard-ready components.
            Built with Tailwind CSS and inspired by classic interface design.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#icons" className="ph-btn ph-btn-signal ph-btn-lg rounded-full px-8">
              Browse components
            </a>
            <a
              href="https://github.com/lauridskern/open-runde"
              className="ph-btn ph-btn-outline ph-btn-secondary ph-btn-lg rounded-full px-8"
              target="_blank"
              rel="noreferrer"
            >
              Open Runde typeface
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-14 lg:px-8">
        <CollapsibleSection title="Icons" id="icons">
          <IconShowcase />
        </CollapsibleSection>
        <CollapsibleSection title="Colour Tokens" id="colors">
          <ColorPalette />
        </CollapsibleSection>
        <ButtonShowcase />
        <BadgeShowcase />
        <AlertShowcase />
        <ToastShowcase />
        <CardShowcase />
        <FormShowcase />
        <TableShowcase />
        <ChartShowcase />
        <DashboardShowcase />
        <ModalShowcase />
        <DrawerShowcase />
        <DropdownShowcase />
        <TabShowcase />
        <NavigationShowcase />
        <UtilityShowcase />
        <ProgressShowcase />
        <TooltipShowcase />
        <AvatarShowcase />
        <StatShowcase />
        <TimelineShowcase />
        <CountdownShowcase />
        <KbdShowcase />
        <SwapShowcase />
        <StackShowcase />
        <DiffShowcase />
        <IndicatorShowcase />
        <CodeMockupShowcase />
        <AccordionShowcase />
        <StepperShowcase />
        <SegmentedControlShowcase />
        <CommandPaletteShowcase />
        <CalendarShowcase />
        <HoverCardShowcase />
        <EmptyStateShowcase />
        <FilterChipsShowcase />
        <CollapsibleSection title="Setup & Theme" id="setup-theme">
          <SetupThemeShowcase />
        </CollapsibleSection>
      </div>

      <footer className="mt-16 border-t border-ph-border bg-ph-muted py-10 text-center text-sm text-ph-mutedtext">
        <p className="font-semibold text-ph-ink">The Old UI</p>
        <p className="mt-1">Next.js · Tailwind · Open Runde · Bespoke icons</p>
      </footer>
    </main>
  );
}

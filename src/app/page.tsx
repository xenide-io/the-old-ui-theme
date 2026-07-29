"use client";

import AccordionShowcase from "@/components/sections/AccordionShowcase";
import AlertShowcase from "@/components/sections/AlertShowcase";
import AvatarShowcase from "@/components/sections/AvatarShowcase";
import BadgeShowcase from "@/components/sections/BadgeShowcase";
import ButtonShowcase from "@/components/sections/ButtonShowcase";
import CalendarShowcase from "@/components/sections/CalendarShowcase";
import CardShowcase from "@/components/sections/CardShowcase";
import CodeMockupShowcase from "@/components/sections/CodeMockupShowcase";
import ColorPalette from "@/components/sections/ColorPalette";
import CommandPaletteShowcase from "@/components/sections/CommandPaletteShowcase";
import CountdownShowcase from "@/components/sections/CountdownShowcase";
import DiffShowcase from "@/components/sections/DiffShowcase";
import DrawerShowcase from "@/components/sections/DrawerShowcase";
import DropdownShowcase from "@/components/sections/DropdownShowcase";
import EmptyStateShowcase from "@/components/sections/EmptyStateShowcase";
import FilterChipsShowcase from "@/components/sections/FilterChipsShowcase";
import FormShowcase from "@/components/sections/FormShowcase";
import HoverCardShowcase from "@/components/sections/HoverCardShowcase";
import IconShowcase from "@/components/sections/IconShowcase";
import IndicatorShowcase from "@/components/sections/IndicatorShowcase";
import KbdShowcase from "@/components/sections/KbdShowcase";
import ModalShowcase from "@/components/sections/ModalShowcase";
import NavigationShowcase from "@/components/sections/NavigationShowcase";
import NewComponentsShowcase from "@/components/sections/NewComponentsShowcase";
import ProgressShowcase from "@/components/sections/ProgressShowcase";
import QuillChartShowcase from "@/components/sections/QuillChartShowcase";
import QuillDashboardShowcase from "@/components/sections/QuillDashboardShowcase";
import SegmentedControlShowcase from "@/components/sections/SegmentedControlShowcase";
import SetupThemeShowcase from "@/components/sections/SetupThemeShowcase";
import SidebarShowcase from "@/components/sections/SidebarShowcase";
import StackShowcase from "@/components/sections/StackShowcase";
import StepperShowcase from "@/components/sections/StepperShowcase";
import SwapShowcase from "@/components/sections/SwapShowcase";
import TabShowcase from "@/components/sections/TabShowcase";
import TableShowcase from "@/components/sections/TableShowcase";
import TimelineShowcase from "@/components/sections/TimelineShowcase";
import ToastShowcase from "@/components/sections/ToastShowcase";
import TooltipShowcase from "@/components/sections/TooltipShowcase";
import UtilityShowcase from "@/components/sections/UtilityShowcase";

import { AppLayout, Button, Sidebar, ThemeSwitcher, CollapsibleSection } from "@/components/ui";
import ProductLayoutsShowcase from "@/components/sections/ProductLayoutsShowcase";
import { Home as LucideHome, Search, Flag, Bell, Zap, Plus } from "lucide-react";
import { IconAreaChart } from "@/components/icons";

const sidebarGroups = [
  {
    label: "Overview",
    items: [
      { label: "Home", icon: <LucideHome className="h-4 w-4" />, href: "#", active: true },
      { label: "Icons", icon: <Search className="h-4 w-4" />, href: "#icons" },
      { label: "Colours", icon: <Flag className="h-4 w-4" />, href: "#colors" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Buttons", icon: <Zap className="h-4 w-4" />, href: "#buttons" },
      { label: "Badges", icon: <Flag className="h-4 w-4" />, href: "#badges" },
      { label: "Alerts", icon: <Bell className="h-4 w-4" />, href: "#alerts" },
      { label: "Cards", icon: <IconAreaChart className="h-4 w-4" />, href: "#cards" },
      { label: "Inputs", href: "#forms" },
      { label: "Tables", href: "#tables" },
      { label: "Modals & Drawers", href: "#modals" },
      { label: "Navigation", href: "#navigation" },
      { label: "Sidebar", href: "#sidebar-demo" },
      { label: "Settings", href: "#settings" },
    ],
  },
  {
    label: "Charts & Data",
    items: [
      { label: "TimeSeriesLineChart", href: "#quill-timeline" },
      { label: "BarChart", href: "#quill-barchart" },
      { label: "PieChart", href: "#quill-piechart" },
      { label: "FunnelChart", href: "#quill-funnel" },
      { label: "MetricCard", href: "#quill-metriccard" },
      { label: "Dashboards", href: "#quill-dashboard" },
      { label: "Charts Overview", href: "#quill-charts-overview" },
    ],
  },
  {
    label: "Patterns",
    items: [
      { label: "Stepper", href: "#stepper" },
      { label: "Command Palette", href: "#command" },
      { label: "Filters", href: "#filters" },
      { label: "Auth & Settings", href: "#auth" },
      { label: "Loading & Empty", href: "#progress" },
    ],
  },
];

const headerLinks = [
      { label: "Icons", href: "#icons" },
      { label: "Sidebar", href: "#sidebar-demo" },
      { label: "Components", href: "#buttons" },
  { label: "Dashboards", href: "#quill-dashboard" },
];

export default function Home() {
  return (
    <AppLayout
      sidebar={
        <Sidebar
          groups={sidebarGroups}
          header={
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-ph-brand flex items-center justify-center text-xs font-bold text-[var(--ph-on-accent)]">T</div>
              <span className="text-sm font-bold text-ph-ink">The Old UI</span>
            </div>
          }
          footer={
            <div className="flex items-center justify-between px-3 py-3">
              <span className="text-xs text-ph-mutedtext">v0.3.2</span>
            </div>
          }
        />
      }
    >
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 border-b border-ph-border bg-ph-surface/80 backdrop-blur-md">
          <div className="flex h-12 items-center justify-between px-6">
            <nav className="flex items-center gap-1">
              {headerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-ph-subtle transition hover:bg-ph-muted hover:text-ph-ink"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="h-3.5 w-3.5" aria-hidden />}
                onClick={() => document.getElementById("icons")?.scrollIntoView({ behavior: "smooth" })}
              >
                New
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-16 px-6 py-8 max-w-6xl">
          <section className="border-b border-ph-border pb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ph-mutedtext">Component library</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ph-ink">
              The Old UI <span className="text-ph-brand">Lab</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ph-subtle">
              A curated set of UI primitives with swappable themes, bespoke icons, and dashboard-ready components.
            </p>
          </section>

          <AccordionShowcase />
          <AlertShowcase />
          <AvatarShowcase />
          <BadgeShowcase />
          <ButtonShowcase />
          <CalendarShowcase />
          <CardShowcase />
          <CodeMockupShowcase />
          <CollapsibleSection title="Colour Tokens" id="colors"><ColorPalette /></CollapsibleSection>
          <CommandPaletteShowcase />
          <CountdownShowcase />
          <DiffShowcase />
          <DrawerShowcase />
          <DropdownShowcase />
          <EmptyStateShowcase />
          <FilterChipsShowcase />
          <FormShowcase />
          <HoverCardShowcase />
          <CollapsibleSection title="Icons" id="icons"><IconShowcase /></CollapsibleSection>
          <IndicatorShowcase />
          <KbdShowcase />
          <ModalShowcase />
          <NavigationShowcase />
          <NewComponentsShowcase />
          <ProductLayoutsShowcase />
          <ProgressShowcase />
          <QuillChartShowcase />
          <QuillDashboardShowcase />
          <SegmentedControlShowcase />
          <CollapsibleSection title="Setup & Theme" id="setup-theme"><SetupThemeShowcase /></CollapsibleSection>
          <SidebarShowcase />
          <StackShowcase />
          <StepperShowcase />
          <SwapShowcase />
          <TabShowcase />
          <TableShowcase />
          <TimelineShowcase />
          <ToastShowcase />
          <TooltipShowcase />
          <UtilityShowcase />
        </div>
      </div>
    </AppLayout>
  );
}

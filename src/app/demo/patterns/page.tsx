"use client";

import CommandPaletteShowcase from "@/components/sections/CommandPaletteShowcase";
import CountdownShowcase from "@/components/sections/CountdownShowcase";
import DiffShowcase from "@/components/sections/DiffShowcase";
import DrawerShowcase from "@/components/sections/DrawerShowcase";
import EmptyStateShowcase from "@/components/sections/EmptyStateShowcase";
import FilterChipsShowcase from "@/components/sections/FilterChipsShowcase";
import ModalShowcase from "@/components/sections/ModalShowcase";
import ProductLayoutsShowcase from "@/components/sections/ProductLayoutsShowcase";
import ProgressShowcase from "@/components/sections/ProgressShowcase";
import StepperShowcase from "@/components/sections/StepperShowcase";

import { DemoPage } from "../demo-page";

export default function PatternsDemoPage() {
  return (
    <DemoPage
      eyebrow="Composed UI"
      title="Patterns"
      description="Auth, settings, overlays, filters, loading, and other multi-component flows that deserve their own working surface."
    >
      <ProductLayoutsShowcase />
      <CommandPaletteShowcase />
      <CountdownShowcase />
      <DiffShowcase />
      <DrawerShowcase />
      <EmptyStateShowcase />
      <FilterChipsShowcase />
      <ModalShowcase />
      <ProgressShowcase />
      <StepperShowcase />
    </DemoPage>
  );
}

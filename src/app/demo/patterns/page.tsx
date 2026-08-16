"use client";

import CommandPaletteShowcase from "@/components/sections/CommandPaletteShowcase";
import EmptyStateShowcase from "@/components/sections/EmptyStateShowcase";
import FilterChipsShowcase from "@/components/sections/FilterChipsShowcase";
import ModalShowcase from "@/components/sections/ModalShowcase";
import ProductLayoutsShowcase from "@/components/sections/ProductLayoutsShowcase";
import ProgressShowcase from "@/components/sections/ProgressShowcase";

import { DemoPage } from "../demo-page";

export default function PatternsDemoPage() {
  return (
    <DemoPage
      eyebrow="Composed UI"
      title="Patterns"
      description="Auth, settings, overlays, filters, and loading flows that combine several primitives into one working surface."
    >
      <ProductLayoutsShowcase />
      <CommandPaletteShowcase />
      <EmptyStateShowcase />
      <FilterChipsShowcase />
      <ModalShowcase />
      <ProgressShowcase />
    </DemoPage>
  );
}

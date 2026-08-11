"use client";

import SidebarShowcase from "@/components/sections/SidebarShowcase";
import SuiteShowcase from "@/components/sections/SuiteShowcase";

import { DemoPage } from "../demo-page";

export default function SuiteDemoPage() {
  return (
    <DemoPage
      eyebrow="Shared product chrome"
      title="Suite"
      description="The shared app shell used across the suite: sidebar, mobile chrome, app switching, and settings navigation."
    >
      <SidebarShowcase />
      <SuiteShowcase />
    </DemoPage>
  );
}

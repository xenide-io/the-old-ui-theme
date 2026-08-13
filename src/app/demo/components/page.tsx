"use client";

import AccordionShowcase from "@/components/sections/AccordionShowcase";
import AlertShowcase from "@/components/sections/AlertShowcase";
import AvatarShowcase from "@/components/sections/AvatarShowcase";
import BadgeShowcase from "@/components/sections/BadgeShowcase";
import ButtonShowcase from "@/components/sections/ButtonShowcase";
import CalendarShowcase from "@/components/sections/CalendarShowcase";
import CardShowcase from "@/components/sections/CardShowcase";
import DropdownShowcase from "@/components/sections/DropdownShowcase";
import FormShowcase from "@/components/sections/FormShowcase";
import NavigationShowcase from "@/components/sections/NavigationShowcase";
import PrimitivesShowcase from "@/components/sections/PrimitivesShowcase";
import SegmentedControlShowcase from "@/components/sections/SegmentedControlShowcase";
import TableShowcase from "@/components/sections/TableShowcase";
import TooltipShowcase from "@/components/sections/TooltipShowcase";

import { DemoPage } from "../demo-page";

export default function ComponentsDemoPage() {
  return (
    <DemoPage
      eyebrow="Primitives"
      title="Components"
      description="Every control the ShellStack apps actually ship, organized as a focused component lab instead of one giant page."
    >
      <AccordionShowcase />
      <AlertShowcase />
      <AvatarShowcase />
      <BadgeShowcase />
      <ButtonShowcase />
      <CalendarShowcase />
      <CardShowcase />
      <DropdownShowcase />
      <FormShowcase />
      <NavigationShowcase />
      <PrimitivesShowcase />
      <SegmentedControlShowcase />
      <TableShowcase />
      <TooltipShowcase />
    </DemoPage>
  );
}

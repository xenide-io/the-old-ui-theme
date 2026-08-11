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
import HoverCardShowcase from "@/components/sections/HoverCardShowcase";
import IndicatorShowcase from "@/components/sections/IndicatorShowcase";
import NavigationShowcase from "@/components/sections/NavigationShowcase";
import NewComponentsShowcase from "@/components/sections/NewComponentsShowcase";
import SegmentedControlShowcase from "@/components/sections/SegmentedControlShowcase";
import StackShowcase from "@/components/sections/StackShowcase";
import SwapShowcase from "@/components/sections/SwapShowcase";
import TabShowcase from "@/components/sections/TabShowcase";
import TableShowcase from "@/components/sections/TableShowcase";
import ToastShowcase from "@/components/sections/ToastShowcase";
import TooltipShowcase from "@/components/sections/TooltipShowcase";

import { DemoPage } from "../demo-page";

export default function ComponentsDemoPage() {
  return (
    <DemoPage
      eyebrow="Primitives"
      title="Components"
      description="The everyday controls and surfaces, organized as a focused component lab instead of one giant page."
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
      <HoverCardShowcase />
      <IndicatorShowcase />
      <NavigationShowcase />
      <NewComponentsShowcase />
      <SegmentedControlShowcase />
      <StackShowcase />
      <SwapShowcase />
      <TabShowcase />
      <TableShowcase />
      <ToastShowcase />
      <TooltipShowcase />
    </DemoPage>
  );
}

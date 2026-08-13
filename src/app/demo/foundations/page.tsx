"use client";

import { CollapsibleSection } from "@/components/ui";
import ColorPalette from "@/components/sections/ColorPalette";
import IconShowcase from "@/components/sections/IconShowcase";
import KbdShowcase from "@/components/sections/KbdShowcase";
import SetupThemeShowcase from "@/components/sections/SetupThemeShowcase";
import TypographyShowcase from "@/components/sections/TypographyShowcase";

import { DemoPage } from "../demo-page";

export default function FoundationsDemoPage() {
  return (
    <DemoPage
      eyebrow="Tokens, type, icons, setup"
      title="Foundations & themes"
      description="The stable visual contract underneath every component: the type scale, semantic tokens, iconography, setup patterns, and keyboard affordances."
    >
      <TypographyShowcase />
      <CollapsibleSection title="Colour Tokens" id="colors">
        <ColorPalette />
      </CollapsibleSection>
      <CollapsibleSection title="Icons" id="icons">
        <IconShowcase />
      </CollapsibleSection>
      <SetupThemeShowcase />
      <KbdShowcase />
    </DemoPage>
  );
}

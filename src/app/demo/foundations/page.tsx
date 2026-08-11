"use client";

import { CollapsibleSection } from "@/components/ui";
import CodeMockupShowcase from "@/components/sections/CodeMockupShowcase";
import ColorPalette from "@/components/sections/ColorPalette";
import IconShowcase from "@/components/sections/IconShowcase";
import KbdShowcase from "@/components/sections/KbdShowcase";
import SetupThemeShowcase from "@/components/sections/SetupThemeShowcase";
import UtilityShowcase from "@/components/sections/UtilityShowcase";

import { DemoPage } from "../demo-page";

export default function FoundationsDemoPage() {
  return (
    <DemoPage
      eyebrow="Tokens, icons, setup"
      title="Foundations & themes"
      description="The stable visual contract underneath every component: semantic tokens, iconography, setup patterns, and keyboard affordances."
    >
      <CollapsibleSection title="Colour Tokens" id="colors">
        <ColorPalette />
      </CollapsibleSection>
      <CollapsibleSection title="Icons" id="icons">
        <IconShowcase />
      </CollapsibleSection>
      <SetupThemeShowcase />
      <CodeMockupShowcase />
      <KbdShowcase />
      <UtilityShowcase />
    </DemoPage>
  );
}

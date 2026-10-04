"use client";

import {
  Caption,
  ComponentDocs,
  Display,
  H1,
  H2,
  H3,
  H4,
  H5,
  Label,
  Lead,
  Mono,
  Overline,
  P,
  Panel,
  SectionTitle,
  ShowcaseWrapper,
  Small,
} from "@/components/ui";

export default function TypographyShowcase() {
  const code = `import { Display, Lead, H2, P } from "@xenide-io/the-old-ui-theme/ui";

// Marketing hero — fluid size, one per page, no breakpoint chain
<Display>Track time without the ceremony</Display>
<Lead>Open a project, hit start, get on with the work.</Lead>

// Product surfaces use the shared role scale (also used by SuitePageHeader)
<H2>This week</H2>
<P>One face everywhere; hierarchy comes from size and weight.</P>`;

  return (
    <ShowcaseWrapper
      id="typography"
      title="Typography"
      description="One voice: Open Runde everywhere, with hierarchy from size, weight, and tracking. Monospace is functional only — code, IDs, and shortcuts."
      code={code}
      filename="TypographyExample.tsx"
      docs={
        <ComponentDocs
          title="Roles"
          rows={[
            { name: "Display", type: "fluid", description: "Marketing hero. One per page. Uses .ph-hero-title." },
            { name: "SectionTitle", type: "fluid", description: "Landing section heading. Uses .ph-section-title." },
            { name: "H1–H5", type: "role scale", description: "Page 22–24px, section 22–24px, subsection 20px, card 18px, small heading 16px." },
            { name: "Lead", type: "fluid", description: "Intro paragraph, capped at ~42ch for readability." },
            { name: "P / Small", type: "shared tokens", description: "Body 16px; secondary and control text 15px desktop / 16px mobile." },
            { name: "Caption / Overline", type: "metadata", description: "Sentence-case captions 13–14px; uppercase eyebrows 12px." },
            { name: "Mono", type: "monospace", description: "Code, IDs, and data. Never decorative." },
            { name: "tone / weight", type: "prop", description: "Semantic colour and weight without touching size." },
          ]}
        />
      }
    >
      <div className="space-y-6">
        <Panel title="Marketing scale — fluid" className="space-y-4">
          <Overline>Landing pages</Overline>
          <Display>Time tracking that stays calm</Display>
          <Lead>
            Hero, section, and lead sizes are one `clamp()` each, so a landing page
            needs no breakpoint chain and every app opens at the same rhythm.
          </Lead>
          <SectionTitle>Built for the whole suite</SectionTitle>
        </Panel>

        <Panel title="Product scale — shared roles" className="space-y-3">
          <H1>Page title (H1)</H1>
          <H2>Section title (H2)</H2>
          <H3>Subsection (H3)</H3>
          <H4>Card title (H4)</H4>
          <H5>Small heading (H5)</H5>
          <P>
            Body copy sits at the same size everywhere in the suite, so a sentence
            reads identically in TurtleTime, Tides, Kraken, ShellStack, and Shelly.
          </P>
          <Small tone="subtle">Secondary copy for helper text and meta rows.</Small>
        </Panel>

        <Panel title="Meta & functional" className="space-y-3">
          <div className="flex flex-wrap items-center gap-6">
            <Caption>Last synced 4 minutes ago</Caption>
            <Overline>Beta</Overline>
            <Label>Field label</Label>
            <Mono>workspace_id=8f2c…</Mono>
          </div>
        </Panel>
      </div>
    </ShowcaseWrapper>
  );
}

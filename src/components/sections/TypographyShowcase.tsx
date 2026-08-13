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

// Marketing hero — serif display, fluid size, one per page
<Display>Track time without the ceremony</Display>
<Lead>Open a project, hit start, get on with the work.</Lead>

// Product surfaces stay sans
<H2>This week</H2>
<P>Every heading below H1 is Open Runde.</P>`;

  return (
    <ShowcaseWrapper
      id="typography"
      title="Typography"
      description="Two voices: Instrument Serif for display, Open Runde for everything you read or operate. Monospace is functional only — code, IDs, and shortcuts."
      code={code}
      filename="TypographyExample.tsx"
      docs={
        <ComponentDocs
          title="Roles"
          rows={[
            { name: "Display", type: "serif, fluid", description: "Marketing hero. One per page. Uses .ph-hero-title." },
            { name: "SectionTitle", type: "serif, fluid", description: "Landing section heading. Uses .ph-section-title." },
            { name: "H1–H5", type: "sans", description: "Product headings: page title down to card title." },
            { name: "Lead", type: "sans, fluid", description: "Intro paragraph, capped at ~42ch for readability." },
            { name: "P / Small", type: "sans", description: "Body and secondary copy." },
            { name: "Caption / Overline", type: "sans, caps", description: "Meta and eyebrows — replaces ad-hoc text-[10px]/[11px]." },
            { name: "Mono", type: "monospace", description: "Code, IDs, and data. Never decorative." },
            { name: "tone / weight", type: "prop", description: "Semantic colour and weight without touching size." },
          ]}
        />
      }
    >
      <div className="space-y-6">
        <Panel title="Display voice — Instrument Serif" className="space-y-4">
          <Overline>Why serif</Overline>
          <Display>
            Time tracking that stays <em>calm</em>
          </Display>
          <Lead>
            The hero contrasts with the interface on purpose: different shapes, not
            just a bigger weight of the same face.
          </Lead>
          <SectionTitle>Built for the whole suite</SectionTitle>
        </Panel>

        <Panel title="Product voice — Open Runde" className="space-y-3">
          <H1>Page title (H1)</H1>
          <H2>Section title (H2)</H2>
          <H3>Subsection (H3)</H3>
          <H4>Card title (H4)</H4>
          <H5>Small heading (H5)</H5>
          <P>
            Body copy sits at the same size everywhere in the suite, so a sentence
            reads identically in TurtleTime, Tides, Kraken, ShellStack, and Nakama.
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

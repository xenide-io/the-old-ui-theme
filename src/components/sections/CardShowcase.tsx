import { Badge, Button, Card, ComponentDocs, ShowcaseWrapper } from "@/components/ui";

export default function CardShowcase() {
  const code = `import { Badge, Button, Card } from "the-old-ui";

<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  <Card
    title="Insight saved"
    description="White surface, hairline border, orange hover ring — mimics dashboard tiles."
    actions={
      <>
        <Button variant="secondary" outline>
          Discard
        </Button>
        <Button variant="primary">Open</Button>
      </>
    }
  />

  <Card
    title="With visual"
    description="Same card shell — media sits flush to the border like product cards."
    media={<div className="flex h-40 items-center justify-center bg-gradient-to-br from-orange-400 via-ph-brand to-ph-blue text-lg font-bold text-white">Hero stripe</div>}
    actions={
      <Button variant="primary" size="sm">
        View funnel
      </Button>
    }
  />

  <Card
    title={
      <>
        Releases <Badge variant="brand">NEW</Badge>
      </>
    }
    description="Dense header row with badge + actions on the trailing edge."
    actions={
      <>
        <Button variant="secondary" size="sm">
          Docs
        </Button>
        <Button variant="primary" size="sm">
          Enable
        </Button>
      </>
    }
  />

  <Card
    variant="highlighted"
    title={<span className="text-ph-brand">Highlighted</span>}
    description="Use tinted fill + accent border instead of generic neon glass cards."
    actions={<Button variant="primary" size="sm">Acknowledge</Button>}
  />

  <Card
    variant="outlined"
    title="Panel inset"
    description="Grey trays on canvas — mirrors secondary surfaces in-app."
    actions={<Button variant="primary" outline>Inspect</Button>}
  />
</div>`;

  return (
    <ShowcaseWrapper
      title="Cards"
      description="Reusable card shell with title, description, actions, media, footer, and variant props."
      code={code}
      filename="CardExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "variant", type: "default | outlined | elevated | highlighted", defaultValue: "default", description: "Controls the default chrome without requiring classes." },
            { name: "title", type: "ReactNode", description: "Optional header title." },
            { name: "description", type: "ReactNode", description: "Optional supporting copy." },
            { name: "actions", type: "ReactNode", description: "Button row rendered with card action spacing." },
            { name: "media", type: "ReactNode", description: "Optional visual block rendered above the card body." },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Insight saved"
          description="White surface, hairline border, orange hover ring — mimics dashboard tiles."
          actions={
            <>
              <Button variant="secondary" outline>
                Discard
              </Button>
              <Button variant="primary">Open</Button>
            </>
          }
        />

        <Card
          title="With visual"
          description="Same card shell — media sits flush to the border like product cards."
          media={<div className="flex h-40 items-center justify-center bg-gradient-to-br from-orange-400 via-ph-brand to-ph-blue text-lg font-bold text-white">Hero stripe</div>}
          actions={
            <Button variant="primary" size="sm">
              View funnel
            </Button>
          }
        />

        <Card
          title={
            <>
              Releases <Badge variant="brand">NEW</Badge>
            </>
          }
          description="Dense header row with badge + actions on the trailing edge."
          actions={
            <>
              <Button variant="secondary" size="sm">
                Docs
              </Button>
              <Button variant="primary" size="sm">
                Enable
              </Button>
            </>
          }
        />

        <Card
          variant="highlighted"
          title={<span className="text-ph-brand">Highlighted</span>}
          description="Use tinted fill + accent border instead of generic neon glass cards."
          actions={<Button variant="primary" size="sm">Acknowledge</Button>}
        />

        <Card
          variant="outlined"
          title="Panel inset"
          description="Grey trays on canvas — mirrors secondary surfaces in-app."
          actions={<Button variant="primary" outline>Inspect</Button>}
        />
      </div>
    </ShowcaseWrapper>
  );
}

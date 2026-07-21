import { Badge, Button, Card, ComponentDocs, ShowcaseWrapper } from "@/components/ui";

export default function CardShowcase() {
  const code = `import { Badge, Button, Card } from "@xenide-io/the-old-ui-theme";

<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  <Card
    title="Insight saved"
    description="A quiet, static surface. Depth is reserved for interactive or elevated content."
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
    description="Media sits flush to the card edge with a semantic divider."
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

  <Card
    interactive
    title="Interactive surface"
    description="Hover depth is opt-in for cards containing an action."
    actions={<Button variant="tertiary">Review</Button>}
  />
</div>`;

  return (
    <ShowcaseWrapper
      title="Cards"
      description="Static by default, with explicit elevated, highlighted, and interactive treatments."
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
            { name: "interactive", type: "boolean", defaultValue: "false", description: "Adds hover and focus-within depth for a card containing an action." },
            { name: "titleAs", type: "h2 | h3 | h4", defaultValue: "h3", description: "Selects the semantic heading level without changing the card style." },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Insight saved"
          description="A quiet, static surface. Depth is reserved for interactive or elevated content."
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
          description="Media sits flush to the card edge with a semantic divider."
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

        <Card
          interactive
          title="Interactive surface"
          description="Hover depth is opt-in for cards containing an action."
          actions={<Button variant="tertiary">Review</Button>}
        />
      </div>
    </ShowcaseWrapper>
  );
}

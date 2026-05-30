import { IconBell, IconMail, IconShoppingCart, IconSurveys } from "@/components/icons";
import { ComponentDocs, Indicator, ShowcaseWrapper } from "@/components/ui";

const indicators = [
  { icon: IconBell, label: "Notifications", count: "8", hue: "bg-ph-brand" },
  { icon: IconMail, label: "Messages", count: "99+", hue: "bg-ph-blue" },
  { icon: IconSurveys, label: "Comments", count: "3", hue: "bg-emerald-600" },
  { icon: IconShoppingCart, label: "Cart", count: "!", hue: "bg-ph-danger" },
] as const;

export default function IndicatorShowcase() {
  const code = `import { Indicator } from "the-old-ui";

<Indicator badge="8" color="bg-ph-brand">
  <Button variant="ghost" shape="circle">
    <IconBell className="h-6 w-6" />
  </Button>
</Indicator>

<Indicator dot color="bg-ph-brand">
  <Avatar label="JD" />
</Indicator>`;

  return (
    <ShowcaseWrapper
      title="Badge hotspots"
      description="Indicator badges and dots for notifications, status, and counts."
      code={code}
      filename="IndicatorExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "badge", type: "ReactNode", description: "Badge content (number, text, !)." },
            { name: "color", type: "string", defaultValue: "bg-ph-brand", description: "Tailwind colour class." },
            { name: "position", type: "top-right | top-left | bottom-right | bottom-left", defaultValue: "top-right", description: "Indicator position." },
            { name: "dot", type: "boolean", defaultValue: "false", description: "Show a simple dot instead of badge." },
          ]}
        />
      }
    >
      <div className="flex flex-wrap gap-10 rounded-xl border border-ph-border bg-ph-muted px-10 py-8">
        {indicators.map(({ icon: Icon, label, count, hue }) => (
          <Indicator key={label} badge={count} color={hue}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ph-surface shadow-ph">
              <Icon className="h-6 w-6 text-ph-mutedtext" />
            </div>
          </Indicator>
        ))}
      </div>
    </ShowcaseWrapper>
  );
}

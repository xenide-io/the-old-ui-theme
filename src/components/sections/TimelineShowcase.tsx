import { IconAreaChart, IconBolt, IconGift, IconRocket } from "@/components/icons";
import { ComponentDocs, ShowcaseWrapper, Timeline } from "@/components/ui";

const events = [
  {
    id: "1",
    icon: <IconRocket className="h-6 w-6" />,
    color: "bg-ph-brand text-white",
    title: "Project scaffolded",
    desc: "Next.js ingestion keys issued for prod + staging.",
    time: "2h ago",
  },
  {
    id: "2",
    icon: <IconBolt className="h-6 w-6" />,
    color: "bg-ph-purple text-white",
    title: "$pageview spikes",
    desc: "CDN edge experiment rolled to 42% cohort.",
    time: "1h ago",
  },
  {
    id: "3",
    icon: <IconAreaChart className="h-6 w-6" />,
    color: "bg-ph-blue text-white",
    title: "Dashboard shared",
    desc: "Growth pack pinned to Slack #metrics.",
    time: "45m ago",
  },
  {
    id: "4",
    icon: <IconGift className="h-6 w-6" />,
    color: "bg-emerald-600 text-white",
    title: "Feature flag LIVE",
    desc: "pricing-test-v3 now default for EU traffic.",
    time: "Just now",
  },
];

export default function TimelineShowcase() {
  const code = `import { Timeline } from "the-old-ui";

<Timeline
  events={[
    {
      id: "1",
      title: "Project scaffolded",
      description: "Keys issued for prod + staging.",
      time: "2h ago",
      icon: <IconRocket />,
      color: "bg-ph-brand text-white",
    },
  ]}
  alternate
/>`;

  return (
    <ShowcaseWrapper
      title="Timeline"
      description="Event timeline with icons, descriptions, and alternating layout."
      code={code}
      filename="TimelineExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "events", type: "TimelineEvent[]", description: "Timeline events to render." },
            { name: "alternate", type: "boolean", defaultValue: "false", description: "Alternate left/right on large screens." },
            { name: "event.id", type: "string", description: "Unique key." },
            { name: "event.title", type: "string", description: "Event title." },
            { name: "event.description", type: "string", description: "Event description." },
            { name: "event.time", type: "string", description: "Timestamp." },
            { name: "event.icon", type: "ReactNode", description: "Icon element." },
            { name: "event.color", type: "string", description: "Tailwind colour classes." },
          ]}
        />
      }
    >
      <div className="relative ph-panel overflow-hidden">
        <div className="absolute bottom-8 left-[3.125rem] top-8 w-px bg-ph-border lg:left-[3.5rem]" aria-hidden />
        <Timeline events={events} alternate />
      </div>
    </ShowcaseWrapper>
  );
}

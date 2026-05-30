import { IconAreaChart, IconArrowUp, IconCohort, IconSurveys } from "@/components/icons";
import { Avatar, ChatBubble, ComponentDocs, Panel, Stat, ShowcaseWrapper } from "@/components/ui";

export default function StatShowcase() {
  const code = `import { Avatar, ChatBubble, Panel, Stat } from "the-old-ui";

<div className="space-y-10">
  <div className="grid gap-4 md:grid-cols-3">
    <Stat icon={...} label="Total volume" value="2.6M" tone="brand" footer={...} />
  </div>

  <Panel className="grid gap-6 lg:grid-cols-2">
    <ChatBubble
      variant="from"
      avatar={<Avatar label="M" color="bg-ph-muted text-ph-mutedtext" icon={...} />}
      name="Max"
      time="Today · 09:14"
      footer="Synced with session replay"
    >
      Could you summarise the spike on /billing?
    </ChatBubble>

    <ChatBubble
      variant="self"
      avatar={<Avatar label="AI" color="bg-ph-purple text-white" />}
      name="PostHog AI"
      time="09:15"
      footer="Tokens billed per org policy"
    >
      Checkout completion jumped 41%...
    </ChatBubble>
  </Panel>
</div>`;

  return (
    <ShowcaseWrapper
      title="Stats & conversational UI"
      description="Stat cards and chat bubble components for dashboards and AI interfaces."
      code={code}
      filename="StatExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "Stat.icon", type: "ReactNode", description: "Leading icon." },
            { name: "Stat.label", type: "ReactNode", description: "Metric label." },
            { name: "Stat.value", type: "ReactNode", description: "Metric value." },
            { name: "Stat.footer", type: "ReactNode", description: "Supporting text." },
            { name: "Stat.tone", type: "default | brand | blue | purple | warning", defaultValue: "default", description: "Colour treatment." },
            { name: "ChatBubble.variant", type: "from | self", defaultValue: "from", description: "Bubble alignment and colour." },
            { name: "ChatBubble.avatar", type: "ReactNode", description: "Avatar element." },
            { name: "ChatBubble.name", type: "string", description: "Sender name." },
            { name: "ChatBubble.time", type: "string", description: "Timestamp." },
          ]}
        />
      }
    >
      <div className="space-y-10">
        <div className="grid gap-4 md:grid-cols-3">
          <Stat icon={<IconArrowUp className="h-7 w-7" />} label="Total volume" value="2.6M" tone="brand" footer={<><span className="font-semibold text-emerald-700">up 21%</span> vs previous window</>} />
          <Stat icon={<IconCohort className="h-7 w-7" />} label="Identified persons" value="89.4K" tone="blue" footer={<>Stable cohort churn <span className="tabular-nums text-ph-mutedtext">1.8%</span></>} />
          <Stat icon={<IconAreaChart className="h-7 w-7" />} label="Activation" value="12.6%" tone="purple" footer={<>Powered by experimentation <strong className="text-ph-mutedtext">#flags</strong></>} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Stat label="Pageviews" value="1.2M" footer={<><span className="font-semibold text-emerald-700">up 15%</span> vs trailing 7-day</>} />
          <Stat label="Experiment guardrail" value="42%" tone="warning" footer={<><span className="font-semibold text-ph-danger">down 3%</span> watch conversion</>} />
        </div>

        <Panel className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Co-pilot replies</h3>
            <div className="space-y-5">
              <ChatBubble
                variant="from"
                avatar={<Avatar
                  size="sm"
                  icon={<IconSurveys className="h-5 w-5 text-ph-mutedtext" />}
                  color="bg-ph-muted text-ph-mutedtext"
                />}
                name="Max"
                time="Today · 09:14"
                footer="Synced with session replay 19ab…"
              >
                Could you summarise the spike on /billing?
              </ChatBubble>
              <ChatBubble
                variant="self"
                avatar={<Avatar
                  size="sm"
                  label="AI"
                  color="bg-ph-purple text-white"
                />}
                name="PostHog AI"
                time="09:15"
                footer="Tokens billed per org policy"
              >
                Checkout completion jumped 41% once you shipped the HogProvider race fix yesterday.
              </ChatBubble>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">FAQ accordion</h3>
            <div className="space-y-2">
              <details className="ph-details">
                <summary>What qualifies as an "active user"?</summary>
                <div className="ph-details-inner leading-relaxed">
                  Any person emitting at least one non-$feature_flag_called event inside the timezone-aware window configured on the insight.
                </div>
              </details>
              <details className="ph-details">
                <summary>How do I ship safely with feature flags?</summary>
                <div className="ph-details-inner leading-relaxed">
                  Pair multivariate payloads with enrichment properties, ramp traffic slowly, then wire the HogQL guardrail dashboards your team trusts.
                </div>
              </details>
              <details className="ph-details">
                <summary>Can I correlate LLM traces with revenue?</summary>
                <div className="ph-details-inner leading-relaxed">
                  Yes — warehouse joins from <code className="ph-kbd">$ai_generation</code> to Shopify/Snowflake exports are the canonical path PostHog's team dogfoods.
                </div>
              </details>
            </div>
          </div>
        </Panel>
      </div>
    </ShowcaseWrapper>
  );
}

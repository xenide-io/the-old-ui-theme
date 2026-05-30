import { IconAreaChart, IconArrowUp, IconCohort, IconPlus } from "@/components/icons";
import {
  DashboardFiltersBar,
  DashboardGrid,
  DashboardInsightPlaceholder,
  DashboardKpiCard,
  DashboardToolbar,
  DashboardWell,
  InsightMiniCard,
} from "@/components/dashboard";
import { Button, ShowcaseWrapper } from "@/components/ui";

const insightCards = [
  {
    title: "Weekly active users",
    subtitle: "Last 14 days · product analytics",
    ribbonColour: "var(--ph-product-product-analytics)",
    heights: [40, 55, 48, 62, 58, 70, 52, 45, 68, 72, 65, 80, 75, 88],
  },
  {
    title: "Session length",
    subtitle: "Median minutes · replay cohort",
    ribbonColour: "var(--ph-product-session-replay)",
    heights: [52, 48, 45, 50, 55, 60, 58, 54, 50, 48, 55, 60, 58, 62],
  },
  {
    title: "Flag evaluations",
    subtitle: "Per minute · infrastructure",
    ribbonColour: "var(--ph-product-feature-flags)",
    heights: [30, 35, 42, 38, 45, 50, 48, 52, 55, 58, 54, 50, 48, 55],
  },
] as const;

export default function DashboardShowcase() {
  const code = `import { IconAreaChart, IconArrowUp, IconCohort, IconPlus } from "the-old-ui";
import { DashboardFiltersBar, DashboardGrid, DashboardInsightPlaceholder, DashboardKpiCard, DashboardToolbar, DashboardWell, InsightMiniCard } from "the-old-ui";
import { Button } from "the-old-ui";

<DashboardWell className="space-y-6">
  <DashboardToolbar
    title="Marketing overview"
    description="Mock layout · spacing and elevation only"
    actions={
      <Button variant="secondary" size="sm">
        Edit layout
      </Button>
    }
  />

  <DashboardFiltersBar className="text-xs">
    <span className="font-semibold text-ph-ink">Last 14 days</span>
    <span className="text-ph-mutedtext">·</span>
    <span>Global cohort</span>
    <Button variant="ghost" size="xs" className="rounded-md px-2">
      Breakdown
    </Button>
  </DashboardFiltersBar>

  <div className="grid gap-4 md:grid-cols-3">
    <DashboardKpiCard
      icon={<IconArrowUp className="text-ph-brand" aria-hidden />}
      label="Event volume"
      value={<span className="text-ph-brand tabular-nums">2.6M</span>}
      footer={
        <>
          <span className="font-semibold text-emerald-700">▲ 21%</span> vs previous window
        </>
      }
    />
    <DashboardKpiCard
      icon={<IconCohort className="text-ph-blue" aria-hidden />}
      label="Weekly active users"
      value={<span className="text-ph-blue tabular-nums">12.8K</span>}
      footer="Stable vs trailing 28-day baseline"
    />
    <DashboardKpiCard
      icon={<IconAreaChart className="text-ph-purple" aria-hidden />}
      label="Experiments exposing"
      value={<span className="text-ph-purple tabular-nums">4</span>}
      footer="Flags + multivariates counted"
    />
  </div>

  <DashboardGrid>
    {insightCards.map((card) => (
      <InsightMiniCard
        key={card.title}
        title={card.title}
        subtitle={card.subtitle}
        ribbonColour={card.ribbonColour}
        heights={card.heights}
      />
    ))}
  </DashboardGrid>

  <div className="grid gap-4 md:grid-cols-2">
    <InsightMiniCard
      title="Activation funnel"
      subtitle="Mock · drop-off by step"
      ribbonColour="var(--ph-product-experiments)"
      heights={[88, 72, 58, 44, 32, 28, 24, 22, 20, 18, 16, 15, 14, 13]}
    />
    <DashboardInsightPlaceholder>
      <IconPlus className="h-8 w-8 text-ph-mutedtext group-hover:text-ph-brand" aria-hidden />
      <span className="text-sm font-medium text-ph-subtle group-hover:text-ph-ink">Add insight</span>
      <span className="max-w-[14rem] text-xs text-ph-mutedtext">Opens the same picker pattern your app uses for new tiles.</span>
    </DashboardInsightPlaceholder>
  </div>
</DashboardWell>`;

  return (
    <ShowcaseWrapper
      title="Dashboard shells"
      description="Inset canvas (DashboardWell) and raised insight tiles (InsightShell / InsightMiniCard) mirror how the PostHog app frames dashboards."
      code={code}
      filename="DashboardExample.tsx"
    >
      <DashboardWell className="space-y-6">
        <DashboardToolbar
          title="Marketing overview"
          description="Mock layout · spacing and elevation only"
          actions={
            <Button variant="secondary" size="sm">
              Edit layout
            </Button>
          }
        />

        <DashboardFiltersBar className="text-xs">
          <span className="font-semibold text-ph-ink">Last 14 days</span>
          <span className="text-ph-mutedtext">·</span>
          <span>Global cohort</span>
          <Button variant="ghost" size="xs" className="rounded-md px-2">
            Breakdown
          </Button>
        </DashboardFiltersBar>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardKpiCard
            icon={<IconArrowUp className="text-ph-brand" aria-hidden />}
            label="Event volume"
            value={<span className="text-ph-brand tabular-nums">2.6M</span>}
            footer={
              <>
                <span className="font-semibold text-emerald-700">▲ 21%</span> vs previous window
              </>
            }
          />
          <DashboardKpiCard
            icon={<IconCohort className="text-ph-blue" aria-hidden />}
            label="Weekly active users"
            value={<span className="text-ph-blue tabular-nums">12.8K</span>}
            footer="Stable vs trailing 28-day baseline"
          />
          <DashboardKpiCard
            icon={<IconAreaChart className="text-ph-purple" aria-hidden />}
            label="Experiments exposing"
            value={<span className="text-ph-purple tabular-nums">4</span>}
            footer="Flags + multivariates counted"
          />
        </div>

        <DashboardGrid>
          {insightCards.map((card) => (
            <InsightMiniCard
              key={card.title}
              title={card.title}
              subtitle={card.subtitle}
              ribbonColour={card.ribbonColour}
              heights={card.heights}
            />
          ))}
        </DashboardGrid>

        <div className="grid gap-4 md:grid-cols-2">
          <InsightMiniCard
            title="Activation funnel"
            subtitle="Mock · drop-off by step"
            ribbonColour="var(--ph-product-experiments)"
            heights={[88, 72, 58, 44, 32, 28, 24, 22, 20, 18, 16, 15, 14, 13]}
          />
          <DashboardInsightPlaceholder>
            <IconPlus className="h-8 w-8 text-ph-mutedtext group-hover:text-ph-brand" aria-hidden />
            <span className="text-sm font-medium text-ph-subtle group-hover:text-ph-ink">Add insight</span>
            <span className="max-w-[14rem] text-xs text-ph-mutedtext">Opens the same picker pattern your app uses for new tiles.</span>
          </DashboardInsightPlaceholder>
        </div>
      </DashboardWell>
    </ShowcaseWrapper>
  );
}

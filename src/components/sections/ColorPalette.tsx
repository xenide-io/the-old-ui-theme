import type { CSSProperties } from "react";
import { ShowcaseWrapper } from "@/components/ui";

const brandSurface: { label: string; token: string; style: CSSProperties; textClass: string }[] = [
  { label: "Brand orange", token: "--ph-accent", style: { background: "var(--ph-accent)" }, textClass: "text-white" },
  { label: "Brand blue", token: "--ph-blue", style: { background: "var(--ph-blue)" }, textClass: "text-white" },
  { label: "Purple accent", token: "--ph-purple", style: { background: "var(--ph-purple)" }, textClass: "text-white" },
  { label: "Canvas (3000-50)", token: "--ph-canvas", style: { background: "var(--ph-canvas)" }, textClass: "text-ph-ink ring-1 ring-inset ring-ph-border" },
  { label: "Muted surface", token: "--ph-muted", style: { background: "var(--ph-muted)" }, textClass: "text-ph-ink ring-1 ring-inset ring-ph-border" },
  { label: "White surface", token: "--ph-surface", style: { background: "var(--ph-surface)" }, textClass: "text-ph-ink ring-1 ring-inset ring-ph-border" },
  { label: "Border", token: "--ph-border", style: { background: "var(--ph-border)" }, textClass: "text-ph-ink" },
  { label: "Success", token: "--ph-success", style: { background: "var(--ph-success)" }, textClass: "text-white" },
  { label: "Warning", token: "--ph-warning", style: { background: "var(--ph-warning)" }, textClass: "text-white" },
  { label: "Danger", token: "--ph-danger", style: { background: "var(--ph-danger)" }, textClass: "text-white" },
  { label: "Info", token: "--ph-info", style: { background: "var(--ph-info)" }, textClass: "text-white" },
];

const dataSeries = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  label: `Data ${n}`,
  token: `--ph-data-${n}`,
  style: { background: `var(--ph-data-${n})` } as CSSProperties,
  textClass: "text-white",
}));

const productRail = [
  { label: "Session replay", token: "--ph-product-session-replay", style: { background: "var(--ph-product-session-replay)" } as CSSProperties },
  { label: "Product analytics", token: "--ph-product-product-analytics", style: { background: "var(--ph-product-product-analytics)" } as CSSProperties },
  { label: "Data pipeline", token: "--ph-product-data-pipeline", style: { background: "var(--ph-product-data-pipeline)" } as CSSProperties },
  { label: "Feature flags", token: "--ph-product-feature-flags", style: { background: "var(--ph-product-feature-flags)" } as CSSProperties },
  { label: "Experiments", token: "--ph-product-experiments", style: { background: "var(--ph-product-experiments)" } as CSSProperties },
  { label: "Data warehouse", token: "--ph-product-data-warehouse", style: { background: "var(--ph-product-data-warehouse)" } as CSSProperties },
  { label: "Surveys", token: "--ph-product-surveys", style: { background: "var(--ph-product-surveys)" } as CSSProperties },
].map((row) => ({ ...row, textClass: "text-white" }));

function SwatchGrid({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: { label: string; token: string; style: CSSProperties; textClass: string }[];
}) {
  return (
    <div>
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">{title}</h3>
      <p className="mb-3 text-sm text-ph-subtle">{description}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((c) => (
          <div
            key={c.token}
            className={`rounded-[var(--ph-radius-app)] p-5 ${c.textClass}`}
            style={{
              ...c.style,
              boxShadow: "var(--ph-shadow-elevation-3000)",
            }}
          >
            <p className="text-sm font-semibold">{c.label}</p>
            <p className="mt-1 font-mono text-[11px] opacity-90">{c.token}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ColorPalette() {
  const code = `/* CSS variables update with the active theme */

// Brand & surfaces
background: var(--ph-accent);     // Brand orange
background: var(--ph-canvas);     // Canvas
background: var(--ph-surface);    // White surface
border-color: var(--ph-border);   // Hairline borders

// Semantic status
color: var(--ph-success);         // Success green
color: var(--ph-danger);          // Danger red
color: var(--ph-warning);         // Warning amber
color: var(--ph-info);            // Info blue

// Data series (charts)
background: var(--ph-data-1);     // Primary
background: var(--ph-data-2);     // Secondary
// ... up to ph-data-7

// Product rail
background: var(--ph-product-session-replay);
background: var(--ph-product-product-analytics);`;

  return (
    <ShowcaseWrapper
      title="Colour tokens"
      description="Tokens update with the Theme select in the header — surfaces, accents, chart series, and product rail colours all swap together."
      code={code}
      filename="Tokens.css"
    >
      <div className="space-y-10">
        <SwatchGrid
          title="Brand & surfaces"
          description="Core UI chrome and semantic status hues."
          items={brandSurface}
        />
        <SwatchGrid
          title="Insight data series"
          description="Default trend / breakdown palette."
          items={dataSeries}
        />
        <SwatchGrid
          title="Product rail"
          description="Saturated nav / marketing tiles."
          items={productRail}
        />
      </div>
    </ShowcaseWrapper>
  );
}

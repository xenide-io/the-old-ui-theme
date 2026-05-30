"use client";

import { Breadcrumbs, ComponentDocs, Pagination, ShowcaseWrapper } from "@/components/ui";

const breadcrumbTrail = [
  { label: "Project", href: "#" },
  { label: "Product analytics", href: "#" },
  { label: "Trends", current: true },
];

const longBreadcrumbTrail = [
  { label: "Organisation", href: "#" },
  { label: "Data pipeline", href: "#" },
  { label: "Warehouse", href: "#" },
  { label: "Sources", href: "#" },
  { label: "Stripe sync", current: true },
];

export default function UtilityShowcase() {
  const code = `import { Breadcrumbs, Pagination } from "the-old-ui";

<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
  <div className="ph-panel space-y-6">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Breadcrumbs</h3>

    <Breadcrumbs items={breadcrumbTrail} />
    <Breadcrumbs items={longBreadcrumbTrail} label="Long breadcrumb" />
  </div>

  <div className="ph-panel space-y-6">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Pagination</h3>

    <Pagination page={1} totalPages={12} label="Table pagination" />
    <Pagination page={5} totalPages={8} compact label="Compact pagination" />

    <p className="text-xs text-ph-mutedtext">
      Pair with table footers. Active page state and disabled arrows are handled by props.
    </p>
  </div>
</div>`;

  return (
    <ShowcaseWrapper
      title="Navigation utilities"
      description="Breadcrumb and pagination primitives with accessibility and default styling built in."
      code={code}
      filename="UtilityExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "Breadcrumbs.items", type: "{ label; href?; current? }[]", description: "Trail entries rendered with separators and current page state." },
            { name: "Pagination.page", type: "number", description: "Current page." },
            { name: "Pagination.totalPages", type: "number", description: "Total page count." },
            { name: "Pagination.compact", type: "boolean", defaultValue: "false", description: "Uses a narrower visible page window." },
            { name: "Pagination.onPageChange", type: "(page: number) => void", description: "Called by page and arrow buttons." },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="ph-panel space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Breadcrumbs</h3>

          <Breadcrumbs items={breadcrumbTrail} />
          <Breadcrumbs items={longBreadcrumbTrail} label="Long breadcrumb" />
        </div>

        <div className="ph-panel space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Pagination</h3>

          <Pagination page={1} totalPages={12} label="Table pagination" />
          <Pagination page={5} totalPages={8} compact label="Compact pagination" />

          <p className="text-xs text-ph-mutedtext">
            Pair with table footers. Active page state and disabled arrows are handled by props.
          </p>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

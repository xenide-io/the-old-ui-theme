import type { CSSProperties } from "react";
import { Badge, ComponentDocs, ShowcaseWrapper, Table, type TableColumn } from "@/components/ui";

const data = [
  { id: 1, name: "Alice Johnson", role: "Developer", status: "Active", plan: "Pro" },
  { id: 2, name: "Bob Smith", role: "Designer", status: "Offline", plan: "Basic" },
  { id: 3, name: "Charlie Brown", role: "Manager", status: "Active", plan: "Enterprise" },
  { id: 4, name: "Diana Prince", role: "Developer", status: "Busy", plan: "Pro" },
  { id: 5, name: "Eve Davis", role: "QA", status: "Active", plan: "Basic" },
];

const ribbonByPlan: Record<string, string> = {
  Pro: "var(--ph-data-1)",
  Basic: "var(--ph-data-4)",
  Enterprise: "var(--ph-data-6)",
};

type UserRow = (typeof data)[number];

const statusVariant: Record<string, "success" | "neutral" | "warning"> = {
  Active: "success",
  Offline: "neutral",
  Busy: "warning",
};

const columns: TableColumn<UserRow>[] = [
  { key: "id", header: "#", cell: (row) => <span className="tabular-nums text-ph-mutedtext">{row.id}</span>, className: "w-12 text-center" },
  { key: "name", header: "Name", cell: (row) => <span className="font-medium text-ph-ink">{row.name}</span> },
  { key: "role", header: "Role", cell: (row) => row.role },
  { key: "status", header: "Status", cell: (row) => <Badge variant={statusVariant[row.status] ?? "outline"}>{row.status}</Badge> },
  { key: "plan", header: "Plan", cell: (row) => <span className="text-ph-subtle">{row.plan}</span> },
];

const keyValueData = [
  { key: "distinct_id", value: "019b2eef-..." },
  { key: "capture_api_version", value: "2024-06-06" },
];

const keyValueColumns: TableColumn<(typeof keyValueData)[number]>[] = [
  { key: "key", header: "Key", cell: (row) => <span className="font-mono text-xs">{row.key}</span> },
  { key: "value", header: "Value", cell: (row) => <span className="font-mono text-xs">{row.value}</span> },
];

export default function TableShowcase() {
  const code = `import { Badge, Table, type TableColumn } from "the-old-ui";

<div className="space-y-8">
  <div>
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Dashboard table</h3>
    <p className="mb-4 max-w-2xl text-sm text-ph-subtle">
      White canvas, tinted header strip, zebra optional — avoids DaisyUI&apos;s chunky row chrome.
    </p>
    <Table data={data} columns={columns} caption="Dashboard users" />
  </div>

  <div>
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Ribbon column</h3>
    <p className="mb-4 max-w-2xl text-sm text-ph-subtle">
      Per-row accents via inherited <code className="ph-kbd">--row-ribbon</code> mimic Lemon insight list markers (
      <code className="ph-kbd">.ph-table--ribbon</code>).
    </p>
    <Table
      data={data}
      columns={columns}
      ribbon
      getRowStyle={(row) => ({
        "--row-ribbon": ribbonByPlan[row.plan] ?? "var(--ph-data-5)",
      } as CSSProperties)}
    />
  </div>

  <div>
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Zebra rows</h3>
    <Table data={data} columns={columns.slice(0, 4)} zebra />
  </div>

  <div>
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Compact density</h3>
    <Table data={keyValueData} columns={keyValueColumns} compact className="max-w-xl" />
  </div>
</div>`;

  return (
    <ShowcaseWrapper
      title="Tables"
      description="Data table wrapper with typed columns, zebra rows, compact density, and component-based cell rendering."
      code={code}
      filename="TableExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "data", type: "T[]", description: "Rows passed to each column cell renderer." },
            { name: "columns", type: "TableColumn<T>[]", description: "Column definitions with header and cell render function." },
            { name: "zebra", type: "boolean", defaultValue: "false", description: "Adds alternating row backgrounds." },
            { name: "compact", type: "boolean", defaultValue: "false", description: "Reduces density for admin tables." },
            { name: "ribbon", type: "boolean", defaultValue: "false", description: "Adds per-row accent ribbon support." },
            { name: "getRowStyle", type: "(row: T) => CSSProperties", description: "Optional row-level CSS variables or inline style." },
            { name: "caption", type: "string", description: "Accessible table caption rendered visually hidden." },
          ]}
        />
      }
    >
      <div className="space-y-8">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Dashboard table</h3>
          <p className="mb-4 max-w-2xl text-sm text-ph-subtle">
            White canvas, tinted header strip, zebra optional — avoids DaisyUI&apos;s chunky row chrome.
          </p>
          <Table data={data} columns={columns} caption="Dashboard users" />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Ribbon column</h3>
          <p className="mb-4 max-w-2xl text-sm text-ph-subtle">
            Per-row accents via inherited <code className="ph-kbd">--row-ribbon</code> mimic Lemon insight list markers (
            <code className="ph-kbd">.ph-table--ribbon</code>).
          </p>
          <Table
            data={data}
            columns={columns}
            ribbon
            getRowStyle={(row) => ({
              "--row-ribbon": ribbonByPlan[row.plan] ?? "var(--ph-data-5)",
            } as CSSProperties)}
          />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Zebra rows</h3>
          <Table data={data} columns={columns.slice(0, 4)} zebra />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Compact density</h3>
          <Table data={keyValueData} columns={keyValueColumns} compact className="max-w-xl" />
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

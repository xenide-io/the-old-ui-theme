"use client";

import { useState } from "react";
import {
  ComponentDocs,
  FilterControls,
  FilterMenu,
  ShowcaseWrapper,
  SortMenu,
} from "@/components/ui";

const statusOptions = [
  { value: "all", label: "Any status" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
] as const;

const ownerOptions = [
  { value: "anyone", label: "Anyone" },
  { value: "me", label: "Owned by me" },
  { value: "team", label: "My team" },
] as const;

const sortOptions = [
  { value: "updated", label: "Recently updated" },
  { value: "created", label: "Recently created" },
  { value: "name", label: "Name A-Z" },
] as const;

export default function FilterChipsShowcase() {
  const [status, setStatus] = useState("active");
  const [owner, setOwner] = useState("me");
  const [sort, setSort] = useState("updated");

  const applied = [
    ...(status !== "all"
      ? [{ id: "status", label: "Status", value: statusOptions.find((option) => option.value === status)?.label, active: true }]
      : []),
    ...(owner !== "anyone"
      ? [{ id: "owner", label: "Owner", value: ownerOptions.find((option) => option.value === owner)?.label, active: true }]
      : []),
  ];

  const clear = () => {
    setStatus("all");
    setOwner("anyone");
    setSort("updated");
  };

  const remove = (id: string) => {
    if (id === "status") setStatus("all");
    if (id === "owner") setOwner("anyone");
  };

  const code = `import { FilterControls, FilterMenu, SortMenu } from "@xenide-io/the-old-ui-theme";

<FilterControls
  barProps={{ onClear: clearFilters, resultCount: "24 insights" }}
  chipsProps={{ chips: appliedFilters, onRemove: removeFilter }}
  emptyState={<span>No filters applied</span>}
>
  <FilterMenu label="Status" value={status} options={statusOptions} onValueChange={setStatus} />
  <FilterMenu label="Owner" value={owner} options={ownerOptions} onValueChange={setOwner} />
  <SortMenu label="Sort" value={sort} options={sortOptions} onValueChange={setSort} />
</FilterControls>`;

  return (
    <ShowcaseWrapper
      id="filters"
      title="Filter and sort"
      description="Controlled, URL-ready filter menus, applied chips, sorting, clear-all, and result feedback. Menus flip and shift at viewport edges."
      code={code}
      filename="FilterBarExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "FilterControls", type: "FilterControlsProps", description: "Combined filter bar and applied-chip composition without owning state." },
            { name: "FilterBar", type: "FilterBarProps", description: "Lower-level responsive group for filter, sort, clear, and result controls." },
            { name: "FilterMenu", type: "FilterMenuProps", description: "Single-choice filter using an adaptive radio menu." },
            { name: "SortMenu", type: "SortMenuProps", description: "Dedicated sort control kept separate from filter state." },
            { name: "FilterChips", type: "FilterChipsProps", description: "Applied or toggleable chips with independent keyboard-accessible removal." },
          ]}
        />
      }
    >
      <FilterControls
        barProps={{ onClear: clear, resultCount: "24 insights" }}
        chipsProps={{ chips: applied, onRemove: remove }}
        emptyState={<p className="text-xs text-ph-mutedtext">No filters applied</p>}
      >
          <FilterMenu label="Status" value={status} options={statusOptions} onValueChange={setStatus} />
          <FilterMenu label="Owner" value={owner} options={ownerOptions} onValueChange={setOwner} />
          <SortMenu label="Sort" value={sort} options={sortOptions} onValueChange={setSort} />
      </FilterControls>
    </ShowcaseWrapper>
  );
}

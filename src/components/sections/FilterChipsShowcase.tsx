"use client";

import { useState } from "react";
import { ComponentDocs, FilterChips, ShowcaseWrapper } from "@/components/ui";

export default function FilterChipsShowcase() {
  const [chips, setChips] = useState([
    { id: "1", label: "Active", active: true },
    { id: "2", label: "Archived", active: false },
    { id: "3", label: "Draft", active: false },
    { id: "4", label: "Pending", active: true },
    { id: "5", label: "Failed", active: false },
  ]);

  const toggleChip = (id: string) => {
    setChips((prev) => prev.map((chip) => (chip.id === id ? { ...chip, active: !chip.active } : chip)));
  };

  const removeChip = (id: string) => {
    setChips((prev) => prev.filter((chip) => chip.id !== id));
  };

  const code = `import { FilterChips } from "the-old-ui";

<div className="ph-panel">
  <FilterChips chips={chips} onToggle={toggleChip} onRemove={removeChip} />
</div>`;

  return (
    <ShowcaseWrapper
      title="Filter Chips"
      description="Controlled chips for active filters, facets, and quick toggles."
      code={code}
      filename="FilterChipsExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "chips", type: "{ id; label; active }[]", description: "Chips to render." },
            { name: "onToggle", type: "(id: string) => void", description: "Called when a chip is clicked." },
            { name: "onRemove", type: "(id: string) => void", description: "Shows remove control when provided." },
          ]}
        />
      }
    >
      <div className="ph-panel">
        <FilterChips chips={chips} onToggle={toggleChip} onRemove={removeChip} />
      </div>
    </ShowcaseWrapper>
  );
}

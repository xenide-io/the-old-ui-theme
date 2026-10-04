"use client";

import { useState } from "react";

import {
  Button,
  Calendar,
  CommandPalette,
  Input,
  SegmentedControl,
  Table,
} from "@/components/ui";

export default function InteractionStatesFixture() {
  const [view, setView] = useState("board");
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <main className="min-h-screen bg-ph-canvas p-4 text-ph-ink sm:p-8">
      <div
        data-testid="interaction-states-fixture"
        className="mx-auto grid max-w-3xl gap-5 rounded-[var(--ph-radius-overlay)] border border-ph-border bg-ph-surface p-5 sm:grid-cols-2"
      >
        <section className="space-y-4">
          <div>
            <h1 className="text-lg font-semibold">Interaction states</h1>
            <p className="text-sm text-ph-subtle">Focus, selection, overlay, and empty data.</p>
          </div>
          <SegmentedControl
            aria-label="Project view"
            value={view}
            onChange={setView}
            options={[
              { value: "board", label: "Board" },
              { value: "timeline", label: "Timeline" },
            ]}
          />
          <Input label="Workspace name" defaultValue="Northstar" />
          <Input label="Owner email" defaultValue="alex@" error="Enter a valid work email" />
          <Button variant="secondary" onClick={() => setCommandOpen(true)}>
            Open commands
          </Button>
          <Table
            data={[] as Array<{ name: string }>}
            columns={[{ key: "name", header: "Name", cell: (row) => row.name }]}
            caption="Team members"
            emptyState="No teammates yet."
          />
        </section>
        <Calendar value={new Date(2026, 0, 15)} />
      </div>

      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        items={[
          { id: "search", label: "Search workspace", shortcut: "⌘ K", onSelect: () => {} },
          { id: "invite", label: "Invite teammate", shortcut: "⌘ I", onSelect: () => {} },
          { id: "settings", label: "Open settings", shortcut: "⌘ ,", onSelect: () => {} },
        ]}
      />
    </main>
  );
}

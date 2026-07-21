"use client";

import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  DropdownButton,
  DropdownItem,
  FilterBar,
  FilterChips,
  FilterMenu,
  Input,
  Kbd,
  Modal,
  Select,
  SortMenu,
  Textarea,
} from "@/components/ui";
import {
  IconCodePreview,
  IconCommandCursor,
  IconDataReel,
  IconEventStream,
  IconExperimentSplit,
  IconFeatureGate,
  IconInsightBoard,
  IconOldWindow,
  IconQueryStack,
  IconReplayFrame,
  IconSurveyCard,
} from "@/components/icons";

export default function FirstSliceFixture() {
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("active");
  const [sort, setSort] = useState("updated");

  return (
    <main className="min-h-screen bg-ph-canvas p-4 text-ph-ink sm:p-8">
      <div
        data-testid="first-slice-fixture"
        className="mx-auto max-w-5xl rounded-xl border border-ph-border-subtle bg-ph-surface p-4 sm:p-6"
      >
        <header className="flex flex-col gap-4 border-b border-ph-border-subtle pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="brand">Workspace</Badge>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">Activation overview</h1>
            <p className="mt-1 text-sm text-ph-subtle">A realistic state matrix for the refreshed foundations.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DropdownButton label="More" align="end">
              <DropdownItem>Duplicate dashboard</DropdownItem>
              <DropdownItem>Copy link</DropdownItem>
            </DropdownButton>
            <Button variant="secondary">Export</Button>
            <Button variant="primary" onClick={() => setModalOpen(true)}>Invite teammate</Button>
          </div>
        </header>

        <section aria-label="Button states" className="mt-5 flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="signal">Signal</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="signal" outline>Outline</Button>
          <Button variant="primary" loading>Loading</Button>
        </section>

        <section aria-label="Keyboard and original icons" className="mt-5 flex flex-wrap items-center gap-4 border-y border-ph-border-subtle py-4">
          <Kbd keys={["Command", "K"]} platform="mac" />
          <Kbd variant="key">Escape</Kbd>
          <Kbd variant="token">HogQL</Kbd>
          <span className="ml-auto flex flex-wrap items-center justify-end gap-3 text-ph-ink">
            <IconOldWindow size={22} />
            <IconCommandCursor size={22} />
            <IconDataReel size={22} />
            <IconCodePreview size={22} />
            <IconInsightBoard size={22} />
            <IconEventStream size={22} />
            <IconFeatureGate size={22} />
            <IconReplayFrame size={22} />
            <IconQueryStack size={22} />
            <IconExperimentSplit size={22} />
            <IconSurveyCard size={22} />
          </span>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <Card title="Active users" description="Last 7 days">
            <strong className="text-3xl tabular-nums">12,840</strong>
            <Badge variant="success">+12.4%</Badge>
          </Card>
          <Card title="Activation rate" description="Signup to first event" variant="elevated">
            <strong className="text-3xl tabular-nums">67.2%</strong>
            <Badge variant="warning">Needs review</Badge>
          </Card>
          <Card title="Experiment ready" description="Open the rollout settings" interactive>
            <Button variant="tertiary" size="sm">Review experiment</Button>
          </Card>
        </section>

        <section aria-label="Filters and sorting" className="mt-5 space-y-3">
          <FilterBar
            resultCount="24 insights"
            onClear={() => {
              setStatus("all");
              setSort("updated");
            }}
          >
            <FilterMenu
              label="Status"
              value={status}
              onValueChange={setStatus}
              options={[
                { value: "all", label: "Any status" },
                { value: "active", label: "Active" },
                { value: "draft", label: "Draft" },
              ]}
            />
            <SortMenu
              label="Sort"
              value={sort}
              onValueChange={setSort}
              options={[
                { value: "updated", label: "Recently updated" },
                { value: "name", label: "Name A-Z" },
              ]}
            />
          </FilterBar>
          {status !== "all" ? (
            <FilterChips
              chips={[{ id: "status", label: "Status", value: "Active", active: true }]}
              onRemove={() => setStatus("all")}
            />
          ) : null}
        </section>

        <Alert
          className="mt-4"
          status="info"
          title="Warehouse sync is 4 minutes behind"
          description="Product analytics remains current. Imported revenue may arrive shortly."
        />

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr,auto]">
          <Card title="Create audience" description="Labels, descriptions, errors, and density share one field contract.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Audience name" helperText="Visible to everyone in this workspace" placeholder="Power users…" />
              <Select label="Environment" defaultValue="production">
                <option value="production">Production</option>
                <option value="staging">Staging</option>
              </Select>
              <Input label="Owner email" type="email" error="Enter a valid work email" defaultValue="alex@" />
              <Textarea label="Description" placeholder="Describe this audience…" />
            </div>
            <Checkbox wrapperClassName="mt-4" label="Notify me when this audience changes" helperText="A concise weekly summary will be sent." defaultChecked />
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary" loading>Save audience</Button>
            </div>
          </Card>

          <aside className="flex min-w-48 flex-row flex-wrap content-start gap-2 lg:flex-col">
            <Badge variant="neutral">Draft</Badge>
            <Badge variant="info">Importing</Badge>
            <Badge variant="success">Healthy</Badge>
            <Badge variant="warning">Delayed</Badge>
            <Badge variant="danger">Failed</Badge>
          </aside>
        </section>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Invite teammate"
        description="Give someone access to this workspace."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Send invitation</Button>
          </>
        }
      >
        <Input label="Work email" type="email" placeholder="teammate@company.com…" />
      </Modal>
    </main>
  );
}

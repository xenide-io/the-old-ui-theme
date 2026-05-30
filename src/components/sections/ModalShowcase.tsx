"use client";

import { useState } from "react";
import { IconCheck, IconClose, IconPlus } from "@/components/icons";
import { Button, ComponentDocs, Input, Modal, Select, ShowcaseWrapper, Textarea } from "@/components/ui";

export default function ModalShowcase() {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const close = () => setOpenModal(null);

  const code = `import { IconCheck, IconClose, IconPlus } from "the-old-ui";
import { Button, Input, Modal, Select, Textarea } from "the-old-ui";

<div className="ph-panel space-y-4">
  <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Patterns</h3>

  <div className="flex flex-wrap gap-3">
    <Button variant="secondary" onClick={() => setOpenModal("info")}>
      Info
    </Button>
    <Button variant="success" onClick={() => setOpenModal("success")}>
      Success
    </Button>
    <Button variant="danger" onClick={() => setOpenModal("error")}>
      Error
    </Button>
    <Button variant="primary" icon={<IconPlus className="h-4 w-4" aria-hidden />} onClick={() => setOpenModal("form")}>
      Form modal
    </Button>
  </div>

  <Modal
    open={openModal === "info"}
    onClose={close}
    title="Configure capture"
    description="Lightweight overlay + white sheet — Lemon modals skew toward tight copy and decisive buttons."
    footer={<Button variant="secondary" onClick={close}>Close</Button>}
  />

  <Modal
    open={openModal === "success"}
    onClose={close}
    showCloseButton={false}
    footer={<Button variant="success" onClick={close}>Continue</Button>}
  >
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-ph-success">
        <IconCheck className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-ph-success">Saved</h3>
        <p className="mt-1 text-sm text-ph-subtle">Your dashboard layout synced to the team.</p>
      </div>
    </div>
  </Modal>

  <Modal
    open={openModal === "error"}
    onClose={close}
    showCloseButton={false}
    footer={
      <>
        <Button variant="ghost" onClick={close}>Cancel</Button>
        <Button variant="danger" onClick={close}>View logs</Button>
      </>
    }
  >
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-ph-danger">
        <IconClose className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-ph-danger">Query failed</h3>
        <p className="mt-1 text-sm text-ph-subtle">ClickHouse returned a timeout — retry or narrow the date range.</p>
      </div>
    </div>
  </Modal>

  <Modal
    open={openModal === "form"}
    onClose={close}
    size="lg"
    title="Create feature flag"
    footer={
      <>
        <Button variant="ghost" onClick={close}>Cancel</Button>
        <Button variant="primary" onClick={close}>Create</Button>
      </>
    }
  >
    <div className="space-y-4">
      <Input label="Key" placeholder="billing-ui-v3" />
      <Textarea label="Description" placeholder="Expose the rewritten billing funnel" className="h-28" />
      <Select label="Rollout">
        <option>10% staged</option>
        <option>Everyone</option>
      </Select>
    </div>
  </Modal>
</div>`;

  return (
    <ShowcaseWrapper
      title="Modals"
      description="Accessible modal shell with open state, title, description, size, close button, and footer props."
      code={code}
      filename="ModalExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "open", type: "boolean", defaultValue: "false", description: "Controls modal visibility." },
            { name: "onClose", type: "() => void", description: "Called by overlay and close button." },
            { name: "size", type: "sm | md | lg | xl | full", defaultValue: "md", description: "Controls panel max width." },
            { name: "title", type: "string", description: "Accessible dialog heading." },
            { name: "footer", type: "ReactNode", description: "Renders action row with consistent spacing." },
          ]}
        />
      }
    >
      <div className="ph-panel space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Patterns</h3>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setOpenModal("info")}>
            Info
          </Button>
          <Button variant="success" onClick={() => setOpenModal("success")}>
            Success
          </Button>
          <Button variant="danger" onClick={() => setOpenModal("error")}>
            Error
          </Button>
          <Button variant="primary" icon={<IconPlus className="h-4 w-4" aria-hidden />} onClick={() => setOpenModal("form")}>
            Form modal
          </Button>
        </div>

        <Modal
          open={openModal === "info"}
          onClose={close}
          title="Configure capture"
          description="Lightweight overlay + white sheet — Lemon modals skew toward tight copy and decisive buttons."
          footer={<Button variant="secondary" onClick={close}>Close</Button>}
        />

        <Modal
          open={openModal === "success"}
          onClose={close}
          showCloseButton={false}
          footer={<Button variant="success" onClick={close}>Continue</Button>}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-ph-success">
              <IconCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ph-success">Saved</h3>
              <p className="mt-1 text-sm text-ph-subtle">Your dashboard layout synced to the team.</p>
            </div>
          </div>
        </Modal>

        <Modal
          open={openModal === "error"}
          onClose={close}
          showCloseButton={false}
          footer={
            <>
              <Button variant="ghost" onClick={close}>Cancel</Button>
              <Button variant="danger" onClick={close}>View logs</Button>
            </>
          }
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-ph-danger">
              <IconClose className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ph-danger">Query failed</h3>
              <p className="mt-1 text-sm text-ph-subtle">ClickHouse returned a timeout — retry or narrow the date range.</p>
            </div>
          </div>
        </Modal>

        <Modal
          open={openModal === "form"}
          onClose={close}
          size="lg"
          title="Create feature flag"
          footer={
            <>
              <Button variant="ghost" onClick={close}>Cancel</Button>
              <Button variant="primary" onClick={close}>Create</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input label="Key" placeholder="billing-ui-v3" />
            <Textarea label="Description" placeholder="Expose the rewritten billing funnel" className="h-28" />
            <Select label="Rollout">
              <option>10% staged</option>
              <option>Everyone</option>
            </Select>
          </div>
        </Modal>
      </div>
    </ShowcaseWrapper>
  );
}

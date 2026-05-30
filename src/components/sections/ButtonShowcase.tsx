import {
  IconDownload,
  IconPlayCircle,
  IconPlus,
  IconSave,
  IconSpinner,
  IconSubArrowRight,
  IconTrash,
  IconUpload,
} from "@/components/icons";
import { Button, ComponentDocs, DropdownButton, DropdownItem, Panel, ShowcaseWrapper } from "@/components/ui";

export default function ButtonShowcase() {
  const code = `import { IconDownload, IconPlayCircle, IconPlus, IconSave, IconSpinner, IconSubArrowRight, IconTrash, IconUpload } from "the-old-ui";
import { Button, DropdownButton, DropdownItem, Panel } from "the-old-ui";

<div className="space-y-8">
  <Panel className="space-y-4">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Toolbar (like HogQL / insights)</h3>
    <div className="flex flex-wrap items-center gap-2 rounded-lemon border border-ph-border bg-ph-surface p-3 shadow-elevation-3000">
      <DropdownButton
        label="Run"
        variant="primary"
        split
        icon={<IconPlayCircle className="h-4 w-4" aria-hidden />}
      >
        <DropdownItem>Run now</DropdownItem>
        <DropdownItem>Run as new insight…</DropdownItem>
      </DropdownButton>
      <DropdownButton
        label="Variables"
        variant="secondary"
        icon={
          <span className="font-mono text-sm leading-none" aria-hidden>
            {"{}"}
          </span>
        }
      >
        <DropdownItem>Manage variables…</DropdownItem>
        <DropdownItem>Insert column…</DropdownItem>
      </DropdownButton>
      <DropdownButton label="Filters" variant="secondary" panelClassName="min-w-[13rem]">
        <DropdownItem>Add filter group</DropdownItem>
        <DropdownItem>Clear all filters</DropdownItem>
        <DropdownItem className="text-ph-mutedtext">Save as cohort…</DropdownItem>
      </DropdownButton>
      <Button variant="secondary" size="sm" shape="square" aria-label="Layout">
        <span className="flex gap-0.5" aria-hidden>
          <span className="h-4 w-1.5 rounded-sm bg-current" />
          <span className="h-4 w-1.5 rounded-sm bg-current opacity-40" />
        </span>
      </Button>
    </div>
  </Panel>

  <Panel className="space-y-4">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Lemon 3000 primary & secondary</h3>
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="primary" outline>
        Primary outline
      </Button>
      <Button variant="secondary" outline>
        Secondary outline
      </Button>
    </div>
  </Panel>

  <Panel className="space-y-4">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Marketing signal vs in-app</h3>
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">App primary (3000)</Button>
      <Button variant="signal">Marketing signal</Button>
    </div>
  </Panel>

  <Panel className="space-y-4">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Semantic solids</h3>
    <div className="flex flex-wrap gap-3">
      <Button variant="accent">Accent</Button>
      <Button variant="neutral">Neutral</Button>
      <Button variant="info">Info</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
    </div>
  </Panel>

  <Panel className="space-y-4">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">With icons</h3>
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" icon={<IconPlus className="h-4 w-4" aria-hidden />}>
        New project
      </Button>
      <Button variant="primary" sideIcon={<IconSubArrowRight className="h-4 w-4" aria-hidden />}>
        Continue
      </Button>
      <Button variant="secondary" icon={<IconDownload className="h-4 w-4" aria-hidden />}>
        Export
      </Button>
      <Button variant="success" icon={<IconSave className="h-4 w-4" aria-hidden />}>
        Save
      </Button>
      <Button variant="danger" icon={<IconTrash className="h-4 w-4" aria-hidden />}>
        Delete
      </Button>
      <Button variant="ghost" icon={<IconUpload className="h-4 w-4" aria-hidden />}>
        Upload
      </Button>
    </div>
  </Panel>

  <Panel className="space-y-4">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Sizes & shapes</h3>
    <div className="flex flex-wrap items-end gap-3">
      <Button variant="primary" size="xs">
        XS
      </Button>
      <Button variant="primary" size="sm">
        SM
      </Button>
      <Button variant="primary">MD</Button>
      <Button variant="primary" size="lg">
        LG
      </Button>
      <Button variant="primary" shape="circle" aria-label="Add">
        <IconPlus className="h-5 w-5" />
      </Button>
      <Button variant="primary" shape="square" aria-label="Add">
        <IconPlus className="h-5 w-5" />
      </Button>
      <Button variant="secondary" shape="wide">
        Wide
      </Button>
    </div>
  </Panel>

  <Panel className="space-y-4">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Ghost, link & states</h3>
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="ghost">Tertiary</Button>
      <Button variant="link">Text link button</Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <Button variant="primary" icon={<IconSpinner className="h-4 w-4" aria-hidden />}>
        Loading
      </Button>
    </div>
  </Panel>
</div>`;

  return (
    <ShowcaseWrapper
      title="Buttons"
      description="Reusable primitives from the-old-ui — Button, DropdownButton, SearchInput. Primary/secondary Lemon chrome from PostHog LemonButton.scss."
      code={code}
      filename="ButtonExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "variant", type: "primary | secondary | tertiary | signal | accent | neutral | info | success | warning | danger | ghost | link", defaultValue: "secondary", description: "Controls semantic colour and Lemon chrome treatment." },
            { name: "size", type: "xs | sm | md | lg", defaultValue: "md", description: "Controls density without extra classes." },
            { name: "shape", type: "default | circle | square | wide", defaultValue: "default", description: "Applies common button shapes without className." },
            { name: "outline", type: "boolean", defaultValue: "false", description: "Converts solid variants to outline treatment." },
            { name: "icon", type: "ReactNode", description: "Leading icon slot." },
            { name: "sideIcon", type: "ReactNode", description: "Trailing icon slot." },
            { name: "split", type: "boolean", defaultValue: "false", description: "Adds split divider before the trailing slot." },
          ]}
        />
      }
    >
      <div className="space-y-8">
        <Panel className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Toolbar (like HogQL / insights)</h3>
          <div className="flex flex-wrap items-center gap-2 rounded-lemon border border-ph-border bg-ph-surface p-3 shadow-elevation-3000">
            <DropdownButton
              label="Run"
              variant="primary"
              split
              icon={<IconPlayCircle className="h-4 w-4" aria-hidden />}
            >
              <DropdownItem>Run now</DropdownItem>
              <DropdownItem>Run as new insight…</DropdownItem>
            </DropdownButton>
            <DropdownButton
              label="Variables"
              variant="secondary"
              icon={
                <span className="font-mono text-sm leading-none" aria-hidden>
                  {"{}"}
                </span>
              }
            >
              <DropdownItem>Manage variables…</DropdownItem>
              <DropdownItem>Insert column…</DropdownItem>
            </DropdownButton>
            <DropdownButton label="Filters" variant="secondary" panelClassName="min-w-[13rem]">
              <DropdownItem>Add filter group</DropdownItem>
              <DropdownItem>Clear all filters</DropdownItem>
              <DropdownItem className="text-ph-mutedtext">Save as cohort…</DropdownItem>
            </DropdownButton>
            <Button variant="secondary" size="sm" shape="square" aria-label="Layout">
              <span className="flex gap-0.5" aria-hidden>
                <span className="h-4 w-1.5 rounded-sm bg-current" />
                <span className="h-4 w-1.5 rounded-sm bg-current opacity-40" />
              </span>
            </Button>
          </div>
        </Panel>

        <Panel className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Lemon 3000 primary & secondary</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="primary" outline>
              Primary outline
            </Button>
            <Button variant="secondary" outline>
              Secondary outline
            </Button>
          </div>
        </Panel>

        <Panel className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Marketing signal vs in-app</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">App primary (3000)</Button>
            <Button variant="signal">Marketing signal</Button>
          </div>
        </Panel>

        <Panel className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Semantic solids</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="accent">Accent</Button>
            <Button variant="neutral">Neutral</Button>
            <Button variant="info">Info</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </Panel>

        <Panel className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">With icons</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" icon={<IconPlus className="h-4 w-4" aria-hidden />}>
              New project
            </Button>
            <Button variant="primary" sideIcon={<IconSubArrowRight className="h-4 w-4" aria-hidden />}>
              Continue
            </Button>
            <Button variant="secondary" icon={<IconDownload className="h-4 w-4" aria-hidden />}>
              Export
            </Button>
            <Button variant="success" icon={<IconSave className="h-4 w-4" aria-hidden />}>
              Save
            </Button>
            <Button variant="danger" icon={<IconTrash className="h-4 w-4" aria-hidden />}>
              Delete
            </Button>
            <Button variant="ghost" icon={<IconUpload className="h-4 w-4" aria-hidden />}>
              Upload
            </Button>
          </div>
        </Panel>

        <Panel className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Sizes & shapes</h3>
          <div className="flex flex-wrap items-end gap-3">
            <Button variant="primary" size="xs">
              XS
            </Button>
            <Button variant="primary" size="sm">
              SM
            </Button>
            <Button variant="primary">MD</Button>
            <Button variant="primary" size="lg">
              LG
            </Button>
            <Button variant="primary" shape="circle" aria-label="Add">
              <IconPlus className="h-5 w-5" />
            </Button>
            <Button variant="primary" shape="square" aria-label="Add">
              <IconPlus className="h-5 w-5" />
            </Button>
            <Button variant="secondary" shape="wide">
              Wide
            </Button>
          </div>
        </Panel>

        <Panel className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Ghost, link & states</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="ghost">Tertiary</Button>
            <Button variant="link">Text link button</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="primary" icon={<IconSpinner className="h-4 w-4" aria-hidden />}>
              Loading
            </Button>
          </div>
        </Panel>
      </div>
    </ShowcaseWrapper>
  );
}

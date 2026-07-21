"use client";

import { IconCopy, IconEdit, IconLogout, IconPerson, IconTrash, IconTuning } from "@/components/icons";
import { DropdownButton, DropdownItem, ShowcaseWrapper } from "@/components/ui";

export default function DropdownShowcase() {
  const code = `import { IconCopy, IconEdit, IconLogout, IconPerson, IconTrash, IconTuning } from "@xenide-io/the-old-ui-theme";
import { DropdownButton, DropdownItem } from "@xenide-io/the-old-ui-theme";

<div className="ph-panel space-y-6">
  <p className="text-sm text-ph-subtle">
    Use <code className="ph-kbd">DropdownButton</code> from{" "}
    <code className="ph-kbd">the-old-ui</code> — labelled Lemon triggers +{" "}
    <code className="ph-kbd">DropdownItem</code> menu rows.
  </p>

  <div className="flex flex-wrap items-start gap-6">
    <DropdownButton label="Actions" variant="primary">
      <DropdownItem>Refresh cache</DropdownItem>
      <DropdownItem>Export HogQL</DropdownItem>
      <DropdownItem>Jump to inspector</DropdownItem>
    </DropdownButton>

    <DropdownButton label="Account" variant="secondary">
      <DropdownItem>
        <IconPerson className="h-4 w-4" aria-hidden /> Profile
      </DropdownItem>
      <DropdownItem>
        <IconTuning className="h-4 w-4" aria-hidden /> Project settings
      </DropdownItem>
      <DropdownItem>
        <IconLogout className="h-4 w-4" aria-hidden /> Sign out
      </DropdownItem>
    </DropdownButton>

    <DropdownButton label="Row menu" variant="accent" outline>
      <DropdownItem>
        <IconEdit className="h-4 w-4" aria-hidden /> Rename
      </DropdownItem>
      <DropdownItem>
        <IconCopy className="h-4 w-4" aria-hidden /> Duplicate key
      </DropdownItem>
      <div className="my-1 h-px bg-ph-border" />
      <DropdownItem className="text-ph-danger">
        <IconTrash className="h-4 w-4" aria-hidden /> Delete
      </DropdownItem>
    </DropdownButton>
  </div>
</div>`;

  return (
    <ShowcaseWrapper
      title="Dropdowns"
      description="Accessible menu buttons with keyboard navigation and automatic viewport-aware side flipping and alignment shifting."
      code={code}
      filename="DropdownExample.tsx"
    >
      <div className="ph-panel space-y-6">
        <p className="text-sm text-ph-subtle">
          Menus prefer the requested side, then flip above or sideways and shift start/end alignment to remain visible.
        </p>

        <div className="flex flex-wrap items-start gap-6">
          <DropdownButton label="Actions" variant="primary">
            <DropdownItem>Refresh cache</DropdownItem>
            <DropdownItem>Export HogQL</DropdownItem>
            <DropdownItem>Jump to inspector</DropdownItem>
          </DropdownButton>

          <DropdownButton label="Account" variant="secondary">
            <DropdownItem>
              <IconPerson className="h-4 w-4" aria-hidden /> Profile
            </DropdownItem>
            <DropdownItem>
              <IconTuning className="h-4 w-4" aria-hidden /> Project settings
            </DropdownItem>
            <DropdownItem>
              <IconLogout className="h-4 w-4" aria-hidden /> Sign out
            </DropdownItem>
          </DropdownButton>

          <DropdownButton label="Row menu" variant="accent" outline>
            <DropdownItem>
              <IconEdit className="h-4 w-4" aria-hidden /> Rename
            </DropdownItem>
            <DropdownItem>
              <IconCopy className="h-4 w-4" aria-hidden /> Duplicate key
            </DropdownItem>
            <div className="my-1 h-px bg-ph-border" />
            <DropdownItem className="text-ph-danger">
              <IconTrash className="h-4 w-4" aria-hidden /> Delete
            </DropdownItem>
          </DropdownButton>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}

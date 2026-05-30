"use client";

import { useState } from "react";
import { Button, CommandPalette, ComponentDocs, ShowcaseWrapper } from "@/components/ui";
import { IconSearch, IconBolt, IconTuning, IconHome, IconPerson } from "@/components/icons";

export default function CommandPaletteShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { id: "1", label: "Go to Dashboard", shortcut: "Cmd+D", icon: <IconHome className="h-5 w-5" />, onSelect: () => {} },
    { id: "2", label: "Search Events", shortcut: "Cmd+K", icon: <IconSearch className="h-5 w-5" />, onSelect: () => {} },
    { id: "3", label: "Run Query", shortcut: "Cmd+R", icon: <IconBolt className="h-5 w-5" />, onSelect: () => {} },
    { id: "4", label: "Settings", shortcut: "Cmd+,", icon: <IconTuning className="h-5 w-5" />, onSelect: () => {} },
    { id: "5", label: "Profile", icon: <IconPerson className="h-5 w-5" />, onSelect: () => {} },
  ];

  const code = `import { Button, CommandPalette } from "the-old-ui";
import { IconSearch, IconBolt, IconTuning, IconHome, IconPerson } from "the-old-ui";

<div className="ph-panel">
  <Button onClick={() => setIsOpen(true)}>Open Command Palette</Button>
  <CommandPalette items={items} isOpen={isOpen} onClose={() => setIsOpen(false)} />
</div>`;

  return (
    <ShowcaseWrapper
      title="Command Palette"
      description="Application command launcher with controlled open state and typed item actions."
      code={code}
      filename="CommandPaletteExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "items", type: "{ id; label; shortcut?; icon?; onSelect }[]", description: "Commands shown in the palette." },
            { name: "isOpen", type: "boolean", description: "Controls palette visibility." },
            { name: "onClose", type: "() => void", description: "Called by escape, backdrop, or selection." },
          ]}
        />
      }
    >
      <div className="ph-panel">
        <Button onClick={() => setIsOpen(true)}>Open Command Palette</Button>
        <CommandPalette items={items} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </ShowcaseWrapper>
  );
}

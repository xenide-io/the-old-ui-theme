"use client";

import { useState } from "react";
import {
  Banner, Divider, Tag, ProgressCircle, Row, Widget,
  Lettermark, Splotch, Popover, LoadingBar, Link,
  Spinner, Snack, Combobox, Autocomplete, ContextMenu,
  Resizable, ScrollArea, NumberField, InputGroup, ButtonGroup,
  ToggleButton, ToggleGroup, Menubar, AlertDialog, Dot,
  Collapsible, Metric, Chip, DataTable, DatePicker,
  ComponentDocs, ShowcaseWrapper,
  Button, Card, Badge, Dialog, Input, Checkbox, Textarea, Select,
} from "@/components/ui";
import { Bell, Settings, User, Search, Plus } from "iconoir-react";

const bannerCode = `import { Banner } from "@xenide-io/the-old-ui-theme";

<Banner type="info">You are viewing read-only data.</Banner>
<Banner type="success" onClose={() => {}}>Export completed successfully.</Banner>
<Banner type="warning">Your trial ends in 3 days.</Banner>
<Banner type="danger">Pipeline disconnected — check credentials.</Banner>`;

const tagCode = `import { Tag } from "@xenide-io/the-old-ui-theme";

<Tag type="primary">Beta</Tag>
<Tag type="success" closable>Approved</Tag>
<Tag type="warning">Pending</Tag>
<Tag type="danger">Failed</Tag>`;

const dividerCode = `import { Divider } from "@xenide-io/the-old-ui-theme";

<Divider />
<Divider dashed />
<Divider label="OR" />
<Divider vertical />`;

const progressCircleCode = `import { ProgressCircle } from "@xenide-io/the-old-ui-theme";

<ProgressCircle progress={0.75} />
<ProgressCircle progress={0.5} size={60}>
  <span>50%</span>
</ProgressCircle>`;

const rowCode = `import { Row } from "@xenide-io/the-old-ui-theme";
import { User, Settings } from "iconoir-react";

<Row icon={<User className="h-4 w-4" />}>User profile</Row>
<Row sideIcon={<Settings className="h-4 w-4" />}>Settings</Row>`;

const widgetCode = `import { Widget } from "@xenide-io/the-old-ui-theme";

<Widget title="Active Users" onClose={() => {}}>
  Content here
</Widget>`;

const lettermarkCode = `import { Lettermark } from "@xenide-io/the-old-ui-theme";

<Lettermark name="PostHog" />
<Lettermark name="42" />
<Lettermark name="A" rounded outlined />`;

const splotchCode = `import { Splotch } from "@xenide-io/the-old-ui-theme";

<Splotch color="purple" />
<Splotch color="blue" />
<Splotch color="green" />`;

const popoverCode = `import { Popover } from "@xenide-io/the-old-ui-theme";

<Popover trigger={<Button>Open</Button>}>
  Popover content
</Popover>`;

const loadingBarCode = `import { LoadingBar } from "@xenide-io/the-old-ui-theme";

<LoadingBar active />`;

const linkCode = `import { Link } from "@xenide-io/the-old-ui-theme";

<Link href="/docs">Documentation</Link>`;

const spinnerCode = `import { Spinner } from "@xenide-io/the-old-ui-theme";

<Spinner />
<Spinner size="lg" />`;

const snackCode = `import { Snack } from "@xenide-io/the-old-ui-theme";

<Snack>app.posthog.com</Snack>
<Snack type="pill" onClose={() => {}}>Filter applied</Snack>`;

export default function NewComponentsShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <ShowcaseWrapper
        title="Banner"
        description="Status banners for page-level alerts and notifications."
        code={bannerCode}
        filename="BannerExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "type", type: "'info' | 'success' | 'warning' | 'danger' | 'ai'", defaultValue: "info", description: "Controls the banner colour." },
              { name: "onClose", type: "() => void", description: "Shows a close button when provided." },
              { name: "action", type: "ReactNode", description: "Optional action element (e.g. a button)." },
              { name: "hideIcon", type: "boolean", defaultValue: "false", description: "Hides the type icon." },
              { name: "square", type: "boolean", defaultValue: "false", description: "Removes border-radius." },
            ]}
          />
        }
      >
        <div className="space-y-3">
          <Banner type="info">You are viewing read-only data from a previous export.</Banner>
          <Banner type="success" onClose={() => {}}>Export completed successfully. Download available now.</Banner>
          <Banner type="warning">Your trial period ends in 3 days. Add a billing method to continue.</Banner>
          <Banner type="danger">Pipeline disconnected — check your source credentials.</Banner>
          <Banner type="ai">PostHog AI has identified 3 optimization opportunities.</Banner>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Tag"
        description="Compact labels for status, categories, and metadata."
        code={tagCode}
        filename="TagExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "type", type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'highlight'", defaultValue: "default", description: "Semantic colour." },
              { name: "size", type: "'sm' | 'md'", defaultValue: "md", description: "Tag size." },
              { name: "icon", type: "ReactNode", description: "Leading icon." },
              { name: "closable", type: "boolean", defaultValue: "false", description: "Shows a close button." },
              { name: "onClose", type: "() => void", description: "Close callback." },
            ]}
          />
        }
      >
        <div className="flex flex-wrap gap-2">
          <Tag type="default">Default</Tag>
          <Tag type="primary">Beta</Tag>
          <Tag type="success">Live</Tag>
          <Tag type="warning">Pending</Tag>
          <Tag type="danger">Failed</Tag>
          <Tag type="info">Info</Tag>
          <Tag type="muted">Archived</Tag>
          <Tag type="highlight">New</Tag>
          <Tag type="success" closable onClose={() => {}}>Approved</Tag>
          <Tag type="primary" size="sm">Small</Tag>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Divider"
        description="Separates content sections horizontally or vertically."
        code={dividerCode}
        filename="DividerExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "vertical", type: "boolean", defaultValue: "false", description: "Render as a vertical divider." },
              { name: "dashed", type: "boolean", defaultValue: "false", description: "Dashed line style." },
              { name: "thick", type: "boolean", defaultValue: "false", description: "Thicker line." },
              { name: "label", type: "string", description: "Shows a label inside the divider." },
            ]}
          />
        }
      >
        <div className="space-y-6">
          <div>
            <p className="text-sm text-ph-subtle">Content above</p>
            <Divider />
            <p className="text-sm text-ph-subtle">Content below</p>
          </div>
          <Divider dashed />
          <Divider label="OR" />
          <div className="flex h-20 items-center gap-4">
            <span className="text-sm text-ph-subtle">Left</span>
            <Divider vertical />
            <span className="text-sm text-ph-subtle">Right</span>
          </div>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Progress Circle"
        description="Circular progress indicator with optional child content."
        code={progressCircleCode}
        filename="ProgressCircleExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "progress", type: "number", defaultValue: "0", description: "Progress value between 0 and 1." },
              { name: "size", type: "number", defaultValue: "40", description: "Diameter in pixels." },
              { name: "strokeWidth", type: "number", description: "Stroke width override." },
              { name: "children", type: "ReactNode", description: "Content rendered in the centre." },
            ]}
          />
        }
      >
        <div className="flex flex-wrap items-end gap-8">
          <div className="flex flex-col items-center gap-2">
            <ProgressCircle progress={0.25} size={48} />
            <span className="text-xs text-ph-mutedtext">25%</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProgressCircle progress={0.5} size={48} />
            <span className="text-xs text-ph-mutedtext">50%</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProgressCircle progress={0.75} size={48} />
            <span className="text-xs text-ph-mutedtext">75%</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProgressCircle progress={1} size={48} />
            <span className="text-xs text-ph-mutedtext">100%</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProgressCircle progress={0.65} size={64}>
              <span className="text-xs font-bold">65%</span>
            </ProgressCircle>
            <span className="text-xs text-ph-mutedtext">With label</span>
          </div>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Row"
        description="Horizontal layout container with icon and side-icon slots."
        code={rowCode}
        filename="RowExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "icon", type: "ReactElement", description: "Leading icon element." },
              { name: "sideIcon", type: "ReactElement", description: "Trailing icon element." },
              { name: "status", type: "'default' | 'success' | 'warning' | 'danger' | 'muted'", defaultValue: "default", description: "Semantic colour." },
              { name: "fullWidth", type: "boolean", defaultValue: "false", description: "Takes full width." },
              { name: "center", type: "boolean", defaultValue: "false", description: "Centers content." },
              { name: "size", type: "'sm' | 'md' | 'lg'", defaultValue: "md", description: "Row size." },
            ]}
          />
        }
      >
        <div className="space-y-3">
          <Row icon={<User className="h-4 w-4" />}>User profile</Row>
          <Row sideIcon={<Settings className="h-4 w-4" />}>Settings</Row>
          <Row icon={<Bell className="h-4 w-4" />} sideIcon={<Badge variant="danger">3</Badge>}>
            Notifications
          </Row>
          <Row status="success" fullWidth className="rounded-md bg-ph-muted px-3 py-2">
            Operation completed successfully
          </Row>
          <Row center fullWidth>
            Centered content
          </Row>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Widget"
        description="Panel with a distinct header and content area."
        code={widgetCode}
        filename="WidgetExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "title", type: "ReactNode", description: "Widget header title." },
              { name: "onClose", type: "() => void", description: "Shows close button." },
              { name: "actions", type: "ReactNode", description: "Header action elements." },
            ]}
          />
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Widget title="Active Users" onClose={() => {}}>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-ph-ink">1,234</span>
              <span className="text-xs text-ph-success">+12%</span>
            </div>
            <p className="mt-1 text-xs text-ph-mutedtext">Last 30 minutes</p>
          </Widget>
          <Widget title="Page Views" actions={<Tag type="primary">Live</Tag>}>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-ph-ink">89.2k</span>
              <span className="text-xs text-ph-mutedtext">today</span>
            </div>
          </Widget>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Lettermark"
        description="Avatar-style initial letter display."
        code={lettermarkCode}
        filename="LettermarkExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "name", type: "string | number", description: "Text to derive initial from." },
              { name: "index", type: "number", description: "Picks a deterministic colour." },
              { name: "rounded", type: "boolean", description: "Circular shape." },
              { name: "outlined", type: "boolean", description: "Outlined vs filled." },
              { name: "size", type: "'xs' | 'sm' | 'md' | 'lg'", defaultValue: "md" },
            ]}
          />
        }
      >
        <div className="flex flex-wrap items-center gap-4">
          <Lettermark name="PostHog" index={0} />
          <Lettermark name="Analytics" index={1} />
          <Lettermark name="Experiments" index={2} />
          <Lettermark name="Replay" index={3} rounded />
          <Lettermark name="Flags" index={4} rounded />
          <Lettermark name="A" outlined />
          <Lettermark name="42" index={5} rounded outlined />
          <div className="flex items-center gap-2">
            <Lettermark name="XS" size="xs" index={6} />
            <Lettermark name="MD" index={7} />
            <Lettermark name="LG" size="lg" index={0} />
          </div>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Splotch"
        description="Color swatch indicator for pickers and menus."
        code={splotchCode}
        filename="SplotchExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "color", type: "'purple' | 'blue' | 'green' | 'black' | 'white' | 'orange' | 'red' | 'yellow'", description: "Splotch colour." },
            ]}
          />
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <Splotch color="purple" />
          <Splotch color="blue" />
          <Splotch color="green" />
          <Splotch color="orange" />
          <Splotch color="red" />
          <Splotch color="yellow" />
          <Splotch color="black" />
          <Splotch color="white" />
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Popover"
        description="Floating panel anchored to a trigger element."
        code={popoverCode}
        filename="PopoverExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "trigger", type: "ReactNode", description: "Element that opens the popover." },
              { name: "open", type: "boolean", description: "Controlled open state." },
              { name: "onOpenChange", type: "(open) => void", description: "Open state change handler." },
              { name: "placement", type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "bottom", description: "Popover placement." },
              { name: "matchTriggerWidth", type: "boolean", defaultValue: "false", description: "Match trigger width." },
              { name: "padded", type: "boolean", defaultValue: "true", description: "Add padding inside panel." },
            ]}
          />
        }
      >
        <div className="flex flex-wrap gap-4">
          <Popover trigger={<Button variant="secondary">Open popover</Button>}>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-ph-ink">Popover Content</p>
              <p className="text-ph-mutedtext">This is a basic popover with some content inside.</p>
            </div>
          </Popover>
          <Popover trigger={<Button variant="primary">With list</Button>}>
            <div className="space-y-1">
              {["Profile", "Settings", "Help", "Log out"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="w-full rounded-md px-3 py-1.5 text-left text-sm text-ph-subtle hover:bg-ph-muted hover:text-ph-ink"
                >
                  {item}
                </button>
              ))}
            </div>
          </Popover>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Loading Bar"
        description="Thin indeterminate progress bar for page-level loading."
        code={loadingBarCode}
        filename="LoadingBarExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "active", type: "boolean", defaultValue: "true", description: "Animates when active." },
            ]}
          />
        }
      >
        <div className="space-y-3">
          <LoadingBar active />
          <LoadingBar active={false} />
          <Button variant="primary" onClick={toggleLoading} loading={loading}>
            {loading ? "Loading..." : "Trigger loading"}
          </Button>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Link"
        description="Styled text link with brand colour and hover underline."
        code={linkCode}
        filename="LinkExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables the link." },
              { name: "href", type: "string", description: "Anchor href." },
            ]}
          />
        }
      >
        <div className="flex flex-wrap items-center gap-4">
          <Link href="#">Documentation</Link>
          <Link href="#">API Reference</Link>
          <Link href="#">Changelog</Link>
          <Link href="#" disabled>Disabled link</Link>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Spinner"
        description="Animated loading spinner for inline loading states."
        code={spinnerCode}
        filename="SpinnerExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "size", type: "'sm' | 'md' | 'lg'", defaultValue: "sm", description: "Spinner size." },
              { name: "textColored", type: "boolean", defaultValue: "false", description: "Use text colour instead of brand." },
            ]}
          />
        }
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="sm" />
            <span className="text-xs text-ph-mutedtext">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <span className="text-xs text-ph-mutedtext">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <span className="text-xs text-ph-mutedtext">Large</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner textColored />
            <span className="text-xs text-ph-mutedtext">Text colored</span>
          </div>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Snack"
        description="Small chip for displaying removable filter values or selections."
        code={snackCode}
        filename="SnackExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "type", type: "'regular' | 'pill'", defaultValue: "regular", description: "Shape variant." },
              { name: "onClose", type: "() => void", description: "Shows close button." },
              { name: "wrap", type: "boolean", defaultValue: "false", description: "Allows text wrapping." },
            ]}
          />
        }
      >
        <div className="flex flex-wrap gap-2">
          <Snack>app.posthog.com</Snack>
          <Snack>production</Snack>
          <Snack type="pill">Filter: last 7 days</Snack>
          <Snack type="pill" onClose={() => {}}>Status: active</Snack>
          <Snack onClose={() => {}}>user_123@example.com</Snack>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Dialog"
        description="Confirmation dialog built on Modal with confirm/cancel buttons."
        code={`import { Dialog } from "@xenide-io/the-old-ui-theme";

<Dialog
  title="Confirm deletion"
  confirmText="Delete"
  confirmProps={{ variant: "danger" }}
  onConfirm={() => console.log("confirmed")}
  onClose={() => {}}
>
  Are you sure?
</Dialog>`}
        filename="DialogExample.tsx"
        docs={
          <ComponentDocs
            rows={[
              { name: "title", type: "string", description: "Dialog title." },
              { name: "onConfirm", type: "() => void | Promise<void>", description: "Confirm callback." },
              { name: "onClose", type: "() => void", description: "Close callback." },
              { name: "confirmText", type: "string", defaultValue: "Confirm", description: "Confirm button label." },
              { name: "cancelText", type: "string", defaultValue: "Cancel", description: "Cancel button label." },
              { name: "confirmProps", type: "Partial<ButtonProps>", description: "Override confirm button." },
            ]}
          />
        }
      >
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" onClick={() => setDialogOpen(true)}>
            Open dialog
          </Button>
          <Dialog
            title="Confirm action"
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onConfirm={() => {}}
            confirmText="Continue"
          >
            <p className="text-sm text-ph-subtle">
              Are you sure you want to proceed with this action? This cannot be undone.
            </p>
          </Dialog>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Combobox"
        description="Searchable multi-select with removable chips."
        code={`import { Combobox } from "@xenide-io/the-old-ui-theme";

<Combobox
  options={[
    { value: "1", label: "Option A" },
    { value: "2", label: "Option B" },
  ]}
  value={["1"]}
  onChange={(v) => console.log(v)}
/>`}
        filename="ComboboxExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "options", type: "ComboboxOption[]", description: "Array of {value, label}." },
          { name: "value", type: "string[]", description: "Selected values." },
          { name: "onChange", type: "(value: string[]) => void", description: "Selection change handler." },
          { name: "placeholder", type: "string", defaultValue: "Search..." },
        ]} />}
      >
        <Combobox
          options={[
            { value: "react", label: "React" },
            { value: "vue", label: "Vue" },
            { value: "svelte", label: "Svelte" },
            { value: "angular", label: "Angular" },
            { value: "solid", label: "Solid" },
          ]}
          value={["react", "vue"]}
          placeholder="Search frameworks..."
        />
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Autocomplete"
        description="Search input with filtered suggestions dropdown."
        code={`import { Autocomplete } from "@xenide-io/the-old-ui-theme";

<Autocomplete
  options={[
    { value: "1", label: "Result A" },
    { value: "2", label: "Result B" },
  ]}
  onSelect={(opt) => console.log(opt)}
/>`}
        filename="AutocompleteExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "options", type: "AutocompleteOption[]", description: "Array of {value, label}." },
          { name: "onSelect", type: "(option) => void", description: "Selection handler." },
        ]} />}
      >
        <Autocomplete
          options={[
            { value: "1", label: "Dashboard" },
            { value: "2", label: "Insights" },
            { value: "3", label: "Experiments" },
            { value: "4", label: "Feature Flags" },
          ]}
          placeholder="Search pages..."
        />
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Context Menu"
        description="Right-click triggered contextual menu."
        code={`import { ContextMenu } from "@xenide-io/the-old-ui-theme";

<ContextMenu
  items={[
    { label: "Edit", onClick: () => {} },
    { label: "Delete", onClick: () => {}, disabled: true },
  ]}
>
  <div className="p-8 border rounded">Right-click me</div>
</ContextMenu>`}
        filename="ContextMenuExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "items", type: "ContextMenuItem[]", description: "Menu items with label, onClick, disabled, separator, icon." },
        ]} />}
      >
        <ContextMenu
          items={[
            { label: "Edit", onClick: () => alert("Edit") },
            { label: "Duplicate", onClick: () => alert("Duplicate") },
            { separator: true },
            { label: "Delete", onClick: () => alert("Delete") },
          ]}
        >
          <Card variant="elevated" className="p-8 text-center text-sm text-ph-mutedtext cursor-context-menu">
            Right-click this area
          </Card>
        </ContextMenu>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Resizable"
        description="Drag-to-resize split panel layout."
        code={`import { Resizable } from "@xenide-io/the-old-ui-theme";

<Resizable
  left={<div>Left panel</div>}
  right={<div>Right panel</div>}
  defaultLeftWidth={40}
/>`}
        filename="ResizableExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "left", type: "ReactNode", description: "Left panel content." },
          { name: "right", type: "ReactNode", description: "Right panel content." },
          { name: "defaultLeftWidth", type: "number", defaultValue: "50", description: "Initial left width percentage." },
          { name: "minLeftWidth", type: "number", defaultValue: "20", description: "Minimum left width %." },
          { name: "minRightWidth", type: "number", defaultValue: "20", description: "Minimum right width %." },
        ]} />}
      >
        <div className="h-48 rounded-lg border border-ph-border overflow-hidden">
          <Resizable
            left={<div className="flex h-full items-center justify-center text-sm text-ph-mutedtext bg-ph-muted">Left panel</div>}
            right={<div className="flex h-full items-center justify-center text-sm text-ph-mutedtext">Right panel</div>}
            defaultLeftWidth={40}
          />
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Scroll Area"
        description="Scrollable container with edge shadow indicators."
        code={`import { ScrollArea } from "@xenide-io/the-old-ui-theme";

<ScrollArea className="h-40">
  {items.map((item) => <div key={item}>{item}</div>)}
</ScrollArea>`}
        filename="ScrollAreaExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "orientation", type: "'vertical' | 'horizontal' | 'both'", defaultValue: "vertical" },
        ]} />}
      >
        <ScrollArea className="h-32 w-64 rounded-lg border border-ph-border">
          <div className="space-y-2 p-3">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="rounded-md bg-ph-muted px-3 py-2 text-sm text-ph-subtle">
                Item {i + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Number Field"
        description="Numeric input with increment/decrement buttons."
        code={`import { NumberField } from "@xenide-io/the-old-ui-theme";

<NumberField
  value={5}
  onChange={(v) => console.log(v)}
  min={0}
  max={100}
  step={1}
/>`}
        filename="NumberFieldExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "value", type: "number" },
          { name: "onChange", type: "(value: number) => void" },
          { name: "min", type: "number" },
          { name: "max", type: "number" },
          { name: "step", type: "number", defaultValue: "1" },
          { name: "label", type: "string" },
        ]} />}
      >
        <div className="flex flex-wrap gap-6">
          <NumberField label="Quantity" min={0} max={99} />
          <NumberField label="Timeout (s)" value={30} step={5} />
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Input Group"
        description="Input with leading/trailing add-on elements."
        code={`import { InputGroup, Input, Button } from "@xenide-io/the-old-ui-theme";

<InputGroup>
  <span className="px-3 py-2 text-sm bg-ph-muted text-ph-subtle border-r border-ph-border">https://</span>
  <input className="ph-input flex-1 border-0 rounded-none" />
  <Button>Go</Button>
</InputGroup>`}
        filename="InputGroupExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "children", type: "ReactNode", description: "Elements to group together." },
        ]} />}
      >
        <div className="space-y-3">
          <InputGroup>
            <span className="inline-flex items-center px-3 text-sm text-ph-mutedtext bg-ph-muted border-r border-ph-border">https://</span>
            <Input placeholder="example.com" className="rounded-none border-0" />
          </InputGroup>
          <InputGroup>
            <Input placeholder="Search..." className="rounded-none border-0" />
            <Button variant="primary" className="rounded-none"><Search className="h-4 w-4" /></Button>
          </InputGroup>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Button Group"
        description="Segmented button row with separators."
        code={`import { ButtonGroup, Button } from "@xenide-io/the-old-ui-theme";

<ButtonGroup>
  <Button variant="secondary">Left</Button>
  <Button variant="secondary">Center</Button>
  <Button variant="secondary">Right</Button>
</ButtonGroup>`}
        filename="ButtonGroupExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "children", type: "ReactNode", description: "Buttons to group." },
        ]} />}
      >
        <ButtonGroup>
          <Button variant="secondary" size="sm">Day</Button>
          <Button variant="secondary" size="sm">Week</Button>
          <Button variant="secondary" size="sm">Month</Button>
          <Button variant="secondary" size="sm">Year</Button>
        </ButtonGroup>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Toggle Button"
        description="Pressable toggle button for toolbars and stateful controls."
        code={`import { ToggleButton, ToggleGroup } from "@xenide-io/the-old-ui-theme";

<ToggleButton pressed={true} onPressedChange={(p) => console.log(p)}>
  Bold
</ToggleButton>`}
        filename="ToggleButtonExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "pressed", type: "boolean", defaultValue: "false" },
          { name: "onPressedChange", type: "(pressed: boolean) => void" },
          { name: "icon", type: "ReactNode", description: "Leading icon." },
        ]} />}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <ToggleButton pressed={true}>Bold</ToggleButton>
            <ToggleButton>Italic</ToggleButton>
            <ToggleButton>Underline</ToggleButton>
          </div>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Menubar"
        description="Horizontal menu bar with dropdown submenus."
        code={`import { Menubar } from "@xenide-io/the-old-ui-theme";

<Menubar
  items={[
    { label: "File", items: [{ label: "New" }, { label: "Open" }] },
    { label: "Edit", items: [{ label: "Cut" }, { label: "Copy" }] },
  ]}
/>`}
        filename="MenubarExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "items", type: "MenubarItem[]", description: "Menu items with label and optional sub-items." },
        ]} />}
      >
        <Menubar
          items={[
            {
              label: "File",
              items: [
                { label: "New File", onClick: () => alert("New") },
                { label: "Open...", onClick: () => alert("Open") },
                { separator: true },
                { label: "Save", onClick: () => alert("Save") },
              ],
            },
            {
              label: "Edit",
              items: [
                { label: "Undo", onClick: () => alert("Undo") },
                { label: "Redo", onClick: () => alert("Redo") },
              ],
            },
            { label: "View", items: [{ label: "Toggle Sidebar" }] },
          ]}
        />
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Alert Dialog"
        description="Alert role confirmation dialog."
        code={`import { AlertDialog, Button } from "@xenide-io/the-old-ui-theme";

<AlertDialog
  title="Delete item"
  confirmText="Delete"
  confirmProps={{ variant: "danger" }}
  onConfirm={() => {}}
>
  <p>This action cannot be undone.</p>
</AlertDialog>`}
        filename="AlertDialogExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "title", type: "string" },
          { name: "onConfirm", type: "() => void | Promise<void>" },
          { name: "confirmText", type: "string", defaultValue: "Confirm" },
          { name: "cancelText", type: "string", defaultValue: "Cancel" },
        ]} />}
      >
        <div>
          <Button variant="danger" onClick={() => setDialogOpen(true)}>Delete item</Button>
          <AlertDialog
            title="Delete item"
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onConfirm={() => alert("Deleted!")}
            confirmText="Delete"
            confirmProps={{ variant: "danger" }}
          >
            <p className="text-sm text-ph-subtle">This action cannot be undone. Are you sure you want to delete this item?</p>
          </AlertDialog>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Dot"
        description="Tiny presence and status indicator dot."
        code={`import { Dot } from "@xenide-io/the-old-ui-theme";

<Dot color="green" />
<Dot color="yellow" />
<Dot color="red" />`}
        filename="DotExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "color", type: "'green' | 'yellow' | 'red' | 'blue' | 'gray'", defaultValue: "gray" },
          { name: "size", type: "'sm' | 'md'", defaultValue: "md" },
        ]} />}
      >
        <div className="flex flex-wrap items-center gap-4">
          {(["green", "yellow", "red", "blue", "gray"] as const).map((c) => (
            <div key={c} className="flex items-center gap-2 text-sm text-ph-subtle">
              <Dot color={c} />
              <span className="capitalize">{c}</span>
            </div>
          ))}
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Collapsible"
        description="Single-section disclosure with chevron toggle."
        code={`import { Collapsible } from "@xenide-io/the-old-ui-theme";

<Collapsible trigger={<span>Section title</span>}>
  Hidden content here
</Collapsible>`}
        filename="CollapsibleExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "trigger", type: "ReactNode", description: "Visible trigger content." },
          { name: "open", type: "boolean", description: "Controlled open state." },
          { name: "onOpenChange", type: "(open) => void" },
        ]} />}
      >
        <div className="space-y-2">
          <Collapsible trigger={<span className="text-sm font-medium">Configuration</span>}>
            <div className="space-y-2">
              <Checkbox label="Enable analytics" />
              <Checkbox label="Enable session recording" />
            </div>
          </Collapsible>
          <Collapsible trigger={<span className="text-sm font-medium">Advanced</span>}>
            <p className="text-ph-subtle">Advanced configuration options go here.</p>
          </Collapsible>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Metric"
        description="Composable stat tile with label, value, badge, and trend."
        code={`import { Metric, Badge } from "@xenide-io/the-old-ui-theme";

<Metric
  value="1,234"
  label="Active Users"
  badge={<Badge variant="success">+12%</Badge>}
/>`}
        filename="MetricExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "value", type: "string | number", description: "Primary metric value." },
          { name: "label", type: "string", description: "Metric label." },
          { name: "badge", type: "ReactNode", description: "Optional badge/chip." },
          { name: "trend", type: "ReactNode", description: "Trend indicator." },
          { name: "icon", type: "ReactNode", description: "Leading icon." },
        ]} />}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric
            value="89.2k"
            label="Page Views"
            badge={<Badge variant="success">+12%</Badge>}
            trend={<span>vs 79.6k last week</span>}
          />
          <Metric
            value="2,847"
            label="Active Users"
            badge={<Badge variant="warning">+3%</Badge>}
            trend={<span>vs 2,764 last week</span>}
          />
          <Metric
            value="23"
            label="Avg. Session (min)"
            badge={<Badge variant="danger">-5%</Badge>}
            trend={<span>vs 24.2 last week</span>}
          />
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Chip"
        description="Removable token for filters, tags, and multi-select values."
        code={`import { Chip } from "@xenide-io/the-old-ui-theme";

<Chip onRemove={() => {}}>React</Chip>
<Chip selected>Vue</Chip>`}
        filename="ChipExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "selected", type: "boolean", defaultValue: "false" },
          { name: "onRemove", type: "() => void", description: "Shows remove button." },
        ]} />}
      >
        <div className="flex flex-wrap gap-2">
          <Chip>React</Chip>
          <Chip selected>Vue</Chip>
          <Chip>Svelte</Chip>
          <Chip selected onRemove={() => {}}>Angular</Chip>
          <Chip onRemove={() => {}}>Solid</Chip>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Data Table"
        description="Sortable, paginated, searchable data table."
        code={`import { DataTable } from "@xenide-io/the-old-ui-theme";

<DataTable
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "status", label: "Status" },
  ]}
  data={[
    { name: "Item 1", status: "Active" },
  ]}
  searchable
  pageSize={5}
/>`}
        filename="DataTableExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "columns", type: "DataTableColumn[]", description: "Column definitions with key, label, render, sortable." },
          { name: "data", type: "T[]", description: "Array of data objects." },
          { name: "pageSize", type: "number", defaultValue: "10" },
          { name: "searchable", type: "boolean", defaultValue: "false" },
        ]} />}
      >
        <DataTable
          columns={[
            { key: "name", label: "Name", sortable: true },
            { key: "email", label: "Email", sortable: true },
            { key: "role", label: "Role", sortable: true },
            { key: "status", label: "Status" },
          ]}
          data={[
            { name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
            { name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" },
            { name: "Charlie Lee", email: "charlie@example.com", role: "Viewer", status: "Inactive" },
            { name: "Diana Ross", email: "diana@example.com", role: "Admin", status: "Active" },
            { name: "Eve Wilson", email: "eve@example.com", role: "Editor", status: "Active" },
            { name: "Frank Brown", email: "frank@example.com", role: "Viewer", status: "Inactive" },
            { name: "Grace Chen", email: "grace@example.com", role: "Admin", status: "Active" },
          ]}
          searchable
          pageSize={3}
        />
      </ShowcaseWrapper>

      <ShowcaseWrapper
        title="Date Picker"
        description="Calendar date picker dropdown."
        code={`import { DatePicker } from "@xenide-io/the-old-ui-theme";

<DatePicker
  value={new Date()}
  onChange={(date) => console.log(date)}
/>`}
        filename="DatePickerExample.tsx"
        docs={<ComponentDocs rows={[
          { name: "value", type: "Date", description: "Selected date." },
          { name: "onChange", type: "(date: Date) => void", description: "Date selection handler." },
        ]} />}
      >
        <DatePicker
          value={new Date()}
          onChange={(date) => console.log(date.toDateString())}
        />
      </ShowcaseWrapper>
    </>
  );
}

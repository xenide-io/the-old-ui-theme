# Component Usage

Always import from the package root:

```tsx
import { Button, Card, H1, P } from "the-old-ui";
```

Do not import internal `Ph*` components.

## Typography

```tsx
import { Display, H1, H2, H3, H4, H5, P, Small, Caption, Overline, Lead, Mono, Label } from "the-old-ui";

<Display>Marketing Title</Display>
<H1>Page Title</H1>
<H2>Section Title</H2>
<H3>Subsection</H3>
<P tone="subtle">Body copy with muted treatment.</P>
<Small tone="muted">Small helper text</Small>
<Caption>Metadata</Caption>
<Lead>Large intro paragraph.</Lead>
<Mono>distinct_id</Mono>
```

Common typography props:

```ts
tone?: "default" | "muted" | "subtle" | "brand" | "danger" | "success" | "warning" | "info" | "inherit"
weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold"
truncate?: boolean
className?: string
```

## Actions

```tsx
import { Button, DropdownButton, DropdownItem } from "the-old-ui";

<Button variant="primary" size="sm">Save</Button>
<Button variant="secondary" outline>Cancel</Button>
<Button variant="danger" disabled>Delete</Button>

<DropdownButton label="Run" variant="primary" split>
  <DropdownItem>Run now</DropdownItem>
  <DropdownItem>Run as new insight</DropdownItem>
</DropdownButton>
```

Button props:

```ts
variant?: "primary" | "secondary" | "tertiary" | "signal" | "accent" | "neutral" | "info" | "success" | "warning" | "danger" | "ghost" | "link"
size?: "xs" | "sm" | "md" | "lg"
shape?: "default" | "circle" | "square" | "wide"
outline?: boolean
icon?: ReactNode
sideIcon?: ReactNode
```

## Feedback

```tsx
import { Alert, Badge, Toast, ToastStack, EmptyState, Progress } from "the-old-ui";

<Alert status="warning" title="Approaching quota" description="Replay capture is at 92%." />
<Badge variant="success">Live</Badge>

<ToastStack>
  <Toast status="success" title="Saved" description="Your dashboard updated." />
</ToastStack>

<Progress label="Exports" value={45} color="bg-ph-blue" showPercentage />

<EmptyState title="No projects yet" description="Create your first project." />
```

## Inputs

```tsx
import { Checkbox, FileUpload, Input, Radio, Range, Rating, SearchGroup, SearchInput, Select, Textarea, Toggle } from "the-old-ui";

<Input label="Email" placeholder="you@example.com" />
<Input label="Key" error="Required" />
<Select label="Environment"><option>Production</option></Select>
<Textarea label="Description" />
<Checkbox label="Autocapture pageviews" defaultChecked />
<Radio name="cohort" label="Dynamic cohort" />
<Toggle label="Session replay" />
<Range label="Sample rate" min={0} max={100} defaultValue={42} />
<Rating label="Satisfaction" value={4} />
<FileUpload label="Source map archive" />
<SearchInput label="Jump to" shortcut="Cmd K" />
<SearchGroup label="Grouped search" submitLabel="Search records" />
```

## Layout

```tsx
import { Card, Drawer, Modal, Panel, Accordion, HoverCard } from "the-old-ui";

<Panel title="Settings">Content</Panel>
<Card title="Insight saved" description="Dashboard tile copy." />
<Modal open={open} onClose={close} title="Create feature flag">Content</Modal>
<Drawer open={open} onClose={close} title="Insight controls">Content</Drawer>
<Accordion items={items} allowMultiple defaultOpen={["1"]} />
<HoverCard trigger={<button>Hover me</button>}>Details</HoverCard>
```

## Navigation

```tsx
import { Breadcrumbs, CommandPalette, FilterChips, Pagination, SegmentedControl, Stepper, Tabs } from "the-old-ui";

<Tabs items={items} value={active} onChange={setActive} />
<Breadcrumbs items={[{ label: "Project", href: "#" }, { label: "Trends", current: true }]} />
<Pagination page={1} totalPages={12} onPageChange={setPage} />
<SegmentedControl options={options} value={view} onChange={setView} />
<Stepper steps={steps} currentStep={1} />
<CommandPalette items={commands} isOpen={open} onClose={close} />
<FilterChips chips={chips} onToggle={toggleChip} onRemove={removeChip} />
```

## Data And Display

```tsx
import { Avatar, AvatarGroup, ChatBubble, Indicator, Kbd, Stat, Table, Terminal, Timeline } from "the-old-ui";

<Stat label="Total volume" value="2.6M" tone="brand" />

<Table data={rows} columns={columns} zebra compact />

<Avatar label="JD" status="online" />
<AvatarGroup><Avatar label="MJ" /><Avatar label="AR" /></AvatarGroup>

<ChatBubble name="Max" time="09:14">Could you summarize this?</ChatBubble>

<Indicator badge="8"><button>Notifications</button></Indicator>

<Terminal title="sandbox" lines={[{ text: "❯ bun add the-old-ui" }]} />

<Timeline events={events} alternate />

<Kbd keys={["⌘", "K"]} />
```

## Calendar

```tsx
import { Calendar } from "the-old-ui";

const [date, setDate] = useState<Date | undefined>(new Date());

<Calendar value={date} onChange={setDate} />
```

## Icons

```tsx
import { IconPlus, IconSearch, IconPerson } from "the-old-ui";

<IconPlus className="h-4 w-4" />
<IconSearch className="h-5 w-5 text-ph-mutedtext" />
<IconPerson className="h-5 w-5" />
```

Icons use `currentColor`, so apply color with `text-ph-*` classes.

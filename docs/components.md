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
import { Card, Drawer, Modal, Panel, Accordion, HoverCard } from "@xenide-io/the-old-ui-theme";

<Panel title="Settings">Content</Panel>
<Card title="Insight saved" description="Dashboard tile copy." />
<Modal open={open} onClose={close} title="Create feature flag">Content</Modal>
<Drawer open={open} onClose={close} title="Insight controls">Content</Drawer>
<Accordion items={items} allowMultiple defaultOpen={["1"]} />
<HoverCard trigger={<button>Hover me</button>}>Details</HoverCard>
```

## Navigation

```tsx
import { Breadcrumbs, CommandPalette, FilterBar, FilterChips, FilterMenu, Pagination, SegmentedControl, SortMenu, Stepper, Tabs } from "@xenide-io/the-old-ui-theme";

<Tabs items={items} value={active} onChange={setActive} />
<Breadcrumbs items={[{ label: "Project", href: "#" }, { label: "Trends", current: true }]} />
<Pagination page={1} totalPages={12} onPageChange={setPage} />
<SegmentedControl options={options} value={view} onChange={setView} />
<Stepper steps={steps} currentStep={1} />
<CommandPalette items={commands} isOpen={open} onClose={close} />
<FilterBar onClear={clearFilters} resultCount="24 insights">
  <FilterMenu label="Status" value={status} options={statusOptions} onValueChange={setStatus} />
  <SortMenu label="Sort" value={sort} options={sortOptions} onValueChange={setSort} />
</FilterBar>
<FilterChips chips={appliedFilters} onRemove={removeFilter} />
```

## Product Layouts

```tsx
import {
  AuthCard,
  AuthLayout,
  FilterControls,
  Loader,
  SettingsLayout,
  SettingsNav,
  Skeleton,
} from "@xenide-io/the-old-ui-theme";

<AuthLayout brand="Acme">
  <AuthCard title="Welcome back">Sign-in form</AuthCard>
</AuthLayout>

<SettingsLayout title="Settings" navigation={<SettingsNav groups={groups} />}>
  Settings panels
</SettingsLayout>

<Loader variant="dots" label="Loading events" />
<Skeleton shape="block" />
```

## Data And Display

```tsx
import { Avatar, AvatarGroup, ChatBubble, Indicator, Kbd, Stat, Table, Terminal, Timeline } from "@xenide-io/the-old-ui-theme";

<Stat label="Total volume" value="2.6M" tone="brand" />

<Table data={rows} columns={columns} zebra compact />

<Avatar label="JD" status="online" />
<AvatarGroup><Avatar label="MJ" /><Avatar label="AR" /></AvatarGroup>

<ChatBubble name="Max" time="09:14">Could you summarize this?</ChatBubble>

<Indicator badge="8"><button>Notifications</button></Indicator>

<Terminal title="sandbox" lines={[{ text: "❯ bun add the-old-ui" }]} />

<Timeline events={events} alternate />

<Kbd keys={["Command", "K"]} platform="mac" />
<Kbd variant="key">Escape</Kbd>
<Kbd variant="token">HogQL</Kbd>
```

## Calendar

```tsx
import { Calendar } from "the-old-ui";

const [date, setDate] = useState<Date | undefined>(new Date());

<Calendar value={date} onChange={setDate} />
```

## Icons

```tsx
import { IconCommandCursor, IconDataReel, IconOldWindow, IconPlus, IconSearch } from "@xenide-io/the-old-ui-theme";

<IconPlus className="h-4 w-4" />
<IconSearch className="h-5 w-5 text-ph-mutedtext" />
<IconOldWindow size={20} />
<IconCommandCursor size={20} />
<IconDataReel size={20} aria-label="Data reel" />
```

Icons use `currentColor`, so apply color with `text-ph-*` classes. Unlabelled icons are decorative and hidden from assistive technology; passing `aria-label` exposes an icon as an image.

Old UI originals follow a 24×24 filled grid, use strong silhouettes, retain at least 1.5px negative space, and must remain recognizable at 16, 20, and 24px. Add distinctive product metaphors deliberately rather than copying a large generic icon catalog.

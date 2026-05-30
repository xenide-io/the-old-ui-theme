# AI Quick Reference

Use this file when an AI agent needs to generate UI with `the-old-ui`.

## Rules

Always import from `the-old-ui`.

```tsx
import { Button, Card, H1, P } from "the-old-ui";
```

Never import from internal paths like `the-old-ui/dist/*`, `src/components/*`, or `Ph*` files.

Prefer props over classes. Use `className` only for layout, spacing, and one-off overrides.

Use semantic components instead of raw HTML when available:

```tsx
// Good
<H2>Settings</H2>
<P tone="subtle">Manage workspace preferences.</P>
<Button variant="primary">Save</Button>

// Avoid unless no component exists
<h2 className="...">Settings</h2>
<button className="...">Save</button>
```

## Default App Setup

```tsx
import "the-old-ui/styles.css";
import { THEME_INIT_SCRIPT, ThemeManager } from "the-old-ui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="hedgehog-light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeManager>{children}</ThemeManager>
      </body>
    </html>
  );
}
```

## Common UI Patterns

Page header:

```tsx
<div className="space-y-2">
  <H1>Dashboard</H1>
  <P tone="subtle">Monitor product usage and conversion.</P>
</div>
```

Action row:

```tsx
<div className="flex gap-2">
  <Button variant="primary">Save</Button>
  <Button variant="secondary" outline>Cancel</Button>
</div>
```

Form:

```tsx
<Panel title="Profile" className="space-y-4">
  <Input label="Name" />
  <Textarea label="Bio" />
  <Toggle label="Public profile" />
  <Button variant="primary">Save</Button>
</Panel>
```

Card grid:

```tsx
<div className="grid gap-4 md:grid-cols-3">
  <Card title="Activation" description="Track onboarding." />
  <Card title="Retention" description="Monitor cohorts." />
  <Card title="Revenue" description="Watch conversion." />
</div>
```

Status message:

```tsx
<Alert status="warning" title="Approaching quota" description="Usage is at 92%." />
```

Data table:

```tsx
const columns = [
  { key: "name", header: "Name", cell: (row) => row.name },
  { key: "status", header: "Status", cell: (row) => <Badge variant="success">{row.status}</Badge> },
];

<Table data={rows} columns={columns} zebra />
```

Theme switcher:

```tsx
<ThemeSwitcher />
```

Manual theme change:

```tsx
persistTheme("hedgehog-dark");
```

## Component Groups

Typography: `Display`, `H1`, `H2`, `H3`, `H4`, `H5`, `P`, `Small`, `Caption`, `Overline`, `Lead`, `Mono`, `Label`

Actions: `Button`, `DropdownButton`, `DropdownItem`, `DropdownMenu`

Feedback: `Alert`, `Badge`, `Toast`, `ToastStack`, `EmptyState`, `Progress`

Inputs: `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Toggle`, `Range`, `Rating`, `FileUpload`, `SearchInput`, `SearchGroup`

Layout: `Card`, `Panel`, `Modal`, `Drawer`, `Accordion`, `HoverCard`

Navigation: `Tabs`, `Breadcrumbs`, `Pagination`, `SegmentedControl`, `Stepper`, `CommandPalette`, `FilterChips`

Data/display: `Table`, `Stat`, `Avatar`, `AvatarGroup`, `ChatBubble`, `Indicator`, `Terminal`, `Timeline`, `Calendar`, `Kbd`

Themes: `ThemeManager`, `ThemeSwitcher`, `persistTheme`, `readStoredTheme`, `THEME_INIT_SCRIPT`

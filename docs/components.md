# Component Usage

Import supported components from `@xenide-io/the-old-ui-theme`. The complete
supported surface is listed in the [component reference](./component-reference.md).

```tsx
import {
  Alert,
  Button,
  Card,
  Input,
  Modal,
  Table,
  type TableColumn,
} from "@xenide-io/the-old-ui-theme";
```

Use `className` for layout and small local adjustments. Prefer a component's
typed props and semantic token classes over literal colours or bespoke control
implementations.

```tsx
<Card title="Workspace settings" description="Manage member access.">
  <Input label="Workspace name" defaultValue="Research" />
  <Button variant="primary">Save changes</Button>
</Card>

<Alert status="warning" title="Approaching quota" />

<Modal open={open} onClose={() => setOpen(false)} title="Create project">
  <Input label="Project name" autoFocus />
</Modal>
```

Tables need stable row identity whenever rows can change order or contain
stateful content:

```tsx
const columns: TableColumn<User>[] = [
  { key: "name", header: "Name", cell: (user) => user.name },
];

<Table data={users} columns={columns} getRowKey={(user) => user.id} />;
```

For the additional `/ui` surface, import from
`@xenide-io/the-old-ui-theme/ui`. Use `/suite` only for ShellStack product
chrome and suite workflow components.

# AI Quick Reference

Use `@xenide-io/the-old-ui-theme` for supported primitives. Do not import
internal source paths or symbols absent from the
[component reference](./component-reference.md).

```tsx
import "@xenide-io/the-old-ui-theme/styles.css";
import {
  Button,
  Card,
  H1,
  Input,
  P,
  THEME_INIT_SCRIPT,
  ThemeDomSync,
} from "@xenide-io/the-old-ui-theme";
```

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="hedgehog-light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeDomSync />
        {children}
      </body>
    </html>
  );
}
```

Use semantic components and native form controls. Every interactive control
needs an accessible name, visible focus state, keyboard support, and loading or
disabled feedback where applicable. Prefer `Button` over a styled `div`, and
use `Input label="..."` or an explicit `aria-label` when a visible label is
not appropriate.

```tsx
<section className="space-y-4">
  <div>
    <H1>Workspace settings</H1>
    <P tone="subtle">Manage member access and defaults.</P>
  </div>
  <Card title="Profile">
    <Input label="Display name" />
    <Button variant="primary">Save changes</Button>
  </Card>
</section>
```

Use the `/suite` entry only for ShellStack application chrome. It is not a
generic replacement for primitive components.

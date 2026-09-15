# The Old UI Docs

These docs support humans and AI agents using `@xenide-io/the-old-ui-theme` as a React UI library. The rendered demo shows visual examples; this folder explains how to install, configure, import, theme, and compose the supported UI elements.

## Start Here

1. [Installation](./installation.md)
2. [Theme Setup](./themes.md)
3. [Component And Variant Reference](./component-reference.md)
4. [Component Usage](./components.md)
5. [Theme Token Reference](./theme-token-reference.md)
6. [AI Quick Reference](./ai-quick-reference.md)
7. [Suite UI Audit](./suite-audit.md)
8. [Demo Routes](./demos.md)

## Import Rule

Always import public components from the package root:

```tsx
import { Button, Card, H1, P } from "@xenide-io/the-old-ui-theme";
```

Do not import internal `Ph*` files. The `Ph*` names are implementation details.

## Default Theme

The default theme is:

```txt
hedgehog-light
```

Use `hedgehog-dark` for its dark pair.

# The Old UI Docs

These docs are the source for humans and AI agents using `the-old-ui` as a React UI library. The rendered demo shows visual examples; this folder explains how to install, configure, import, theme, and compose the UI elements.

## Start Here

1. [Installation](./installation.md)
2. [Theme Setup](./themes.md)
3. [Component Usage](./components.md)
4. [Component And Variant Reference](./component-reference.md)
5. [Theme Token Reference](./theme-token-reference.md)
6. [AI Quick Reference](./ai-quick-reference.md)

## Import Rule

Always import public components from the package root:

```tsx
import { Button, Card, H1, P } from "the-old-ui";
```

Do not import internal `Ph*` files. The `Ph*` names are implementation details.

## Default Theme

The default theme is:

```txt
hedgehog-light
```

Use `hedgehog-dark` for its dark pair.

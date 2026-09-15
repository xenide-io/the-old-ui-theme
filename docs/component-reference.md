# Component Reference

The published package is `@xenide-io/the-old-ui-theme`. Import the supported
product surface from the package root:

```tsx
import { Button, Card, H1, P } from "@xenide-io/the-old-ui-theme";
```

The `/ui` entry additionally exposes `Range`, `Kbd`, `SearchGroup`,
`FilterControls`, `ThemeDomSync`, `ThemeSwitcher`, and catalogue helpers.
The `/suite` entry exposes ShellStack-specific application chrome and workflow
components; it is not a generic primitive library.

## Actions And Feedback

| Component | Primary API |
|---|---|
| `Button` | `variant`, `size`, `shape`, `loading`, `icon`, `sideIcon`, `split`, `outline` |
| `ButtonChrome` | Shared visual button chrome for product-specific actions. |
| `Alert` | `status`, `title`, `description`, `icon`, `onDismiss`, `live` |
| `Badge` | `variant`, `size` |
| `Loader` | `variant`, `size`, `label` |
| `LoadingState` | `label`, `title`, `description`, `variant`, `size` |
| `Skeleton` | `shape` |
| `Progress` | `value`, `max`, `label`, `showPercentage`, `size` |
| `EmptyState` | `icon`, `title`, `description`, `action` |

## Forms

| Component | Primary API |
|---|---|
| `FormField` | `controlId`, `label`, `hideLabel`, `helperText`, `error`, `required` |
| `Input` | Native input props plus `label`, `hideLabel`, `error`, `helperText`, `size`, `variant` |
| `Select` | Native select props plus `label`, `hideLabel`, `error`, `helperText`, `size` |
| `Textarea` | Native textarea props plus `label`, `hideLabel`, `error`, `helperText`, `size` |
| `Checkbox`, `Radio`, `Toggle` | Native control props plus label and field feedback props. |
| `FileUpload` | File-input wrapper with label and prompt. |
| `SearchInput` | Search field with optional shortcut and density. |
| `Range` (`/ui`) | Native range wrapper with labels and value display. |

## Overlays And Selection

| Component | Primary API |
|---|---|
| `Modal` | `open`, `onClose`, `title`, `description`, `footer`, `size`, dismissal controls |
| `DropdownMenu` | Radix-backed `trigger`, `align`, `side`, menu content. |
| `DropdownItem`, `DropdownRadioGroup`, `DropdownRadioItem` | Canonical menu item composition. |
| `Tooltip` | `content`, `side`, `align`, `open`, `defaultOpen`, `onOpenChange` |
| `Accordion` | `items`, `allowMultiple`, `defaultOpen` |
| `SegmentedControl` | `options`, `value`, `onChange` |
| `Calendar` | `value`, `onChange` |
| `CommandPalette` | `items`, `isOpen`, `onClose` |
| `FilterBar`, `FilterMenu`, `SortMenu`, `FilterChips` | Stateless filtering composition. |

## Content And Layout

| Component | Primary API |
|---|---|
| `Card` | `title`, `description`, `media`, `actions`, `footer`, `variant` |
| `Panel` | `title`, `description`, native div props. |
| `Table` | `data`, `columns`, `getRowKey`, `caption`, density and ribbon props. |
| `Stat` | `label`, `value`, `tone`, `icon`, `footer` |
| `Avatar`, `AvatarGroup` | `size`, `status`, label/icon and grouping props. |
| `AuthLayout`, `AuthCard`, `AuthDivider` | Authentication page composition. |
| `SettingsLayout`, `SettingsNav` | Settings page composition and navigation. |

## Typography And Utilities

`Display`, `SectionTitle`, `H1` through `H5`, `P`, `Small`, `Caption`,
`Overline`, `Lead`, `Mono`, `Label`, `Link`, `Chip`, `Dot`, `Spinner`,
`Icon`, and `IconByName` are exported from the root package.

Themes are provided through `THEMES`, `THEME_GROUPS`, `getTheme`,
`persistTheme`, `readStoredTheme`, `THEME_INIT_SCRIPT`, `ThemeDomSync`, and
`ThemeSwitcher`.

Use the generated TypeScript declarations as the authoritative detailed prop
reference until per-component API pages are added. Named props interfaces are
available for the major primitives and are being standardised across the
remaining public components.

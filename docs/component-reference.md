# Component And Variant Reference

This is the AI-readable public API reference. Import all components from `the-old-ui`.

```tsx
import { Button, Card, H1, P } from "the-old-ui";
```

Do not use internal file names or implementation prefixes.

## Typography

Components: `Display`, `H1`, `H2`, `H3`, `H4`, `H5`, `P`, `Small`, `Caption`, `Overline`, `Lead`, `Mono`, `Label`

Shared props:

| Prop | Values | Default |
|---|---|---|
| `tone` | `default`, `muted`, `subtle`, `brand`, `danger`, `success`, `warning`, `info`, `inherit` | component-specific |
| `weight` | `normal`, `medium`, `semibold`, `bold`, `extrabold` | component-specific |
| `truncate` | `boolean` | `false` |
| `className` | `string` | - |

## Button

Component: `Button`

| Prop | Values | Default |
|---|---|---|
| `variant` | `primary`, `secondary`, `tertiary`, `signal`, `accent`, `neutral`, `info`, `success`, `warning`, `danger`, `ghost`, `link` | `secondary` |
| `size` | `xs`, `sm`, `md`, `lg` | `md` |
| `shape` | `default`, `circle`, `square`, `wide` | `default` |
| `outline` | `boolean` | `false` |
| `split` | `boolean` | `false` |
| `icon` | `ReactNode` | - |
| `sideIcon` | `ReactNode` | - |
| `loading` | `boolean` | `false` |
| `loadingLabel` | `ReactNode` | current label |

## Dropdowns

Components: `DropdownButton`, `DropdownMenu`, `DropdownItem`

| Component | Important Props |
|---|---|
| `DropdownButton` | `label`, `variant`, `split`, `icon`, `sideIcon`, `panelClassName` |
| `DropdownMenu` | `trigger`, `children`, `align` (`start`, `end`) |
| `DropdownItem` | native button props, `className`, `children` |

## Badge

Component: `Badge`

| Prop | Values | Default |
|---|---|---|
| `variant` | `brand`, `neutral`, `success`, `warning`, `danger`, `info`, `outline` | `neutral` |
| `size` | `sm`, `md` | `md` |

## Alert

Component: `Alert`

| Prop | Values | Default |
|---|---|---|
| `status` | `info`, `success`, `warning`, `danger` | `info` |
| `title` | `string` | - |
| `description` | `string` | - |
| `icon` | `ReactNode` | status icon |
| `onDismiss` | `() => void` | - |
| `live` | `off`, `polite`, `assertive` | - |

## Toast

Components: `Toast`, `ToastStack`

| Prop | Values | Default |
|---|---|---|
| `status` | `info`, `success`, `warning`, `danger` | `info` |
| `title` | `string` | required |
| `description` | `string` | - |
| `onDismiss` | `() => void` | - |

## Card

Component: `Card`

| Prop | Values | Default |
|---|---|---|
| `variant` | `default`, `outlined`, `elevated`, `highlighted` | `default` |
| `title` | `ReactNode` | - |
| `description` | `ReactNode` | - |
| `actions` | `ReactNode` | - |
| `footer` | `ReactNode` | - |
| `media` | `ReactNode` | - |
| `interactive` | `boolean` | `false` |
| `titleAs` | `h2`, `h3`, `h4` | `h3` |

## Inputs

Components: `FormField`, `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Toggle`, `Range`, `FileUpload`, `Rating`, `SearchInput`, `SearchGroup`

| Component | Important Props |
|---|---|
| `FormField` | `controlId`, `label`, `hideLabel`, `helperText`, `error`, `required`, render-function `children` |
| `Input` | `label`, `hideLabel`, `error`, `helperText`, `size`, `variant`, `wrapperClassName` |
| `Select` | `label`, `hideLabel`, `error`, `helperText`, `size`, `wrapperClassName`, `children` |
| `Textarea` | `label`, `hideLabel`, `error`, `helperText`, `size`, `wrapperClassName` |
| `Checkbox` | `label`, `error`, `helperText`, `wrapperClassName` |
| `Radio` | `label`, `wrapperClassName` |
| `Toggle` | `label`, `wrapperClassName` |
| `Range` | `label`, `minLabel`, `maxLabel`, `valueLabel`, `wrapperClassName` |
| `FileUpload` | `label`, `prompt`, `wrapperClassName` |
| `Rating` | `label`, `value`, `max`, `onChange` |
| `SearchInput` | `label`, `hideLabel`, `shortcut`, `density`, `wrapperClassName` |
| `SearchGroup` | `label`, `submitLabel`, `wrapperClassName` |

Input shared variants:

| Prop | Values | Default |
|---|---|---|
| `size` | `sm`, `md`, `lg` | `md` |
| `variant` | `default`, `ghost` | `default` |

## Modal

Component: `Modal`

| Prop | Values | Default |
|---|---|---|
| `open` | `boolean` | `false` |
| `onClose` | `() => void` | - |
| `size` | `sm`, `md`, `lg`, `xl`, `full` | `md` |
| `title` | `string` | - |
| `description` | `string` | - |
| `footer` | `ReactNode` | - |
| `showCloseButton` | `boolean` | `true` |
| `closeOnOutsideClick` | `boolean` | `true` |
| `closeOnEscape` | `boolean` | `true` |
| `aria-label` | `string` | fallback when no visible title exists |

## Drawer

Component: `Drawer`

| Prop | Values | Default |
|---|---|---|
| `open` | `boolean` | `false` |
| `onClose` | `() => void` | - |
| `side` | `left`, `right` | `right` |
| `size` | `sm`, `md`, `lg` | `md` |
| `title` | `ReactNode` | - |
| `footer` | `ReactNode` | - |
| `showCloseButton` | `boolean` | `true` |

## Panel

Component: `Panel`

Props: `title`, `description`, `children`, `className`, native div props.

## Table

Component: `Table`

| Prop | Values | Default |
|---|---|---|
| `data` | `T[]` | required |
| `columns` | `TableColumn<T>[]` | required |
| `zebra` | `boolean` | `false` |
| `compact` | `boolean` | `false` |
| `ribbon` | `boolean` | `false` |
| `caption` | `string` | - |
| `getRowStyle` | `(row: T) => CSSProperties` | - |

Column shape:

```ts
type TableColumn<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
};
```

## Tabs

Component: `Tabs`

| Prop | Values | Default |
|---|---|---|
| `items` | `{ value: string; label: string }[]` | required |
| `value` | `string` | required |
| `onChange` | `(value: string) => void` | required |
| `variant` | `pill`, `underline` | `pill` |

## Navigation Utilities

Components: `Breadcrumbs`, `Pagination`

| Component | Important Props |
|---|---|
| `Breadcrumbs` | `items`, `label`, `className` |
| `Pagination` | `page`, `totalPages`, `onPageChange`, `label`, `compact` |

## Stats

Component: `Stat`

| Prop | Values | Default |
|---|---|---|
| `tone` | `default`, `brand`, `blue`, `purple`, `warning` | `default` |
| `icon` | `ReactNode` | - |
| `label` | `ReactNode` | required |
| `value` | `ReactNode` | required |
| `footer` | `ReactNode` | - |

## Avatar

Components: `Avatar`, `AvatarGroup`

| Prop | Values | Default |
|---|---|---|
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | `md` |
| `status` | `online`, `offline`, `away`, `busy` | - |
| `label` | `string` | - |
| `icon` | `ReactNode` | - |
| `color` | `string` | `bg-ph-brand text-white` |
| `badge` | `string` | - |

`AvatarGroup` props: `children`, `max`, `className`.

## Progress

Component: `Progress`

| Prop | Values | Default |
|---|---|---|
| `value` | `number` | required |
| `max` | `number` | `100` |
| `color` | `string` | `bg-ph-brand` |
| `label` | `string` | - |
| `showPercentage` | `boolean` | `false` |
| `size` | `sm`, `md`, `lg` | `md` |

## ChatBubble

Component: `ChatBubble`

| Prop | Values | Default |
|---|---|---|
| `variant` | `from`, `self` | `from` |
| `avatar` | `ReactNode` | - |
| `name` | `string` | - |
| `time` | `string` | - |
| `footer` | `ReactNode` | - |
| `children` | `ReactNode` | - |

## Indicator

Component: `Indicator`

| Prop | Values | Default |
|---|---|---|
| `badge` | `ReactNode` | - |
| `dot` | `boolean` | `false` |
| `color` | `string` | `bg-ph-brand` |
| `position` | `top-right`, `top-left`, `bottom-right`, `bottom-left` | `top-right` |
| `children` | `ReactNode` | required |

## Terminal

Component: `Terminal`

| Prop | Values | Default |
|---|---|---|
| `title` | `string` | `sandbox` |
| `lines` | `Array<{ text: string; color?: string } | string>` | - |
| `children` | `ReactNode` | - |

## Timeline

Component: `Timeline`

| Prop | Values | Default |
|---|---|---|
| `events` | `TimelineEvent[]` | required |
| `alternate` | `boolean` | `false` |

Event shape:

```ts
type TimelineEvent = {
  id: string;
  title: string;
  description?: string;
  time?: string;
  icon?: ReactNode;
  color?: string;
};
```

## Other Components

| Component | Notes |
|---|---|
| `Accordion` | `items`, `allowMultiple`, `defaultOpen` |
| `Stepper` | `steps`, `currentStep` |
| `SegmentedControl` | `options`, `value`, `onChange` |
| `CommandPalette` | `items`, `isOpen`, `onClose` |
| `Calendar` | `value`, `onChange`, `className` |
| `HoverCard` | `trigger`, `children` |
| `EmptyState` | `icon`, `title`, `description`, `action` |
| `FilterChips` | `chips`, `onToggle`, `onRemove` |
| `FilterControls` | `children`, `barProps`, `chipsProps`, `emptyState` |
| `FilterBar` | `children`, `onClear`, `clearLabel`, `resultCount` |
| `FilterMenu` | `label`, `value`, `options`, `onValueChange`, adaptive menu placement |
| `SortMenu` | `label`, `value`, `options`, `onValueChange`, `direction` |
| `Loader` | `variant` (`spinner`, `dots`, `pulse`), `size`, `label` |
| `Skeleton` | `shape` (`title`, `text`, `short-text`, `avatar`, `button`, `block`) |
| `LoadingState` | `label`, `title`, `description`, `variant`, `size` |
| `AuthLayout` | `brand`, `aside`, `footer`, `children` |
| `AuthCard` | `title`, `description`, `footer`, `children` |
| `SettingsLayout` | `title`, `description`, `actions`, `navigation`, `children` |
| `SettingsNav` | grouped route links with `aria-current` support |
| `CodeBlock` | `code`, `language`, `filename` |
| `Kbd` | `keys`, `variant` (`shortcut`, `key`, `token`), `platform` (`text`, `mac`, `windows`), `separator` |

## Icons

- `CANONICAL_ICONS` is the authoritative registry for documentation and new dynamic usage.
- `PH_ICON_ALIASES` contains compatibility names such as `grid`, `play`, and `warning`.
- `PH_ICONS` combines both registries so existing `IconByName` calls continue to work.
- `OLD_UI_ICONS` contains original 24×24 analytics and retro-interface SVGs authored for this library.
- `IconByName` accepts every `IconName`, forwards its SVG ref, and preserves alias behavior.
- Individual icons accept `size`, SVG attributes, `aria-label`, and `aria-labelledby`.

## Charts

Components: `HogTrendLineChart`, `InsightDoughnutChart`, `InsightHorizontalBarChart`, `InsightPolarAreaChart`, `InsightStackedBarChart`, `InsightVerticalBarChart`

These components render themed demo charts using the package color tokens. They are client components and require the package peer dependencies used by the chart bundle.

## Dashboard Primitives

Components: `DashboardWell`, `DashboardToolbar`, `DashboardGrid`, `DashboardFiltersBar`, `DashboardKpiCard`, `DashboardInsightPlaceholder`, `InsightShell`, `InsightShellHeader`, `MiniTrendBars`, `InsightMiniCard`

Use these for dense analytics layouts and chart shells. They are exported from the root package so demo snippets can be copied without internal imports.

## Theme Components And Helpers

| Export | Purpose |
|---|---|
| `ThemeManager` | Client wrapper that syncs stored theme onto `html[data-theme]` |
| `ThemeSwitcher` | Select UI for built-in registered themes |
| `THEME_INIT_SCRIPT` | Inline script to avoid theme flash before hydration |
| `persistTheme(themeId)` | Set and store active theme |
| `readStoredTheme()` | Read stored/default theme |
| `THEMES` | Theme registry |
| `THEME_GROUPS` | Theme group labels |
| `DEFAULT_THEME_ID` | `hedgehog-light` |

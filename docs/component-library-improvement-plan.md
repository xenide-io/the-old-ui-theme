# Component Library Improvement Plan

## Executive summary

The Old UI should not stop looking PostHog-ish. Its strongest assets are already the parts that make PostHog recognizable: warm work surfaces, rounded typography, tactile controls, compact product UI, vivid data colors, and a slightly handmade tone.

The next version should refine that identity into **handcrafted precision**: a calm, dense analytics workspace where tactility and playfulness appear deliberately rather than on every surface.

The highest-value work is not adding more components. It is:

1. Make the token system complete and consistent across every theme.
2. Make interactive components production-accessible and keyboard-complete.
3. Give depth, color, radius, density, and motion explicit meanings.
4. Turn tables, charts, filters, and dashboard shells into reusable product patterns.
5. Add automated behavior, accessibility, package, and visual regression coverage.

## Current baseline

The repository is both a published component library and a Next.js component lab.

- 40 UI source files, 10 dashboard components, 6 public chart components, and 64 icon components.
- 28 themes across 14 light/dark pairs.
- Semantic theme variables, a Tailwind preset, Open Runde, bespoke SVG icons, and PostHog-style button chrome.
- No unit, interaction, accessibility, or visual regression tests. The current `test` script is TypeScript checking only.
- The library is broad enough for internal tools, but its complex widgets are not yet production-grade.

### What is already strong

- The warm HedgeHog canvas and crisp surface hierarchy are more distinctive than a generic neutral component kit.
- Open Runde gives the system an approachable voice without sacrificing product density.
- Primary and secondary button chrome has a recognizable physical press interaction.
- Theme switching is token-driven and does not require React rerenders.
- The dashboard grid and table overflow behavior already account for responsive layouts.
- The icon set is locally owned, consistent, and based on `currentColor`.
- Chart and product-category colors are separate from the basic neutral palette.
- Components generally use native HTML elements for simple controls.

### Main systemic problems

- Depth has no stable meaning. Static cards, inputs, panels, insights, and actions often share similar ridges and elevation.
- The token model has backgrounds but lacks `on-*` foreground colors, selected states, focus colors, and complete interaction roles.
- Hardcoded Tailwind colors bypass themes in cards, stats, ratings, avatars, filters, and buttons.
- Radius and spacing choices drift between CSS variables and one-off `rounded-lg`/`rounded-xl` utilities.
- Many composite widgets look finished but lack their expected keyboard, focus, and ARIA behavior.
- Twenty-eight themes multiply defects because many do not override the complete token set.
- The chart exports are fixed demos rather than reusable chart APIs.
- The lab documents components manually, causing examples, package names, theme lists, and actual APIs to drift.

## Recommended visual direction

### Handcrafted precision

Use an approximate **80 / 15 / 5** balance:

- 80% quiet workspace: neutral surfaces, precise alignment, compact controls, readable data.
- 15% tactile product character: hard button ridge, inset wells, selected controls, purposeful ribbons.
- 5% playful punctuation: illustrations, unusual empty states, success moments, onboarding, and rare easter eggs.

This avoids two bad outcomes: cloning current PostHog component-for-component, or replacing the identity with generic shadcn/Linear-style SaaS UI.

### Preserve

- Warm yellow-gray HedgeHog canvas rather than generic zinc or slate.
- Open Runde for interface text.
- Six-pixel control radius as the default visual signature.
- Hard lower ridge and physical press behavior for important actions.
- Orange as the brand/action accent, separate from danger.
- Bold blue, violet, green, pink, and red data series.
- Product-category ribbons where category recognition matters.
- Dense toolbars, query controls, tables, and analytics layouts.
- Bespoke icons and concise, human copy.

### Change

- Raised treatment should mean **interactive**, not merely “contained.”
- Static cards and charts should be mostly flat; only clickable cards receive hover elevation.
- Orange should not also mean warning, error, selection, link, and decoration.
- Status colors must have paired readable foreground and subtle-background tokens.
- Large radii should be reserved for floating overlays, not applied inconsistently.
- Product controls should use a coherent density scale rather than unrelated size values.
- Routine work should use quick, subtle motion; expressive motion should be rare.
- Personality should come from typography, tactility, copy, icons, and authored moments, not gradients or decorative effects.

## Reference systems

### PostHog: identity and tactile character

Borrow:

- Warm neutral workspace, Open Runde/RoundHog character, compact Lemon controls, hard button ridge, expressive data palette, and intentionally unusual moments.
- The brand principle of feeling handcrafted, thoughtful, and recognizable.

Do not copy:

- Legacy token fragmentation, overlapping color meanings, or every implementation detail of Lemon UI.

Primary sources:

- <https://posthog.com/handbook/brand/visual-identity>
- <https://posthog.com/handbook/brand/assets>
- <https://github.com/PostHog/posthog/tree/master/frontend/src/lib/lemon-ui>
- <https://github.com/PostHog/posthog/blob/master/frontend/src/styles/base.scss>

### Linear: hierarchy and application shell

Borrow:

- Quiet global chrome, strong alignment, neutral hierarchy before hue, and full-workflow stress testing.
- Clear separation of persistent navigation, working content, and inspectors.

Do not copy:

- Cool monochrome translucency, faint low-contrast borders, or generic premium-dark-SaaS styling.

Sources:

- <https://linear.app/now/how-we-redesigned-the-linear-ui>
- <https://linear.app/blog/a-design-reset>

### GitHub Primer: semantic token discipline

Borrow:

- Primitive, functional, and component token layers.
- Explicit rest, hover, active, selected, disabled, loading, and focus roles.
- Responsive regions that change workflow rather than merely shrink.

Do not copy:

- GitHub’s blue/green identity or border-heavy repository-page appearance.

Sources:

- <https://primer.style/product/getting-started/foundations/color-usage/>
- <https://primer.style/product/primitives/color/>
- <https://primer.style/product/getting-started/foundations/layout/>

### Shopify Polaris: semantic depth and task density

Borrow:

- Compact controls for minute-to-minute work.
- Depth that distinguishes pressable actions from static content.
- Workflow components such as saved views, index filters, bulk actions, and contextual feedback.

Do not copy:

- Card soup or an overly neutral black-and-white visual identity.

Sources:

- <https://polaris.shopify.com/design/layout>
- <https://polaris.shopify.com/design/colors>
- <https://polaris.shopify.com/design/depth>

### Radix Themes and primitives: mechanics

Borrow:

- Predictable color scales, contextual radius, role-based shadows, and accessible headless behavior.
- Primitive behavior underneath custom Old UI styling.

Do not copy:

- Default indigo-gray visuals, pervasive translucency, or one radius formula for every component.

Sources:

- <https://www.radix-ui.com/themes/docs/theme/color>
- <https://www.radix-ui.com/themes/docs/theme/radius>
- <https://www.radix-ui.com/themes/docs/theme/shadows>

### IBM Carbon: data density and spatial rhythm

Borrow:

- Four-pixel micro spacing with an eight-pixel major rhythm.
- Productive versus expressive motion.
- Complete data-table workflows and alignment to visible layout keylines.

Do not copy:

- Square enterprise styling or forcing every measurement onto eight pixels.

Sources:

- <https://carbondesignsystem.com/elements/2x-grid/overview/>
- <https://carbondesignsystem.com/elements/motion/overview/>
- <https://carbondesignsystem.com/components/data-table/usage/>

## Foundation plan

### 1. Token architecture

Keep the public `--ph-*` prefix because the package has external consumers. Consolidate tokens into three documented layers.

**Primitive layer**

- Neutral and accent scales in perceptual color space, preferably OKLCH.
- Separate scales for brand, success, warning, danger, info, and categorical data.
- Alpha scales for subtle fills and state overlays.

**Semantic layer**

- Surfaces: canvas, surface, subtle/inset, raised, overlay.
- Text: primary, secondary, tertiary, disabled, inverse, link.
- Borders: subtle, default, strong, focus, danger.
- Actions: primary, secondary, quiet, danger, plus foreground and hover/active roles.
- Feedback: solid, subtle, border, and foreground roles for every status.
- Selection: selected background, selected foreground, selected border.
- Focus: one global focus-ring color and offset token.

**Component layer**

- Use only where a component cannot be expressed cleanly with semantic roles.
- Keep existing Lemon button face/frame tokens here.
- Add explicit overlay, tooltip, table, and chart-specific roles rather than hardcoded utilities.

Required additions include:

- `--ph-on-accent`
- `--ph-on-success`
- `--ph-on-warning`
- `--ph-on-danger`
- `--ph-on-info`
- `--ph-focus-ring`
- `--ph-selected-bg`
- `--ph-selected-text`
- `--ph-selected-border`
- `--ph-surface-inset`
- `--ph-surface-raised`
- `--ph-surface-overlay`
- `--ph-border-subtle`

Every built-in theme must define the complete required token contract. Do not allow missing values to silently inherit HedgeHog Light.

### 2. Theme tiers

Keep theme breadth, but stop treating all 28 themes as equally certified.

- **Core:** the themes guaranteed to pass contrast, interaction, chart, and visual tests.
- **Compatible:** themes that satisfy semantic token and contrast requirements but may have less hand-tuning.
- **Experimental:** novelty themes available in the lab without a production guarantee.

Start with HedgeHog Light/Dark as the reference pair. Promote other themes only after they pass the same fixtures.

### 3. Depth model

Define four levels and apply them consistently.

| Level | Meaning | Examples |
| --- | --- | --- |
| Flat | Static content | cards, alerts, badges, chart canvases |
| Inset | Working area or contained input | query well, code area, dashboard canvas |
| Raised | Pressable or selectable | primary/secondary buttons, menu trigger, interactive tile |
| Floating | Temporarily above the app | popover, menu, command palette, dialog |

The hard three-pixel Lemon ridge belongs primarily to raised actions. Static cards should not move on hover.

### 4. Radius model

- Control: 6px.
- Surface: 8px.
- Floating overlay: 10-12px.
- Pill: fully rounded only for chips, status pills, and intentionally pill-shaped actions.
- Circular: avatars and icon controls.

Remove one-off radius utilities when a semantic radius applies.

### 5. Density and spacing

- Use a 4px micro-grid and 8px major spacing rhythm.
- Standardize controls around `xs`, `sm`, `md`, and `lg` rather than component-specific values.
- Suggested visible heights: 24px, 30px, 36px, and 44px.
- Keep at least a 44px effective touch target on touch layouts even when the visual control is compact.
- Define compact and standard table/list densities as complete sets, not isolated padding changes.

### 6. Typography

- Keep Open Runde, but publish font assets correctly or make the font an explicit consumer-owned option.
- Use a tighter product type scale than the marketing hero scale.
- Add tabular numerals to stats, tables, timestamps, pagination, and chart labels.
- Balance large headings and use pretty wrapping for body introductions.
- Allow typography components to accept native element props and refs.
- Avoid fixed heading levels inside reusable cards and dashboard shells; allow consumers to choose semantic level.

### 7. Focus and motion

- Apply one tokenized `:focus-visible` treatment to every interactive primitive.
- Use `:focus-within` for compound fields, file upload, search groups, and segmented controls.
- Remove `outline-none` unless an equal or stronger replacement exists.
- Add a global reduced-motion mode.
- Animate only opacity and transform where possible.
- Productive motion should generally complete in 100-180ms; reserve expressive motion for rare moments.
- Remove global smooth scrolling under reduced-motion preferences.

### 8. Responsive behavior

- Define named regions: shell, navigator, toolbar, canvas, inspector, and activity panel.
- On narrow screens, convert inspectors and secondary panes to sheets or drill-in screens instead of squeezed columns.
- Menus, hover cards, and popovers need collision detection and safe viewport padding.
- Tabs, steppers, and segmented controls need an explicit wrap, scroll, or collapse policy.
- Add mobile navigation to the component lab.
- Account for safe areas in full-height overlays and drawers.

## Component plan

### Actions

**Button and ButtonChrome**

- Keep the tactile primary/secondary chrome as a signature.
- Reduce conceptual variants to primary, secondary, quiet/tertiary, danger, and link. Treat success/warning/info as tones only where a workflow truly needs them.
- Reserve `signal` for a featured CTA pattern instead of a general button role.
- Make outline support explicit rather than silently no-op on most variants.
- Replace the current visual-only `split` prop with a true two-target split-button composition.
- Add loading state that preserves label width, icon-only accessible-name requirements, and ref forwarding.
- Use one focus-visible and disabled-state contract across every variant.

**DropdownButton, DropdownMenu, DropdownItem**

- Decide whether this is a disclosure or an ARIA menu and name/API it accordingly.
- Use a headless positioning/interaction primitive for collision detection, Escape, outside click, focus movement, and focus return.
- Add item groups, labels, separators, checkbox/radio items, destructive items, disabled items, and links only after base behavior is complete.

### Forms

**Input, Select, Textarea, Checkbox, Radio, Toggle, Range, FileUpload**

- Introduce a shared `Field`/`FormField` composition for label, description, error, required state, and generated IDs.
- Connect helper/error text with `aria-describedby` and `aria-errormessage`.
- Implement the currently missing small and large input styles.
- Forward refs and preserve native props.
- Give compound controls a shared focus-within treatment.
- Correct Range and FileUpload label association.
- Place checkbox description/error content in a proper text column.
- Add indeterminate Checkbox and required/optional label affordances.
- Keep native controls wherever possible.

**SearchInput and SearchGroup**

- Treat search as a compound field with a clear button, loading state, shortcut hint, and focus-within border.
- Ensure compact density remains readable and touch-safe.

**Rating**

- Implement single-selection radio semantics and arrow-key navigation.
- Separate read-only display from interactive rating APIs.

**Calendar**

- Rebuild around an accessible date-grid behavior foundation rather than extending the current button grid.
- Add locale-aware month/day labels, keyboard navigation, selected/today semantics, min/max dates, disabled dates, and visible-month synchronization.
- Keep Old UI styling above the behavior layer.

### Feedback and status

**Alert and Toast**

- Define deliberate live-region policy: static alerts should not always be assertive; transient toasts should announce at the right politeness.
- Use consistent status icon, subtle fill, border, title, body, and action anatomy.
- Add toast duration, pause-on-hover/focus, swipe/dismiss behavior, and provider/viewport only if the library intends to own toast orchestration.

**Badge and Indicator**

- Separate status, category, count, and decorative badge roles.
- Use semantic foreground tokens instead of white text assumptions.
- Fix Indicator offset or remove it from the API.
- Ensure status information has a text equivalent when meaningful.

**Progress**

- Validate zero/negative max and clamp both visual and ARIA values.
- Support determinate and indeterminate modes explicitly.
- Connect visible labels to the progress element.

**EmptyState**

- Keep this as a personality punctuation point.
- Add size and alignment patterns, but avoid excessive variants.
- Define when illustration, icon, primary action, and secondary help are appropriate.

### Surfaces and layout

**Card and Panel**

- Make default cards flat and static.
- Add a distinct interactive card variant with hover, focus, and pressed behavior.
- Remove global hover elevation from noninteractive cards.
- Fix media edge alignment and replace hardcoded orange highlighting with semantic tokens.
- Prefer composable header/body/footer regions over fixed heading semantics.
- Clarify Panel as an inset/working surface or merge it with the surface model.

**Modal and Drawer**

- Rebuild on accessible dialog primitives with portals, accessible names/descriptions, focus trapping, Escape, focus restoration, scroll lock, and outside-click policy.
- Add viewport-safe max height, internal scrolling, overscroll containment, and mobile safe-area padding.
- Treat Drawer as a dialog/sheet with equivalent behavior.
- Use floating elevation, not the same ridge as normal cards.

**Accordion and CollapsibleSection**

- Add complete disclosure semantics and hide collapsed focusable content.
- Consolidate shared disclosure behavior.
- Keep `CollapsibleSection` lab-only unless consumers have a real product need.

**HoverCard**

- Support keyboard focus, pointer hover intent, touch behavior, safe delays, and collision-aware placement.
- Add a separate accessible Tooltip primitive; do not treat HoverCard and Tooltip as the same pattern.

### Navigation

**Tabs and SegmentedControl**

- Tabs need tablist/tab/panel relationships, roving focus, and arrow-key behavior.
- SegmentedControl should use radio-group or pressed-button semantics based on whether it selects a value or changes a view.
- Define overflow behavior for narrow layouts.

**Breadcrumbs and Pagination**

- Render Breadcrumbs as an ordered list.
- Replace Pagination's fixed `[1, 2, 3, last]` logic with a window around the current page.
- Use the ellipsis character and include accessible page labels.
- Define behavior for invalid page counts and zero results.

**Stepper**

- Use list semantics and announce current, complete, and error states.
- Either honor per-step status or remove it in favor of a single current index.
- Add vertical/mobile presentation.

**CommandPalette**

- Rebuild as an accessible dialog plus combobox/listbox pattern.
- Trap and restore focus, label the input, expose active option state, support empty results safely, and contain keyboard handling.
- Add groups and recent actions only after the core model is correct.

**FilterChips**

- Separate toggle and remove actions into valid focusable controls.
- Define filter, selected-filter, and dismissible-tag APIs rather than combining them in one element.
- Build a higher-level filter bar pattern with count, clear-all, and overflow behavior.

### Data display

**Table**

- Keep a lightweight semantic Table primitive.
- Add stable row keys, column scopes, empty state, row props, numeric alignment, and responsive overflow indicators.
- Build a separate DataTable pattern for sorting, selection, density, filtering, pagination, bulk actions, saved views, and loading states.
- Do not overload the basic Table with every data-grid behavior.

**Stat and DashboardKpiCard**

- Consolidate duplicate metric anatomy.
- Use tabular numerals, optional trend context, comparison period, and accessible value descriptions.
- Replace hardcoded amber and other palette utilities with semantic tones.

**Avatar and AvatarGroup**

- Replace white status borders with a surface token.
- Use `React.Children.toArray` for grouping and counts.
- Define image fallback, initials, loading failure, and status text behavior.

**Timeline, ChatBubble, Terminal, Kbd**

- Keep these as specialized display primitives, but align their radius, spacing, focus, and semantic APIs with foundations.
- Make Timeline heading levels consumer-controlled.
- Limit ChatBubble to conversational products rather than presenting it as a universal primitive.
- Fix Kbd's `ReactNode[]` joining behavior and distinguish key, shortcut, and token visuals or simplify the variants.
- Keep Terminal content semantic and horizontally scrollable.

### Charts and dashboards

**Chart components**

- Move charts to a dedicated `charts` package subpath so optional peer dependencies are actually optional.
- Replace fixed demo exports with typed data, series, label, size, formatter, loading, empty, and error props.
- Keep demo datasets only in the component lab.
- Provide a textual summary or table fallback for every chart.
- Make tooltip and data-point exploration keyboard accessible where practical.
- Keep chart colors in a separate categorical namespace and test adjacent-series contrast.

**Dashboard components**

- Keep DashboardGrid, DashboardWell, toolbar, filters, KPI, and insight shells as the start of a useful analytics pattern library.
- Make shell headings consumer-controlled.
- Mark mini trend bars decorative or provide an accessible summary.
- Add complete insight states: loading, empty, error, stale, refreshing, and no-permission.
- Standardize toolbar/keyline alignment across KPI cards, filters, charts, and tables.
- Add responsive inspector/sheet patterns rather than only card grids.

### Foundation and documentation components

**Typography**

- Add native props, refs, and an `as` strategy where semantics need to differ from visual style.
- Add a dedicated typography specimen to the lab.

**Icons**

- Keep decorative icons hidden by default.
- Automatically expose icons when an accessible label/title is provided, or provide a clear labeled-icon API.
- Add size and stroke alignment fixtures at 12, 16, 20, and 24px.

**ThemeSwitcher, ThemeManager, ThemeDomSync**

- Synchronize multiple switchers and cross-tab changes.
- Guard storage access.
- Add optional system mode.
- Keep pre-paint initialization to avoid theme flash.

**CodeBlock, ComponentDocs, ShowcaseWrapper**

- Treat these as documentation-only exports unless consumer demand exists.
- Generate examples and prop references from executable fixtures or metadata to reduce drift.
- Announce copy success and handle clipboard failures.

### Add only after foundations are stable

- Tooltip
- Popover
- Skeleton
- Spinner/LoadingIndicator
- FormField
- DataTable
- Combobox/Autocomplete
- Sheet as the responsive Drawer pattern
- VisuallyHidden and FocusScope utilities if not supplied by behavior primitives

## Engineering plan

### Behavior foundation decision

Do not hand-roll focus trapping, roving focus, popover collision detection, or complex ARIA state unless there is a strong reason.

Evaluate headless primitives against these requirements:

- Unstyled or easily restyled.
- Tree-shakeable per primitive.
- Good React 18 and server-component boundaries.
- Portal, focus, keyboard, and positioning behavior.
- Does not impose a competing visual system.

Radix primitives are the leading fit for Dialog, DropdownMenu, Popover, HoverCard, Tabs, Accordion, and Tooltip. Calendar/date behavior may warrant a focused accessible date library. The visual layer should remain fully owned by The Old UI.

### API rules

- Export every public component prop and item type.
- Forward refs on native and interactive primitives.
- Extend the correct native element props where possible.
- Use controlled and uncontrolled state conventions consistently.
- Do not expose props that have no effect.
- Separate visual tone, interaction role, size, and state instead of encoding all of them in a single `variant` union.
- Keep escape-hatch `className`, but make normal use possible through documented props.
- Plan breaking API cleanup for a major release because the package is already public.

### CSS rules

- One source of truth for active component CSS; remove or clearly archive duplicated `lemon-primitives.css` and `excel-themes.css`.
- No hardcoded palette utilities inside theme-aware public components.
- No `transition: all`.
- No static hover elevation.
- Every interaction state must work in light and dark themes.
- Compile publishable CSS instead of requiring consumers to process private Tailwind directives unexpectedly.
- Package font assets with resolvable URLs or document fonts as a separate installation choice.

## Verification strategy

### Component tests

Add Vitest and Testing Library tests for:

- Controlled and uncontrolled behavior.
- Keyboard navigation and focus restoration.
- ARIA state, labels, descriptions, and live-region behavior.
- Disabled, loading, empty, and error states.
- Edge cases such as zero progress max, empty command results, and pagination windows.

### Accessibility tests

- Run automated axe checks on every lab fixture.
- Add keyboard-only acceptance tests for all interactive composites.
- Measure text and non-text contrast for every core theme.
- Include reduced-motion and high-contrast/forced-colors checks.

### Visual tests

Keep the existing Next.js lab and add Playwright screenshot coverage rather than introducing another documentation stack immediately.

- Capture all components in HedgeHog Light and Dark.
- Capture semantic color and state fixtures in every theme.
- Capture compact, standard, mobile, and long-content cases.
- Test 320px, 768px, and desktop widths.
- Add interaction screenshots for focus, hover, active, selected, disabled, loading, and error.

### Package tests

- Pack and install the tarball into a minimal consumer fixture.
- Verify root, `ui`, future `charts`, CSS, themes, and Tailwind preset exports.
- Verify fonts resolve or are intentionally external.
- Verify importing `ui` does not require chart dependencies.
- Verify ESM, CJS, and type declarations.

## Delivery phases

### Phase 0: stop regressions

Effort: medium

- Add interaction, axe, visual, and package smoke test foundations.
- Fix font publication and CSS packaging.
- Separate chart exports from the default UI entry.
- Fix existing API no-ops and clear functional defects: pagination, progress, Indicator offset, Rating semantics, input sizes, card media, and chart border class.
- Export public prop types.

Exit criteria:

- A package tarball works in a clean consumer fixture.
- Core components have baseline screenshots and axe checks.
- Root UI imports do not require optional chart packages.

### Phase 1: foundations and reference theme

Effort: large

- Implement semantic foreground, selection, focus, surface, and border tokens.
- Define depth, radius, spacing, density, typography, and motion rules.
- Remove hardcoded component colors and inconsistent radii.
- Fully tune HedgeHog Light and Dark as reference themes.
- Add a theme contract fixture and validator.

Exit criteria:

- HedgeHog Light/Dark pass contrast and every state fixture.
- Components use semantic roles rather than hardcoded color utilities.
- Static and interactive depth are visibly distinguishable.

### Phase 2: core primitives

Effort: large

- Refine Button, FormField and inputs, Badge, Alert, Toast, Progress, Card, Panel, Avatar, typography, and icons.
- Add ref forwarding and native prop support.
- Standardize loading, disabled, focus, and error behavior.

Exit criteria:

- Core primitives work with keyboard, screen reader, long text, dark mode, and mobile touch.
- Component APIs consistently separate role, tone, size, and state.

### Phase 3: complex interaction

Effort: large

- Rebuild Modal, Drawer/Sheet, DropdownMenu, Tooltip, HoverCard, Tabs, Accordion, SegmentedControl, CommandPalette, Calendar, Stepper, and FilterChips using proven behavior primitives.
- Add collision detection, focus management, portals, responsive policies, and complete keyboard contracts.

Exit criteria:

- Every composite passes documented keyboard interaction tests.
- Overlay behavior is viewport-safe and restores focus.
- No pointer-only public component remains.

### Phase 4: data workflows

Effort: large

- Expand basic Table and create a separate DataTable pattern.
- Turn charts into typed reusable components with accessible fallback content.
- Complete dashboard loading/empty/error/refreshing states.
- Align toolbars, filters, KPI cards, charts, tables, and inspectors to shared keylines.

Exit criteria:

- At least one realistic analytics workflow works end-to-end at mobile and desktop widths.
- Data components support loading, empty, error, and populated states.
- Chart dependencies remain optional.

### Phase 5: themes and documentation

Effort: medium

- Classify themes as core, compatible, or experimental.
- Bring each promoted theme up to the complete token contract.
- Generate or co-locate examples to prevent source-string drift.
- Add typography, state, density, responsive, and accessibility documentation.
- Add a mobile component-lab navigator.

Exit criteria:

- Documentation uses the real package name and current APIs.
- Theme claims match automated theme coverage.
- Every public component has purpose, anatomy, API, state, keyboard, and usage guidance.

## Priority order by component

### P0: fix before visual expansion

- Modal, Drawer, CommandPalette, Calendar, Tabs, SegmentedControl, Accordion, HoverCard.
- Input family error/help associations and ref forwarding.
- Font/CSS packaging and optional chart dependency isolation.
- Theme foreground contrast and focus tokens.
- Pagination, Rating, Progress, FilterChips, and Indicator defects.

### P1: establish the evolved look

- Button role/variant cleanup.
- Card/Panel depth semantics.
- Consistent radii, spacing, density, focus, and motion.
- Alert, Toast, Badge, Stat, Avatar, EmptyState, and typography refinement.
- HedgeHog Light/Dark reference-theme polish.

### P2: make it a strong product library

- DataTable and filter/saved-view workflows.
- Reusable chart APIs and accessible chart summaries.
- Responsive dashboard shell, inspectors, and sheets.
- Complete documentation and visual regression matrix.
- Promotion of additional themes to certified status.

### P3: optional expansion

- Specialized ChatBubble, Timeline, Terminal, Diff, Swap, Countdown, and novelty patterns.
- Additional themes and expressive motion.
- New component categories only when tied to a real consuming-product workflow.

## Success measures

- All public interactive components are keyboard complete and have automated interaction tests.
- All core themes meet WCAG AA contrast for text, controls, status foregrounds, and focus indicators.
- No hardcoded color in a public component bypasses the semantic theme contract.
- Root UI import has no chart dependency requirement.
- Package fonts and CSS work in a clean consumer without undocumented build behavior.
- Every component has documented loading, empty, error, disabled, focus, and long-content behavior where applicable.
- Mobile workflows preserve functionality rather than only stacking desktop cards.
- The interface remains recognizable as The Old UI in grayscale through typography, spacing, radius, and tactile depth alone.

## Recommended first implementation slice

The first slice should be small enough to prove the direction but broad enough to expose token weaknesses:

1. Build the new semantic token contract in HedgeHog Light/Dark.
2. Apply it to Button, Input/FormField, Card, Badge, Alert, and Modal.
3. Make Card flat by default and Button tactile by default.
4. Rebuild Modal behavior on an accessible primitive.
5. Add one realistic dashboard fixture containing a toolbar, filters, KPI, card, form, alert, and modal.
6. Capture desktop/mobile, light/dark, keyboard-focus, error, loading, and disabled visual tests.

That slice will determine whether handcrafted precision works as a system before the remaining components are migrated.

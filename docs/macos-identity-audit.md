# macOS Identity Audit

## Goal

Give The Old UI a recognisable macOS sensibility without turning it into an
Apple replica or losing its PostHog-derived character.

The target is **warm tactile precision**:

- Keep Open Runde, the warm Hedgehog canvas, orange action colour, dense
  product layouts, bespoke icons, and Lemon button press behaviour.
- Add macOS-like material hierarchy, crisp selected states, quiet inset
  controls, deliberate overlay depth, compact toolbars, and restrained motion.
- Do not add fake window traffic lights, copy Apple application layouts,
  replace the typeface with SF Pro, or make every surface translucent.

## Audit Baseline

This audit supersedes stale baseline statements in
`component-library-improvement-plan.md`:

- The package currently has 16 themes across 8 light/dark pairs, not 28.
- Vitest now covers primitives and suite workflows: 28 files and 113 tests.
- Playwright has desktop and mobile snapshots for the first-slice workflow,
  themes, modal, auth, settings, filters, progress, and button states.
- Modal and dropdown behaviour now use Radix primitives.
- Semantic surface, status, selection, focus, and foreground tokens exist.

Baseline `bun run check` passes. ESLint reports three existing warnings and no
errors.

## Public Surface Inventory

### Actions, Feedback, And Status

| Elements | Current character | macOS identity treatment |
| --- | --- | --- |
| `Button`, `ButtonChrome`, `DropdownButton`, `MarketingLink` | Strong Lemon ridge and physical press | Preserve the signature ridge for filled actions; make neutral controls quieter and give every face one crisp top highlight and a shorter pressed travel |
| `Alert`, `Badge`, `Progress`, `Dot` | Semantic colour system is established | Keep semantic colours; reduce border weight and use calm tinted wells rather than stronger shadows |
| `Loader`, `Spinner`, `LoadingState`, `Skeleton` | Multiple compatible loading patterns | Keep geometry, standardise motion duration and remove redundant decorative elevation |
| `EmptyState`, `SuiteEmptyState`, `TodayEmptyState` | Three visibly different treatments | Share surface/radius/depth rules while preserving suite artwork and product-specific punctuation |

### Forms And Selection

| Elements | Current character | macOS identity treatment |
| --- | --- | --- |
| `FormField`, `Input`, `Select`, `Textarea`, `SearchInput`, `SearchGroup` | Good semantic field contract; inset lip already exists | Use one control fill, border, inset highlight, and blue focus halo across every field |
| `Checkbox`, `Radio`, `Toggle`, `Range`, `FileUpload` | Native-derived controls with mixed geometry | Keep native mechanics; tune marks, switch track, thumb shadow, and focus treatment as one family |
| `SegmentedControl` | Visually close to macOS but uses one-off radii, shadow, and `transition-all` | Make this the clearest macOS reference: inset track, selected face, subtle hairline, arrow-key semantics, no broad transition |
| `Chip`, `FilterChips`, `FilterBar`, `FilterMenu`, `SortMenu`, `FilterControls` | Functional but pill and surface treatments vary | Keep pills only for filters/tags; use a shared selected state and compact toolbar material |
| `Calendar` | Accessible date grid with one-off card styling | Move it onto overlay tokens and use compact circular/rounded selection states without changing behaviour |

### Overlays And Disclosure

| Elements | Current character | macOS identity treatment |
| --- | --- | --- |
| `Modal` | Radix behaviour and strong floating shadow | Use a cleaner overlay material, title-bar rhythm, hairline separator, and consistent close control |
| `DropdownMenu`, `Tooltip`, `CommandPalette` | Each has a different overlay implementation and visual formula | Unify overlay radius, border, shadow, blur fallback, row height, selected state, and entrance motion |
| `Accordion`, `CollapsibleSection` | Correct disclosure semantics but hardcoded large radii and broad transitions | Use shared surface radius and only animate grid/chevron properties |
| `SuiteMobileDrawer` | Accessible Radix drawer with native-style motion | Retain mobile sheet/drawer behaviour; use the same material and focus contract as desktop overlays |

### Surfaces, Data, And Content

| Elements | Current character | macOS identity treatment |
| --- | --- | --- |
| `Card`, `Panel`, `Stat` | Base CSS says static cards are flat, but suite skin gives every card a shadow and 12px radius | Restore semantic depth: static cards flat, interactive cards raised, panels inset, stats aligned with cards |
| `Table` | Compact and readable | Use a quiet header material, selected/hover row tint, tabular values, and visible scroll-container focus |
| `DonutChart`, `BarChart`, `StackedBarChart` | Token-driven and lightweight | Keep data colours; make chart wells flat and legends follow table typography |
| `Avatar`, `AvatarGroup`, `Kbd`, `Link`, typography, icons | Strong owned identity | Preserve Open Runde and bespoke glyphs; use semantic avatar foregrounds and system glyph stacks only where function requires them |
| `AuthLayout`, `AuthCard`, `SettingsLayout`, `SettingsNav` | Clear compositions with separate surface formulas | Apply the shared material hierarchy; settings navigation should read like a macOS source list without copying System Settings |
| Marketing components and illustrations | New user-owned work in progress | Audit separately after it settles; do not let application chrome changes overwrite its animation or layout work |

### Suite Chrome And Workflows

| Elements | Current character | macOS identity treatment |
| --- | --- | --- |
| `SuiteAppLayout`, `SuiteSidebar`, `SuiteMobileHeader`, `SuiteBottomNav` | Responsive shell, with translucency already present on mobile | Extend quiet material hierarchy to desktop sidebar and chrome; keep mobile behaviour platform-appropriate |
| `AppSwitcher`, `SuiteWorkspaceSwitcher`, `SuiteUserMenu`, notifications | Good compact interaction patterns, inconsistent one-off radius/focus/shadow values | Use one source-list row, menu selection, icon size, and focus contract |
| `SuitePage`, headers, breadcrumbs, toolbars, tabs, section headers | Strong layout foundations | Tighten toolbar grouping and selected tabs; do not change page structure |
| Today components | More expressive and rounded than the rest of the suite | Keep the authored Today personality, but map panels and actions to shared geometry/depth tokens |
| AI panel and markdown | Purpose-built conversational UI with many local visual decisions | Preserve chat anatomy; standardise composer, action controls, bubbles, and floating panel depth only |
| Integration picker/rules, client/project directory, palette library | Product workflows, not primitives | Inherit the revised tokens first; replace local visual exceptions only when snapshots show a mismatch |

## Ranked Findings

### P0: Resolve Before Styling Expansion

1. **Two competing geometry systems.** `globals.css` defines 6px controls,
   8px surfaces, and 12px overlays, while `suite-skin.css` overrides every
   `.ph-card` to 12px. Components also add `rounded-lg`, `rounded-xl`, and
   `rounded-2xl`. A macOS identity will look cosmetic until geometry has one
   source of truth.
2. **Depth semantics conflict.** The base card contract is flat by default,
   but suite skin shadows every card. Panels, stats, filters, tables, and
   interactive controls often share similar elevation. Static, raised, inset,
   and floating surfaces need distinct meanings.
3. **Hedgehog Dark does not match its contract.** Its registry description
   promises Hedgehog orange, while its tokens explicitly implement a Microsoft
   Copilot-style graphite/blue theme. The reference pair cannot establish a
   coherent identity until dark mode returns to warm graphite and orange.
4. **Focus styling is fragmented.** Public controls alternate between a 3px
   semantic outline, Tailwind `ring-2`, brand rings, and local border-only
   focus. macOS-like precision depends on one visible focus halo, not a new
   effect per component.
5. **Global touch CSS disables browser zoom on coarse pointers.** The
   `touch-action: pan-x pan-y` rule intentionally removes pinch zoom. This is an
   accessibility regression and should not be part of a native-feel strategy.
6. **The intended mobile modal sheet is not fully expressed by the current
   CSS.** `Modal` content remains fixed and centred; changing overlay alignment
   and panel width/radius does not move that fixed panel to the bottom. Verify
   and correct the transform/position contract before polishing sheets.

### P1: Establish The Identity

1. Preserve the tactile Lemon button, but reserve pronounced depth for actual
   actions. Secondary, toolbar, filter, and navigation controls should use
   quieter faces.
2. Introduce material through existing semantic surfaces: opaque content,
   subtly translucent sidebar/toolbars, and floating overlays. Do not add a
   second theme system or a glass variant API.
3. Make `SegmentedControl`, source-list selection, toggles, menus, and command
   palette the strongest macOS cues. These familiar interaction patterns carry
   more identity than decorative window chrome.
4. Keep Open Runde. The rounded type is core to The Old UI; replacing it with
   an Apple font would divert the design too far.
5. Standardise control, surface, and overlay radii through
   `--ph-radius-control`, `--ph-radius-surface`, and `--ph-radius-overlay`.
   Pills remain limited to tags, filters, statuses, toggles, and avatars.
6. Standardise motion at 120ms for control feedback and 180ms for overlays.
   Keep spring motion for drawers and authored Today/AI moments only.

### P2: Correct Local Drift

1. Replace public-component `transition-all` usage with explicit properties.
2. Move Command Palette, Calendar, Accordion, Suite Empty State, Today panels,
   and suite switchers from one-off shadows/radii to semantic tokens.
3. Change Avatar's default `text-white` to `--ph-on-accent` and use
   `React.Children.toArray` for grouping.
4. Give Table an empty state and visible focus treatment for its scroll region.
5. Add grouped selection semantics and keyboard movement to Segmented Control.
6. Keep decorative `Dot` hidden, but require adjacent text whenever it conveys
   status.
7. Add focus-visible treatment to the new marketing motion control and links
   before publishing those exports.

## Proposed Visual Contract

### Geometry

- Control: keep 6px.
- Surface: converge on 10px rather than the current 8px/12px split.
- Overlay: keep 12px desktop; mobile sheets may use 16px top corners.
- Pill: only semantic pill/capsule controls.
- Circular: avatar, status dot, icon-only circular action.

### Depth

- Flat: cards, alerts, charts, tables, settings content.
- Inset: inputs, segmented tracks, code/query wells, sidebars when visually
  grouped with the canvas.
- Raised: buttons, selected segments, clickable cards.
- Floating: dropdowns, tooltips, command palette, modal, drawer.

### Material

- Content stays opaque for readability.
- Sidebar, top bar, bottom navigation, and temporary overlays may mix the
  semantic surface with transparency and blur.
- Every blur gets an opaque fallback.
- No gradients are added to routine product chrome.

### Colour

- Keep each product theme's palette.
- Tune Hedgehog Light/Dark first as the reference pair.
- Preserve orange as Hedgehog action/brand colour in both modes.
- Use semantic blue for focus, not for unrelated selection or decoration.
- Keep vivid categorical chart colours.

## Implementation Plan

### Rollout Status

All four phases are implemented on `feat/macos-identity`:

- Foundation tokens, Hedgehog Dark, modal positioning, and the first-slice proof
  are complete.
- Public primitives now share the geometry, depth, overlay, focus, and motion
  contract, with grouped keyboard selection and explicit empty states.
- Suite shell, navigation, settings, Today, AI, integration, directory, and
  palette surfaces now inherit the same contract without changing their layout
  or authored interaction models.
- Marketing header, links, buttons, and motion control use the final contract;
  Open Runde, illustration geometry, and authored motion remain unchanged.
- Playwright now covers focused controls, command palette, Ask AI, desktop
  sidebar, mobile header, and mobile bottom navigation in addition to the
  original light/dark workflow matrix.

### Phase 1: Foundation Proof

Files: `src/app/globals.css`, `src/styles/themes.css`,
`src/styles/suite-skin.css`, and the existing visual fixture only.

1. Reconcile the three radius tokens and remove the suite card override.
2. Reconcile flat, inset, raised, and floating shadows.
3. Define one focus-visible formula and apply it through shared selectors.
4. Retune Hedgehog Dark to warm graphite plus orange while preserving contrast.
5. Remove the zoom restriction and fix the mobile sheet position contract.
6. Prove the direction on Button, Input, Card, Segmented Control, Dropdown, and
   Modal before touching the broader library.

Exit criteria:

- Existing first-slice fixture remains recognisably The Old UI.
- The same fixture reads as macOS-influenced in light and dark without window
  cosplay.
- Static and interactive surfaces are distinguishable in grayscale.
- Desktop and mobile snapshots pass after intentional baseline review.

### Phase 2: Primitive Rollout

1. Apply the contract to all forms, statuses, loading states, filtering,
   calendar, command palette, tooltip, accordion, table, stat, avatar, and
   typography utility elements.
2. Replace local radii, shadows, focus rings, and broad transitions only where
   the semantic contract covers them.
3. Keep component APIs stable unless an accessibility fix requires a small
   addition.

Exit criteria:

- Every public UI element has rest, hover, focus, active/selected, disabled,
  loading, and error treatment where applicable.
- No public primitive invents a second overlay or control style.

### Phase 3: Suite Chrome

1. Apply desktop material hierarchy to app layout, sidebar, page headers,
   switchers, menus, settings navigation, and command surfaces.
2. Keep mobile header, drawer, sheet, and bottom navigation touch-first rather
   than forcing desktop macOS patterns onto phones.
3. Let Today, AI, integration, and directory workflows inherit tokens first;
   make local edits only for visible outliers.

Exit criteria:

- All five consuming applications share the identity without losing their
  palette or product workflows.
- Dense pages remain compact and readable at desktop and mobile widths.

### Phase 4: Marketing Integration

1. Rebase the new marketing components onto the final shared focus, radius,
   button, and material contract.
2. Preserve the current user-owned illustration and motion work.
3. Keep expressive atmosphere on public pages only; do not leak it into dense
   application workspaces.

## Verification

Use existing infrastructure; do not add Storybook or another visual system.

1. `bun run check`
2. `bun run build`
3. `bun run build:lib`
4. `bun run package:smoke`
5. `bun run test:visual`
6. Review light/dark screenshots at mobile and desktop widths.
7. Add focused screenshots for segmented control, input focus/error, dropdown,
   command palette, desktop sidebar, mobile drawer, and mobile modal sheet.
8. Run contrast checks for all 16 themes and keyboard-only passes for every
   interactive composite.

## Recommended First Result

Implement only Phase 1 first. It is broad enough to show the identity but
small enough to reject or refine without rewriting every component. Once the
light/dark first-slice screenshots are approved, roll the same contract through
the remaining primitives and suite chrome.

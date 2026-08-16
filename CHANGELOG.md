# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.3] - 2026-08-13

### Changed

- Today's sticky page title now follows Slack: it holds its position on the page background instead of becoming its own bar. The stuck surface tint, bottom border and backdrop blur are gone, and content dissolves into the same background through a scrim pinned to the title's bottom edge.

### Added

- `--suite-scroll-scrim` and `--suite-scroll-fade` tokens so an app or theme can retune the scroll edge without overriding the rule.

## [0.6.2] - 2026-08-13

### Changed

- Single-typeface system: Open Runde carries marketing and product type. Hero and section titles get their weight from size, weight (700) and tracking rather than a second face.

### Removed

- Instrument Serif, the `font-serif` preset family, and `--ph-font-serif-stack`. Apps no longer need to self-host a display font.

## [0.6.1] - 2026-08-13

### Changed

- Hero and section ceilings tuned for heroes that sit in a half-width column (hero caps at 4.5rem, section at 2.75rem).
- Hero line-height relaxed to 1.06 so multi-line serif headlines do not collide.

### Fixed

- Demo sidebar no longer links to the removed `/demo/charts` route and now exposes Foundations.

## [0.6.0] - 2026-08-13

### Added

- Instrument Serif as the single display voice (self-hosted, one weight) alongside Open Runde.
- `font-serif` family in the Tailwind preset plus `--ph-font-serif-stack`.
- Fluid marketing type classes: `.ph-hero-title`, `.ph-section-title`, `.ph-feature-title`, `.ph-lead`, `.ph-eyebrow`.
- `SectionTitle` component and a typography contract test.
- Demo showcases for typography and the status/metric primitives.

### Changed

- `Display` now renders the serif hero voice; `Lead` is measure-capped. Product headings (`H1`–`H5`) stay Open Runde.
- Demo site trimmed to the components the ShellStack apps actually ship.

### Removed

- 41 unused UI components (Toast, Tabs, Drawer, Stepper, Timeline, Terminal, HoverCard, Indicator, Navigation, Rating, DataTable, DatePicker, Popover, Menubar, ThemeManager, legacy `AppLayout`/`Sidebar`, and the rest of the never-imported set).
- Quill charts and `hog-charts-lite`, plus the `/demo/charts` route.

## [0.5.5] - 2026-08-13

### Changed

- Sticky page-header chrome is Today-only in `suite-skin.css` (product apps no longer need local overrides).
- `html` now sets `touch-action: manipulation` in the shared suite skin.

## [0.5.4] - 2026-08-13

### Added

- Shared `scripts/install-theme-dev.sh` for Docker/local theme sync into app `node_modules`.
- Command palette dialog semantics, focus restore, Tab trap, and backdrop dismiss.
- Segmented control mobile touch height and `aria-pressed`.
- Chip remove control as a real separate button (no nested interactive roles).
- Suite dock safe-area padding for home-indicator devices.

### Changed

- Published UI/main exports trimmed to the ShellStack product surface.
- Quill/chart modules are no longer part of the published package API (demo source remains in-repo).
- Dropped optional `d3-scale` peer dependency.

### Fixed

- Suite layout / mobile chrome touch targets and scroll ownership polish.

## [0.4.8] - 2026-08-09

### Added

- Ask AI launcher dragging with viewport constraints, nearest-edge docking, saved placement, and keyboard repositioning.

### Changed

- Ask AI panels now open from the same left or right edge as the launcher.

## [0.3.2] - 2026-07-30

### Fixed

- Filled buttons now use a seamless face and depth frame across rest, hover, active, outline, and circular states.
- Showcase controls now consistently use the bundled `Button` component.

## [0.3.0] - 2026-07-21

### Added

- Composable `FilterBar`, `FilterMenu`, `SortMenu`, and accessible applied-filter chips.
- Combined `FilterControls`, authentication shells, responsive settings navigation, and reusable loader/skeleton patterns.
- Kraken light and dark themes inspired by Medium's black-and-white editorial UI, warm paper, and classic publication yellow.
- Canonical icon registry, compatibility aliases, and original Old UI analytics glyphs.
- Semantic theme tokens, new theme coverage, component tests, and desktop/mobile visual regression tests.

### Changed

- Dropdown menus now use collision-aware Radix positioning, portals, keyboard navigation, and focus restoration.
- Filled buttons use a stationary depth plate and smoothly animated face across semantic variants.
- Keyboard shortcuts render as recognizable physical keycaps, distinct from inline code tokens.
- Modal, forms, cards, badges, alerts, and icon foundations received accessibility and API improvements.

### Fixed

- Dropdown panels now flip above bottom-edge triggers and shift horizontally within the viewport.
- Filter removal is independently focusable and keyboard operable without nested controls.
- Button presses no longer interpolate depth shadows or leave a visual trail.

## [0.2.9] - 2026-07-16

### Added

- New `./ui` subpath export so consumers can import individual UI components without pulling in chart/dashboard bundles.
- `src/components` is now included in the published package files, enabling direct source imports when needed.

### Changed

- `build:lib` now outputs a separate `ui` entry alongside `index` and `tailwind-preset`.

### Fixed

- Release workflow uses Node 22 and injects `NODE_AUTH_TOKEN` for npm publishing.

## [0.2.8] - 2026-07-16

### Fixed

- Release workflow fixes (unpublished; superseded by 0.2.9).

## [0.2.7] - 2026-07-16

### Added

- `./ui` subpath export and `src/components` shipping (unpublished; superseded by 0.2.9).

## [0.2.6] - 2026-07-12

### Added

- Initial chart/dashboard primitives bundled in the main entry.
- Tailwind preset export.

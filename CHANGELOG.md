# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

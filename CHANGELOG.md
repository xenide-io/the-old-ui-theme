# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.7] - 2026-07-16

### Added

- New `./ui` subpath export so consumers can import individual UI components without pulling in chart/dashboard bundles.
- `src/components` is now included in the published package files, enabling direct source imports when needed.

### Changed

- `build:lib` now outputs a separate `ui` entry alongside `index` and `tailwind-preset`.

## [0.2.6] - 2026-07-12

### Added

- Initial chart/dashboard primitives bundled in the main entry.
- Tailwind preset export.

# Demo Routes

The catalogue is intentionally split into focused routes. The root `/` route
redirects to `/demo` instead of mounting every showcase at once.

| Route               | Focus                                                      |
| ------------------- | ---------------------------------------------------------- |
| `/demo`             | Demo index and route picker                                |
| `/demo/foundations` | Tokens, themes, icons, setup, and keyboard affordances     |
| `/demo/components`  | Primitive components and everyday controls                 |
| `/demo/patterns`    | Auth, settings, overlays, filters, and loading flows       |
| `/demo/charts`      | Quill charts, dashboards, tables, and timelines            |
| `/demo/suite`       | Suite shell, sidebar, mobile chrome, and settings patterns |

Every demo route uses the shared `SuiteAppLayout`. The sidebar selection is
route-aware, the desktop rail is resizable, and the width is persisted per
browser.

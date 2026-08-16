# Demo Routes

The catalogue is intentionally split into focused routes. The root `/` route
redirects to `/demo` instead of mounting every showcase at once.

| Route               | Focus                                                      |
| ------------------- | ---------------------------------------------------------- |
| `/demo`             | Demo index and route picker                                |
| `/demo/foundations` | Type scale, tokens, themes, icons, setup, and shortcuts     |
| `/demo/components`  | Primitive components and everyday controls                 |
| `/demo/patterns`    | Auth, settings, overlays, filters, and loading flows       |
| `/demo/suite`       | Suite shell, sidebar, mobile chrome, and settings patterns |

Every showcase maps to a component the ShellStack apps ship. If a component is
not used by an app, it does not belong in the package or the demo.

Every demo route uses the shared `SuiteAppLayout`. The sidebar selection is
route-aware, the desktop rail is resizable, and the width is persisted per
browser.

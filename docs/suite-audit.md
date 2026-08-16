# Suite UI Audit

The suite apps are separate consumers of this package. The shared package now
owns the visual language; app code should keep product-specific workflows and
illustrations.

## Move Into The Shared Package

| Pattern                                                      | Current consumers                     | Shared home                                                             |
| ------------------------------------------------------------ | ------------------------------------- | ----------------------------------------------------------------------- |
| Desktop rail, mobile header, bottom navigation               | Tides, TurtleTime, ShellStack, Kraken | `SuiteAppLayout`, `SuiteSidebar`, `SuiteMobileHeader`, `SuiteBottomNav` |
| App switching, notifications, command handoff                | All suite apps                        | `/suite` exports                                                        |
| Cards, alerts, empty/loading states, dialogs, inputs, tables | All suite apps                        | `/ui` exports and `--ph-*` tokens                                       |
| Auth and settings chrome                                     | Tides, TurtleTime, ShellStack, Kraken | `AuthLayout`, `AuthCard`, `SettingsLayout`                              |
| Theme pairing, semantic status colours, focus rings          | All suite apps                        | `themes.css` and `themes/registry.ts`                                   |

## Keep In The Apps

- Tides kanban, task detail, BlockNote editor, project and crew controls.
- TurtleTime tracker, timer state, report charts, and time-entry workflows.
- ShellStack terminal scene, workspace/billing domain, and API documentation.
- Kraken document editor, React Flow diagrams, deep research, and citations.
- Product marks and illustrations that carry product meaning.

## Adoption Contract

Keep app canvases token-driven and quiet by default:

```tsx
<SuiteAppLayout {...props} />
```

Decorative hero treatments should remain app-owned and opt-in. Do not add
continuous animated backgrounds to dense product workspaces.

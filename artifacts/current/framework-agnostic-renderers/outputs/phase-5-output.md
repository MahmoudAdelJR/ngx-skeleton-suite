# Phase 5 Output — Tests & Consumer Fixtures

## Status: ✅ Complete

## Test inventory (32 passing)

| Suite | Count | Coverage |
| --- | --- | --- |
| `skeleton.directive.spec.ts` | 11 | boolean/Signal/Observable sources, timing, presets, grid, CLS, empty/error |
| `ngx-skeleton.spec.ts` | 1 | core exports smoke test |
| `native-skeleton-renderer.component.spec.ts` | 6 | native DOM, mapping, animations, no UI-library nodes |
| `primeng-skeleton-renderer.component.spec.ts` | 7 | `<p-skeleton>` mapping, animation suppression, directive integration |
| `material-skeleton-renderer.component.spec.ts` | 7 | `ngx-skeleton-loader` mapping, animation engine, directive integration |

Verification commands:

```
npx ng build ngx-skeleton
npx ng test ngx-skeleton --watch=false
npm run verify:decoupling
```

## Decisive decoupling fixture

The demo application was built with `primeng`, `ngx-skeleton-loader`, and `@primeuix`
**temporarily removed from `node_modules`**:

```
npx ng build demo-app --configuration development   # succeeded, no UI library present
```

This proves the default (native) path has zero runtime dependency on any UI library.

> Production demo build requires network access for Google Fonts inlining; it was verified
> with `--configuration development`.

## Supported adapter version matrix

| Adapter | Entry point | Required peer | Peak tested |
| --- | --- | --- | --- |
| Native CSS (default) | `ngx-skeleton-suite` | none | Angular 20 |
| PrimeNG | `ngx-skeleton-suite/primeng` | `primeng` `>=17 <24` | PrimeNG 22 |
| Material | `ngx-skeleton-suite/material` | `ngx-skeleton-loader` `>=11` | 13.0.0 |

## Known environmental note

The workspace currently installs Angular 20.3.26 with PrimeNG 22 (which declares Angular 22
peers). The adapter compiles and its tests run against the installed PrimeNG, but the official
supported pairing should be validated in per-matrix fixture workspaces before release. CI still
installs with `--legacy-peer-deps`; the recommended follow-up is to run real peer resolution and
a supported-combination matrix.
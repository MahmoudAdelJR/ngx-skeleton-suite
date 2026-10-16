# Phase 3 Output — Material Adapter Evaluation

## Status: ✅ Complete (implemented)

## Candidate comparison

| Candidate | Latest | Angular peers | Maintained | License | Verdict |
| --- | --- | --- | --- | --- | --- |
| `ngx-skeleton-loader` | 13.0.0 | `@angular/common` & `core >= 19` | Yes (2026-06) | MIT | **Selected** |
| `ngx-loading-skeleton` | 3.0.3 | `@angular/* ^9` | No (2022) | MIT | Rejected (stale) |
| `ng-skeleton-loader` | 1.0.10 | n/a | No (2022) | MIT | Rejected (stale) |

Angular Material ships **no** first-party skeleton component, so the Material-oriented
adapter wraps the community package `ngx-skeleton-loader`, which is standalone,
SSR-compatible, signal-input based, and compatible with the workspace's Angular version.

## Decision

Implement `ngx-skeleton-suite/material` on top of `ngx-skeleton-loader`.

## What changed

### Added (`projects/ngx-skeleton/material/`)
- `ng-package.json`, `src/public-api.ts`.
- `src/lib/material-skeleton-renderer.component.ts` — `MaterialSkeletonRendererComponent`:
  - `rectangle` → `appearance="line"`, `circle` → `appearance="circle"`.
  - width/height/size/borderRadius → loader `theme`.
  - animation mapping: `adapter-default`/`shimmer`/`wave` → `progress`, `pulse` → `pulse`,
    `none` → off.
  - Bridges `--ngx-skeleton-base-color` → `--ngx-skeleton-loader-base-color` and
    `--mat-sys-surface-variant` fallback.
- `src/lib/provide-material-skeleton.ts` — `provideMaterialSkeleton()`.
- `src/lib/material-skeleton-renderer.scss` — `:host { display: contents }` + margin reset.
- `src/lib/material-skeleton-renderer.component.spec.ts` — 7 tests.

### Changed
- `package.json` (root) — added `ngx-skeleton-loader@13` as a dev dependency.
- `tsconfig.json` — added `ngx-skeleton-suite/material` path.
- `angular.json` — karma include for `material` specs.

## Verification

- `npx ng build ngx-skeleton` builds `ngx-skeleton-suite/material`.
- `npx ng test ngx-skeleton --watch=false` — material adapter tests pass.
- PrimeNG adapter entry point remains independent of `ngx-skeleton-loader`.
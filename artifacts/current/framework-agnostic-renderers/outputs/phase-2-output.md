# Phase 2 Output — PrimeNG Adapter Entry Point

## Status: ✅ Complete

## What changed

### Added (`projects/ngx-skeleton/primeng/`)
- `ng-package.json` — secondary entry point (`entryFile: src/public-api.ts`).
- `src/public-api.ts` — `ngx-skeleton-suite/primeng` surface.
- `src/lib/primeng-skeleton-renderer.component.ts`
  - `PrimeNgSkeletonRendererComponent` importing `SkeletonModule` from `primeng/skeleton`.
  - Maps `shape` / `width` / `height` / `size` / `borderRadius` / `styleClass`.
  - `primeAnimation()` returns `'wave'` only for `adapter-default`, otherwise `'none'`.
  - Adds `ngx-skeleton-shape` + `data-ngx-skeleton-*` neutral hooks.
- `src/lib/provide-primeng-skeleton.ts` — `providePrimeNgSkeleton()` overrides
  `NGX_SKELETON_RENDERER`.
- `src/lib/primeng-skeleton-renderer.scss` — the only stylesheet touching `.p-skeleton`
  and `--p-*` tokens (animation bridging, reduced motion, RTL).
- `src/lib/primeng-skeleton-renderer.component.spec.ts` — 7 tests.

### Changed
- `tsconfig.json` — added `ngx-skeleton-suite` + `ngx-skeleton-suite/primeng` path maps.
- `projects/ngx-skeleton/tsconfig.spec.json` — include adapter/secondary sources.
- `angular.json` — karma `include` widened to adapter spec folders.

## Verification

- `npx ng build ngx-skeleton` — builds `ngx-skeleton-suite` then
  `ngx-skeleton-suite/primeng`.
- Output: `dist/ngx-skeleton/fesm2022/ngx-skeleton-suite-primeng.mjs`,
  `dist/ngx-skeleton/primeng/index.d.ts`, and an auto-generated `./primeng` export map.
- Core bundle contains no PrimeNG import (only a doc-comment mention).
- `npx ng test ngx-skeleton --watch=false` — 19/19 pass (12 core + 7 adapter).

## Notes
- ng-packagr 20 auto-generates the package `exports` map for secondary entry points.
- PrimeNG 22's `p-skeleton` sets width/height/borderRadius inline; `size` overrides
  width/height equally, matching the native renderer.
- Workspace still installs Angular 20 with PrimeNG 22 (peer mismatch) — documented in
  Phase 5; adapter tests compile/run against the installed PrimeNG.
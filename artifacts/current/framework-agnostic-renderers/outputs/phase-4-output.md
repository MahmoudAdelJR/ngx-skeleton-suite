# Phase 4 Output — Packaging, Public API & Peer Dependencies

## Status: ✅ Complete

## What changed

### `projects/ngx-skeleton/package.json`
- Version bumped to `2.0.0` (breaking major).
- Description/keywords updated to renderer-agnostic.
- `peerDependencies`: `@angular/common`, `@angular/core`, `rxjs` (required);
  `primeng` and `ngx-skeleton-loader` (optional).
- `peerDependenciesMeta`: `primeng` and `ngx-skeleton-loader` marked `optional: true`.
- Removed PrimeNG from required peers.

### Secondary entry points
- `primeng/`, `material/`, `testing/` each have `ng-package.json` + `src/public-api.ts`.
- ng-packagr auto-generates the `exports` map: `.`, `./primeng`, `./material`, `./testing`.

### Public API
- Core `public-api.ts` exports the renderer model, renderer contract, native renderer, and
  the renderer-neutral host — no PrimeNG.
- `SkeletonHarness` moved out of core into `ngx-skeleton-suite/testing`.
- Deleted `src/lib/testing/skeleton-harness.ts`.

### Workspace
- Removed unused `primeicons` and `@primeuix/themes` dependencies.
- Added `scripts/verify-decoupling.mjs` + `npm run verify:decoupling`.

## Verification

- `npx ng build ngx-skeleton` — 4 entry points built.
- Generated `dist/ngx-skeleton/package.json` lists optional peers and `.`, `./primeng`,
  `./material`, `./testing` exports.
- `npm pack ./dist/ngx-skeleton --dry-run` — 16 files, `42.6 kB`, includes all entry points.
- `npm run verify:decoupling` — passes:
  - core FESM imports no `primeng` / `ngx-skeleton-loader` / `@primeuix`;
  - core `public-api.ts` has no PrimeNG reference;
  - optional peers marked optional;
  - adapter entry points + types exist;
  - `primeng/skeleton` imported only by the primeng bundle.
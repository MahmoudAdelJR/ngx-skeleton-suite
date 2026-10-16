# Phase 2 — PrimeNG Adapter Entry Point

## Goal

Provide `ngx-skeleton-suite/primeng` as a secondary entry point that renders
PrimeNG skeletons and is the only place PrimeNG is imported or styled.

## Scope

1. Create `projects/ngx-skeleton/primeng/ng-package.json` with
   `{ "lib": { "entryFile": "src/public-api.ts" } }` so ng-packagr discovers the
   `ngx-skeleton-suite/primeng` entry point.
2. Add `PrimeNgSkeletonRendererComponent` importing `SkeletonModule` from
   `primeng/skeleton`:
   - Bind `shape`, `width`, `height`, `size`, `borderRadius`, `styleClass`.
   - Bind `[animation]` to `'wave'` only for `adapter-default`, otherwise `'none'`
     so suite-owned animations and `none` reliably disable Prime's native wave.
   - Add neutral `ngx-skeleton-shape` class and `data-ngx-skeleton-shape` /
     `data-ngx-skeleton-animation` attributes.
3. Add `providePrimeNgSkeleton()` returning an override of
   `NGX_SKELETON_RENDERER`.
4. Add `primeng-skeleton-renderer.scss` bridging `.p-skeleton`, Prime `--p-*`
   tokens, animation classes, reduced motion, and RTL.
5. Export the adapter from `primeng/src/public-api.ts`.

## Definition of Done

- `npx ng build ngx-skeleton` builds both `ngx-skeleton-suite` and
  `ngx-skeleton-suite/primeng`.
- `dist/ngx-skeleton/primeng` exists with FESM + d.ts.
- PrimeNG is imported only by the adapter entry point.
- Adapter test asserts `<p-skeleton>` mapping and animation suppression.
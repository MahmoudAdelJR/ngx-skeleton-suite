# Phase 6 Output — Demo & Documentation

## Status: ✅ Complete

## Demo app
- `app.config.ts` unchanged (native renderer is the default; no provider required).
- `app.ts`:
  - animation API row updated to `'adapter-default' | ...`.
  - code generator default changed from `'prime'` to `'adapter-default'`.
  - quickstart TOC gained `04. Renderer Adapters`.
- `app.html`:
  - chapter lead reframed to renderer-agnostic.
  - dependency matrix now lists optional PrimeNG and `ngx-skeleton-loader` adapters.
  - playground animation chip `PRIME` → `ADAPTER`.
  - new "Renderer Adapters" section with `providePrimeNgSkeleton()` /
    `provideMaterialSkeleton()` examples.
  - footer updated.

## Documentation
- `projects/ngx-skeleton/README.md` — rewritten for v2: renderer-agnostic intro, adapter
  compatibility table, install-per-adapter, adapters + testing sections, `adapter-default`.
- `README.md` (root) — intro, feature list, and adapter snippet updated.
- `projects/ngx-skeleton/DOCUMENTATION.md` — compatibility matrix, architecture diagram,
  variables, targetable classes, new "Renderer Adapters & Theme Synergy" section, animation
  modes, API table, install commands, and package-name fixes.
- `docs/`:
  - `getting-started.mdx` — stack trace fixes: `provideNgxSkeleton` (was stale
    `provideSkeletonConfig`), adapter install + provider table.
  - `api-reference.mdx` — animation type/default updated.
  - `styling-and-themes.mdx` — neutral `.ngx-skeleton-shape` hook, adapter notes.

## Verification
- `npx ng build demo-app --configuration development` — pass.
- `npm --prefix docs run build` — pass (10 pages).

## Notes
- Docs production demo build needs network for font inlining; not a code issue.
- Historical design artifacts under `artifacts/archived/` and `ngx-skeleton-package-plan.md`
  still describe the original Prime-first design and are intentionally left as historical
  records.
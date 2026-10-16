# Changelog

All notable changes to `ngx-skeleton-suite` are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.0] — Unreleased

### Breaking changes
- **Renderer-agnostic architecture.** Rendering is now delegated to a pluggable
  renderer selected through the `NGX_SKELETON_RENDERER` injection token. The default
  is the dependency-free **native CSS renderer**.
- **PrimeNG is no longer a required peer dependency.** It is now an optional peer used
  only by the `ngx-skeleton-suite/primeng` entry point.
- **`SkeletonAnimation` values changed.** The vendor value `'prime'` was replaced by
  `'adapter-default'`. The full set is now
  `'adapter-default' | 'pulse' | 'shimmer' | 'wave' | 'none'`. The global default
  changed from `'prime'` to `'adapter-default'`.
- **Public surface reorganized into secondary entry points:**
  - `ngx-skeleton-suite` — core directive, presets, grids, native renderer.
  - `ngx-skeleton-suite/primeng` — `providePrimeNgSkeleton()` + `PrimeNgSkeletonRendererComponent`.
  - `ngx-skeleton-suite/material` — `provideMaterialSkeleton()` + `MaterialSkeletonRendererComponent`.
  - `ngx-skeleton-suite/testing` — `SkeletonHarness` (moved out of the root entry point).
- **`SkeletonHostComponent` is renderer-neutral.** It no longer imports PrimeNG and
  renders shapes through the configured renderer via a typed `SkeletonRenderModel`.

### Added
- `SkeletonRenderModel`, `SkeletonRendererComponent`, `NGX_SKELETON_RENDERER`,
  `provideNativeSkeletonRenderer()`.
- `NativeSkeletonRendererComponent` (default, zero UI-library dependencies).
- `PrimeNgSkeletonRendererComponent` / `providePrimeNgSkeleton()`; PrimeNG's native
  animation is explicitly disabled for suite-owned animation modes and `none`.
- `MaterialSkeletonRendererComponent` / `provideMaterialSkeleton()` backed by
  `ngx-skeleton-loader`.
- Renderer-neutral DOM hooks: `data-ngx-skeleton-host`, `data-ngx-skeleton-shape`,
  `data-ngx-skeleton-animation`, and the `.ngx-skeleton-shape` class.
- `scripts/verify-decoupling.mjs` (`npm run verify:decoupling`) and a CI compatibility
  matrix.

### Fixed
- PrimeNG's native `wave` animation is now explicitly disabled when the suite owns the
  animation (`pulse` / `shimmer` / `wave`) or when `none` is requested.
- Documented highlight CSS variable is now actually used by the built-in animations.

### Removed
- Unused workspace dependencies `primeicons` and `@primeuix/themes`.
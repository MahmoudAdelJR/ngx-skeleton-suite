# Phase 1 Output — Core Renderer Contract & Native Renderer

## Status: ✅ Complete

## What changed

### Added
- `lib/renderer/skeleton-render-model.ts`
  - `SkeletonShape`, `SkeletonAnimation` (`adapter-default | pulse | shimmer | wave | none`),
    `SkeletonRenderModel`.
- `lib/renderer/skeleton-renderer.ts`
  - `SkeletonRendererComponent` contract (required `model` input).
  - `NGX_SKELETON_RENDERER` injection token.
- `lib/renderer/native-skeleton-renderer.component.ts`
  - `NativeSkeletonRendererComponent` (`div.ngx-skeleton-shape`, stable
    `data-ngx-skeleton-*` attributes).
  - `provideNativeSkeletonRenderer()`.
- `lib/renderer/native-skeleton-renderer.scss`
  - Native shape + pulse/shimmer/wave keyframes, reduced motion, RTL.

### Changed
- `lib/component/skeleton-host.component.ts`
  - Removed `primeng/skeleton` import and `<p-skeleton>`.
  - Injects `NGX_SKELETON_RENDERER` (falls back to native).
  - Renders every shape via `ngComponentOutlet` bound to a `SkeletonRenderModel`.
  - Adds `data-ngx-skeleton-host` marker.
- `lib/styles/ngx-skeleton.scss`
  - Removed Prime tokens and `.p-skeleton`; kept wrapper, grid, fade-in, reduced motion.
- `lib/config/skeleton-config.ts`
  - `SkeletonAnimation` now sourced from the renderer model; default `adapter-default`.
- `lib/directive/skeleton.directive.ts`, `lib/testing/skeleton-harness.ts`
  - Import `SkeletonAnimation` from the renderer model.
- `src/public-api.ts`
  - Exports the renderer module.

## Verification

- `npx ng build ngx-skeleton` — pass.
- `npx ng test ngx-skeleton --watch=false` — 12/12 pass.
- Static check: no `primeng` / `p-skeleton` / `primeuix` references under core `src`.

## Notes / follow-ups
- Animation classes live on the renderer's own shape element because Angular style
  encapsulation prevents the host from styling child-renderer elements.
- `provideNgxSkeleton()` intentionally does not provide a renderer, so it never
  conflicts with adapter providers; the native renderer is the fallback.
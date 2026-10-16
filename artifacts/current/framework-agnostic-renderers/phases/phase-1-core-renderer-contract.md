# Phase 1 — Core Renderer Contract & Native Renderer

## Goal

Extract every PrimeNG dependency out of the core library and introduce a
renderer contract with a native CSS implementation as the default.

## Scope

1. Add renderer model types (`lib/renderer/skeleton-render-model.ts`):
   - `SkeletonShape = 'rectangle' | 'circle'`
   - `SkeletonAnimation = 'adapter-default' | 'pulse' | 'shimmer' | 'wave' | 'none'`
   - `SkeletonRenderModel` (shape, width, height, size, borderRadius, styleClass,
     animation).
2. Add renderer contract (`lib/renderer/skeleton-renderer.ts`):
   - `SkeletonRendererComponent` interface requiring a `model` input.
   - `NGX_SKELETON_RENDERER` injection token, `providedIn: 'root'`, defaulting to the
     native renderer.
   - `provideNativeSkeletonRenderer()` helper.
3. Add `NativeSkeletonRendererComponent` rendering a `div.ngx-skeleton-shape` with
   neutral classes and stable `data-ngx-skeleton-*` attributes.
4. Refactor `SkeletonHostComponent` to be renderer-neutral:
   - Remove the `primeng/skeleton` import and `<p-skeleton>`.
   - Inject `NGX_SKELETON_RENDERER` and render each shape via `ngComponentOutlet`.
   - Build `SkeletonRenderModel` for simple shapes and for preset leaf nodes.
   - Add `data-ngx-skeleton-host` to the wrapper.
5. Strip PrimeNG tokens/selectors from `lib/styles/ngx-skeleton.scss`; keep host
   wrapper, grid, fade-in, reduced-motion. Move animations to the renderers.
6. Move `SkeletonAnimation` import in config to the renderer model; change default
   animation from `'prime'` to `'adapter-default'`.
7. Update the directive to import `SkeletonAnimation` from the renderer model.
8. Update `SkeletonHarness` to import `SkeletonAnimation` from the renderer model.
9. Export the renderer module from `src/public-api.ts`.

## Definition of Done

- No `primeng` import anywhere under `projects/ngx-skeleton/src/lib` or `src/public-api.ts`.
- `npx ng build ngx-skeleton` passes.
- `npx ng test ngx-skeleton --watch=false` passes (native renderer assertions added).
- Directive still supports boolean/Signal/Observable sources, presets, grids,
  delay/min-duration, fade-in, empty/error, layout preservation.

## Risks

- `ngComponentOutlet` input binding identity each CD (acceptable overhead).
- Animation classes must live on the renderer shape element (encapsulation boundary).
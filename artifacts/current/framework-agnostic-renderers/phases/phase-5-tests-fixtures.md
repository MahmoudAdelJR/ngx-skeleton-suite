# Phase 5 — Tests & Consumer Fixtures

## Goal

Prove the decoupling and lock the renderer contract with tests.

## Scope

1. Renderer contract tests shared across renderers (width/height/size/shape/
   borderRadius/styleClass/animation mapping and `data-ngx-skeleton-*` markers).
2. Native renderer test: renders `.ngx-skeleton-shape`, no `.p-skeleton`, honors
   animation classes, reduced-motion-safe markup.
3. Prime adapter test: renders `<p-skeleton>` with mapped inputs; `animation='none'`
   for suite-owned modes and `none`; `'wave'` for `adapter-default`.
4. Directive regression tests updated to the renderer-neutral harness.
5. Core-only guard test: assert no `primeng` reference in the core public API
   (static check via a test that the core module does not export Prime symbols).
6. Document the supported Angular/PrimeNG version matrix and remove reliance on
   `--legacy-peer-deps` masking invalid combinations.

## Definition of Done

- `npx ng test ngx-skeleton --watch=false` passes.
- Tests assert both native and PrimeNG rendering.
- Version matrix documented for the adapter.
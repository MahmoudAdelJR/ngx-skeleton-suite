# Phase 6 — Demo & Documentation

## Goal

Show all renderers in the demo and rewrite documentation around adapters.

## Scope

1. Demo app:
   - Provide the native renderer by default.
   - Add a renderer/provider switch demonstrating `providePrimeNgSkeleton()`.
   - Fix the stale `provideSkeletonConfig` reference to `provideNgxSkeleton`.
2. Docs (`README.md`, `DOCUMENTATION.md`, `docs/`):
   - Reframe the product as renderer-agnostic.
   - Separate install/config per adapter.
   - Replace `'prime'` with `'adapter-default'` and document `'none'`.
   - Document the renderer contract and how to add adapters.
3. Correct the compatibility matrix to explicitly supported adapter versions.

## Definition of Done

- `npx ng build demo-app` passes.
- No doc claims PrimeNG is mandatory.
- Adapter install instructions are accurate and minimal.
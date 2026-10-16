# Feature: Framework-Agnostic Skeleton Renderers

Decouple `ngx-skeleton-suite` from PrimeNG so developers can render skeletons with
native CSS (default), PrimeNG, Angular Material (via a third-party package), or any
future adapter — each installed and versioned independently.

## Problem

The library is hard-wired to PrimeNG:

- `SkeletonHostComponent` imports `primeng/skeleton` and renders `<p-skeleton>`.
- `SkeletonDirective` statically creates that Prime-backed host.
- `SkeletonAnimation` (with a vendor value `'prime'`) is public and leaks from the host.
- Runtime SCSS targets `.p-skeleton` and Prime `--p-*` design tokens.
- `primeng` is a mandatory peer dependency.
- `SkeletonHostComponent` and `SkeletonHarness` expose the concrete renderer.

## Solution

Introduce a renderer contract and split the package into secondary entry points:

- `ngx-skeleton-suite` — core directive, presets, grids, timing, accessibility,
  and the **native CSS renderer** (default, no UI dependency).
- `ngx-skeleton-suite/primeng` — PrimeNG adapter (optional peer).
- `ngx-skeleton-suite/material` — Material adapter (optional peer, third-party based).
- `ngx-skeleton-suite/testing` — renderer-neutral test harness.

The core layout host owns preset traversal, grids, dimensions, and accessibility.
An adapter owns only rendering individual shapes through a typed `SkeletonRenderModel`.

## Decisions (approved)

| Decision | Choice |
| --- | --- |
| Package model | Secondary entry points in one npm package |
| Default renderer | Native CSS, works with no UI dependency |
| Migration | Breaking major; no Prime-default compatibility layer |
| Material | Third-party package, evaluated before implementation |
| Version policy | Adapter declares and tests explicit supported versions |

## Progress Matrix

| Phase | Title | Status |
| --- | --- | --- |
| 1 | Core renderer contract & native renderer | ✅ Done |
| 2 | PrimeNG adapter entry point | ✅ Done |
| 3 | Material adapter evaluation | ✅ Done |
| 4 | Packaging, public API & peer dependencies | ✅ Done |
| 5 | Tests & consumer fixtures | ✅ Done |
| 6 | Demo & documentation | ✅ Done |

## Phase Specs

- `phases/phase-1-core-renderer-contract.md`
- `phases/phase-2-primeng-adapter.md`
- `phases/phase-3-material-adapter.md`
- `phases/phase-4-packaging-public-api.md`
- `phases/phase-5-tests-fixtures.md`
- `phases/phase-6-demo-docs.md`

## Outputs

- `outputs/phase-1-output.md`
- `outputs/phase-2-output.md`
- `outputs/phase-3-output.md`
- `outputs/phase-4-output.md`
- `outputs/phase-5-output.md`
- `outputs/phase-6-output.md`

## Definition of Done (feature)

- Core source and core public API contain no `primeng` imports.
- Installing only `ngx-skeleton-suite` builds and renders native skeletons with no
  PrimeNG present.
- `ngx-skeleton-suite/primeng` renders PrimeNG skeletons and is the only place that
  imports PrimeNG or styles `.p-skeleton`.
- `primeng` is an optional peer dependency.
- Renderer contract is documented so new adapters can be added without core changes.
- Library build, tests, and demo build pass.
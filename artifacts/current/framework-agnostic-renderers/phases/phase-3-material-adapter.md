# Phase 3 — Material Adapter Evaluation

## Goal

Decide which third-party Angular Material-compatible skeleton package (if any) the
`ngx-skeleton-suite/material` adapter should wrap, and implement it when a suitable
candidate exists.

## Evaluation criteria

- Actively maintained; supports current Angular (20) and recent majors.
- Publishes as a standalone component compatible with `ngComponentOutlet`.
- Accepts width/height/shape/border-radius inputs so it maps from `SkeletonRenderModel`.
- SSR-safe, accessible, and permissively licensed.
- Optional peer dependency install; no transitive runtime surprises.

## Outcome

Record the candidate comparison and decision in `outputs/phase-3-output.md`.
If a candidate is selected and installable, implement the adapter using the same
renderer contract; otherwise document the deferred adapter and the recommended
package so it can be added without core changes.

## Definition of Done

- Written evaluation with a concrete recommendation.
- Either a working `ngx-skeleton-suite/material` entry point or a documented,
  approval-gated implementation plan with no core changes required.
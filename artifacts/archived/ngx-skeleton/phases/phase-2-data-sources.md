# Phase 2: Data Source `from` Mode & Typed Context (v0.2.0)

## Objective
Extend `SkeletonDirective` to support data-producing streams (Observables, Signals, Promises) via explicit `from` microsyntax (`*skeleton="let user from user$"`), managing subscription context and race-condition safety.

## Key Features & Deliverables
1. **Data Source Integration (`skeletonFrom`)**:
   - Accept `Observable<T>`, `Signal<T | null | undefined>`, or `PromiseLike<T>`.
   - Structural directive microsyntax `*skeleton="let data from data$"` exposing `$implicit` and `skeleton` template context.
2. **Ready Strategies**:
   - Prevent premature template rendering on initial `undefined`/`null` emissions with `non-nullish-emission` default ready strategy.
   - Support customizable predicate rules (`readyWhen`).
3. **Race Condition Protection**:
   - Generation/token counter for Promise resolutions and Observable source switches so stale emissions are safely ignored.
4. **Subscription Lifecycle**:
   - Automatic unsubscription when destroyed or when the data source input changes.
   - Continuous context updates for subsequent stream emissions after initial load.

## Definition of Done (DoD)
- `*skeleton="let item from source$"` properly displays skeleton while pending and context data when ready.
- Changing data source rapidly discards previous unresolved responses.
- Typed template context `$implicit` and `loading` work with Angular's strict template type checker.

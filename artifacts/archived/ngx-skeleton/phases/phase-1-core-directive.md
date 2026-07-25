# Phase 1: Technical Prototype & Core Directive (v0.1.0)

## Objective
Establish the Angular library workspace and demo app, implement the foundational `SkeletonDirective` structural directive (`*skeleton`), create the internal `SkeletonHostComponent` wrapping PrimeNG's `p-skeleton`, and support boolean/signal/observable loading states with timing & fade-in controls.

## Key Features & Deliverables
1. **Workspace Setup**:
   - Create library workspace `projects/ngx-skeleton` and demo application `projects/demo-app`.
   - Install and configure PrimeNG peer/dev dependencies.
2. **Core Directive (`SkeletonDirective`)**:
   - Structural directive selector `[skeleton]` and alias `[ngxSkeleton]`.
   - Support `boolean`, `Signal<boolean>`, and `Observable<boolean>` as input loading sources.
   - Input cleanup: dispose effects, unsubscribe observables, and cancel timers upon destruction or source replacement.
3. **Internal Host Component (`SkeletonHostComponent`)**:
   - Composes PrimeNG's `p-skeleton`.
   - Accepts width, height, shape (`rectangle` | `circle`), size, border radius, and repeat count.
4. **Timing & Animation Basics**:
   - `skeletonDelay` (default 80ms) to prevent flicker on rapid completion.
   - `skeletonMinimumDuration` (default 200ms) to enforce a minimum visible loading time once shown.
   - `skeletonFadeIn` (boolean | number) CSS fade-in transition when replacing skeleton with actual view.
   - Reduced motion CSS overrides (`prefers-reduced-motion`).
5. **Unit Tests & Demo**:
   - Verification of source switching, subscription safety, timing logic, and host rendering.
   - Demo pages with profile/card examples for signals, observables, and rapid requests.

## Definition of Done (DoD)
- Workspace builds without warnings.
- `*skeleton` switches view based on boolean, signal, or observable loading inputs.
- No memory leaks or unhandled timers/subscriptions on component destruction.
- PrimeNG `p-skeleton` renders cleanly in the host view.
- Fade-in animation executes on content view insertion.

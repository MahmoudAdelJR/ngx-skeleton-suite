# Phase 5: Layout Preservation & SSR Hydration (v0.5.0)

## Objective
Minimize Cumulative Layout Shift (CLS) during view swaps by combining explicit dimension reservation with a `ResizeObserver`-based layout cache for repeated reloads, ensuring server-side rendering (SSR) and hydration safety.

## Key Features & Deliverables
1. **Multi-Level Layout Preservation**:
   - Level 1: Configured explicit dimensions (`width`, `height`).
   - Level 2: Preset-defined minimum dimensions.
   - Level 3: `ResizeObserver` cache capturing live dimensions of rendered content for subsequent reloads (keyed by `layoutKey`).
2. **SSR & Hydration Safety**:
   - Strict `isPlatformBrowser` guards to ensure `ResizeObserver`, `window`, and `document` are never accessed on the server.
   - Server-side no-op adapter for layout preservation.
   - Deterministic SSR rendering (`source-dependent` policy) preventing hydration mismatches.
3. **CLS & Integration Tests**:
   - Measure layout shifts during reload cycles.
   - SSR server-rendering integration tests using Angular server tools.

## Definition of Done (DoD)
- Subsequent reloads of a card/container reuse measured height from previous render, preventing collapse.
- Server-side rendering completes without DOM/window reference exceptions.
- Hydration completes cleanly without DOM structure mismatch console warnings.

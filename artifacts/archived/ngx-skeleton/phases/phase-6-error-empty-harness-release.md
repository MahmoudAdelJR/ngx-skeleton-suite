# Phase 6: Error/Empty States, Testing Harness & Release (v1.0.0)

## Objective
Add optional error and empty state template handlers, publish a dedicated component test harness `SkeletonHarness`, perform comprehensive accessibility audits, finalize documentation, and prepare for production npm publication.

## Key Features & Deliverables
1. **Empty & Error State Templates**:
   - `empty` input (`TemplateRef`) rendered when stream completes with no items or matches predicate `emptyWhen`.
   - `error` input (`TemplateRef`) rendered when stream errors, exposing `$implicit` error object.
2. **Testing Harness (`ngx-skeleton/testing`)**:
   - Component test harness `SkeletonHarness` for `TestBed` unit/integration tests.
   - Convenience helpers: `isLoading()`, `getSkeletonCount()`, `getAnimation()`, `waitForContent()`.
3. **Accessibility & Focus Audits**:
   - Screen reader hiding (`aria-hidden="true"`) for PrimeNG placeholders.
   - Container state tagging (`aria-busy="true"` / `aria-busy="false"`).
   - Preserved focus stability during reloads.
4. **Documentation, Packaging & Release**:
   - Comprehensive `README.md` and documentation site examples.
   - Angular Package Format (APF) compilation validation.
   - Version matrix compatibility table for Angular and PrimeNG.
   - GitHub Actions CI/CD with automated test matrix and npm provenance publishing.

## Definition of Done (DoD)
- Stream errors and empty completions display designated templates gracefully.
- `SkeletonHarness` provides simple test assertions for consuming Angular applications.
- Full test coverage passes across supported Angular and PrimeNG versions.
- Public API is stable, clean, tree-shakable, and fully documented for v1.0.0 release.

# `ngx-skeleton` Feature Roadmap & Status Tracking

## Vision & Summary
`ngx-skeleton` is a reusable Angular library that replaces repeated loading templates with a declarative structural directive (`*skeleton="isLoading"` / `*ngxSkeleton`). It seamlessly integrates PrimeNG's `p-skeleton` component with support for Boolean, Signal, and Observable loading states, data sources, layout preservation, presets, CSS grid generation, custom animations, accessibility, and SSR safety.

- **Primary Directive Selector**: `*skeleton` (Alias: `*ngxSkeleton`)
- **Package Name**: `ngx-skeleton`
- **Target Frameworks**: Angular 20+, RxJS 7.4+, PrimeNG 20+

---

## Phase Matrix

| Phase | Name | Spec File | Target Version | Status | Output File |
|---|---|---|---|---|---|
| 1 | Technical Prototype & Core Directive | [`phases/phase-1-core-directive.md`](file:///G:/Study/New%20folder/artifacts/current/ngx-skeleton/phases/phase-1-core-directive.md) | v0.1.0 | ✅ Completed | [`outputs/phase-1-output.md`](file:///G:/Study/New%20folder/artifacts/current/ngx-skeleton/outputs/phase-1-output.md) |
| 2 | Data Source `from` Mode & Typed Context | [`phases/phase-2-data-sources.md`](file:///G:/Study/New%20folder/artifacts/current/ngx-skeleton/phases/phase-2-data-sources.md) | v0.2.0 | ✅ Completed | [`outputs/phase-2-output.md`](file:///G:/Study/New%20folder/artifacts/current/ngx-skeleton/outputs/phase-2-output.md) |
| 3 | Presets, Animations & Global Provider | [`phases/phase-3-presets-and-animations.md`](file:///G:/Study/New%20folder/artifacts/current/ngx-skeleton/phases/phase-3-presets-and-animations.md) | v0.3.0 | ✅ Completed | [`outputs/phase-3-output.md`](file:///G:/Study/New%20folder/artifacts/current/ngx-skeleton/outputs/phase-3-output.md) |
| 4 | CSS Grid Generation | [`phases/phase-4-css-grid.md`](file:///G:/Study/New%20folder/artifacts/current/ngx-skeleton/phases/phase-4-css-grid.md) | v0.4.0 | ✅ Completed | [`outputs/phase-4-output.md`](file:///G:/Study/New%20folder/artifacts/current/ngx-skeleton/outputs/phase-4-output.md) |
| 5 | Layout Preservation & SSR Hydration | [`phases/phase-5-layout-preservation-ssr.md`](file:///G:/Study/New%20folder/artifacts/current/ngx-skeleton/phases/phase-5-layout-preservation-ssr.md) | v0.5.0 | ✅ Completed | [`outputs/phase-5-output.md`](file:///G:/Study/New%20folder/artifacts/current/ngx-skeleton/outputs/phase-5-output.md) |
| 6 | Error/Empty States, Testing Harness & Release | [`phases/phase-6-error-empty-harness-release.md`](file:///G:/Study/New%20folder/artifacts/current/ngx-skeleton/phases/phase-6-error-empty-harness-release.md) | v1.0.0 | ✅ Completed | [`outputs/phase-6-output.md`](file:///G:/Study/New%20folder/artifacts/current/ngx-skeleton/outputs/phase-6-output.md) |

---

## Technical Architecture Overview

```text
projects/ngx-skeleton/
├── src/
│   ├── public-api.ts
│   └── lib/
│       ├── directive/
│       │   ├── skeleton.directive.ts
│       │   └── skeleton-context.ts
│       ├── component/
│       │   └── skeleton-host.component.ts
│       ├── source/
│       │   ├── boolean-source.adapter.ts
│       │   ├── signal-source.adapter.ts
│       │   ├── observable-source.adapter.ts
│       │   └── source-normalizer.service.ts
│       ├── layout/
│       │   ├── layout-preservation.service.ts
│       │   └── layout-cache.service.ts
│       ├── preset/
│       │   ├── skeleton-preset.registry.ts
│       │   └── built-in-presets.ts
│       ├── config/
│       │   ├── skeleton-config.ts
│       │   └── provide-ngx-skeleton.ts
│       ├── grid/
│       │   └── skeleton-grid.utils.ts
│       └── testing/
│           └── skeleton-harness.ts
```

# `ngx-skeleton` — Angular + PrimeNG Skeleton Package Plan

## 1. Package Vision

Build a reusable Angular library that replaces repeated manual loading templates with a declarative structural directive:

```html
<section *skeleton="isLoading">
  <!-- Actual content -->
</section>
```

The directive displays a PrimeNG `p-skeleton`-based placeholder while a loading state is active, then swaps in the real Angular view with an optional fade-in transition.

The package should support:

- Boolean loading states.
- Angular `Signal<boolean>` loading states.
- `Observable<boolean>` loading states.
- Observable, Promise, or signal-backed data sources through an explicit `from` syntax.
- PrimeNG Skeleton as the rendering primitive.
- Pulse, shimmer, wave, and no-animation modes.
- Layout-preserving containers.
- Reusable skeleton presets.
- Responsive CSS Grid skeleton generation.
- Standalone Angular applications and NgModule-based applications.
- Server-side rendering and hydration safety.
- Accessibility and reduced-motion preferences.

---

## 2. Problem Statement

Without this package, Angular templates commonly repeat loading branches:

```html
@if (isLoading()) {
  <p-skeleton height="12rem" />
} @else {
  <app-profile-card [profile]="profile()" />
}
```

Or:

```html
<ng-container *ngIf="data$ | async as data; else loading">
  <app-content [data]="data" />
</ng-container>

<ng-template #loading>
  <p-skeleton height="12rem" />
</ng-template>
```

This produces:

- Repeated loading templates.
- Inconsistent skeleton dimensions and animations.
- Inconsistent fade behavior.
- More template nesting.
- More boilerplate for observable subscription handling.
- Layout shifts when loading content is replaced.
- Repeated grid skeleton markup for cards and lists.

`ngx-skeleton` should centralize these concerns into a small, typed API.

---

## 3. Naming and Registry Check

The desired public package name is:

```text
ngx-skeleton
```

Before creating the repository, verify that the name is available:

```bash
npm view ngx-skeleton
npm search ngx-skeleton
```

If the unscoped name is unavailable, use one of these alternatives:

```text
@your-scope/ngx-skeleton
ngx-primeng-skeleton
ngx-smart-skeleton
```

Keep the directive selector independent from the npm package name.

Recommended directive selector:

```html
*skeleton
```

Optional safer alias for teams concerned about selector collisions:

```html
*ngxSkeleton
```

The first release can expose both selectors through separate directive aliases, while documentation presents `*skeleton` as the primary API.

---

## 4. Product Principles

### 4.1 Minimal template code

The common case should require only a loading source:

```html
<app-user-card *skeleton="isLoading()" />
```

### 4.2 Explicit behavior when ambiguity exists

A direct boolean-like input represents loading state:

```html
<div *skeleton="loadingSignal">...</div>
<div *skeleton="loading$">...</div>
```

A data-producing stream uses explicit `from` syntax:

```html
<section *skeleton="let user from user$">
  {{ user.name }}
</section>
```

This avoids ambiguity between:

- `Observable<boolean>` meaning “currently loading”.
- `Observable<boolean>` meaning “the loaded data is a boolean”.

### 4.3 PrimeNG remains the visual foundation

The package should compose PrimeNG Skeleton rather than recreate its base placeholder component.

The library adds:

- Loading-source normalization.
- Structural view switching.
- Skeleton composition and repetition.
- Presets.
- Layout preservation.
- Additional animation classes.
- Fade-in transitions.
- Global configuration.

### 4.4 Progressive enhancement

The package must work without layout measurement or browser-only APIs. Advanced measurement features should activate only in the browser.

### 4.5 Honest layout preservation

A structural directive cannot know the exact dimensions of content that has never rendered unless it creates or measures that content. Therefore, layout preservation must have documented strategies instead of claiming perfect automatic inference.

---

## 5. Proposed Public API

## 5.1 Basic boolean usage

```html
<div *skeleton="isLoading">
  Loaded content
</div>
```

## 5.2 Signal usage

The directive should accept either the signal itself or its current value:

```html
<div *skeleton="isLoadingSignal">
  Loaded content
</div>

<div *skeleton="isLoadingSignal()">
  Loaded content
</div>
```

Passing the signal itself is preferable because the directive can react directly to it.

## 5.3 Observable loading usage

```html
<div *skeleton="isLoading$">
  Loaded content
</div>
```

The directive owns the subscription and automatically unsubscribes when destroyed or when the input source changes.

## 5.4 Data-source usage

```html
<section *skeleton="let user from user$">
  <h2>{{ user.name }}</h2>
</section>
```

Behavior:

1. Render the skeleton immediately.
2. Subscribe to `user$` once.
3. Replace the skeleton after the first valid value.
4. Expose the emitted value as `$implicit`.
5. Keep rendering future emitted values in the same embedded view context.
6. Unsubscribe automatically on destruction or source replacement.

Signal-backed data:

```html
<section *skeleton="let user from userSignal">
  <h2>{{ user.name }}</h2>
</section>
```

Promise-backed data:

```html
<section *skeleton="let user from userPromise">
  <h2>{{ user.name }}</h2>
</section>
```

## 5.5 Preset usage

```html
<app-profile-card
  *skeleton="isLoading; preset: 'profile-card'"
/>
```

## 5.6 Animation and fade usage

```html
<div
  *skeleton="isLoading;
             animation: 'wave';
             fadeIn: 180"
>
  Loaded content
</div>
```

## 5.7 Manual shape usage

```html
<div
  *skeleton="isLoading;
             width: '100%';
             height: '12rem';
             borderRadius: '1rem'"
>
  Loaded content
</div>
```

## 5.8 Repeated skeleton usage

```html
<div
  *skeleton="isLoading;
             count: 6;
             preset: 'product-card'"
>
  <app-product-grid [products]="products" />
</div>
```

## 5.9 CSS Grid generation

```html
<section
  *skeleton="isLoading;
             preset: 'product-card';
             grid: productGrid"
>
  <app-product-grid [products]="products" />
</section>
```

```ts
readonly productGrid: SkeletonGridConfig = {
  count: 8,
  columns: {
    default: 1,
    sm: 2,
    md: 3,
    lg: 4,
  },
  gap: '1rem',
};
```

Simpler CSS auto-fit mode:

```ts
readonly productGrid: SkeletonGridConfig = {
  count: 8,
  minItemWidth: '16rem',
  gap: '1rem',
};
```

## 5.10 Custom skeleton template escape hatch

```html
<article
  *skeleton="isLoading; template: customLoading"
>
  <app-article [article]="article" />
</article>

<ng-template #customLoading>
  <div class="article-placeholder">
    <p-skeleton width="60%" height="2rem" />
    <p-skeleton width="100%" height="14rem" />
  </div>
</ng-template>
```

This is intentionally an escape hatch, not the normal workflow.

---

## 6. Microsyntax Design

Primary directive:

```ts
@Directive({
  selector: '[skeleton]',
  standalone: true,
})
export class SkeletonDirective<T> {}
```

Planned microsyntax mappings:

| Template syntax | Directive input |
|---|---|
| `*skeleton="loading"` | `skeleton` |
| `from: source` | `skeletonFrom` |
| `preset: 'card'` | `skeletonPreset` |
| `animation: 'wave'` | `skeletonAnimation` |
| `fadeIn: 180` | `skeletonFadeIn` |
| `count: 6` | `skeletonCount` |
| `grid: config` | `skeletonGrid` |
| `width: '100%'` | `skeletonWidth` |
| `height: '10rem'` | `skeletonHeight` |
| `shape: 'circle'` | `skeletonShape` |
| `borderRadius: '12px'` | `skeletonBorderRadius` |
| `preserveLayout: true` | `skeletonPreserveLayout` |
| `template: loadingTpl` | `skeletonTemplate` |
| `delay: 120` | `skeletonDelay` |
| `minimumDuration: 250` | `skeletonMinimumDuration` |
| `emptyWhen: predicate` | `skeletonEmptyWhen` |
| `error: errorTpl` | `skeletonError` |
| `empty: emptyTpl` | `skeletonEmpty` |

Avoid putting every feature into version `1.0.0`. The API should be designed now, then released incrementally.

---

## 7. Type Model

## 7.1 Loading source

```ts
export type SkeletonLoadingSource =
  | boolean
  | Signal<boolean>
  | Observable<boolean>;
```

Optional future support:

```ts
export type SkeletonLoadingSource =
  | boolean
  | Signal<boolean>
  | Observable<boolean>
  | (() => boolean);
```

Do not initially treat arbitrary functions as signals. Prefer Angular’s `isSignal()` detection to avoid unexpected repeated execution.

## 7.2 Data source

```ts
export type SkeletonDataSource<T> =
  | Signal<T | null | undefined>
  | Observable<T>
  | PromiseLike<T>;
```

Possible later adapter support:

- Angular `ResourceRef<T>`.
- A package-defined `SkeletonAsyncState<T>`.
- TanStack Query result adapters.
- NgRx Signal Store or Component Store adapters.

These should be secondary entry points or optional adapters so that the core package remains small.

## 7.3 Directive context

```ts
export interface SkeletonContext<T> {
  $implicit: T;
  skeleton: T;
  loading: boolean;
  error: unknown | null;
}
```

Usage:

```html
<section *skeleton="let user from user$; let loading = loading">
  {{ user.name }}
</section>
```

In normal behavior, the content view is not created until loading is complete, so `loading` is mainly useful for advanced modes that keep the content mounted.

## 7.4 Animation type

```ts
export type SkeletonAnimation =
  | 'prime'
  | 'pulse'
  | 'shimmer'
  | 'wave'
  | 'none';
```

`prime` means use PrimeNG’s default styling without adding a package animation class.

## 7.5 Shape configuration

```ts
export interface SkeletonShapeConfig {
  shape?: 'rectangle' | 'circle';
  width?: string;
  height?: string;
  size?: string;
  borderRadius?: string;
  styleClass?: string;
}
```

## 7.6 Composite preset configuration

```ts
export interface SkeletonPreset {
  name: string;
  containerClass?: string;
  shapes: SkeletonPresetNode[];
}

export type SkeletonPresetNode =
  | SkeletonShapeNode
  | SkeletonStackNode
  | SkeletonGridNode;
```

Example:

```ts
export const PROFILE_CARD_PRESET: SkeletonPreset = {
  name: 'profile-card',
  containerClass: 'ngx-skeleton-profile-card',
  shapes: [
    {
      type: 'stack',
      direction: 'row',
      gap: '1rem',
      children: [
        { type: 'shape', shape: 'circle', size: '4rem' },
        {
          type: 'stack',
          direction: 'column',
          gap: '.5rem',
          grow: true,
          children: [
            { type: 'shape', width: '65%', height: '1.25rem' },
            { type: 'shape', width: '40%', height: '.875rem' },
          ],
        },
      ],
    },
  ],
};
```

---

## 8. Global Configuration

Provide a tree-shakable environment provider:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideNgxSkeleton({
      animation: 'wave',
      fadeInMs: 180,
      delayMs: 80,
      minimumDurationMs: 200,
      preserveLayout: true,
      respectReducedMotion: true,
    }),
  ],
});
```

Configuration interface:

```ts
export interface NgxSkeletonConfig {
  animation: SkeletonAnimation;
  fadeInMs: number;
  delayMs: number;
  minimumDurationMs: number;
  preserveLayout: boolean;
  respectReducedMotion: boolean;
  defaultPreset?: string;
  ariaLabel?: string;
}
```

Resolution priority:

1. Directive input.
2. Named preset setting.
3. Global provider configuration.
4. Internal defaults.

Include an NgModule compatibility wrapper only if required:

```ts
@NgModule({
  imports: [SkeletonDirective],
  exports: [SkeletonDirective],
})
export class NgxSkeletonModule {}
```

The standalone directive remains the primary API.

---

## 9. Internal Architecture

Recommended library structure:

```text
projects/ngx-skeleton/
├── ng-package.json
├── package.json
├── README.md
├── CHANGELOG.md
├── LICENSE
└── src/
    ├── public-api.ts
    └── lib/
        ├── directive/
        │   ├── skeleton.directive.ts
        │   ├── skeleton-context.ts
        │   └── skeleton.directive.spec.ts
        ├── component/
        │   ├── skeleton-host.component.ts
        │   ├── skeleton-host.component.html
        │   ├── skeleton-host.component.scss
        │   └── skeleton-host.component.spec.ts
        ├── source/
        │   ├── skeleton-source-adapter.ts
        │   ├── boolean-source.adapter.ts
        │   ├── signal-source.adapter.ts
        │   ├── observable-source.adapter.ts
        │   ├── promise-source.adapter.ts
        │   └── source-normalizer.service.ts
        ├── layout/
        │   ├── layout-preservation.service.ts
        │   ├── layout-cache.service.ts
        │   ├── resize-observer.adapter.ts
        │   └── layout.models.ts
        ├── preset/
        │   ├── skeleton-preset.registry.ts
        │   ├── built-in-presets.ts
        │   └── preset.models.ts
        ├── config/
        │   ├── skeleton-config.ts
        │   ├── skeleton-config.token.ts
        │   └── provide-ngx-skeleton.ts
        ├── animation/
        │   ├── animation.models.ts
        │   └── animation-state.service.ts
        ├── grid/
        │   ├── skeleton-grid.models.ts
        │   └── skeleton-grid.utils.ts
        ├── accessibility/
        │   └── accessibility.service.ts
        ├── styles/
        │   ├── _animations.scss
        │   ├── _layout.scss
        │   └── ngx-skeleton.scss
        └── testing/
            ├── skeleton-testing.module.ts
            └── skeleton-harness.ts
```

Demo and integration applications:

```text
projects/
├── ngx-skeleton/
├── demo-app/
└── integration-tests/
```

---

## 10. Core Rendering Flow

The structural directive owns two possible views:

1. Skeleton host view.
2. Actual embedded content view.

Recommended state machine:

```text
idle
  ↓
waiting-delay
  ├── load completes → content-entering
  └── delay expires → skeleton-visible
                         ↓
                  minimum-duration
                         ↓
                  content-entering
                         ↓
                    content-visible

Any active state
  └── source error → error-visible or error-raised
```

### 10.1 Loading starts

- Cancel stale timers.
- Mark the container as `aria-busy="true"`.
- Apply preserved dimensions when available.
- Start the skeleton delay timer.
- Do not show a skeleton immediately for very fast operations when `delayMs > 0`.

### 10.2 Skeleton becomes visible

- Create the internal `SkeletonHostComponent` through `ViewContainerRef`.
- Pass normalized shape, preset, grid, and animation configuration.
- Record the timestamp used by `minimumDurationMs`.

### 10.3 Loading completes

- Ensure minimum skeleton duration has elapsed.
- Remove or transition out the skeleton view.
- Create the actual embedded view.
- Apply fade-in class.
- Remove temporary preserved dimensions after the transition.
- Set `aria-busy="false"`.

### 10.4 Loading restarts

Configurable behavior:

- Default: destroy content and show skeleton.
- Optional future `retainContent: true`: keep stale content visible with an overlay skeleton or loading mask.

Do not include stale-content mode in the first MVP unless required by a real use case.

---

## 11. PrimeNG Integration

The internal skeleton host should import PrimeNG Skeleton directly:

```ts
import { SkeletonModule } from 'primeng/skeleton';
```

Possible internal template:

```html
<div
  class="ngx-skeleton-host"
  [class]="containerClass()"
  [attr.aria-label]="ariaLabel()"
  aria-live="polite"
>
  @for (item of renderedShapes(); track item.id) {
    <p-skeleton
      [shape]="item.shape ?? 'rectangle'"
      [width]="item.width"
      [height]="item.height"
      [size]="item.size"
      [borderRadius]="item.borderRadius"
      [styleClass]="item.styleClass"
    />
  }
</div>
```

Use PrimeNG as a peer dependency:

```json
{
  "peerDependencies": {
    "@angular/common": ">=20 <23",
    "@angular/core": ">=20 <23",
    "primeng": ">=20 <23",
    "rxjs": ">=7.4"
  }
}
```

The exact ranges must be based on the compatibility matrix that passes in CI. Do not publish broad peer ranges that were not tested.

Keep `primeng` out of regular `dependencies` to avoid installing a second PrimeNG copy in consuming applications.

---

## 12. Animation Design

## 12.1 Prime mode

Use PrimeNG’s default skeleton appearance and animation.

## 12.2 Pulse mode

Animate opacity or background intensity:

```css
@keyframes ngx-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
```

## 12.3 Shimmer mode

Use a moving linear-gradient overlay.

## 12.4 Wave mode

Use a wider, softer moving highlight than shimmer. Wave should be visually slower and less sharp.

## 12.5 Reduced motion

When the user has enabled reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .ngx-skeleton--animated,
  .ngx-skeleton-content-enter {
    animation: none !important;
    transition: none !important;
  }
}
```

If `respectReducedMotion` is `false`, directive-level configuration may override this behavior, although the default must respect the operating-system preference.

## 12.6 CSS custom properties

Expose stable variables:

```css
:root {
  --ngx-skeleton-base-color: var(--p-content-border-color);
  --ngx-skeleton-highlight-color: var(--p-content-hover-background);
  --ngx-skeleton-animation-duration: 1.4s;
  --ngx-skeleton-fade-duration: 180ms;
}
```

Prefer PrimeNG design tokens where stable and available, with safe CSS fallbacks.

---

## 13. Fade-In Design

The content should reveal through CSS rather than Angular’s legacy animation package.

Example:

```css
.ngx-skeleton-content-enter {
  animation: ngx-skeleton-fade-in var(--ngx-skeleton-fade-duration) ease-out both;
}

@keyframes ngx-skeleton-fade-in {
  from {
    opacity: 0;
    transform: translateY(2px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Configuration:

- `fadeIn: false` disables the effect.
- `fadeIn: true` uses the global duration.
- `fadeIn: number` uses a duration in milliseconds.

Avoid direct DOM assumptions about a single root node. An Angular embedded view may contain multiple root nodes.

Recommended implementation options:

1. Wrap the embedded view in an internal host element.
2. Apply the fade class to every element root node returned by `EmbeddedViewRef.rootNodes`.
3. Prefer a stable internal wrapper when layout and semantics permit it.

The wrapper strategy should support `display: contents` when possible, but `display: contents` has accessibility and styling edge cases. Test both strategies before finalizing.

---

## 14. Layout Preservation Strategy

“Automatic layout preservation” should be implemented in levels.

## 14.1 Level 1 — Configured dimensions

Most predictable mode:

```html
<div *skeleton="loading; height: '14rem'">...</div>
```

The skeleton container reserves the configured width and height.

## 14.2 Level 2 — Preset dimensions

Presets define expected dimensions:

```ts
{
  name: 'course-card',
  minHeight: '22rem',
  // ...shape tree
}
```

## 14.3 Level 3 — Previously measured layout cache

When real content has rendered at least once:

- Observe its dimensions with `ResizeObserver`.
- Cache dimensions using a developer-provided key.
- Reuse those dimensions during later reloads.

Usage:

```html
<div
  *skeleton="loading;
             preserveLayout: true;
             layoutKey: course.id"
>
  <app-course-card [course]="course" />
</div>
```

Cache options:

- In-memory only by default.
- Per directive instance when no key is provided.
- Optional service-level cache by `layoutKey`.
- Never persist to storage in the core package.

## 14.4 Level 4 — CSS containment and minimum block size

Use CSS to reduce layout shifts:

```css
.ngx-skeleton-layout-host {
  min-block-size: var(--ngx-skeleton-preserved-height, auto);
  contain: layout paint;
}
```

Containment must be optional because it can affect positioned descendants and overflow behavior.

## 14.5 Experimental hidden measurement

An opt-in experimental mode may instantiate the content invisibly to measure it:

```ts
measurementMode: 'hidden-view'
```

Risks:

- Child components initialize before data is ready.
- Duplicate subscriptions or effects may run.
- Components may issue requests.
- Hidden content may still affect accessibility unless carefully isolated.
- Rendering work is duplicated.
- Browser layout cost increases.

This mode should not be part of version `1.0.0`.

## 14.6 Acceptance definition

For version `1.0.0`, “layout preservation” means:

- The package can reserve configured or preset dimensions.
- It can reuse dimensions measured from previously rendered content.
- It minimizes content layout shift during repeated loading cycles.
- It does not promise pixel-perfect dimensions for content that has never rendered and has no size configuration.

---

## 15. CSS Grid Skeleton Generation

## 15.1 Goals

Generate repeated placeholders without this boilerplate:

```html
<div class="grid">
  @for (item of skeletonItems; track $index) {
    <p-skeleton height="18rem" />
  }
</div>
```

## 15.2 Grid model

```ts
export interface SkeletonGridConfig {
  count: number;
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  minItemWidth?: string;
  columns?: number | SkeletonResponsiveColumns;
  itemPreset?: string;
  item?: SkeletonShapeConfig | SkeletonPreset;
  alignItems?: 'stretch' | 'start' | 'center' | 'end';
}

export interface SkeletonResponsiveColumns {
  default: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}
```

## 15.3 Auto-fit output

```css
.ngx-skeleton-grid--auto-fit {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, var(--ngx-skeleton-grid-min)), 1fr));
  gap: var(--ngx-skeleton-grid-gap);
}
```

## 15.4 Responsive columns

Use generated host classes and package media queries rather than inline style injection.

Alternative: use CSS custom properties per breakpoint if browser support and Angular style binding are sufficient.

## 15.5 Grid validation

Validate in development mode:

- `count` must be zero or greater.
- Column values must be one or greater.
- `minItemWidth` and explicit columns should not both control the same behavior unless documented.
- Missing item preset falls back to the default rectangle.

---

## 16. Preset System

## 16.1 Built-in presets

Start with a small set:

- `line`
- `paragraph`
- `avatar`
- `list-item`
- `card`
- `profile-card`
- `table-row`
- `image-card`

Avoid dozens of opinionated presets in the core package.

## 16.2 App-defined presets

```ts
provideNgxSkeleton({
  presets: [COURSE_CARD_SKELETON, USER_PROFILE_SKELETON],
});
```

Or a separate provider:

```ts
provideSkeletonPresets([
  COURSE_CARD_SKELETON,
  USER_PROFILE_SKELETON,
]);
```

## 16.3 Preset registry behavior

- Resolve by name.
- Detect duplicate names in development mode.
- Allow application presets to override built-ins only through an explicit option.
- Freeze normalized preset objects in development mode to catch accidental mutation.

---

## 17. Async Source Handling

## 17.1 Boolean

A direct boolean immediately controls the state.

## 17.2 Signal<boolean>

Use Angular signal detection and an `effect()` scoped to the directive’s injection context.

Requirements:

- Dispose the effect if the input signal is replaced.
- Avoid creating a new effect on every change-detection cycle.
- Use `untracked()` around internal bookkeeping where appropriate.

## 17.3 Observable<boolean>

Requirements:

- Subscribe once per source instance.
- Use automatic destruction cleanup.
- Unsubscribe when replaced.
- Apply `distinctUntilChanged()` internally.
- Do not alter the source with `shareReplay()` because ownership belongs to the consumer.

## 17.4 Observable data source

Initial behavior:

- Loading begins immediately.
- First `next` reveals content.
- Later `next` values update the context.
- `error` moves to error handling.
- `complete` before any value should be treated as empty.

Configurable first-value rule:

```ts
export type SkeletonReadyStrategy =
  | 'first-emission'
  | 'non-nullish-emission'
  | 'predicate';
```

Default for data sources:

```text
non-nullish-emission
```

This prevents `undefined` initial emissions from prematurely revealing content.

Allow consumers to override:

```html
<div *skeleton="let value from source$; readyWhen: isReady">
  ...
</div>
```

## 17.5 Promise source

- Show skeleton immediately.
- Resolve into content.
- Reject into error state.
- Ignore stale Promise results after the input source changes.

Use a generation/token counter to protect against race conditions.

## 17.6 Source switching

When the source input changes:

1. Increment an internal generation identifier.
2. Dispose the old source subscription/effect.
3. Reset timers.
4. Apply the configured reload behavior.
5. Ignore all results from previous generations.

---

## 18. Empty and Error States

These are important but can be phased after the MVP.

Proposed templates:

```html
<section
  *skeleton="let products from products$;
             empty: emptyProducts;
             error: loadError"
>
  <app-product-grid [products]="products" />
</section>

<ng-template #emptyProducts>
  <app-empty-state />
</ng-template>

<ng-template #loadError let-error>
  <app-error-state [error]="error" />
</ng-template>
```

Default behavior:

- Error without an error template: rethrow asynchronously through Angular’s error handling mechanism or log in development and leave the skeleton based on configuration.
- Empty without an empty template: reveal content with the empty value only when the ready strategy considers it valid.

The behavior must be explicit and documented to avoid swallowed errors.

---

## 19. Accessibility

Requirements:

- Mark the loading region with `aria-busy="true"`.
- Set `aria-busy="false"` when content is ready.
- Keep PrimeNG skeleton elements hidden from screen readers.
- Optionally add visually hidden loading text.
- Do not continuously announce animated skeleton changes.
- Respect `prefers-reduced-motion` by default.
- Ensure custom templates can provide their own labels.
- Keep focus behavior stable during reloads.

Suggested API:

```html
<div
  *skeleton="loading;
             ariaLabel: 'Loading user profile'"
>
  ...
</div>
```

Focus rule:

- If focused content is destroyed because loading restarts, move focus only when a developer explicitly configures a focus target.
- The package should not unexpectedly move focus by default.

---

## 20. SSR and Hydration

Requirements:

- Never access `window`, `document`, `ResizeObserver`, or `matchMedia` without a platform check.
- Render deterministic skeleton markup on the server.
- Avoid server/client state divergence during hydration.
- Do not start visual timers on the server.
- Delay browser measurement until after hydration/render stabilization.
- Use a no-op layout observer on the server.

Recommended SSR policies:

```ts
export type SkeletonSsrMode =
  | 'render-skeleton'
  | 'render-content'
  | 'source-dependent';
```

MVP default:

```text
source-dependent
```

For a synchronous `false` loading state, render content. For an unresolved async data source, render the skeleton.

SSR behavior needs integration tests using Angular’s server rendering tooling.

---

## 21. Performance Requirements

- No polling.
- No repeated Observable subscriptions during change detection.
- Use `OnPush` for the internal component.
- Prefer signals for internal component inputs and computed shape models.
- Avoid creating individual Angular components for every simple shape when a lightweight repeated PrimeNG Skeleton render is sufficient.
- Cancel all timers on destruction.
- Disconnect `ResizeObserver` instances.
- Cache normalized presets.
- Avoid deep cloning configuration on every render.
- Keep the package side-effect free except for explicitly imported global styles.
- Publish in Angular partial compilation mode.

Performance targets for a demo page:

- 100 simple skeleton items without subscription leaks.
- Repeated loading toggles without increasing active observers or timers.
- Grid resizing without excessive layout recalculation.
- No meaningful extra change-detection work when loading state is unchanged.

---

## 22. Styling and Theming

The package should not hard-code a full theme.

Use:

1. PrimeNG Skeleton styling.
2. PrimeNG design tokens where available.
3. Package CSS custom properties.
4. Directive-level classes.
5. Consumer overrides.

Example consumer override:

```css
:root {
  --ngx-skeleton-animation-duration: 1.1s;
  --ngx-skeleton-fade-duration: 140ms;
}

.admin-dashboard {
  --ngx-skeleton-base-color: var(--surface-200);
  --ngx-skeleton-highlight-color: var(--surface-100);
}
```

The package must support:

- Light mode.
- Dark mode.
- RTL layouts.
- Logical CSS properties such as `margin-inline`, `padding-inline`, and `block-size`.

Animations should move using logical direction where practical, or offer an RTL-aware direction option.

---

## 23. RTL Support

Requirements:

- Do not use hard-coded left/right spacing in package CSS.
- Use `inline-start` and `inline-end` concepts.
- Detect inherited `dir="rtl"` through CSS, not JavaScript, where possible.
- Reverse directional shimmer/wave movement in RTL only if the animation visually depends on reading direction.
- Test nested LTR content inside an RTL application.

Possible CSS:

```css
[dir='rtl'] .ngx-skeleton--wave::after {
  animation-direction: reverse;
}
```

---

## 24. Testing Strategy

## 24.1 Unit tests

### Directive source tests

- Boolean starts and stops loading.
- Signal changes update the rendered view.
- Signal input replacement disposes the old effect.
- Observable subscribes once.
- Observable replacement unsubscribes from the previous source.
- Destroy unsubscribes and clears timers.
- Promise resolution displays content.
- Stale Promise results are ignored.
- Observable errors use the error template.
- Completion without a value uses the empty state.

### Timing tests

- Delay prevents flicker for fast operations.
- Minimum duration is respected.
- Fade is applied only after content creation.
- Timers are canceled on rapid state changes.

### Rendering tests

- PrimeNG Skeleton receives shape inputs.
- Presets generate the correct tree.
- Count generates the correct number of items.
- Grid configuration generates expected styles/classes.
- Custom loading template overrides generated skeletons.

### Layout tests

- Explicit dimensions are preserved.
- Cached measured dimensions are restored.
- Layout observer disconnects on destroy.
- Browser-only measurement is disabled on the server.

### Accessibility tests

- `aria-busy` toggles correctly.
- Skeleton elements are not focusable.
- Reduced-motion mode disables custom animations.

## 24.2 Integration tests

Create fixture applications for supported combinations:

```text
Angular 20 + tested PrimeNG version
Angular 21 + tested PrimeNG version
Angular 22 + tested PrimeNG version
```

Only advertise combinations that pass.

Test:

- Standalone bootstrap.
- NgModule application.
- Zone-based change detection.
- Zoneless change detection.
- SSR.
- Hydration.
- RTL.
- Dark theme.

## 24.3 Browser tests

Use Playwright for:

- Visual transitions.
- Grid responsiveness.
- Layout shift checks.
- Reduced-motion emulation.
- RTL screenshots.
- SSR hydration console errors.

## 24.4 Visual regression tests

Capture:

- Every built-in preset.
- Every animation mode.
- Light and dark themes.
- LTR and RTL.
- Mobile, tablet, and desktop grid layouts.

## 24.5 Public test utilities

Provide a testing harness in a secondary entry point:

```ts
import { SkeletonHarness } from 'ngx-skeleton/testing';
```

Useful methods:

```ts
await harness.isLoading();
await harness.getSkeletonCount();
await harness.getAnimation();
await harness.waitForContent();
```

---

## 25. Documentation Plan

## 25.1 README

Include:

- Problem and value proposition.
- Installation.
- PrimeNG peer requirement.
- Basic boolean usage.
- Signal usage.
- Observable loading usage.
- Data `from` usage.
- Presets.
- Grid generation.
- Configuration provider.
- Theming.
- RTL.
- Accessibility.
- SSR limitations.
- Layout preservation limitations.
- Compatibility table.

## 25.2 Documentation site

Create sections:

```text
Getting Started
Loading Sources
Data Sources
Animations
Presets
Grid Skeletons
Layout Preservation
Theming
RTL
Accessibility
SSR and Hydration
Testing
API Reference
Migration Guides
```

## 25.3 Interactive examples

Demo cases:

1. Fast request where skeleton delay prevents flicker.
2. Slow signal-based loading.
3. Observable loading flag.
4. Observable data source.
5. Product card grid.
6. Profile preset.
7. Custom skeleton template.
8. Error and empty templates.
9. Repeated reload with layout cache.
10. RTL and dark mode.

---

## 26. Package Creation and Build Setup

Suggested workspace commands:

```bash
ng new ngx-skeleton-workspace \
  --no-create-application \
  --strict \
  --style=scss

cd ngx-skeleton-workspace

ng generate library ngx-skeleton \
  --standalone \
  --test-runner=vitest

ng generate application demo-app \
  --standalone \
  --style=scss
```

Install PrimeNG in the workspace for development and integration testing:

```bash
npm install primeng primeicons
```

The library package must declare PrimeNG as a peer dependency even though the workspace uses it as a development dependency.

Build:

```bash
ng build ngx-skeleton --configuration production
```

Publish dry run:

```bash
cd dist/ngx-skeleton
npm pack --dry-run
```

Inspect the package before publication:

- No demo application files.
- No private source maps unless intended.
- README and LICENSE included.
- Correct `exports` entries.
- No accidental regular dependency on Angular or PrimeNG.
- Styles included and documented.

---

## 27. Public Entry Points

Primary entry point:

```ts
import {
  SkeletonDirective,
  provideNgxSkeleton,
  provideSkeletonPresets,
} from 'ngx-skeleton';
```

Testing entry point:

```ts
import {
  SkeletonHarness,
  provideSkeletonTesting,
} from 'ngx-skeleton/testing';
```

Optional future adapters:

```ts
import { withAngularResource } from 'ngx-skeleton/resource';
import { withTanStackQuery } from 'ngx-skeleton/tanstack-query';
```

Do not create optional entry points until real integration code exists.

---

## 28. Release Scope

## 28.1 Version `0.1.0` — Technical prototype

Deliver:

- Standalone structural directive.
- Boolean loading input.
- Signal loading input.
- Observable loading input.
- PrimeNG Skeleton host.
- Width, height, shape, and border radius.
- Simple fade-in.
- Unit tests.
- Demo application.

Exit criteria:

- No subscription or timer leaks.
- Works in a standalone Angular application.
- PrimeNG theme integration confirmed.

## 28.2 Version `0.2.0` — Data source mode

Deliver:

- `from` microsyntax.
- Observable data.
- Signal data.
- Promise data.
- Typed template context.
- Ready strategy.
- Source replacement race protection.

## 28.3 Version `0.3.0` — Presets and animation system

Deliver:

- Global provider configuration.
- Pulse, shimmer, wave, Prime, and none modes.
- Built-in presets.
- Application-defined presets.
- Reduced-motion support.
- RTL animation behavior.

## 28.4 Version `0.4.0` — Grid generation

Deliver:

- Count.
- Fixed columns.
- Responsive columns.
- Auto-fit minimum width.
- Grid presets.
- Playwright responsive tests.

## 28.5 Version `0.5.0` — Layout preservation

Deliver:

- Configured dimensions.
- Preset minimum dimensions.
- Previous-layout measurement cache.
- `ResizeObserver` adapter.
- SSR-safe no-op adapter.
- Layout shift integration tests.

## 28.6 Version `0.6.0` — Empty, error, and custom templates

Deliver:

- Empty template.
- Error template.
- Custom loading template.
- Explicit error policy.
- Documentation examples.

## 28.7 Version `0.9.0` — Compatibility release candidate

Deliver:

- Angular and PrimeNG test matrix.
- SSR and hydration tests.
- Zoneless tests.
- Accessibility audit.
- API review.
- Bundle analysis.
- Migration policy.

## 28.8 Version `1.0.0` — Stable release

Requirements:

- Stable public API.
- Complete README and docs.
- Verified compatibility table.
- No known subscription, timer, observer, hydration, or focus leaks.
- Visual regression baseline.
- Semantic versioning and changelog process.
- Automated npm provenance publishing.

---

## 29. MVP Definition

The MVP should remain focused.

### Included

- `*skeleton` structural directive.
- Boolean, Signal, and Observable loading states.
- PrimeNG Skeleton rendering.
- Shape, size, count, and preset inputs.
- Fade-in.
- Delay and minimum duration.
- Pulse, shimmer, wave, Prime, and none animations.
- Basic CSS Grid generation.
- Configured/preset layout reservation.
- Standalone usage.
- Global configuration.
- RTL and reduced-motion support.
- Tests and demo.

### Deferred

- Hidden content measurement.
- Stale-content overlay mode.
- Angular Resource adapter.
- TanStack Query adapter.
- NgRx adapters.
- Persistent layout cache.
- Automatic DOM-shape inference.
- Code-generation schematics.

---

## 30. Acceptance Criteria

## 30.1 Basic directive

```html
<div *skeleton="loading">Content</div>
```

- Skeleton is visible when `loading === true`.
- Content is not created while loading.
- Content is created once loading becomes false.
- Content fades in when configured.

## 30.2 Signal

- Passing a signal object reacts to signal updates.
- Destroying the directive disposes its reactive effect.
- Replacing the signal stops reacting to the old signal.

## 30.3 Observable

- Exactly one subscription exists per source instance.
- The subscription is disposed when the source changes.
- The subscription is disposed when the directive is destroyed.

## 30.4 Delay and minimum duration

- Operations faster than `delayMs` do not flash a skeleton.
- Once visible, the skeleton stays for at least `minimumDurationMs`.
- Rapid toggles do not produce stale timers or incorrect views.

## 30.5 Grid

- Grid count matches configuration.
- Responsive columns change at documented breakpoints.
- Auto-fit works without horizontal overflow at narrow widths.

## 30.6 Layout preservation

- Explicit dimensions prevent collapse.
- Preset dimensions prevent collapse.
- Previously measured dimensions are restored on reload.
- Browser measurement does not run during SSR.

## 30.7 Accessibility

- Loading regions expose `aria-busy`.
- Skeletons are ignored by screen readers.
- Reduced-motion disables custom motion by default.
- No unexpected focus movement occurs.

## 30.8 Packaging

- Angular, PrimeNG, and RxJS are peer dependencies.
- The package is published in Angular Package Format.
- The package is side-effect free except for explicitly imported CSS.
- Tree shaking removes unused presets and adapters.

---

## 31. CI/CD and Publishing

Recommended GitHub Actions workflows:

### Pull request workflow

- Install with a locked dependency file.
- Lint.
- Type-check.
- Unit tests.
- Build library.
- Build demo.
- Run integration tests.
- Run package dry-run validation.

### Compatibility matrix workflow

Run supported Angular and PrimeNG combinations in separate fixture workspaces.

### Release workflow

- Trigger from a protected version tag.
- Build production package.
- Run full test matrix.
- Generate or validate changelog.
- Run `npm pack --dry-run`.
- Publish with npm provenance.
- Create GitHub release.
- Deploy documentation site.

Recommended tools:

- Conventional Commits.
- Changesets or semantic-release.
- Dependabot or Renovate.
- CodeQL.
- npm provenance/trusted publishing.

---

## 32. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `*skeleton` selector conflicts with another library | Template compilation conflict | Provide `*ngxSkeleton` alias and document one-selector-per-element constraints |
| Observable boolean/data ambiguity | Incorrect runtime behavior | Reserve direct input for loading and use explicit `from` for data |
| PrimeNG major changes | Broken rendering or styles | Peer dependency ranges based only on tested CI combinations |
| Exact auto-layout inference is impossible before first render | Misleading feature promise | Define layout preservation levels and document limitations |
| Hidden measurement initializes real components | Side effects and performance regressions | Defer as experimental and opt-in only |
| Fast requests cause skeleton flicker | Poor UX | Add `delayMs` and `minimumDurationMs` |
| Rapid source switching shows stale content | Data race | Use source generation tokens and dispose old adapters |
| SSR accesses browser APIs | Runtime failure | Platform abstractions and server no-op implementations |
| Hydration mismatch | Console errors and DOM recreation | Deterministic SSR policy and hydration integration tests |
| Animation affects accessibility | Motion discomfort | Respect reduced motion by default |
| Internal wrapper changes consumer layout | Styling bugs | Test wrapper versus root-node class strategy and document host behavior |
| Too many presets increase bundle size | Larger package | Small built-in set and tree-shakable application presets |
| Generic API becomes too complex | Low adoption | Keep common syntax minimal and defer advanced adapters |

---

## 33. Recommended Implementation Order

1. Create the Angular library workspace and demo application.
2. Add PrimeNG as a development dependency and peer dependency.
3. Implement the internal `SkeletonHostComponent`.
4. Implement boolean loading state in the structural directive.
5. Add signal-source handling.
6. Add observable loading handling with cleanup and source replacement.
7. Add delay and minimum-duration state machine.
8. Add fade-in transition.
9. Add shape, size, count, and custom-template options.
10. Add data-source `from` mode.
11. Add global configuration provider.
12. Add animations and reduced-motion handling.
13. Add preset registry and built-in presets.
14. Add CSS Grid generation.
15. Add configured and preset layout reservation.
16. Add measured layout cache for repeated loads.
17. Add SSR, hydration, zoneless, RTL, and dark-mode tests.
18. Add empty/error state templates.
19. Complete documentation and compatibility matrix.
20. Publish release candidate, gather feedback, then stabilize `1.0.0`.

---

## 34. First Development Iteration

### Goal

Produce a usable technical prototype proving the directive lifecycle and PrimeNG integration.

### Tasks

#### Workspace

- Create an Angular library workspace.
- Create a standalone demo application.
- Configure strict TypeScript.
- Add PrimeNG and PrimeIcons.
- Configure a PrimeNG theme in the demo.

#### Directive

- Create `SkeletonDirective`.
- Inject `TemplateRef` and `ViewContainerRef`.
- Support `boolean | Signal<boolean> | Observable<boolean>`.
- Implement input source replacement.
- Implement destruction cleanup.

#### Host component

- Create `SkeletonHostComponent`.
- Render one PrimeNG Skeleton.
- Support width, height, size, shape, and border radius.
- Support repeated count.

#### Transition

- Add optional content fade-in.
- Add skeleton delay.
- Add minimum visible duration.
- Add reduced-motion CSS.

#### Tests

- Boolean loading test.
- Signal reactivity test.
- Observable subscription cleanup test.
- Rapid toggle timer test.
- PrimeNG shape rendering test.
- Content fade class test.

#### Demo

- Profile card example.
- Product card example.
- Observable loading example.
- Signal loading example.
- Rapid request example proving delay behavior.

### Iteration exit criteria

- The directive works with all three loading-source types.
- No manual loading template is required.
- PrimeNG Skeleton is the rendered placeholder.
- Content reveals with an optional fade.
- Unit tests prove cleanup and race-safe timing.
- The demo contains no known console errors.

---

## 35. Suggested Initial API for the Prototype

Keep the prototype narrow:

```ts
export type SkeletonAnimation =
  | 'prime'
  | 'pulse'
  | 'shimmer'
  | 'wave'
  | 'none';

export type SkeletonLoadingSource =
  | boolean
  | Signal<boolean>
  | Observable<boolean>;

@Directive({
  selector: '[skeleton]',
  standalone: true,
})
export class SkeletonDirective {
  readonly skeleton = input.required<SkeletonLoadingSource>();
  readonly skeletonWidth = input<string>('100%');
  readonly skeletonHeight = input<string>('1rem');
  readonly skeletonShape = input<'rectangle' | 'circle'>('rectangle');
  readonly skeletonBorderRadius = input<string>();
  readonly skeletonCount = input(1);
  readonly skeletonAnimation = input<SkeletonAnimation>('prime');
  readonly skeletonFadeIn = input<boolean | number>(true);
  readonly skeletonDelay = input(80);
  readonly skeletonMinimumDuration = input(200);
}
```

Prototype usage:

```html
<app-user-profile
  *skeleton="loadingSignal;
             height: '14rem';
             animation: 'wave';
             fadeIn: 180;
             delay: 100;
             minimumDuration: 250"
/>
```

After this API is proven, add `from`, presets, grids, and measurement in separate iterations.

---

## 36. Definition of Done for `1.0.0`

The package is ready for stable release when:

- Common loading cases use one structural directive without manual loading templates.
- Boolean, Signal, Observable, and explicit data-source modes are reliable.
- PrimeNG Skeleton remains the base placeholder component.
- Animations, fade, delay, and minimum duration are configurable.
- Presets and grids are typed and documented.
- Layout preservation behavior and limitations are clearly documented.
- SSR, hydration, zoneless, RTL, dark mode, and reduced motion are tested.
- Compatibility ranges are generated from passing CI combinations.
- The public API has no experimental types in the primary entry point.
- The package has complete documentation, examples, changelog, and migration policy.
- npm publishing is automated, reproducible, and protected.

---

## 37. Official References

- Angular structural directives: <https://angular.dev/guide/directives/structural-directives>
- Angular signals: <https://angular.dev/guide/signals>
- Angular RxJS interop: <https://angular.dev/ecosystem/rxjs-interop>
- Angular library creation: <https://angular.dev/tools/libraries/creating-libraries>
- Angular Package Format: <https://angular.dev/tools/libraries/angular-package-format>
- Angular version compatibility: <https://angular.dev/reference/versions>
- PrimeNG Skeleton: <https://primeng.org/skeleton>


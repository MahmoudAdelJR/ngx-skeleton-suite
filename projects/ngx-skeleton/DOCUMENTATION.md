# `ngx-skeleton` Technical Documentation & Developer Guide

`ngx-skeleton` is an enterprise-grade, declarative structural directive suite for Angular applications that seamlessly composes PrimeNG's `p-skeleton` primitive. It eliminates boilerplate `<ng-container *ngIf="...">` loading blocks, handles Signals, RxJS Observables, and Promises, generates responsive CSS grid layouts, prevents Cumulative Layout Shift (CLS), and provides SSR/hydration safety out of the box.

---

## Table of Contents
1. [Compatibility Matrix](#compatibility-matrix)
2. [Architecture & Design System](#architecture--design-system)
3. [Installation & Setup](#installation--setup)
4. [Global Provider Configuration](#global-provider-configuration)
5. [Styling & Customization Guide (SCSS, CSS Variables, Alignment & Themes)](#styling--customization-guide-scss-css-variables-alignment--themes)
   - [1. CSS Custom Properties (CSS Variables)](#1-css-custom-properties-css-variables)
   - [2. Directive Styling Inputs (Width, Height, Radius, Shape)](#2-directive-styling-inputs-width-height-radius-shape)
   - [3. Alignment & Stack Layouts (Flexbox & Grid Alignment)](#3-alignment--stack-layouts-flexbox--grid-alignment)
   - [4. Custom CSS & SCSS Overriding (`styleClass` & `containerClass`)](#4-custom-css--scss-overriding-styleclass--containerclass)
   - [5. PrimeNG Theme Synergy](#5-primeng-theme-synergy)
6. [Detailed Usage Examples](#detailed-usage-examples)
   - [1. Basic Boolean & Signal Loading](#1-basic-boolean--signal-loading)
   - [2. Data Source Binding via `from` Microsyntax](#2-data-source-binding-via-from-microsyntax)
   - [3. Composite Shape Presets](#3-composite-shape-presets)
   - [4. Responsive CSS Grid Generation](#4-responsive-css-grid-generation)
   - [5. Animation Engines & Reduced Motion](#5-animation-engines--reduced-motion)
   - [6. Flicker Protection & Timing Controls](#6-flicker-protection--timing-controls)
   - [7. Layout Shift (CLS) Prevention](#7-layout-shift-cls-prevention)
   - [8. Error & Empty State Templates](#8-error--empty-state-templates)
   - [9. Custom Tree-Based Presets](#9-custom-tree-based-presets)
   - [10. Unit Testing with `SkeletonHarness`](#10-unit-testing-with-skeletonharness)
7. [Complete API Reference](#complete-api-reference)

---

## Compatibility Matrix

`ngx-skeleton` supports modern Angular versions and broad PrimeNG peer dependency ranges:

| Package | Supported Version Range | Tested Compatibility |
|---|---|---|
| **Angular Core / Common** | `>= 18.0.0 < 23.0.0` | Angular 18.x, 19.x, 20.x, 21.x, 22.x |
| **PrimeNG** | `>= 17.0.0 < 23.0.0` | PrimeNG 17.x, 18.x, 19.x, 20.x, 21.x, 22.x |
| **RxJS** | `>= 7.4.0` | RxJS 7.4+ & 7.8+ |

---

## Architecture & Design System

```
                      +---------------------------------------+
                      |         SkeletonDirective             |
                      |  (*skeleton="let user from user$")    |
                      +-------------------+-------------------+
                                          |
                +-------------------------+-------------------------+
                |                                                   |
    +-----------v------------+                             +--------v----------+
    | SourceNormalizerService|                             |  LayoutCache      |
    | (Signals, RxJS, Promises)|                          | (CLS Observer)    |
    +-----------+------------+                             +--------+----------+
                |                                                   |
                +-------------------------+-------------------------+
                                          |
                               +----------v----------+
                               |SkeletonHostComponent|
                               | (Preset Node Renderer)|
                               +----------+----------+
                                          |
                               +----------v----------+
                               |  PrimeNG p-skeleton |
                               | (Native HTML Host)  |
                               +---------------------+
```

### Core Architecture Highlights
1. **Microsyntax & Type Guards**: Implements `ngTemplateContextGuard` for strict template type checking in Angular Language Service.
2. **Universal Source Normalizer**: Normalizes `boolean`, `Signal<T>`, `Observable<T>`, `PromiseLike<T>`, and direct static objects into unified loading callbacks with race-condition generation tokens.
3. **Preset Tree Renderer**: Recursively compiles composite node definitions (`SkeletonStackNode` and `SkeletonShapeNode`) into structured HTML layout trees.
4. **Responsive CSS Grid Engine**: Generates dynamic auto-fit grids (`minmax(min(100%, minItemWidth), 1fr)`) or breakpoint media query columns (`sm`, `md`, `lg`, `xl`).
5. **Layout Shift (CLS) Prevention**: Measures live rendered container bounds using browser `ResizeObserver` and applies preserved `min-height`/`min-width` styles on reloading cycles.
6. **SSR & Hydration Safety**: Uses Angular's `PLATFORM_ID` to isolate browser DOM measurements from Server-Side Rendering execution.

---

## Installation & Setup

### 1. Installation

```bash
npm install ngx-skeleton
```

### 2. Standalone Application Setup (Angular 18+)

Import `SkeletonDirective` directly into standalone components:

```ts
import { Component, signal } from '@angular/core';
import { SkeletonDirective } from 'ngx-skeleton';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [SkeletonDirective],
  templateUrl: './user-card.component.html',
})
export class UserCardComponent {
  isLoading = signal(true);
}
```

### 3. NgModule Application Setup (Angular 18+ Legacy Modules)

Import `NgxSkeletonModule` in your feature module:

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonModule } from 'ngx-skeleton';
import { FeatureComponent } from './feature.component';

@NgModule({
  declarations: [FeatureComponent],
  imports: [CommonModule, NgxSkeletonModule],
})
export class FeatureModule {}
```

---

## Global Provider Configuration

Configure application-wide default timing, animation modes, and custom preset registries in `app.config.ts` or `main.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideNgxSkeleton, provideSkeletonPresets, SkeletonPreset } from 'ngx-skeleton';

const HERO_HEADER_PRESET: SkeletonPreset = {
  name: 'hero-header',
  shapes: [
    { type: 'shape', shape: 'circle', size: '4rem' },
    { type: 'shape', width: '60%', height: '2rem' },
    { type: 'shape', width: '40%', height: '1.25rem' },
  ],
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxSkeleton({
      animation: 'wave',
      delayMs: 80,
      minimumDurationMs: 200,
      fadeInMs: 180,
      preserveLayout: true,
    }),
    provideSkeletonPresets([HERO_HEADER_PRESET]),
  ],
};
```

---

## Styling & Customization Guide (SCSS, CSS Variables, Alignment & Themes)

`ngx-skeleton` provides multiple layers of styling customization ranging from CSS custom properties (variables), fine-grained alignment controls, directive inputs for shapes and dimensions, custom SCSS/CSS class overrides, and native PrimeNG theme integration.

---

### 1. CSS Custom Properties (CSS Variables)

`ngx-skeleton` uses CSS Custom Properties to allow instant global or context-scoped styling changes without needing `:ng-deep` or `!important` hacks.

#### Core CSS Variables Table

| CSS Custom Property | Default Value | Description |
|---|---|---|
| `--ngx-skeleton-base-color` | `var(--p-content-border-color, #1e293b)` | Base background color of skeleton shapes |
| `--ngx-skeleton-highlight-color` | `var(--p-content-hover-background, rgba(255,255,255,0.15))` | Highlight/shimmer gradient color during animations |
| `--ngx-skeleton-animation-duration` | `1.4s` | Duration/speed of `pulse`, `shimmer`, and `wave` animation cycles |
| `--ngx-skeleton-fade-duration` | `180ms` | Fade-in transition speed when switching to real content |
| `--ngx-skeleton-grid-gap` | `1rem` | Overall gap spacing in grid layouts |
| `--ngx-skeleton-grid-row-gap` | `var(--ngx-skeleton-grid-gap, 1rem)` | Vertical row gap spacing in grid layouts |
| `--ngx-skeleton-grid-col-gap` | `var(--ngx-skeleton-grid-gap, 1rem)` | Horizontal column gap spacing in grid layouts |
| `--ngx-skeleton-grid-min` | `16rem` | Minimum item width for auto-fit responsive grid columns |

#### Global Customization in `styles.scss`

Override variables globally at the `:root` level or per light/dark mode selector:

```scss
/* styles.scss */
:root {
  /* Light Theme Skeleton Colors */
  --ngx-skeleton-base-color: #e2e8f0;
  --ngx-skeleton-highlight-color: #ffffff;
  --ngx-skeleton-animation-duration: 1.2s;
}

[data-theme='dark'] {
  /* Dark Theme Skeleton Colors */
  --ngx-skeleton-base-color: #1e293b;
  --ngx-skeleton-highlight-color: rgba(255, 255, 255, 0.12);
}
```

#### Local / Container-Level Override

Override skeleton styling for a specific component, section, or card:

```scss
/* user-card.component.scss */
.user-card-skeleton-container {
  --ngx-skeleton-base-color: #f1f5f9;
  --ngx-skeleton-highlight-color: #3b82f6;
}
```

---

### 2. Directive Styling Inputs (Width, Height, Radius, Shape)

You can pass explicit styling parameters directly on the directive microsyntax or input bindings:

| Input | Type | Default | Description | Example |
|---|---|---|---|---|
| `width` | `string` | `'100%'` | Custom skeleton width | `width: '240px'` or `width: '80%'` |
| `height` | `string` | `'1rem'` | Custom skeleton height | `height: '3rem'` or `height: '150px'` |
| `shape` | `'rectangle' \| 'circle'` | `'rectangle'` | Geometry of the skeleton node | `shape: 'circle'` |
| `size` | `string` | `undefined` | Square dimension or circle diameter | `size: '3.5rem'` |
| `borderRadius` | `string` | `undefined` | Custom border radius | `borderRadius: '12px'` or `borderRadius: '50%'` |

#### Example: Direct Input Customization

```html
<div
  *skeleton="
    isLoading;
    width: '100%';
    height: '200px';
    borderRadius: '16px';
    animation: 'wave'
  "
>
  <app-hero-banner />
</div>
```

---

### 3. Alignment & Stack Layouts (Flexbox & Grid Alignment)

`ngx-skeleton` supports flexible alignment across both preset stack structures and responsive grid layouts.

#### A. Alignment in Presets (`SkeletonStackNode`)

In custom tree presets, `SkeletonStackNode` allows complete flexbox alignment control:

```ts
import { SkeletonPreset } from 'ngx-skeleton';

export const ALIGNED_HEADER_PRESET: SkeletonPreset = {
  name: 'aligned-header',
  shapes: [
    {
      type: 'stack',
      direction: 'row',          // Horizontal layout ('row' | 'column')
      alignItems: 'center',       // Vertical alignment ('flex-start' | 'center' | 'flex-end' | 'stretch')
      justifyContent: 'space-between', // Horizontal distribution ('flex-start' | 'center' | 'space-between' | etc.)
      gap: '1.5rem',             // Flex gap
      children: [
        { type: 'shape', shape: 'circle', size: '3.5rem' },
        {
          type: 'stack',
          direction: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '0.5rem',
          grow: true,            // Flex grow: 1
          children: [
            { type: 'shape', width: '60%', height: '1.25rem' },
            { type: 'shape', width: '35%', height: '0.875rem' },
          ],
        },
        { type: 'shape', width: '80px', height: '2rem', borderRadius: '20px' }, // Action button
      ],
    },
  ],
};
```

#### B. Alignment in Grid Layouts (`SkeletonGridConfig`)

Align grid items vertically within their grid cells using `alignItems`:

```ts
readonly gridConfig: SkeletonGridConfig = {
  count: 6,
  columns: { default: 1, sm: 2, md: 3 },
  gap: '1.5rem',
  alignItems: 'center', // Align skeleton items in center of grid cells
  itemPreset: 'card',
};
```

---

### 4. Custom CSS & SCSS Overriding (`styleClass` & `containerClass`)

When custom SCSS classes or utility framework classes (e.g. Bootstrap or Tailwind) are required, `ngx-skeleton` provides direct hooks:

#### Directive `styleClass`

Applies custom CSS class(es) directly to underlying skeleton shapes:

```html
<div *skeleton="isLoading; styleClass: 'custom-skeleton-glow'">
  <app-content-box />
</div>
```

```scss
/* styles.scss */
.custom-skeleton-glow {
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
}
```

#### Preset `containerClass`

Applies custom CSS class(es) to the preset container host wrapper:

```ts
export const CUSTOM_CARD_PRESET: SkeletonPreset = {
  name: 'custom-card',
  containerClass: 'p-4 border-round-xl surface-card shadow-2', // PrimeFlex / PrimeNG utility classes
  shapes: [ ... ]
};
```

#### Targetable Internal CSS Classes

You can also target internal structural classes in component/global SCSS:

- `.ngx-skeleton-host`: The top-level skeleton wrapper element.
- `.ngx-skeleton-preset-item`: Host container for preset shape trees.
- `.ngx-skeleton-stack`: Internal flex containers generated by preset stacks.
- `.p-skeleton`: The PrimeNG underlying primitive node.

```scss
/* Custom SCSS override */
.ngx-skeleton-host .p-skeleton {
  border-radius: 8px !important;
}
```

---

### 5. PrimeNG Theme Synergy

`ngx-skeleton` seamlessly inherits active PrimeNG design system tokens (e.g. PrimeNG Aura, Lara, Nora, Material, or custom design tokens):

- Defaults to `--p-content-border-color` for standard background shading.
- Defaults to `--p-content-hover-background` for shimmer/wave highlights.
- Responds dynamically when switching PrimeNG themes at runtime.

---

## Detailed Usage Examples

### 1. Basic Boolean & Signal Loading

Bind directly to a `boolean` property, Angular `Signal<boolean>`, or `Observable<boolean>`:

```ts
import { Component, signal } from '@angular/core';
import { SkeletonDirective } from 'ngx-skeleton';

@Component({
  selector: 'app-basic-demo',
  standalone: true,
  imports: [SkeletonDirective],
  template: `
    <!-- Simple height & width override -->
    <div *skeleton="isLoading(); height: '140px'; shape: 'rectangle'">
      <div class="content-box">
        <h3>Dashboard Overview</h3>
        <p>Real-time analytics metric content</p>
      </div>
    </div>
  `
})
export class BasicDemoComponent {
  isLoading = signal<boolean>(true);
}
```

---

### 2. Data Source Binding via `from` Microsyntax

Bind directly to an `Observable<T>`, `Signal<T>`, or `Promise<T>` stream:

```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonDirective } from 'ngx-skeleton';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

@Component({
  selector: 'app-data-demo',
  standalone: true,
  imports: [CommonModule, SkeletonDirective],
  template: `
    <div *skeleton="let user from userPromise; preset: 'profile-card'">
      <div class="user-card" *ngIf="user">
        <img [src]="user.avatar" [alt]="user.name" class="avatar" />
        <div class="details">
          <h4>{{ user.name }}</h4>
          <p>{{ user.email }}</p>
        </div>
      </div>
    </div>
  `
})
export class DataDemoComponent {
  userPromise: Promise<UserProfile> = fetch('/api/user').then((res) => res.json());
}
```

---

### 3. Composite Shape Presets

Use pre-built presets (`profile-card`, `card`, `list-item`, `avatar`, `paragraph`, `table-row`, `image-card`):

```html
<!-- Profile Card Preset -->
<div *skeleton="isLoading; preset: 'profile-card'">
  <app-profile-widget />
</div>

<!-- List Item Preset -->
<div *skeleton="isLoading; preset: 'list-item'; count: 5">
  <app-list-row />
</div>

<!-- Table Row Preset -->
<div *skeleton="isLoading; preset: 'table-row'; count: 10">
  <tr *ngFor="let row of rows">...</tr>
</div>
```

---

### 4. Responsive CSS Grid Generation

Generate dynamic CSS grid skeletons without duplicating HTML markup:

```ts
import { Component } from '@angular/core';
import { SkeletonDirective, SkeletonGridConfig } from 'ngx-skeleton';

@Component({
  selector: 'app-grid-demo',
  standalone: true,
  imports: [SkeletonDirective],
  template: `
    <div *skeleton="isLoading; grid: productGrid">
      <div class="products-container">
        <div *ngFor="let item of products" class="product-card">
          <h4>{{ item.title }}</h4>
          <p>\${{ item.price }}</p>
        </div>
      </div>
    </div>
  `
})
export class GridDemoComponent {
  isLoading = true;

  readonly productGrid: SkeletonGridConfig = {
    count: 6,
    minItemWidth: '16rem',
    gap: '1.5rem',
    itemPreset: 'card',
  };
}
```

---

### 5. Animation Engines & Reduced Motion

Supports 5 animation modes (`wave`, `shimmer`, `pulse`, `prime`, `none`):

```html
<!-- Smooth Wave Sweep Animation -->
<div *skeleton="isLoading; animation: 'wave'">...</div>

<!-- Shimmer Light Reflecting Animation -->
<div *skeleton="isLoading; animation: 'shimmer'">...</div>

<!-- Gentle Opacity Pulse Animation -->
<div *skeleton="isLoading; animation: 'pulse'">...</div>
```

> [!NOTE]
> All animations automatically disable when the user's OS specifies `prefers-reduced-motion: reduce`.

---

### 6. Flicker Protection & Timing Controls

Prevent UI flickering on fast network responses using `delay` and `minimumDuration`:

```html
<div
  *skeleton="
    isLoading;
    delay: 100;
    minimumDuration: 300;
    fadeIn: 250
  "
>
  <app-fast-data-widget />
</div>
```

- **`delay: 100`**: Waits 100ms before displaying the skeleton. Fast requests (<100ms) show no skeleton at all.
- **`minimumDuration: 300`**: Keeps the skeleton visible for at least 300ms if displayed, preventing instantaneous flashes.
- **`fadeIn: 250`**: Applies a 250ms opacity fade-in transition when real content swaps in.

---

### 7. Layout Shift (CLS) Prevention

Prevent layout collapse during view swaps:

```html
<div
  *skeleton="
    isLoading;
    preserveLayout: true;
    layoutKey: 'user-profile-widget'
  "
>
  <app-dynamic-content />
</div>
```

---

### 8. Error & Empty State Templates

Gracefully render custom empty and error states:

```html
<div
  *skeleton="
    let items from itemsStream$;
    empty: emptyTpl;
    error: errorTpl;
    emptyWhen: isListEmpty
  "
>
  <div *ngFor="let item of items" class="item-row">{{ item.name }}</div>
</div>

<ng-template #emptyTpl>
  <div class="empty-state">No matching records found.</div>
</ng-template>

<ng-template #errorTpl let-err>
  <div class="error-state">Failed to load data: {{ err }}</div>
</ng-template>
```

---

### 9. Custom Tree-Based Presets

Define hierarchical preset node trees with rows, columns, gaps, and shapes:

```ts
import { SkeletonPreset } from 'ngx-skeleton';

export const COMPOSITE_ARTICLE_PRESET: SkeletonPreset = {
  name: 'article-header',
  shapes: [
    {
      type: 'stack',
      direction: 'column',
      gap: '1rem',
      children: [
        { type: 'shape', shape: 'rectangle', width: '100%', height: '14rem' },
        {
          type: 'stack',
          direction: 'row',
          gap: '0.75rem',
          alignItems: 'center',
          children: [
            { type: 'shape', shape: 'circle', size: '3rem' },
            {
              type: 'stack',
              direction: 'column',
              gap: '0.25rem',
              grow: true,
              children: [
                { type: 'shape', width: '50%', height: '1rem' },
                { type: 'shape', width: '30%', height: '0.75rem' },
              ],
            },
          ],
        },
      ],
    },
  ],
};
```

---

### 10. Unit Testing with `SkeletonHarness`

Test consuming components easily in Angular `TestBed`:

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonHarness } from 'ngx-skeleton';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let fixture: ComponentFixture<MyComponent>;
  let harness: SkeletonHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    harness = SkeletonHarness.for(fixture);
  });

  it('should display skeleton host while loading', () => {
    fixture.componentInstance.isLoading = true;
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeTrue();
    expect(harness.getAnimation()).toBe('wave');
  });
});
```

---

## Complete API Reference

### `SkeletonDirective` Inputs

| Input Property | Type | Default | Description |
|---|---|---|---|
| `*skeleton` | `boolean \| Signal<boolean> \| Observable<boolean>` | `undefined` | Primary loading state |
| `from` | `Observable<T> \| Signal<T> \| PromiseLike<T>` | `undefined` | Data-producing async source |
| `preset` | `string \| SkeletonPreset` | `undefined` | Named preset or tree definition |
| `grid` | `SkeletonGridConfig` | `undefined` | Responsive CSS grid configuration |
| `width` | `string` | `'100%'` | Custom skeleton width (e.g. `'200px'`, `'80%'`) |
| `height` | `string` | `'1rem'` | Custom skeleton height (e.g. `'2rem'`, `'150px'`) |
| `shape` | `'rectangle' \| 'circle'` | `'rectangle'` | Geometry shape of skeleton item |
| `size` | `string` | `undefined` | Square dimension or circle diameter (e.g. `'3rem'`) |
| `borderRadius` | `string` | `undefined` | Custom border radius (e.g. `'12px'`, `'50%'`) |
| `count` | `number` | `1` | Number of skeleton items to repeat |
| `styleClass` | `string` | `undefined` | Custom CSS class(es) passed to `<p-skeleton>` nodes |
| `animation` | `'prime' \| 'pulse' \| 'shimmer' \| 'wave' \| 'none'` | `'prime'` | Animation engine mode |
| `delay` | `number` | `80` | Delay timer in ms before displaying skeleton |
| `minimumDuration` | `number` | `200` | Minimum visible duration in ms |
| `fadeIn` | `boolean \| number` | `180` | Content fade-in transition duration |
| `preserveLayout` | `boolean` | `false` | Enable layout shift (CLS) prevention |
| `layoutKey` | `string` | `instanceId` | Key for layout bounds caching |
| `empty` | `TemplateRef<unknown>` | `undefined` | Template rendered when data is empty |
| `error` | `TemplateRef<{ $implicit: unknown }>` | `undefined` | Template rendered on stream error |

---

## License
MIT

# `ngx-skeleton-suite` — Declarative, Renderer-Agnostic Angular Skeletons

`ngx-skeleton-suite` is an enterprise-grade structural directive suite for Angular applications.
It eliminates repeated loading boilerplate, handles Signals, RxJS Observables, and Promises,
generates responsive CSS grids, prevents Cumulative Layout Shift (CLS), and provides
SSR/hydration safety out of the box.

Rendering is **renderer-agnostic**: the suite ships a dependency-free native CSS renderer by
default, and optional adapters for PrimeNG and Angular Material. Install only the UI library you
already use.

🌐 **[Live Astro Starlight Documentation Portal](https://MahmoudAdelJR.github.io/ngx-skeleton-suite/)**  
⚡ **[Live Angular Interactive Demo App & Playground](https://MahmoudAdelJR.github.io/ngx-skeleton-suite/demo/)**  
📖 **[Read Full Developer Documentation & API Guide](DOCUMENTATION.md)**

---

## Quick Compatibility

| `ngx-skeleton-suite` Version | Angular Core | RxJS | PrimeNG adapter | Material adapter |
|---|---|---|---|---|
| `2.0.0` | `>= 18.0.0 < 23.0.0` | `>= 7.4.0` | match your Angular major (`primeng >= 17 < 24`) | `ngx-skeleton-loader >= 11` |

`primeng` and `ngx-skeleton-loader` are **optional peer dependencies** — they are only required
if you register the matching adapter. PrimeNG majors track Angular majors (PrimeNG 20 → Angular 20),
so use the PrimeNG major that matches your Angular major. See `CHANGELOG.md` for the breaking
changes in 2.0.0.

---

## Features

- ⚡ **Declarative Structural Directive**: Simplify templates with `*skeleton="isLoading"`.
- 🧩 **Renderer Adapters**: Native CSS (default), PrimeNG, and Angular Material; add your own via
  a documented renderer contract.
- 🔄 **Universal Source Support**: Accepts `boolean`, `Signal<boolean>`, `Observable<boolean>`,
  Promises, or data streams (`*skeleton="let user from user$"`).
- 🎨 **Full Styling & Theme Customization**: CSS variables (`--ngx-skeleton-base-color`,
  `--ngx-skeleton-highlight-color`), alignment controls, shape & size inputs, class hooks
  (`styleClass`).
- ✨ **Custom Animation Engine**: `adapter-default`, `wave`, `shimmer`, `pulse`, and `none`.
- 📐 **Responsive CSS Grid Generation**: Auto-fit or breakpoint-based grid placeholders.
- 🎯 **Composite Presets**: Pre-built shapes (`profile-card`, `card`, `list-item`, `avatar`,
  `paragraph`, `table-row`) and custom tree definitions.
- 🛡️ **Flicker Protection & Minimum Duration**: Delay timer (`skeletonDelay`) and minimum visible
  duration (`skeletonMinimumDuration`).
- 📐 **Layout Shift (CLS) Prevention**: Multi-level layout reservation and `ResizeObserver`
  dimension caching.
- 🌐 **SSR & Hydration Safe**: Platform-aware abstractions guarantee zero server-side rendering
  exceptions.
- ♿ **Accessible & Reduced Motion**: Provides status semantics and honors
  `prefers-reduced-motion`.

---

## Installation

```bash
npm install ngx-skeleton-suite
```

That is all you need for the default native CSS renderer. To use a UI-library renderer, install the
adapter's peer as well:

```bash
# PrimeNG adapter
npm install ngx-skeleton-suite primeng

# Material adapter (community package)
npm install ngx-skeleton-suite ngx-skeleton-loader
```

---

## Quick Usage Example (Standalone Component)

```ts
import { Component, signal } from '@angular/core';
import { SkeletonDirective } from 'ngx-skeleton-suite';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SkeletonDirective],
  template: `
    <div *skeleton="isLoading(); height: '12rem'; animation: 'wave'">
      <app-user-card [user]="user()" />
    </div>
  `,
})
export class UserProfileComponent {
  isLoading = signal(true);
}
```

---

## Renderer Adapters

Provide an adapter once at bootstrap; the directive and presets stay unchanged.

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideNgxSkeleton } from 'ngx-skeleton-suite';
import { providePrimeNgSkeleton } from 'ngx-skeleton-suite/primeng';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxSkeleton({ animation: 'adapter-default' }),
    providePrimeNgSkeleton(), // renders with <p-skeleton>
  ],
};
```

```ts
// Material adapter (backed by ngx-skeleton-loader)
import { provideMaterialSkeleton } from 'ngx-skeleton-suite/material';
```

Omit any adapter provider to use the native CSS renderer.

### Testing

```ts
import { SkeletonHarness } from 'ngx-skeleton-suite/testing';
```

The harness is renderer-neutral and works against any adapter.

---

## Quick Usage Example (NgModule Legacy Applications)

```ts
import { NgModule } from '@angular/core';
import { NgxSkeletonModule } from 'ngx-skeleton-suite';

@NgModule({
  imports: [NgxSkeletonModule],
  declarations: [LegacyUserProfileComponent],
})
export class UserModule {}
```

---

## Documentation & API Index
- 🌐 **[Live Astro Starlight Documentation Portal](https://MahmoudAdelJR.github.io/ngx-skeleton-suite/)**
- ⚡ **[Live Interactive Demo App & Playground](https://MahmoudAdelJR.github.io/ngx-skeleton-suite/demo/)**
- 📖 **[Developer Documentation & API Guide](DOCUMENTATION.md)**

---

## License
MIT
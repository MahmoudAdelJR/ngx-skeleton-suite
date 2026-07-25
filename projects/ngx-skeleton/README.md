# `ngx-skeleton-suite` — Declarative Angular + PrimeNG Skeleton Directive

`ngx-skeleton-suite` is an enterprise-grade structural directive suite for Angular applications that seamlessly composes PrimeNG's `p-skeleton` component. It eliminates repeated loading boilerplate, handles Signals, RxJS Observables, and Promises, generates responsive CSS grids, prevents Cumulative Layout Shift (CLS), and provides SSR/hydration safety out of the box.

👉 **[Read Full Developer Documentation & API Guide](DOCUMENTATION.md)**

---

## Quick Compatibility

| `ngx-skeleton-suite` Version | Angular Core | PrimeNG Version | RxJS Version |
|---|---|---|---|
| `1.0.0` | `>= 18.0.0 < 23.0.0` | `>= 17.0.0 < 23.0.0` | `>= 7.4.0` |

---

## Features

- ⚡ **Declarative Structural Directive**: Simplify templates with `*skeleton="isLoading"`.
- 🔄 **Universal Source Support**: Accepts `boolean`, `Signal<boolean>`, `Observable<boolean>`, Promises, or data streams (`*skeleton="let user from user$"`).
- 🎨 **Full Styling & Theme Customization**: Custom CSS variables (`--ngx-skeleton-base-color`, `--ngx-skeleton-highlight-color`), alignment controls, shape & size inputs, custom SCSS class hooks (`styleClass`), and PrimeNG theme integration.
- ✨ **Custom Animation Engine**: Supports `wave`, `shimmer`, `pulse`, `prime`, and `none` modes.
- 📐 **Responsive CSS Grid Generation**: Auto-fit or breakpoint-based grid placeholders.
- 🎯 **Composite Presets**: Pre-built shapes (`profile-card`, `card`, `list-item`, `avatar`, `paragraph`, `table-row`) and custom tree definitions.
- 🛡️ **Flicker Protection & Minimum Duration**: Delay timer (`skeletonDelay`) and minimum visible duration (`skeletonMinimumDuration`).
- 📐 **Layout Shift (CLS) Prevention**: Multi-level layout reservation and `ResizeObserver` dimension caching.
- 🌐 **SSR & Hydration Safe**: Platform-aware abstractions guarantee zero server-side rendering exceptions.
- ♿ **Accessible & Reduced Motion**: Tags `aria-busy` and honors `prefers-reduced-motion`.

---

## Installation

```bash
npm install ngx-skeleton-suite
```

### Quick Usage Example (Standalone Component)

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
  `
})
export class UserProfileComponent {
  isLoading = signal(true);
}
```

### Quick Usage Example (NgModule Legacy Applications)

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
For full tutorials, custom preset creation, grid generation, SSR guides, and unit testing harness usage, read [`DOCUMENTATION.md`](DOCUMENTATION.md).

---

## License
MIT

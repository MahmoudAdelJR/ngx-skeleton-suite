# `ngx-skeleton-suite`

An enterprise-grade, declarative structural directive suite for Angular applications that seamlessly composes PrimeNG's `p-skeleton` primitive.

👉 **[Read Full Technical Documentation & API Guide](projects/ngx-skeleton/DOCUMENTATION.md)**

---

## Highlights & Features

- ⚡ **Declarative Structural Directive**: Clean `*skeleton="isLoading"` template syntax.
- 🔄 **Universal Async Source Support**: Signals, Observables, Promises, or data streams (`*skeleton="let user from user$"`).
- 🎨 **Extensive Styling & Theme Customization**: Custom CSS variables (`--ngx-skeleton-base-color`, `--ngx-skeleton-highlight-color`), alignment controls, shape & size inputs, custom SCSS class hooks (`styleClass`), and PrimeNG theme synergy.
- ✨ **Custom Animation Engine**: `wave`, `shimmer`, `pulse`, `prime`, and `none` modes.
- 📐 **Responsive CSS Grid Generation**: Auto-fit or breakpoint-based grid placeholders.
- 🎯 **Composite Presets & Custom Trees**: Pre-built presets (`profile-card`, `card`, `list-item`, `avatar`, `paragraph`, `table-row`) and nested flex tree structures.
- 🛡️ **Flicker Protection & Timing Controls**: Delay timer (`skeletonDelay`) and minimum visible duration (`skeletonMinimumDuration`).
- 📐 **Layout Shift (CLS) Prevention**: Multi-level layout reservation and `ResizeObserver` dimension caching.
- 🌐 **SSR & Hydration Safe**: 100% platform-aware execution.

---

## Quick Usage Example

```ts
import { Component, signal } from '@angular/core';
import { SkeletonDirective } from 'ngx-skeleton-suite';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SkeletonDirective],
  template: `
    <div *skeleton="isLoading(); height: '12rem'; animation: 'wave'; styleClass: 'custom-card-skeleton'">
      <app-user-card [user]="user()" />
    </div>
  `
})
export class UserProfileComponent {
  isLoading = signal(true);
}
```

### Styling Example (CSS Variables)

```scss
/* styles.scss */
:root {
  --ngx-skeleton-base-color: #e2e8f0;
  --ngx-skeleton-highlight-color: #ffffff;
}
```

---

## Documentation Links

- 📖 **[Developer Documentation & Customization Guide](projects/ngx-skeleton/DOCUMENTATION.md)**
- 📦 **[Package Source Code](projects/ngx-skeleton)**

---

## License

MIT

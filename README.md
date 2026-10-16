# `ngx-skeleton-suite`

An enterprise-grade, declarative, renderer-agnostic structural directive suite for Angular. Ships a dependency-free native CSS renderer by default plus optional PrimeNG and Angular Material adapters.

🌐 **[Live Astro Starlight Documentation Portal](https://MahmoudAdelJR.github.io/ngx-skeleton-suite/)**  
⚡ **[Live Angular Interactive Demo App & Playground](https://MahmoudAdelJR.github.io/ngx-skeleton-suite/demo/)**  
📖 **[Read Technical Documentation & API Guide](projects/ngx-skeleton/DOCUMENTATION.md)**

---

## Highlights & Features

- ⚡ **Declarative Structural Directive**: Clean `*skeleton="isLoading"` template syntax.
- 🔄 **Universal Async Source Support**: Signals, Observables, Promises, or data streams (`*skeleton="let user from user$"`).
- 🧩 **Renderer Adapters**: Native CSS (default), PrimeNG, and Angular Material; add your own via a documented renderer contract.
- 🎨 **Extensive Styling & Theme Customization**: Custom CSS variables (`--ngx-skeleton-base-color`, `--ngx-skeleton-highlight-color`), alignment controls, shape & size inputs, and class hooks (`styleClass`).
- ✨ **Custom Animation Engine**: `adapter-default`, `wave`, `shimmer`, `pulse`, and `none` modes.
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

### Renderer Adapters

```ts
import { providePrimeNgSkeleton } from 'ngx-skeleton-suite/primeng';
import { provideMaterialSkeleton } from 'ngx-skeleton-suite/material';

// app.config.ts providers: [...]
// Native CSS is the default; register one of the above to render with a UI library.
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

- 🌐 **[Live Astro Starlight Documentation Portal](https://MahmoudAdelJR.github.io/ngx-skeleton-suite/)**
- ⚡ **[Live Interactive Demo App & Playground](https://MahmoudAdelJR.github.io/ngx-skeleton-suite/demo/)**
- 📖 **[Developer Documentation & Customization Guide](projects/ngx-skeleton/DOCUMENTATION.md)**
- 📦 **[Package Source Code](projects/ngx-skeleton)**

---

## License

MIT

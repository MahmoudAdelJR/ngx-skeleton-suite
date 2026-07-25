# Phase 3: Presets, Animations & Global Provider (v0.3.0)

## Objective
Introduce composite skeleton presets, customizable animation modes (pulse, shimmer, wave, prime, none), RTL support, and a tree-shakable global provider `provideNgxSkeleton()`.

## Key Features & Deliverables
1. **Global Configuration Provider**:
   - `provideNgxSkeleton(config)` for application-wide default animation, timing (`fadeInMs`, `delayMs`, `minimumDurationMs`), layout preservation, and reduced motion settings.
2. **Built-in & Custom Presets**:
   - Preset registry `SkeletonPresetRegistry`.
   - Built-in presets: `line`, `paragraph`, `avatar`, `list-item`, `card`, `profile-card`, `table-row`, `image-card`.
   - Custom preset registration via `provideSkeletonPresets([...])`.
3. **Animation Engine**:
   - Animations: `pulse`, `shimmer`, `wave`, `prime` (PrimeNG native), `none`.
   - Accessible reduced-motion handling (`prefers-reduced-motion: reduce`).
4. **RTL & CSS Custom Properties**:
   - RTL support using logical CSS properties and directional animation reversal.
   - CSS tokens for base color, highlight color, and animation durations.

## Definition of Done (DoD)
- Presets can be referenced by name (`preset: 'profile-card'`) or passed as custom shape trees.
- `provideNgxSkeleton` cleanly sets global fallbacks overridden by directive inputs.
- Animation keyframes run smoothly in both light and dark mode as well as RTL layouts.

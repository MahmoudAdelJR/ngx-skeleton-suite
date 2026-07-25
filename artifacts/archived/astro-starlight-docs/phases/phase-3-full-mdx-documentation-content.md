# Phase 3 Spec: Comprehensive MDX Documentation Chapters & Live Embeds

## Objective
Write 8 comprehensive, high-quality MDX documentation chapters in `docs/src/content/docs/` covering every aspect of `ngx-skeleton-suite`, with embedded live runnable web component widgets and copyable code blocks.

## Requirements
1. `index.mdx` — Landing Hero page with feature grid, quick copy command, and instant launch buttons.
2. `getting-started.mdx` — Installation (`npm i ngx-skeleton-suite`), standalone imports, global `provideSkeletonConfig`, and basic template directive syntax.
3. `styling-and-themes.mdx` — CSS Custom Properties (`--ngx-skeleton-base-color`, `--ngx-skeleton-highlight-color`), SCSS class hooks, directive inline style inputs, and PrimeNG theme synergy with live color pickers.
4. `presets-catalog.mdx` — Detailed docs for all 7 built-in presets (`card`, `profile-card`, `avatar`, `list-item`, `paragraph`, `table-row`, `image-card`) with live runnable previews.
5. `responsive-grid.mdx` — Grid engine documentation for `auto-fit` layouts, fixed column counts (1, 2, 3, 4), and responsive breakpoint objects (`{ sm: 2, md: 4, lg: 6 }`) with live interactive grid switcher.
6. `async-sources.mdx` — Universal async source binding for Promises, RxJS Observables, and Angular Signals (`*skeleton="let user from user$"`).
7. `cls-stability.mdx` — Layout shift protection (`preserveLayout`), 40ms rapid fetch simulator (`delay`), and `minimumDuration`.
8. `api-reference.mdx` — Full searchable API reference table listing all 18 input properties, default values, and description.
9. `playground.mdx` — Full-featured interactive sandbox code generator.

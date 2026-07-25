# Phase 1 Spec: Astro Starlight Foundation & VoiceBox Theme Config

## Objective
Initialize an Astro Starlight documentation project under `docs/`, configure `@astrojs/starlight`, customize theme CSS to reflect VoiceBox editorial branding (`#0a0a0a`, `#ef4444`, 0px border-radius), and set up root `package.json` scripts (`dev:docs`, `build:docs`).

## Requirements
- Create `docs/astro.config.mjs`, `docs/package.json`, `docs/src/content/config.ts`, `docs/src/content/docs/`.
- Configure Starlight sidebar navigation for all 8 chapters:
  - Getting Started
  - Styling & Themes
  - Presets Catalog
  - Responsive Grid
  - Async Sources
  - Stability & CLS
  - API Reference
  - Live Playground
- Apply VoiceBox CSS overrides in `docs/src/styles/starlight-custom.css` (0px border-radius, black/red headers, custom fonts).
- Verify basic Astro dev & build scripts.

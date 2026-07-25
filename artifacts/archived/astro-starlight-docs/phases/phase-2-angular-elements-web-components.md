# Phase 2 Spec: Angular Elements Web Components Build

## Objective
Package `ngx-skeleton-suite` interactive demo components into standalone Custom Web Components (Angular Elements `<ngx-skeleton-demo-card>`, `<ngx-skeleton-grid-demo>`, `<ngx-skeleton-playground>`) so they can be loaded directly inside Astro Starlight MDX pages without extra iframe overhead.

## Requirements
- Create Angular Elements entry component or exporter in `projects/demo-app/src/app/wc-entry.ts`.
- Expose Custom Elements `<ngx-skeleton-demo-card>`, `<ngx-skeleton-grid-demo>`, `<ngx-skeleton-playground>`.
- Copy or link compiled Web Component bundle into `docs/public/` so Starlight MDX pages can load `<script src="/ngx-skeleton-elements.js"></script>`.
- Verify custom elements register cleanly in standard HTML and MDX pages.

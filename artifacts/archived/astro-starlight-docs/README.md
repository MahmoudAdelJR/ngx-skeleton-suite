# Feature: Astro Starlight Full Documentation Site (`astro-starlight-docs`)

## Overview
Build a full-featured, production-ready Astro Starlight documentation portal located in `docs/` with embedded live runnable Angular Elements Web Components in MDX pages, VoiceBox editorial styling, and static site generation (SSG) for GitHub Pages / Cloudflare Pages / Vercel.

## Phase Execution Matrix

| Phase | Description | Status | Output Artifact |
|---|---|---|---|
| **Phase 1** | Astro Starlight Foundation & VoiceBox Theme Config | ✅ Completed | [`outputs/phase-1-output.md`](outputs/phase-1-output.md) |
| **Phase 2** | Angular Elements Web Components Build | ✅ Completed | [`outputs/phase-2-output.md`](outputs/phase-2-output.md) |
| **Phase 3** | Comprehensive MDX Documentation Chapters & Live Embeds | ✅ Completed | [`outputs/phase-3-output.md`](outputs/phase-3-output.md) |
| **Phase 4** | SSG Build Verification & PlanKit Review | ✅ Completed | [`outputs/phase-4-output.md`](outputs/phase-4-output.md) |

---

## Target Definition of Done (DoD)
- [ ] Astro Starlight application initialized in `docs/` with package.json scripts (`npm run dev:docs`, `npm run build:docs`).
- [ ] Angular Elements custom web component bundle compiled and embedded cleanly in Starlight MDX pages.
- [ ] 8 comprehensive documentation chapters written in MDX with live runnable component widgets.
- [ ] VoiceBox editorial design system tokens (black `#0a0a0a`, red accent `#ef4444`, 0px border-radius) applied to Starlight theme.
- [ ] Full SSG build verified with 0 errors via `npm run build:docs` yielding static output in `dist/docs`.

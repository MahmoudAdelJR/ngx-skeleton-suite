# Feature Plan: Documentation UI Restructure (`documentation-ui-restructure`)

Transform the `demo-app` into a world-class, magazine-style documentation portal adhering strictly to the **VoiceBox** design system ([`DESIGN.md`](file:///G:/Study/ngx-skeleton-suite/DESIGN.md)). The layout will feature a persistent doc sidebar, structured documentation chapters with embedded live demos, a right-side "On This Page" TOC, and a full-screen interactive Playground.

---

## Progress & Phase Status

| Phase | Description | Status | Target Output |
|---|---|---|---|
| **Phase 1** | Classic Documentation Layout & Sidebar Navigation Shell | ✅ Completed | [`outputs/phase-1-output.md`](outputs/phase-1-output.md) |
| **Phase 2** | Chapter-Based Doc Content & Inline Interactive Widgets | ✅ Completed | [`outputs/phase-2-output.md`](outputs/phase-2-output.md) |
| **Phase 3** | Full-Featured Interactive Playground & Live Code Generator | ✅ Completed | [`outputs/phase-3-output.md`](outputs/phase-3-output.md) |
| **Phase 4** | Quick Search, Mobile Drawer & Build Verification | ✅ Completed | [`outputs/phase-4-output.md`](outputs/phase-4-output.md) |

---

## Architectural Goals
1. **Classic Doc Hierarchy**: Top Bar + Left Collapsible Nav Sidebar + Main Reading Area + Right "On this page" TOC.
2. **VoiceBox Editorial Aesthetic**: High-contrast black/white palette (`#0A0A0A`, `#FAFAFA`), sharp `0px` radius, thick `2px` black borders, and red (`#EF4444`) accent underlines.
3. **Interactive Embedded Demos**: Inline live skeleton sandboxes in every chapter (Styling, Presets, Grids, Async, CLS, API).
4. **Interactive Playground**: Dedicated sandbox with live controls, CSS variable pickers, and dynamic code generation with 1-click copy.

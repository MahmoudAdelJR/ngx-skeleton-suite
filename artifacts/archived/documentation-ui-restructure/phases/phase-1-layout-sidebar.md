## Clarified User Design Preferences
- **Default Landing**: Documentation Reader View (Opens to Getting Started with quick launch link to Playground).
- **Layout Shell**: Three-Column Docs Layout (Fixed Top Header + Left Chapter Sidebar + Central Article Area + Right "On This Page" TOC).
- **Design System**: VoiceBox editorial style (`#0A0A0A`, `#EF4444`, `#FAFAFA`, sharp `0px` corners, `2px` black borders, red active underline).

## Detailed Tasks
1. **Header Component**:
   - Logo block: `NGX-SKELETON // v1.0`
   - Top links: `Docs`, `Playground`, `API Reference`, `GitHub`
   - Quick launch button: `LAUNCH PLAYGROUND ⚡`
2. **Left Navigation Sidebar**:
   - Categorized navigation groups:
     - 🚀 Getting Started (Overview, Installation, Provider Setup)
     - 🎨 Styling & SCSS (CSS Variables, Inputs, Flex Alignment)
     - 🎯 Presets Catalog (Built-in, Custom Trees)
     - 📐 Layouts & Grids (Responsive CSS Grid Engine)
     - 🔄 Async Sources (Promises, Signals, Observables)
     - 🛡️ Stability & CLS (Flicker Protection, Layout Preservation)
     - 📖 API Reference (Directives, Context Guard)
3. **Right TOC Sidebar ("On This Page")**:
   - Sticky jump-links reflecting heading anchors of the current chapter.
4. **VoiceBox Styling**:
   - Pure black/white contrast, sharp `0px` edges, `2px` black borders, and active red (`#EF4444`) border indicator.

## Definition of Done
- Top header, left sidebar, main content area, and right TOC column render smoothly.
- Clicking sidebar links smoothly switches active documentation section.

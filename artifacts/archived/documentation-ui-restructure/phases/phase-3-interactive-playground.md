## Clarified User Preferences for Phase 3
- **Playground Accessibility**: Dedicated Full-Page Playground & Quick Drawer Launcher (Accessible via left sidebar tab or header top launch button).
- **Theme Controls**: Live Color Pickers + Reset Theme Button (Custom hex color pickers updating `--ngx-skeleton-base-color` and `--ngx-skeleton-highlight-color` with instant reset).
- **Code Generator Output**: Template HTML Syntax + Standalone Component Imports Snippet (Separate copyable HTML and TypeScript import blocks).

## Detailed Tasks
1. **Interactive Playground Control Panel**:
   - Preset dropdown (`profile-card`, `card`, `list-item`, `avatar`, `paragraph`, `table-row`, `image-card`)
   - Animation engine radio buttons (`wave`, `shimmer`, `pulse`, `prime`, `none`)
   - Sliders for repeat count (1-5), delay (0-300ms), minimum duration (0-1000ms), fade-in (0-500ms)
   - Live color pickers for Base Color & Highlight Color + "RESET TO DEFAULT THEME" button
2. **Live Component Sandbox**:
   - Interactive canvas with "TOGGLE SKELETON STATE" button to switch between skeleton loading and real rendered user card content.
3. **Dual Code Generator Blocks**:
   - Copyable HTML template directive snippet: `<div *skeleton="...">`
   - Copyable TypeScript import snippet: `import { SkeletonDirective } from 'ngx-skeleton-suite';`

## Definition of Done
- Playground provides complete live control over all directive inputs and CSS variables with dual copyable code snippets.

import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  SkeletonDirective,
  SkeletonAnimation,
  SkeletonGridConfig,
  SkeletonPreset,
} from '../../../../projects/ngx-skeleton/src/public-api';

interface UserProfile {
  id: number;
  name: string;
  role: string;
  avatar: string;
  repos: number;
  stars: number;
}

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  image: string;
}

interface ApiProperty {
  name: string;
  type: string;
  default: string;
  description: string;
}

interface TocItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  // Navigation active tab — Default: 'quickstart' (Documentation Reader View)
  activeTab: 'quickstart' | 'styling' | 'presets' | 'grid' | 'async' | 'cls' | 'api' | 'playground' = 'quickstart';

  // Mobile sidebar drawer state
  isMobileSidebarOpen = false;

  // Loading state control
  readonly isLoading = signal<boolean>(true);

  // Playground Config State
  selectedPreset = 'profile-card';
  selectedAnimation: SkeletonAnimation = 'wave';
  customWidth = '100%';
  customHeight = '1.25rem';
  customShape: 'rectangle' | 'circle' = 'rectangle';
  customBorderRadius = '0px';
  customCount = 1;
  delayMs = 80;
  minDurationMs = 200;
  fadeInDuration = 250;
  preserveLayout = true;
  customStyleClass = '';
  customBaseColor = '#1e293b';
  customHighlightColor = 'rgba(255, 255, 255, 0.15)';

  // Copy status feedback
  copyStatus = 'COPY CODE';

  // Grid tab state
  gridColsMode: 'cols-1' | 'cols-2' | 'cols-3' | 'cols-4' | 'auto-fit' | 'responsive-breakpoints' = 'cols-2';

  // Async stream demo sources
  userPromise: Promise<UserProfile> | undefined = undefined;
  userStream$ = new Subject<UserProfile>();
  asyncLoading$ = new BehaviorSubject<boolean>(true);

  // Preset list
  readonly presetsList: string[] = [
    'profile-card',
    'card',
    'list-item',
    'avatar',
    'paragraph',
    'table-row',
    'image-card',
  ];

  // API Reference Data
  apiSearchQuery = '';
  readonly apiProperties: ApiProperty[] = [
    { name: '*skeleton', type: 'boolean | Signal<boolean> | Observable<boolean>', default: 'undefined', description: 'Primary loading state trigger' },
    { name: 'from', type: 'Observable<T> | Signal<T> | Promise<T>', default: 'undefined', description: 'Data source binding via microsyntax (*skeleton="let user from user$")' },
    { name: 'preset', type: 'string | SkeletonPreset', default: 'undefined', description: 'Named composite shape preset or custom tree structure' },
    { name: 'grid', type: 'SkeletonGridConfig', default: 'undefined', description: 'Responsive CSS Grid layout configuration' },
    { name: 'animation', type: "'wave' | 'shimmer' | 'pulse' | 'prime' | 'none'", default: "'prime'", description: 'Animation engine mode' },
    { name: 'width', type: 'string', default: "'100%'", description: 'Custom width string (e.g. "250px", "80%")' },
    { name: 'height', type: 'string', default: "'1rem'", description: 'Custom height string (e.g. "2rem", "150px")' },
    { name: 'shape', type: "'rectangle' | 'circle'", default: "'rectangle'", description: 'Geometric shape of skeleton elements' },
    { name: 'size', type: 'string', default: 'undefined', description: 'Square dimension or circle diameter (e.g. "3.5rem")' },
    { name: 'borderRadius', type: 'string', default: 'undefined', description: 'Custom border radius (e.g. "0px", "12px", "50%")' },
    { name: 'count', type: 'number', default: '1', description: 'Number of skeleton items to repeat' },
    { name: 'styleClass', type: 'string', default: 'undefined', description: 'Custom CSS class(es) passed to underlying skeleton elements' },
    { name: 'delay', type: 'number', default: '80', description: 'Delay timer in milliseconds before displaying skeleton (flicker protection)' },
    { name: 'minimumDuration', type: 'number', default: '200', description: 'Minimum visible duration in ms to prevent instantaneous flashing' },
    { name: 'fadeIn', type: 'boolean | number', default: '180', description: 'Content entrance fade-in duration in milliseconds' },
    { name: 'preserveLayout', type: 'boolean', default: 'false', description: 'Prevents Cumulative Layout Shift (CLS) using size caching' },
    { name: 'layoutKey', type: 'string', default: 'instanceId', description: 'Key for layout caching per view element' },
    { name: 'empty', type: 'TemplateRef<unknown>', default: 'undefined', description: 'Template rendered when data source is empty' },
    { name: 'error', type: 'TemplateRef<{ $implicit: unknown }>', default: 'undefined', description: 'Template rendered on async stream error' },
  ];

  // Right Sidebar "On This Page" Table of Contents Anchors per Chapter
  readonly activeChapterToc = computed<TocItem[]>(() => {
    switch (this.activeTab) {
      case 'quickstart':
        return [
          { id: 'npm-installation', label: '01. NPM Installation' },
          { id: 'standalone-usage', label: '02. Standalone Component' },
          { id: 'global-provider', label: '03. Global Provider Config' },
        ];
      case 'styling':
        return [
          { id: 'css-variables', label: '01. CSS Custom Properties' },
          { id: 'directive-inputs', label: '02. Directive Inputs' },
          { id: 'alignment-controls', label: '03. Flexbox & Stack Layouts' },
          { id: 'custom-classes', label: '04. SCSS Class Overrides' },
        ];
      case 'presets':
        return [
          { id: 'preset-gallery', label: '01. Preset Gallery' },
          { id: 'preset-structure', label: '02. Tree Node Specs' },
        ];
      case 'grid':
        return [
          { id: 'grid-autofit', label: '01. Auto-Fit Min-Width' },
          { id: 'grid-columns', label: '02. Breakpoint Columns' },
        ];
      case 'async':
        return [
          { id: 'promise-binding', label: '01. Promise Binding' },
          { id: 'observable-streams', label: '02. RxJS Observables' },
          { id: 'signal-sources', label: '03. Angular Signals' },
        ];
      case 'cls':
        return [
          { id: 'flicker-protection', label: '01. Delay Timer (Flicker)' },
          { id: 'cls-preservation', label: '02. Layout Reservation' },
        ];
      case 'api':
        return [
          { id: 'inputs-table', label: '01. Inputs Specification' },
          { id: 'context-guard', label: '02. Context Properties' },
        ];
      case 'playground':
        return [
          { id: 'playground-controls', label: '01. Control Parameters' },
          { id: 'playground-canvas', label: '02. Live Component Canvas' },
          { id: 'playground-code', label: '03. Generated Snippet' },
        ];
    }
  });

  // Filtered API properties
  readonly filteredApiProps = computed(() => {
    const q = this.apiSearchQuery.toLowerCase().trim();
    if (!q) return this.apiProperties;
    return this.apiProperties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  });

  // Generated HTML Snippet for Playground
  readonly generatedCode = computed(() => {
    const lines: string[] = ['<div'];
    lines.push(`  *skeleton="`);
    lines.push(`    isLoading;`);
    if (this.selectedPreset) lines.push(`    preset: '${this.selectedPreset}';`);
    if (this.selectedAnimation !== 'prime') lines.push(`    animation: '${this.selectedAnimation}';`);
    if (this.customCount > 1) lines.push(`    count: ${this.customCount};`);
    if (this.delayMs !== 80) lines.push(`    delay: ${this.delayMs};`);
    if (this.minDurationMs !== 200) lines.push(`    minimumDuration: ${this.minDurationMs};`);
    if (this.fadeInDuration !== 180) lines.push(`    fadeIn: ${this.fadeInDuration};`);
    if (this.customStyleClass) lines.push(`    styleClass: '${this.customStyleClass}';`);
    lines.push(`  "`);
    lines.push('>');
    lines.push('  <app-content-component />');
    lines.push('</div>');
    return lines.join('\n');
  });

  // Generated TypeScript Import Snippet
  readonly generatedTsImportCode = computed(() => {
    return `import { SkeletonDirective } from 'ngx-skeleton-suite';\n\n@Component({\n  imports: [SkeletonDirective],\n  // ...\n})`;
  });

  resetThemeColors(): void {
    this.customBaseColor = '#1e293b';
    this.customHighlightColor = 'rgba(255, 255, 255, 0.15)';
  }

  // Dynamic grid configuration
  readonly activeGridConfig = computed<SkeletonGridConfig>(() => {
    if (this.gridColsMode === 'auto-fit') {
      return { count: 6, minItemWidth: '11rem', gap: '1.5rem', itemPreset: 'card' };
    }
    if (this.gridColsMode === 'responsive-breakpoints') {
      return { count: 6, columns: { default: 1, sm: 2, md: 4, lg: 6 }, gap: '1.5rem', itemPreset: 'card' };
    }
    const colCount = parseInt(this.gridColsMode.replace('cols-', ''), 10);
    return { count: 6, columns: colCount, gap: '1.5rem', itemPreset: 'card' };
  });

  // Dynamic Grid Code Snippet generator
  readonly generatedGridCode = computed(() => {
    const config = this.activeGridConfig();
    const jsonStr = JSON.stringify(config, null, 2);
    return `// TypeScript Component Configuration\nreadonly productGrid: SkeletonGridConfig = ${jsonStr};\n\n<!-- HTML Template -->\n<div *skeleton="isLoading; grid: productGrid; animation: 'wave'">\n  <div class="products-grid">\n    <!-- Real product items -->\n  </div>\n</div>`;
  });

  // Dynamic Grid CSS style for real rendered content
  readonly productsGridStyle = computed(() => {
    if (this.gridColsMode === 'auto-fit') {
      return {
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fit, minmax(min(100%, 11rem), 1fr))',
        gap: '1.5rem',
      };
    }
    if (this.gridColsMode === 'responsive-breakpoints') {
      return {
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fit, minmax(min(100%, 12rem), 1fr))',
        gap: '1.5rem',
      };
    }
    const colCount = parseInt(this.gridColsMode.replace('cols-', ''), 10);
    return {
      display: 'grid',
      'grid-template-columns': `repeat(${colCount}, 1fr)`,
      gap: '1.5rem',
    };
  });

  // 6 Mock Products matching count: 6
  readonly products: Product[] = [
    { id: 1, title: 'QUANTUM WIRELESS HEADPHONES', category: 'AUDIO', price: 299.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
    { id: 2, title: 'MINIMALIST MECHANICAL KEYBOARD', category: 'PERIPHERALS', price: 189.50, rating: 4.8, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80' },
    { id: 3, title: 'ULTRA-WIDE DISPLAY 34"', category: 'MONITORS', price: 799.00, rating: 4.9, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80' },
    { id: 4, title: 'STUDIO CONDENSER MICROPHONE', category: 'AUDIO', price: 149.00, rating: 4.7, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80' },
    { id: 5, title: 'ERGONOMIC GRAPHITE CHAIR', category: 'FURNITURE', price: 649.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=500&q=80' },
    { id: 6, title: 'PRECISION WIRELESS MOUSE', category: 'PERIPHERALS', price: 99.50, rating: 4.8, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80' },
  ];

  constructor() {
    this.reloadAsyncSources();
  }

  setTab(tab: 'quickstart' | 'styling' | 'presets' | 'grid' | 'async' | 'cls' | 'api' | 'playground'): void {
    this.activeTab = tab;
    this.isMobileSidebarOpen = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToAnchor(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  togglePlaygroundLoading(): void {
    this.isLoading.update((v) => !v);
  }

  reloadAsyncSources(): void {
    this.asyncLoading$.next(true);
    this.userPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 101,
          name: 'ELENA ROSTOVA',
          role: 'PRINCIPAL FRONTEND ARCHITECT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
          repos: 58,
          stars: 2450,
        });
      }, 1200);
    });

    setTimeout(() => {
      this.asyncLoading$.next(false);
    }, 1200);
  }

  triggerRapidFetch(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 40);
  }

  copySnippet(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.copyStatus = 'COPIED!';
      setTimeout(() => {
        this.copyStatus = 'COPY CODE';
      }, 2000);
    });
  }

  copyPropName(propName: string): void {
    const codeToCopy = propName.startsWith('*') ? `${propName}="isLoading"` : `[${propName}]="value"`;
    navigator.clipboard.writeText(codeToCopy);
  }
}

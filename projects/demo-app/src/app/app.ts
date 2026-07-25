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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  // Navigation active tab
  activeTab: 'playground' | 'quickstart' | 'styling' | 'presets' | 'grid' | 'async' | 'cls' | 'api' = 'playground';

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
  gridColsMode: 'auto-fit' | 'cols-2' | 'cols-3' | 'cols-4' = 'auto-fit';

  // Async stream demo sources
  userPromise: Promise<UserProfile> | undefined = undefined;
  userStream$ = new Subject<UserProfile>();
  asyncLoading$ = new BehaviorSubject<boolean>(true);
  shouldSimulateError = false;
  shouldSimulateEmpty = false;

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

  // Filtered API properties based on search query
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

  // Dynamic code snippet generation for playground
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

  // Dynamic grid configuration based on user choice
  readonly activeGridConfig = computed<SkeletonGridConfig>(() => {
    if (this.gridColsMode === 'auto-fit') {
      return { count: 6, minItemWidth: '16rem', gap: '1.5rem', itemPreset: 'card' };
    }
    const colCount = parseInt(this.gridColsMode.replace('cols-', ''), 10);
    return { count: 6, columns: colCount, gap: '1.5rem', itemPreset: 'card' };
  });

  // Mock Products
  readonly products: Product[] = [
    { id: 1, title: 'QUANTUM WIRELESS HEADPHONES', category: 'AUDIO', price: 299.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
    { id: 2, title: 'MINIMALIST MECHANICAL KEYBOARD', category: 'PERIPHERALS', price: 189.50, rating: 4.8, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80' },
    { id: 3, title: 'ULTRA-WIDE DISPLAY 34"', category: 'MONITORS', price: 799.00, rating: 4.9, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80' },
  ];

  constructor() {
    this.reloadAsyncSources();
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
}

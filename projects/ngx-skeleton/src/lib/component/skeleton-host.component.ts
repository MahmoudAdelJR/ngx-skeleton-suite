import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { SkeletonPreset, SkeletonPresetNode, SkeletonStackNode } from '../preset/preset.models';
import { SkeletonGridConfig } from '../grid/skeleton-grid.models';

export type SkeletonAnimation = 'prime' | 'pulse' | 'shimmer' | 'wave' | 'none';

@Component({
  selector: 'ngx-skeleton-host',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ngx-skeleton-host"
      [class.ngx-skeleton-grid]="isGrid()"
      [class.ngx-skeleton-grid--auto-fit]="isAutoFit()"
      [class.ngx-skeleton-grid--responsive]="isResponsiveCols()"
      [class.ngx-skeleton-pulse]="animation() === 'pulse'"
      [class.ngx-skeleton-shimmer]="animation() === 'shimmer'"
      [class.ngx-skeleton-wave]="animation() === 'wave'"
      [class]="presetContainerClass()"
      [style]="combinedStyle()"
      [attr.aria-label]="ariaLabel() || 'Loading content'"
      aria-live="polite"
      role="status"
    >
      @for (item of items(); track $index) {
        @if (effectivePresetObj()) {
          <div class="ngx-skeleton-preset-item">
            @for (node of effectivePresetObj()!.shapes; track $index) {
              <ng-container *ngTemplateOutlet="renderNode; context: { $implicit: node }"></ng-container>
            }
          </div>
        } @else {
          <p-skeleton
            [shape]="shape()"
            [width]="width()"
            [height]="height()"
            [size]="size()"
            [borderRadius]="borderRadius()"
            [class]="styleClass() || ''"
            aria-hidden="true"
          />
        }
      }
    </div>

    <!-- Recursive Node Renderer Template -->
    <ng-template #renderNode let-node>
      @if (isStackNode(node)) {
        <div
          class="ngx-skeleton-stack"
          [style.display]="'flex'"
          [style.flex-direction]="node.direction || 'row'"
          [style.gap]="node.gap || '0.5rem'"
          [style.align-items]="node.alignItems || 'stretch'"
          [style.justify-content]="node.justifyContent || 'flex-start'"
          [style.flex-grow]="node.grow ? 1 : 0"
        >
          @for (child of node.children; track $index) {
            <ng-container *ngTemplateOutlet="renderNode; context: { $implicit: child }"></ng-container>
          }
        </div>
      } @else {
        <p-skeleton
          [shape]="node.shape || shape()"
          [width]="node.width || width()"
          [height]="node.height || height()"
          [size]="node.size || size()"
          [borderRadius]="node.borderRadius || borderRadius()"
          [class]="node.styleClass || styleClass() || ''"
          aria-hidden="true"
        />
      }
    </ng-template>
  `,
  styleUrls: ['../styles/ngx-skeleton.scss'],
})
export class SkeletonHostComponent {
  readonly width = input<string>('100%');
  readonly height = input<string>('1rem');
  readonly shape = input<'rectangle' | 'circle'>('rectangle');
  readonly size = input<string>();
  readonly borderRadius = input<string>();
  readonly count = input<number>(1);
  readonly styleClass = input<string>();
  readonly animation = input<SkeletonAnimation>('prime');
  readonly ariaLabel = input<string>('Loading content');

  readonly preset = input<SkeletonPreset | undefined>();
  readonly grid = input<SkeletonGridConfig | undefined>();

  readonly preservedHeight = input<string | undefined>();
  readonly preservedWidth = input<string | undefined>();

  readonly isGrid = computed(() => !!this.grid());
  readonly isAutoFit = computed(() => !!this.grid()?.minItemWidth);
  readonly isResponsiveCols = computed(() => !this.isAutoFit() && !!this.grid()?.columns);

  readonly effectivePresetObj = computed(() => {
    const gridItemPreset = this.grid()?.itemPreset;
    if (gridItemPreset && typeof gridItemPreset === 'object') {
      return gridItemPreset;
    }
    return this.preset();
  });

  readonly presetContainerClass = computed(() => this.effectivePresetObj()?.containerClass || '');

  readonly items = computed(() => {
    const gridCount = this.grid()?.count;
    const cnt = Math.max(1, gridCount ?? this.count() ?? 1);
    return Array.from({ length: cnt }, (_, i) => i);
  });

  readonly combinedStyle = computed(() => {
    const styles: Record<string, string> = {};

    if (this.preservedHeight()) {
      styles['min-height'] = this.preservedHeight()!;
    }
    if (this.preservedWidth()) {
      styles['min-width'] = this.preservedWidth()!;
    }

    const g = this.grid();
    if (g) {
      if (g.gap) styles['--ngx-skeleton-grid-gap'] = g.gap;
      if (g.rowGap) styles['--ngx-skeleton-grid-row-gap'] = g.rowGap;
      if (g.columnGap) styles['--ngx-skeleton-grid-col-gap'] = g.columnGap;
      if (g.minItemWidth) styles['--ngx-skeleton-grid-min'] = g.minItemWidth;
      if (g.alignItems) styles['align-items'] = g.alignItems;

      if (typeof g.columns === 'number') {
        styles['--ngx-skeleton-cols-default'] = g.columns.toString();
      } else if (typeof g.columns === 'object' && g.columns !== null) {
        if (g.columns.default) styles['--ngx-skeleton-cols-default'] = g.columns.default.toString();
        if (g.columns.sm) styles['--ngx-skeleton-cols-sm'] = g.columns.sm.toString();
        if (g.columns.md) styles['--ngx-skeleton-cols-md'] = g.columns.md.toString();
        if (g.columns.lg) styles['--ngx-skeleton-cols-lg'] = g.columns.lg.toString();
        if (g.columns.xl) styles['--ngx-skeleton-cols-xl'] = g.columns.xl.toString();
      }
    }

    return styles;
  });

  isStackNode(node: SkeletonPresetNode): node is SkeletonStackNode {
    return (node as SkeletonStackNode).type === 'stack' || Array.isArray((node as SkeletonStackNode).children);
  }
}

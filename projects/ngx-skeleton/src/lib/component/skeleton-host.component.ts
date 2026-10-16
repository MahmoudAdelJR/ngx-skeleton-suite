import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import {
  SkeletonPreset,
  SkeletonPresetNode,
  SkeletonShapeNode,
  SkeletonStackNode,
} from '../preset/preset.models';
import { SkeletonGridConfig } from '../grid/skeleton-grid.models';
import { SkeletonAnimation, SkeletonRenderModel } from '../renderer/skeleton-render-model';
import { NGX_SKELETON_RENDERER, SkeletonRendererType } from '../renderer/skeleton-renderer';
import { NativeSkeletonRendererComponent } from '../renderer/native-skeleton-renderer.component';

@Component({
  selector: 'ngx-skeleton-host',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ngx-skeleton-host"
      [class.ngx-skeleton-grid]="isGrid()"
      [class.ngx-skeleton-grid--auto-fit]="isAutoFit()"
      [class.ngx-skeleton-grid--responsive]="isResponsiveCols()"
      [class]="presetContainerClass()"
      [style]="combinedStyle()"
      [attr.aria-label]="ariaLabel() || 'Loading content'"
      [attr.data-ngx-skeleton-host]="''"
      aria-live="polite"
      role="status"
    >
      @if (effectivePresetObj(); as presetObj) {
        @for (item of items(); track $index) {
          <div class="ngx-skeleton-preset-item">
            @for (node of presetObj.shapes; track $index) {
              <ng-container *ngTemplateOutlet="renderNode; context: { $implicit: node }"></ng-container>
            }
          </div>
        }
      } @else {
        @for (item of items(); track $index) {
          <ng-container *ngComponentOutlet="rendererType; inputs: simpleInputs()"></ng-container>
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
        <ng-container
          *ngComponentOutlet="rendererType; inputs: nodeInputs(node)"
        ></ng-container>
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
  readonly animation = input<SkeletonAnimation>('adapter-default');
  readonly ariaLabel = input<string>('Loading content');

  readonly preset = input<SkeletonPreset | undefined>();
  readonly grid = input<SkeletonGridConfig | undefined>();

  readonly preservedHeight = input<string | undefined>();
  readonly preservedWidth = input<string | undefined>();

  /**
   * Resolved renderer: the configured adapter, or the native CSS renderer as the
   * dependency-free default.
   */
  readonly rendererType: SkeletonRendererType =
    inject(NGX_SKELETON_RENDERER, { optional: true }) ?? NativeSkeletonRendererComponent;

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

  /** Base render model applied to simple (non-preset) shapes. */
  readonly baseModel = computed<SkeletonRenderModel>(() => ({
    shape: this.shape(),
    width: this.width() ?? '100%',
    height: this.height() ?? '1rem',
    size: this.size(),
    borderRadius: this.borderRadius(),
    styleClass: this.styleClass(),
    animation: this.animation(),
  }));

  readonly simpleInputs = computed<Record<string, unknown>>(() => ({
    model: this.baseModel(),
  }));

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
        const cStr = g.columns.toString();
        styles['--ngx-skeleton-cols-default'] = cStr;
        styles['--ngx-skeleton-cols-sm'] = cStr;
        styles['--ngx-skeleton-cols-md'] = cStr;
        styles['--ngx-skeleton-cols-lg'] = cStr;
        styles['--ngx-skeleton-cols-xl'] = cStr;
        styles['grid-template-columns'] = `repeat(${g.columns}, 1fr)`;
      } else if (typeof g.columns === 'object' && g.columns !== null) {
        if (g.columns.default) styles['--ngx-skeleton-cols-default'] = g.columns.default.toString();
        if (g.columns.sm) styles['--ngx-skeleton-cols-sm'] = g.columns.sm.toString();
        if (g.columns.md) styles['--ngx-skeleton-cols-md'] = g.columns.md.toString();
        if (g.columns.lg) styles['--ngx-skeleton-cols-lg'] = g.columns.lg.toString();
        if (g.columns.xl) styles['--ngx-skeleton-cols-xl'] = g.columns.xl.toString();
      } else if (g.minItemWidth) {
        styles['grid-template-columns'] = `repeat(auto-fit, minmax(min(100%, ${g.minItemWidth}), 1fr))`;
      }
    }

    return styles;
  });

  /** Merges a preset shape node over the current base model. */
  nodeInputs(node: SkeletonPresetNode): Record<string, unknown> {
    const base = this.baseModel();
    const shapeNode = node as SkeletonShapeNode;
    const model: SkeletonRenderModel = {
      shape: shapeNode.shape ?? base.shape,
      width: shapeNode.width ?? base.width,
      height: shapeNode.height ?? base.height,
      size: shapeNode.size ?? base.size,
      borderRadius: shapeNode.borderRadius ?? base.borderRadius,
      styleClass: shapeNode.styleClass ?? base.styleClass,
      animation: base.animation,
    };
    return { model };
  }

  isStackNode(node: SkeletonPresetNode): node is SkeletonStackNode {
    return (node as SkeletonStackNode).type === 'stack' || Array.isArray((node as SkeletonStackNode).children);
  }
}
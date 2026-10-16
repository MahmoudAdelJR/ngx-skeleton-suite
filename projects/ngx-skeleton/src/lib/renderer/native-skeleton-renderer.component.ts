import { ChangeDetectionStrategy, Component, Provider, computed, input } from '@angular/core';
import { SkeletonRenderModel } from './skeleton-render-model';
import { NGX_SKELETON_RENDERER, SkeletonRendererComponent } from './skeleton-renderer';

/**
 * Default, dependency-free renderer. Emits a plain `div` styled by the suite's own
 * CSS custom properties, so it works in any Angular app with no UI library.
 */
@Component({
  selector: 'ngx-skeleton-native',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ngx-skeleton-shape"
      [class.ngx-skeleton-shape--circle]="model().shape === 'circle'"
      [class.ngx-skeleton-animation--pulse]="model().animation === 'pulse'"
      [class.ngx-skeleton-animation--shimmer]="model().animation === 'shimmer'"
      [class.ngx-skeleton-animation--wave]="model().animation === 'wave'"
      [class]="model().styleClass || ''"
      [style.width]="resolvedWidth()"
      [style.height]="resolvedHeight()"
      [style.border-radius]="resolvedBorderRadius()"
      [attr.data-ngx-skeleton-shape]="''"
      [attr.data-ngx-skeleton-animation]="model().animation"
      aria-hidden="true"
    ></div>
  `,
  styleUrls: ['./native-skeleton-renderer.scss'],
})
export class NativeSkeletonRendererComponent implements SkeletonRendererComponent {
  readonly model = input.required<SkeletonRenderModel>();

  readonly resolvedWidth = computed(() => this.model().size ?? this.model().width);
  readonly resolvedHeight = computed(() => this.model().size ?? this.model().height);

  readonly resolvedBorderRadius = computed<string | null>(() => {
    const model = this.model();
    if (model.borderRadius) {
      return model.borderRadius;
    }
    return model.shape === 'circle' ? '50%' : null;
  });
}

/** Provides the default native CSS renderer. */
export function provideNativeSkeletonRenderer(): Provider[] {
  return [{ provide: NGX_SKELETON_RENDERER, useValue: NativeSkeletonRendererComponent }];
}
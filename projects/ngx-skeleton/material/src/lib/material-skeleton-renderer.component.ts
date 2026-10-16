import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgxSkeletonLoaderComponent, NgxSkeletonLoaderConfigTheme } from 'ngx-skeleton-loader';
import { SkeletonRenderModel, SkeletonRendererComponent } from 'ngx-skeleton-suite';

/**
 * Renders a skeleton shape with the third-party `ngx-skeleton-loader` component
 * (Material-oriented styling).
 *
 * Angular Material does not provide a skeleton primitive, so this adapter maps the
 * suite's render model onto `ngx-skeleton-loader`:
 *
 * - `rectangle` → `appearance="line"`, `circle` → `appearance="circle"`.
 * - width/height/size/borderRadius → the loader `theme`.
 * - Suite animation modes map onto the loader's own engine:
 *   `adapter-default`/`shimmer`/`wave` → `progress`, `pulse` → `pulse`, `none` → off.
 */
@Component({
  selector: 'ngx-skeleton-material',
  standalone: true,
  imports: [NgxSkeletonLoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngx-skeleton-loader
      [appearance]="appearance()"
      [animation]="loaderAnimation()"
      [theme]="theme()"
      [class]="model().styleClass || ''"
      [class.ngx-skeleton-shape]="true"
      [style.--ngx-skeleton-loader-base-color]="baseColor()"
      [style.--ngx-skeleton-loader-animation-duration]="animationDuration()"
      [attr.data-ngx-skeleton-shape]="''"
      [attr.data-ngx-skeleton-animation]="model().animation"
    ></ngx-skeleton-loader>
  `,
  styleUrls: ['./material-skeleton-renderer.scss'],
})
export class MaterialSkeletonRendererComponent implements SkeletonRendererComponent {
  readonly model = input.required<SkeletonRenderModel>();

  readonly baseColor = computed(
    () => 'var(--ngx-skeleton-base-color, var(--mat-sys-surface-variant, #e0e0e0))'
  );

  readonly animationDuration = computed(() => 'var(--ngx-skeleton-animation-duration, 1.4s)');

  readonly appearance = computed<'line' | 'circle'>(() =>
    this.model().shape === 'circle' ? 'circle' : 'line'
  );

  readonly loaderAnimation = computed<'progress' | 'pulse' | false>(() => {
    switch (this.model().animation) {
      case 'none':
        return false;
      case 'pulse':
        return 'pulse';
      default:
        return 'progress';
    }
  });

  readonly theme = computed<NgxSkeletonLoaderConfigTheme>(() => {
    const model = this.model();
    const width = model.size ?? model.width;
    const height = model.size ?? model.height;
    const borderRadius =
      model.borderRadius ?? (model.shape === 'circle' ? '50%' : undefined);

    return {
      width,
      height,
      ...(borderRadius ? { borderRadius } : {}),
    };
  });
}
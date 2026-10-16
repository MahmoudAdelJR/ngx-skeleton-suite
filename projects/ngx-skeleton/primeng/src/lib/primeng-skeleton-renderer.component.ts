import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { SkeletonRenderModel, SkeletonRendererComponent } from 'ngx-skeleton-suite';

/**
 * Renders a single skeleton shape with PrimeNG's `p-skeleton` component.
 *
 * When the suite owns the animation (`pulse`, `shimmer`, `wave`) or disables it
 * (`none`), PrimeNG's own animation is turned off so the two never conflict.
 * `adapter-default` hands animation control to PrimeNG.
 */
@Component({
  selector: 'ngx-skeleton-primeng',
  standalone: true,
  imports: [SkeletonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-skeleton
      [shape]="model().shape"
      [width]="model().width"
      [height]="model().height"
      [size]="model().size"
      [borderRadius]="model().borderRadius"
      [animation]="primeAnimation()"
      [class]="model().styleClass || ''"
      [class.ngx-skeleton-shape]="true"
      [class.ngx-skeleton-animation--pulse]="model().animation === 'pulse'"
      [class.ngx-skeleton-animation--shimmer]="model().animation === 'shimmer'"
      [class.ngx-skeleton-animation--wave]="model().animation === 'wave'"
      [attr.data-ngx-skeleton-shape]="''"
      [attr.data-ngx-skeleton-animation]="model().animation"
    ></p-skeleton>
  `,
  styleUrls: ['./primeng-skeleton-renderer.scss'],
})
export class PrimeNgSkeletonRendererComponent implements SkeletonRendererComponent {
  readonly model = input.required<SkeletonRenderModel>();

  readonly primeAnimation = computed<'wave' | 'none'>(() =>
    this.model().animation === 'adapter-default' ? 'wave' : 'none'
  );
}
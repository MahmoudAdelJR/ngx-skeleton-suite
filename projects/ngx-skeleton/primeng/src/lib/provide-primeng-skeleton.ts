import { Provider } from '@angular/core';
import { NGX_SKELETON_RENDERER } from 'ngx-skeleton-suite';
import { PrimeNgSkeletonRendererComponent } from './primeng-skeleton-renderer.component';

/**
 * Configures the PrimeNG renderer adapter.
 *
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [providePrimeNgSkeleton()],
 * });
 * ```
 */
export function providePrimeNgSkeleton(): Provider[] {
  return [{ provide: NGX_SKELETON_RENDERER, useValue: PrimeNgSkeletonRendererComponent }];
}
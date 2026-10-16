import { Provider } from '@angular/core';
import { NGX_SKELETON_RENDERER } from 'ngx-skeleton-suite';
import { MaterialSkeletonRendererComponent } from './material-skeleton-renderer.component';

/**
 * Configures the Material-oriented renderer adapter (backed by `ngx-skeleton-loader`).
 *
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [provideMaterialSkeleton()],
 * });
 * ```
 *
 * Requires `ngx-skeleton-loader` to be installed.
 */
export function provideMaterialSkeleton(): Provider[] {
  return [{ provide: NGX_SKELETON_RENDERER, useValue: MaterialSkeletonRendererComponent }];
}
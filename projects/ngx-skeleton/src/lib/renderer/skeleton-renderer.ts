import { InjectionToken, InputSignal, Type } from '@angular/core';
import { SkeletonRenderModel } from './skeleton-render-model';

/**
 * Contract every skeleton renderer component must satisfy.
 *
 * A renderer is a standalone component that declares a single required `model`
 * input. The core layout host instantiates the configured renderer once per shape
 * via `ngComponentOutlet`, binding the `model`.
 */
export interface SkeletonRendererComponent {
  readonly model: InputSignal<SkeletonRenderModel>;
}

export type SkeletonRendererType = Type<SkeletonRendererComponent>;

/**
 * Selects the renderer used by the skeleton layout host.
 *
 * Defaults to the native CSS renderer when no provider is configured. Adapters
 * (e.g. `providePrimeNgSkeleton()`) override this token.
 */
export const NGX_SKELETON_RENDERER = new InjectionToken<SkeletonRendererType>(
  'NGX_SKELETON_RENDERER'
);
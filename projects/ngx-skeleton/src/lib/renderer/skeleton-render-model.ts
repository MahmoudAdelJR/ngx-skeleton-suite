/**
 * Renderer-neutral shape model consumed by every skeleton renderer adapter.
 *
 * Core orchestration (loading state, presets, grids, timing, accessibility) produces
 * these models; adapters (native, PrimeNG, Material, ...) translate a model into UI.
 */
export type SkeletonShape = 'rectangle' | 'circle';

/**
 * Animation modes owned by the suite.
 *
 * - `adapter-default`: let the renderer use its native animation (if any).
 * - `pulse` / `shimmer` / `wave`: suite-owned animation; adapters must disable their
 *   own native animation so the two do not conflict.
 * - `none`: no animation.
 */
export type SkeletonAnimation = 'adapter-default' | 'pulse' | 'shimmer' | 'wave' | 'none';

export interface SkeletonRenderModel {
  /** Geometric shape of a single skeleton item. */
  shape: SkeletonShape;
  /** CSS width, ignored when `size` is provided. */
  width: string;
  /** CSS height, ignored when `size` is provided. */
  height: string;
  /** Equal width/height shorthand (e.g. circle avatars). */
  size?: string;
  /** Explicit border radius; renderers fall back to their own default. */
  borderRadius?: string;
  /** Extra class(es) applied to the rendered shape element. */
  styleClass?: string;
  /** Animation mode requested by the suite. */
  animation: SkeletonAnimation;
}
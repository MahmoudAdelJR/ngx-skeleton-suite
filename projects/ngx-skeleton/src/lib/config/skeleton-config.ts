import { InjectionToken, Provider } from '@angular/core';
import { SkeletonAnimation } from '../component/skeleton-host.component';
import { SkeletonPreset } from '../preset/preset.models';
import { SKELETON_PRESETS_TOKEN } from '../preset/skeleton-preset.registry';

export interface NgxSkeletonConfig {
  animation: SkeletonAnimation;
  fadeInMs: number;
  delayMs: number;
  minimumDurationMs: number;
  preserveLayout: boolean;
  respectReducedMotion: boolean;
  defaultPreset?: string;
  ariaLabel?: string;
}

export const DEFAULT_NGX_SKELETON_CONFIG: NgxSkeletonConfig = {
  animation: 'prime',
  fadeInMs: 180,
  delayMs: 80,
  minimumDurationMs: 200,
  preserveLayout: false,
  respectReducedMotion: true,
  ariaLabel: 'Loading content',
};

export const NGX_SKELETON_CONFIG = new InjectionToken<NgxSkeletonConfig>('NGX_SKELETON_CONFIG');

export function provideNgxSkeleton(config?: Partial<NgxSkeletonConfig>): Provider[] {
  return [
    {
      provide: NGX_SKELETON_CONFIG,
      useValue: { ...DEFAULT_NGX_SKELETON_CONFIG, ...config },
    },
  ];
}

export function provideSkeletonPresets(presets: SkeletonPreset[]): Provider[] {
  return [
    {
      provide: SKELETON_PRESETS_TOKEN,
      useValue: presets,
      multi: true,
    },
  ];
}

import { Injectable, Inject, Optional } from '@angular/core';
import { SkeletonPreset } from './preset.models';
import { BUILT_IN_PRESETS } from './built-in-presets';
import { InjectionToken } from '@angular/core';

export const SKELETON_PRESETS_TOKEN = new InjectionToken<SkeletonPreset[] | SkeletonPreset[][]>(
  'SKELETON_PRESETS_TOKEN'
);

@Injectable({ providedIn: 'root' })
export class SkeletonPresetRegistry {
  private readonly presetsMap = new Map<string, SkeletonPreset>();

  constructor(
    @Optional()
    @Inject(SKELETON_PRESETS_TOKEN)
    customPresets?: (SkeletonPreset | SkeletonPreset[])[]
  ) {
    // Register built-in presets
    BUILT_IN_PRESETS.forEach((preset) => this.registerPreset(preset));

    // Register custom presets provided via token
    if (customPresets) {
      const flattened = customPresets.flat(2);
      flattened.forEach((preset) => this.registerPreset(preset));
    }
  }

  registerPreset(preset: SkeletonPreset): void {
    if (!preset || !preset.name) return;
    this.presetsMap.set(preset.name.toLowerCase(), Object.freeze(preset));
  }

  getPreset(name: string): SkeletonPreset | undefined {
    if (!name) return undefined;
    return this.presetsMap.get(name.toLowerCase());
  }

  hasPreset(name: string): boolean {
    if (!name) return false;
    return this.presetsMap.has(name.toLowerCase());
  }
}

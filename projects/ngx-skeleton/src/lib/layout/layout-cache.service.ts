import { Injectable } from '@angular/core';

export interface LayoutDimensions {
  width: number;
  height: number;
}

@Injectable({ providedIn: 'root' })
export class LayoutCacheService {
  private readonly cache = new Map<string, LayoutDimensions>();

  setDimensions(key: string, dimensions: LayoutDimensions): void {
    if (!key) return;
    this.cache.set(key, dimensions);
  }

  getDimensions(key: string): LayoutDimensions | undefined {
    if (!key) return undefined;
    return this.cache.get(key);
  }

  hasDimensions(key: string): boolean {
    if (!key) return false;
    return this.cache.has(key);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

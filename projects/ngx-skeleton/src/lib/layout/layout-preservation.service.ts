import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LayoutCacheService, LayoutDimensions } from './layout-cache.service';

@Injectable({ providedIn: 'root' })
export class LayoutPreservationService {
  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly layoutCache: LayoutCacheService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  observeElement(
    element: HTMLElement,
    key: string,
    onMeasure?: (dimensions: LayoutDimensions) => void
  ): () => void {
    if (!this.isBrowser || !element || typeof ResizeObserver === 'undefined') {
      return () => {};
    }

    let observer: ResizeObserver | null = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.contentRect || element.getBoundingClientRect();
        if (rect.height > 0 || rect.width > 0) {
          const dims: LayoutDimensions = {
            width: rect.width || element.offsetWidth,
            height: rect.height || element.offsetHeight,
          };
          this.layoutCache.setDimensions(key, dims);
          if (onMeasure) {
            onMeasure(dims);
          }
        }
      }
    });

    observer.observe(element);

    return () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
  }

  getCachedDimensions(key: string): LayoutDimensions | undefined {
    return this.layoutCache.getDimensions(key);
  }
}

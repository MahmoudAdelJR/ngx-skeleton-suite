import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkeletonAnimation, SkeletonHostComponent } from 'ngx-skeleton-suite';

/**
 * Renderer-neutral test harness.
 *
 * Queries the core layout host (which is adapter-free), so it works with the native,
 * PrimeNG, Material, or any future renderer.
 *
 * ```ts
 * import { SkeletonHarness } from 'ngx-skeleton-suite/testing';
 * ```
 */
export class SkeletonHarness {
  constructor(private readonly fixture: ComponentFixture<unknown>) {}

  static for(fixture: ComponentFixture<unknown>): SkeletonHarness {
    return new SkeletonHarness(fixture);
  }

  private hostComponent(): SkeletonHostComponent | undefined {
    const host = this.fixture.debugElement.query(By.directive(SkeletonHostComponent));
    return host ? (host.componentInstance as SkeletonHostComponent) : undefined;
  }

  isSkeletonVisible(): boolean {
    return !!this.fixture.debugElement.query(By.directive(SkeletonHostComponent));
  }

  /** Number of skeleton items (grid cells / repeated shapes). */
  getSkeletonCount(): number {
    return this.hostComponent()?.items().length ?? 0;
  }

  getAnimation(): SkeletonAnimation | undefined {
    return this.hostComponent()?.animation();
  }

  getPresetName(): string | undefined {
    return this.hostComponent()?.preset()?.name;
  }

  /** Resolved renderer component type currently in use. */
  getRendererType(): unknown {
    return this.hostComponent()?.rendererType;
  }
}
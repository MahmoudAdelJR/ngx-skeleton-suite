import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkeletonHostComponent, SkeletonAnimation } from '../component/skeleton-host.component';

export class SkeletonHarness {
  constructor(private readonly fixture: ComponentFixture<unknown>) {}

  static for(fixture: ComponentFixture<unknown>): SkeletonHarness {
    return new SkeletonHarness(fixture);
  }

  isSkeletonVisible(): boolean {
    const host = this.fixture.debugElement.query(By.directive(SkeletonHostComponent));
    return !!host;
  }

  getSkeletonCount(): number {
    const host = this.fixture.debugElement.query(By.directive(SkeletonHostComponent));
    if (!host) return 0;
    const hostComp = host.componentInstance as SkeletonHostComponent;
    return hostComp.items().length;
  }

  getAnimation(): SkeletonAnimation | undefined {
    const host = this.fixture.debugElement.query(By.directive(SkeletonHostComponent));
    if (!host) return undefined;
    const hostComp = host.componentInstance as SkeletonHostComponent;
    return hostComp.animation();
  }

  getPresetName(): string | undefined {
    const host = this.fixture.debugElement.query(By.directive(SkeletonHostComponent));
    if (!host) return undefined;
    const hostComp = host.componentInstance as SkeletonHostComponent;
    return hostComp.preset()?.name;
  }
}

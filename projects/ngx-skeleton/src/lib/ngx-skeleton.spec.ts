import { SkeletonDirective } from './directive/skeleton.directive';
import { SkeletonHostComponent } from './component/skeleton-host.component';

describe('ngx-skeleton exports', () => {
  it('should export SkeletonDirective and SkeletonHostComponent', () => {
    expect(SkeletonDirective).toBeDefined();
    expect(SkeletonHostComponent).toBeDefined();
  });
});

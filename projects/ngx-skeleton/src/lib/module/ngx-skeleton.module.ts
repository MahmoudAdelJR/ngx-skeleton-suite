import { NgModule } from '@angular/core';
import { SkeletonDirective } from '../directive/skeleton.directive';

@NgModule({
  imports: [SkeletonDirective],
  exports: [SkeletonDirective],
})
export class NgxSkeletonModule {}

import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface SkeletonContext<T> {
  $implicit: T;
  skeleton: T;
  loading: boolean;
  error: unknown | null;
}

export type SkeletonDataSource<T> =
  | Observable<T>
  | Signal<T | null | undefined>
  | PromiseLike<T>
  | T;

export type SkeletonReadyStrategy = 'first-emission' | 'non-nullish-emission';

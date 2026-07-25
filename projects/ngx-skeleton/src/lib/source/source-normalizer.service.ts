import { Injectable, Injector, Signal, isSignal, effect, EffectRef } from '@angular/core';
import { Observable, Subscription, isObservable } from 'rxjs';
import { SkeletonDataSource, SkeletonReadyStrategy } from '../directive/skeleton-context';

export type SkeletonLoadingSource = boolean | Signal<boolean> | Observable<boolean>;

@Injectable({ providedIn: 'root' })
export class SourceNormalizerService {
  /**
   * Subscribes/observes the loading source boolean and invokes callback whenever the loading state changes.
   * Returns a cleanup teardown function.
   */
  observeLoadingSource(
    source: SkeletonLoadingSource | undefined | null | '',
    injector: Injector,
    onStateChange: (isLoading: boolean) => void
  ): () => void {
    if (source === undefined || source === null || source === '') {
      onStateChange(false);
      return () => {};
    }

    if (typeof source === 'boolean') {
      onStateChange(source);
      return () => {};
    }

    if (isSignal(source)) {
      let effectRef: EffectRef | null = effect(
        () => {
          const val = source();
          onStateChange(Boolean(val));
        },
        { injector }
      );

      return () => {
        if (effectRef) {
          effectRef.destroy();
          effectRef = null;
        }
      };
    }

    if (isObservable(source)) {
      const sub: Subscription = source.subscribe({
        next: (val) => onStateChange(Boolean(val)),
        error: (err) => {
          console.error('[ngx-skeleton] Loading observable error:', err);
          onStateChange(false);
        },
      });

      return () => {
        sub.unsubscribe();
      };
    }

    onStateChange(Boolean(source));
    return () => {};
  }

  /**
   * Observes a data source (Observable, Signal, Promise, or Direct Value) with generation token protection.
   */
  observeDataSource<T>(
    source: SkeletonDataSource<T> | undefined | null,
    injector: Injector,
    generationToken: number,
    readyWhen: SkeletonReadyStrategy | ((val: T) => boolean) = 'non-nullish-emission',
    onData: (data: T, token: number) => void,
    onError: (error: unknown, token: number) => void
  ): () => void {
    if (source === undefined || source === null) {
      return () => {};
    }

    const isReady = (val: T): boolean => {
      if (typeof readyWhen === 'function') {
        return readyWhen(val);
      }
      if (readyWhen === 'first-emission') {
        return true;
      }
      return val !== null && val !== undefined;
    };

    if (isSignal(source)) {
      let effectRef: EffectRef | null = effect(
        () => {
          const val = (source as Signal<T>)();
          if (isReady(val)) {
            onData(val, generationToken);
          }
        },
        { injector }
      );

      return () => {
        if (effectRef) {
          effectRef.destroy();
          effectRef = null;
        }
      };
    }

    if (isObservable(source)) {
      const sub = (source as Observable<T>).subscribe({
        next: (val) => {
          if (isReady(val)) {
            onData(val, generationToken);
          }
        },
        error: (err) => onError(err, generationToken),
      });

      return () => {
        sub.unsubscribe();
      };
    }

    if (typeof (source as PromiseLike<T>)?.then === 'function') {
      let isCancelled = false;
      Promise.resolve(source as PromiseLike<T>)
        .then((val) => {
          if (!isCancelled && isReady(val)) {
            onData(val, generationToken);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            onError(err, generationToken);
          }
        });

      return () => {
        isCancelled = true;
      };
    }

    // Direct static value T
    if (isReady(source as T)) {
      onData(source as T, generationToken);
    }
    return () => {};
  }
}

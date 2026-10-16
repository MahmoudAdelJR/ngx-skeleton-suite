import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  ComponentRef,
  EmbeddedViewRef,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  Injector,
  inject,
} from '@angular/core';
import { SkeletonHostComponent } from '../component/skeleton-host.component';
import { SkeletonAnimation } from '../renderer/skeleton-render-model';
import { SourceNormalizerService, SkeletonLoadingSource } from '../source/source-normalizer.service';
import { SkeletonContext, SkeletonDataSource, SkeletonReadyStrategy } from './skeleton-context';
import { NgxSkeletonConfig, NGX_SKELETON_CONFIG, DEFAULT_NGX_SKELETON_CONFIG } from '../config/skeleton-config';
import { SkeletonPresetRegistry } from '../preset/skeleton-preset.registry';
import { SkeletonPreset } from '../preset/preset.models';
import { SkeletonGridConfig } from '../grid/skeleton-grid.models';
import { LayoutPreservationService } from '../layout/layout-preservation.service';

@Directive({
  selector: '[skeleton], [ngxSkeleton]',
  standalone: true,
})
export class SkeletonDirective<T = unknown> implements OnInit, OnChanges, OnDestroy {
  private readonly templateRef = inject(TemplateRef<SkeletonContext<T>>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  private readonly sourceNormalizer = inject(SourceNormalizerService);
  private readonly presetRegistry = inject(SkeletonPresetRegistry);
  private readonly layoutPreservation = inject(LayoutPreservationService);

  private readonly globalConfig: NgxSkeletonConfig =
    inject(NGX_SKELETON_CONFIG, { optional: true }) ?? DEFAULT_NGX_SKELETON_CONFIG;

  // Structural Directive Inputs
  @Input('skeleton') loadingSource: SkeletonLoadingSource | undefined | '';
  @Input('skeletonFrom') dataSource: SkeletonDataSource<T> | undefined;
  @Input('skeletonReadyWhen') readyWhen: SkeletonReadyStrategy | ((val: T) => boolean) = 'non-nullish-emission';

  @Input('skeletonEmpty') emptyTemplate?: TemplateRef<unknown>;
  @Input('skeletonError') errorTemplate?: TemplateRef<{ $implicit: unknown }>;
  @Input('skeletonEmptyWhen') emptyWhen?: (val: T) => boolean;

  @Input('skeletonPreset') presetInput: string | SkeletonPreset | undefined;
  @Input('skeletonGrid') grid?: SkeletonGridConfig;
  @Input('skeletonPreserveLayout') preserveLayout?: boolean;
  @Input('skeletonLayoutKey') layoutKey?: string;

  @Input('skeletonWidth') width?: string;
  @Input('skeletonHeight') height?: string;
  @Input('skeletonShape') shape?: 'rectangle' | 'circle';
  @Input('skeletonSize') size?: string;
  @Input('skeletonBorderRadius') borderRadius?: string;
  @Input('skeletonCount') count?: number;
  @Input('skeletonAnimation') animation?: SkeletonAnimation;
  @Input('skeletonFadeIn') fadeIn?: boolean | number;
  @Input('skeletonDelay') delay?: number;
  @Input('skeletonMinimumDuration') minimumDuration?: number;
  @Input('skeletonStyleClass') styleClass?: string;

  private hostComponentRef: ComponentRef<SkeletonHostComponent> | null = null;
  private embeddedViewRef: EmbeddedViewRef<unknown> | null = null;

  private sourceCleanupFn: (() => void) | null = null;
  private dataCleanupFn: (() => void) | null = null;
  private layoutObserverCleanupFn: (() => void) | null = null;
  private delayTimer: ReturnType<typeof setTimeout> | null = null;
  private minDurationTimer: ReturnType<typeof setTimeout> | null = null;

  private isSkeletonVisible = false;
  private skeletonVisibleStartTime = 0;
  private currentLoadingState = false;

  private generationToken = 0;
  private currentData: T | undefined = undefined;
  private currentError: unknown | null = null;
  private context: SkeletonContext<T> | null = null;

  private activeRenderMode: 'skeleton' | 'content' | 'empty' | 'error' = 'skeleton';

  private static instanceCounter = 0;
  private readonly uniqueInstanceId = `skeleton-inst-${++SkeletonDirective.instanceCounter}`;

  static ngTemplateContextGuard<T>(
    dir: SkeletonDirective<T>,
    ctx: unknown
  ): ctx is SkeletonContext<T> {
    return true;
  }

  private get effectiveAnimation(): SkeletonAnimation {
    return this.animation ?? this.globalConfig.animation;
  }

  private get effectiveDelay(): number {
    return this.delay ?? this.globalConfig.delayMs;
  }

  private get effectiveMinDuration(): number {
    return this.minimumDuration ?? this.globalConfig.minimumDurationMs;
  }

  private get effectiveFadeIn(): boolean | number {
    return this.fadeIn ?? this.globalConfig.fadeInMs;
  }

  private get effectivePreserveLayout(): boolean {
    return this.preserveLayout ?? this.globalConfig.preserveLayout;
  }

  private get effectiveLayoutKey(): string {
    return this.layoutKey || this.uniqueInstanceId;
  }

  private get resolvedPreset(): SkeletonPreset | undefined {
    if (this.grid?.itemPreset && typeof this.grid.itemPreset === 'string') {
      return this.presetRegistry.getPreset(this.grid.itemPreset);
    }
    if (!this.presetInput) {
      if (this.globalConfig.defaultPreset) {
        return this.presetRegistry.getPreset(this.globalConfig.defaultPreset);
      }
      return undefined;
    }
    if (typeof this.presetInput === 'string') {
      return this.presetRegistry.getPreset(this.presetInput);
    }
    return this.presetInput;
  }

  ngOnInit(): void {
    this.setupObservation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['loadingSource'] && !changes['loadingSource'].isFirstChange()) ||
      (changes['dataSource'] && !changes['dataSource'].isFirstChange()) ||
      (changes['readyWhen'] && !changes['readyWhen'].isFirstChange())
    ) {
      this.setupObservation();
    } else if (this.isSkeletonVisible && this.hostComponentRef) {
      this.updateHostInputs();
    }
  }

  ngOnDestroy(): void {
    this.cleanupTimers();
    this.cleanupSources();
    this.cleanupLayoutObserver();
    this.clearViews();
  }

  private setupObservation(): void {
    this.cleanupSources();

    // Check if in data source mode (either dataSource is passed or loadingSource is empty string from 'let user from userPromise')
    const isDataMode = this.dataSource !== undefined || this.loadingSource === '';

    if (isDataMode) {
      if (this.dataSource !== undefined && this.dataSource !== null) {
        this.generationToken++;
        const currentToken = this.generationToken;

        this.handleLoadingStateChange(true);

        this.dataCleanupFn = this.sourceNormalizer.observeDataSource<T>(
          this.dataSource,
          this.injector,
          currentToken,
          this.readyWhen,
          (data: T, token: number) => {
            if (token !== this.generationToken) return;
            this.currentData = data;
            this.currentError = null;

            const isEmpty = this.emptyWhen
              ? this.emptyWhen(data)
              : Array.isArray(data) && data.length === 0;

            if (isEmpty && this.emptyTemplate) {
              this.activeRenderMode = 'empty';
            } else {
              this.activeRenderMode = 'content';
            }

            if (this.embeddedViewRef && this.context) {
              this.context.$implicit = data;
              this.context.skeleton = data;
              this.context.loading = false;
              this.embeddedViewRef.markForCheck();
            }
            this.handleLoadingStateChange(false);
          },
          (error: unknown, token: number) => {
            if (token !== this.generationToken) return;
            console.error('[ngx-skeleton] Data stream error:', error);
            this.currentError = error;

            if (this.errorTemplate) {
              this.activeRenderMode = 'error';
              this.handleLoadingStateChange(false);
            }
          }
        );
      } else {
        // Data source is currently undefined or null (pending load/reload) -> show skeleton placeholder!
        this.activeRenderMode = 'skeleton';
        this.handleLoadingStateChange(true);
      }
    } else if (this.loadingSource !== undefined) {
      this.sourceCleanupFn = this.sourceNormalizer.observeLoadingSource(
        this.loadingSource,
        this.injector,
        (isLoading: boolean) => {
          this.activeRenderMode = isLoading ? 'skeleton' : 'content';
          this.handleLoadingStateChange(isLoading);
        }
      );
    }
  }

  private handleLoadingStateChange(isLoading: boolean): void {
    this.currentLoadingState = isLoading;

    if (isLoading) {
      this.clearMinDurationTimer();

      if (this.isSkeletonVisible) {
        this.updateHostInputs();
        return;
      }

      const activeDelay = this.effectiveDelay;
      if (activeDelay > 0) {
        this.clearDelayTimer();
        this.delayTimer = setTimeout(() => {
          if (this.currentLoadingState) {
            this.showSkeleton();
          }
        }, activeDelay);
      } else {
        this.showSkeleton();
      }
    } else {
      this.clearDelayTimer();

      if (!this.isSkeletonVisible) {
        this.renderTargetView();
        return;
      }

      const elapsed = Date.now() - this.skeletonVisibleStartTime;
      const remaining = this.effectiveMinDuration - elapsed;

      if (remaining > 0) {
        this.clearMinDurationTimer();
        this.minDurationTimer = setTimeout(() => {
          if (!this.currentLoadingState) {
            this.renderTargetView();
          }
        }, remaining);
      } else {
        this.renderTargetView();
      }
    }
  }

  private showSkeleton(): void {
    this.clearViews();
    this.isSkeletonVisible = true;
    this.skeletonVisibleStartTime = Date.now();

    this.hostComponentRef = this.viewContainer.createComponent(SkeletonHostComponent);
    this.updateHostInputs();
  }

  private updateHostInputs(): void {
    if (!this.hostComponentRef) return;

    let preservedH: string | undefined = undefined;
    let preservedW: string | undefined = undefined;

    if (this.effectivePreserveLayout) {
      const cached = this.layoutPreservation.getCachedDimensions(this.effectiveLayoutKey);
      if (cached) {
        preservedH = `${cached.height}px`;
        preservedW = `${cached.width}px`;
      }
    }

    this.hostComponentRef.setInput('width', this.width ?? '100%');
    this.hostComponentRef.setInput('height', this.height ?? '1rem');
    this.hostComponentRef.setInput('shape', this.shape ?? 'rectangle');
    this.hostComponentRef.setInput('size', this.size);
    this.hostComponentRef.setInput('borderRadius', this.borderRadius);
    this.hostComponentRef.setInput('count', this.count ?? 1);
    this.hostComponentRef.setInput('animation', this.effectiveAnimation);
    this.hostComponentRef.setInput('styleClass', this.styleClass);
    this.hostComponentRef.setInput('preset', this.resolvedPreset);
    this.hostComponentRef.setInput('grid', this.grid);
    this.hostComponentRef.setInput('preservedHeight', preservedH);
    this.hostComponentRef.setInput('preservedWidth', preservedW);
    this.hostComponentRef.setInput('ariaLabel', this.globalConfig.ariaLabel);
    this.hostComponentRef.changeDetectorRef.markForCheck();
  }

  private renderTargetView(): void {
    this.clearViews();
    this.isSkeletonVisible = false;

    if (this.activeRenderMode === 'error' && this.errorTemplate) {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(
        this.errorTemplate as TemplateRef<unknown>,
        { $implicit: this.currentError }
      ) as EmbeddedViewRef<unknown>;
    } else if (this.activeRenderMode === 'empty' && this.emptyTemplate) {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.emptyTemplate);
    } else {
      this.context = {
        $implicit: this.currentData as T,
        skeleton: this.currentData as T,
        loading: false,
        error: this.currentError,
      };

      this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.context);

      if (this.effectivePreserveLayout) {
        this.attachLayoutObserver();
      }
    }

    const activeFadeIn = this.effectiveFadeIn;
    if (activeFadeIn && this.embeddedViewRef) {
      const duration = typeof activeFadeIn === 'number' ? `${activeFadeIn}ms` : '180ms';
      this.embeddedViewRef.rootNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          node.classList.add('ngx-skeleton-content-enter');
          node.style.setProperty('--ngx-skeleton-fade-duration', duration);
        }
      });
    }

    if (this.embeddedViewRef) {
      this.embeddedViewRef.markForCheck();
    }
  }

  private attachLayoutObserver(): void {
    this.cleanupLayoutObserver();

    if (!this.embeddedViewRef) return;
    const firstHtmlElement = this.embeddedViewRef.rootNodes.find(
      (node) => node instanceof HTMLElement
    ) as HTMLElement | undefined;

    if (firstHtmlElement) {
      this.layoutObserverCleanupFn = this.layoutPreservation.observeElement(
        firstHtmlElement,
        this.effectiveLayoutKey
      );
    }
  }

  private clearViews(): void {
    this.viewContainer.clear();
    this.hostComponentRef = null;
    this.embeddedViewRef = null;
    this.context = null;
  }

  private clearDelayTimer(): void {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  }

  private clearMinDurationTimer(): void {
    if (this.minDurationTimer) {
      clearTimeout(this.minDurationTimer);
      this.minDurationTimer = null;
    }
  }

  private cleanupTimers(): void {
    this.clearDelayTimer();
    this.clearMinDurationTimer();
  }

  private cleanupSources(): void {
    if (this.sourceCleanupFn) {
      this.sourceCleanupFn();
      this.sourceCleanupFn = null;
    }
    if (this.dataCleanupFn) {
      this.dataCleanupFn();
      this.dataCleanupFn = null;
    }
  }

  private cleanupLayoutObserver(): void {
    if (this.layoutObserverCleanupFn) {
      this.layoutObserverCleanupFn();
      this.layoutObserverCleanupFn = null;
    }
  }
}

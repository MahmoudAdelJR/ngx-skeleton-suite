import { Component, signal, WritableSignal, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import { SkeletonDirective } from './skeleton.directive';
import { SkeletonHostComponent } from '../component/skeleton-host.component';
import { SkeletonAnimation } from '../renderer/skeleton-render-model';
import { SkeletonDataSource } from './skeleton-context';
import { provideNgxSkeleton, provideSkeletonPresets } from '../config/skeleton-config';
import { SkeletonPreset } from '../preset/preset.models';
import { SkeletonGridConfig } from '../grid/skeleton-grid.models';
import { LayoutCacheService } from '../layout/layout-cache.service';
import { SkeletonHarness } from '../../../testing/src/public-api';

interface User {
  id: number;
  name: string;
}

const CUSTOM_HEADER_PRESET: SkeletonPreset = {
  name: 'custom-header',
  shapes: [{ type: 'shape', width: '50%', height: '3rem' }],
};

@Component({
  standalone: true,
  imports: [SkeletonDirective],
  template: `
    <div
      *skeleton="
        loadingSource;
        from: dataSource;
        preset: preset;
        grid: grid;
        preserveLayout: preserveLayout;
        layoutKey: layoutKey;
        empty: emptyTpl;
        error: errorTpl;
        width: width;
        height: height;
        shape: shape;
        count: count;
        animation: animation;
        delay: delay;
        minimumDuration: minimumDuration;
        fadeIn: fadeIn;
        let item
      "
      class="test-content"
    >
      <span class="actual-content">{{ item ? item.name : 'Loaded Content' }}</span>
    </div>

    <ng-template #emptyTpl>
      <span class="empty-state">No Data Available</span>
    </ng-template>

    <ng-template #errorTpl let-err>
      <span class="error-state">Error: {{ err }}</span>
    </ng-template>
  `,
})
class TestHostComponent {
  loadingSource: boolean | WritableSignal<boolean> | BehaviorSubject<boolean> = true;
  dataSource: SkeletonDataSource<User[]> | undefined = undefined;
  preset: string | SkeletonPreset | undefined = undefined;
  grid: SkeletonGridConfig | undefined = undefined;
  preserveLayout: boolean | undefined = undefined;
  layoutKey: string | undefined = undefined;
  width = '100%';
  height = '2rem';
  shape: 'rectangle' | 'circle' = 'rectangle';
  count = 1;
  animation: SkeletonAnimation = 'adapter-default';
  delay = 0;
  minimumDuration = 0;
  fadeIn: boolean | number = false;

  @ViewChild('emptyTpl', { static: true }) emptyTpl!: TemplateRef<unknown>;
  @ViewChild('errorTpl', { static: true }) errorTpl!: TemplateRef<{ $implicit: unknown }>;
}

describe('SkeletonDirective & SkeletonHarness', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let layoutCache: LayoutCacheService;
  let harness: SkeletonHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonDirective, TestHostComponent],
      providers: [
        provideNgxSkeleton({ animation: 'shimmer', delayMs: 0, minimumDurationMs: 0 }),
        provideSkeletonPresets([CUSTOM_HEADER_PRESET]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    layoutCache = TestBed.inject(LayoutCacheService);
    harness = SkeletonHarness.for(fixture);
  });

  it('should render skeleton host when boolean loading is true', () => {
    component.loadingSource = true;
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeTrue();
    const contentEl = fixture.debugElement.query(By.css('.actual-content'));
    expect(contentEl).toBeNull();
  });

  it('should render content when boolean loading is false', () => {
    component.loadingSource = false;
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeFalse();
    const contentEl = fixture.debugElement.query(By.css('.actual-content'));
    expect(contentEl).toBeTruthy();
    expect(contentEl.nativeElement.textContent).toContain('Loaded Content');
  });

  it('should react to Signal updates', () => {
    const loadingSig = signal(true);
    component.loadingSource = loadingSig;
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeTrue();

    loadingSig.set(false);
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeFalse();
    expect(fixture.debugElement.query(By.css('.actual-content'))).toBeTruthy();
  });

  it('should react to RxJS Observable emissions', () => {
    const loading$ = new BehaviorSubject<boolean>(true);
    component.loadingSource = loading$;
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeTrue();

    loading$.next(false);
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeFalse();
    expect(fixture.debugElement.query(By.css('.actual-content'))).toBeTruthy();
  });

  it('should respect delay and minimumDuration timing', fakeAsync(() => {
    component.delay = 100;
    component.minimumDuration = 200;
    component.loadingSource = true;
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeFalse();

    tick(100);
    fixture.detectChanges();
    expect(harness.isSkeletonVisible()).toBeTrue();

    component.loadingSource = false;
    fixture.detectChanges();

    tick(100);
    fixture.detectChanges();
    expect(harness.isSkeletonVisible()).toBeTrue();

    tick(100);
    fixture.detectChanges();
    expect(harness.isSkeletonVisible()).toBeFalse();
    expect(fixture.debugElement.query(By.css('.actual-content'))).toBeTruthy();
  }));

  it('should resolve built-in preset by name', () => {
    component.loadingSource = true;
    component.preset = 'profile-card';
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeTrue();
    expect(harness.getPresetName()).toBe('profile-card');
  });

  it('should resolve custom preset registered via provideSkeletonPresets', () => {
    component.loadingSource = true;
    component.preset = 'custom-header';
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeTrue();
    expect(harness.getPresetName()).toBe('custom-header');
  });

  it('should apply CSS Grid container classes and item count when grid input is provided', () => {
    component.loadingSource = true;
    component.grid = {
      count: 6,
      minItemWidth: '15rem',
      gap: '1.5rem',
    };
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeTrue();
    expect(harness.getSkeletonCount()).toBe(6);
  });

  it('should pass cached preserved dimensions to SkeletonHostComponent when preserveLayout is enabled', () => {
    layoutCache.setDimensions('user-card-1', { width: 320, height: 220 });

    component.loadingSource = true;
    component.preserveLayout = true;
    component.layoutKey = 'user-card-1';
    fixture.detectChanges();

    const hostDebugEl = fixture.debugElement.query(By.directive(SkeletonHostComponent));
    expect(hostDebugEl).toBeTruthy();
    const hostComp = hostDebugEl.componentInstance as SkeletonHostComponent;

    expect(hostComp.preservedHeight()).toBe('220px');
    expect(hostComp.preservedWidth()).toBe('320px');
  });

  it('should render emptyTemplate when data source emits empty array', () => {
    const data$ = new Subject<User[]>();
    component.dataSource = data$;
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeTrue();

    data$.next([]);
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeFalse();
    const emptyEl = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyEl).toBeTruthy();
    expect(emptyEl.nativeElement.textContent).toContain('No Data Available');
  });

  it('should render errorTemplate when data source errors', () => {
    const data$ = new Subject<User[]>();
    component.dataSource = data$;
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeTrue();

    data$.error('Network Timeout');
    fixture.detectChanges();

    expect(harness.isSkeletonVisible()).toBeFalse();
    const errorEl = fixture.debugElement.query(By.css('.error-state'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain('Network Timeout');
  });
});

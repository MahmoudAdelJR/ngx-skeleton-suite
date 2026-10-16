import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  SkeletonDirective,
  SkeletonRenderModel,
  provideNgxSkeleton,
} from 'ngx-skeleton-suite';
import { PrimeNgSkeletonRendererComponent } from './primeng-skeleton-renderer.component';
import { providePrimeNgSkeleton } from './provide-primeng-skeleton';

@Component({
  standalone: true,
  imports: [PrimeNgSkeletonRendererComponent],
  template: `<ngx-skeleton-primeng [model]="model" />`,
})
class AdapterHostComponent {
  model: SkeletonRenderModel = {
    shape: 'rectangle',
    width: '100%',
    height: '1rem',
    animation: 'adapter-default',
  };
}

@Component({
  standalone: true,
  imports: [SkeletonDirective],
  template: `<div *skeleton="loading" class="real-content">Content</div>`,
})
class DirectiveHostComponent {
  loading = true;
}

describe('PrimeNgSkeletonRendererComponent', () => {
  let fixture: ComponentFixture<AdapterHostComponent>;
  let host: AdapterHostComponent;

  const skeletonElement = (): HTMLElement =>
    fixture.debugElement.query(By.css('p-skeleton')).nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdapterHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdapterHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders a PrimeNG p-skeleton with the neutral hook class', () => {
    expect(fixture.debugElement.query(By.css('p-skeleton'))).toBeTruthy();
    expect(skeletonElement().classList).toContain('p-skeleton');
    expect(skeletonElement().classList).toContain('ngx-skeleton-shape');
  });

  it('maps width, height and circle shape', () => {
    host.model = { ...host.model, width: '250px', height: '2rem', shape: 'circle' };
    fixture.detectChanges();

    const el = skeletonElement();
    expect(el.style.width).toBe('250px');
    expect(el.style.height).toBe('2rem');
    expect(el.classList).toContain('p-skeleton-circle');
  });

  it('maps size and borderRadius', () => {
    host.model = { ...host.model, size: '3rem', borderRadius: '4px' };
    fixture.detectChanges();

    const el = skeletonElement();
    expect(el.style.width).toBe('3rem');
    expect(el.style.height).toBe('3rem');
    expect(el.style.borderRadius).toBe('4px');
  });

  it('applies styleClass', () => {
    host.model = { ...host.model, styleClass: 'my-custom-class' };
    fixture.detectChanges();
    expect(skeletonElement().classList).toContain('my-custom-class');
  });

  it('lets PrimeNG animate only for adapter-default', () => {
    expect(skeletonElement().classList).not.toContain('p-skeleton-animation-none');

    host.model = { ...host.model, animation: 'pulse' };
    fixture.detectChanges();
    expect(skeletonElement().classList).toContain('p-skeleton-animation-none');
    expect(skeletonElement().classList).toContain('ngx-skeleton-animation--pulse');
  });

  it('disables PrimeNG animation for suite modes and none', () => {
    for (const animation of ['shimmer', 'wave', 'none'] as const) {
      host.model = { ...host.model, animation };
      fixture.detectChanges();
      expect(skeletonElement().classList).toContain('p-skeleton-animation-none');
    }
  });
});

describe('providePrimeNgSkeleton (directive integration)', () => {
  it('renders PrimeNG skeletons through the directive', async () => {
    await TestBed.configureTestingModule({
      imports: [DirectiveHostComponent],
      providers: [
        provideNgxSkeleton({ delayMs: 0, minimumDurationMs: 0 }),
        providePrimeNgSkeleton(),
      ],
    }).compileComponents();

    const fixture: ComponentFixture<DirectiveHostComponent> =
      TestBed.createComponent(DirectiveHostComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('p-skeleton'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.real-content'))).toBeNull();
  });
});
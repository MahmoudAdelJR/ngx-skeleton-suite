import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  SkeletonDirective,
  SkeletonRenderModel,
  provideNgxSkeleton,
} from 'ngx-skeleton-suite';
import { MaterialSkeletonRendererComponent } from './material-skeleton-renderer.component';
import { provideMaterialSkeleton } from './provide-material-skeleton';

@Component({
  standalone: true,
  imports: [MaterialSkeletonRendererComponent],
  template: `<ngx-skeleton-material [model]="model" />`,
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

describe('MaterialSkeletonRendererComponent (ngx-skeleton-loader)', () => {
  let fixture: ComponentFixture<AdapterHostComponent>;
  let host: AdapterHostComponent;

  const loaderElement = (): HTMLElement =>
    fixture.debugElement.query(By.css('ngx-skeleton-loader')).nativeElement as HTMLElement;

  const innerElement = (): HTMLElement =>
    fixture.debugElement.query(By.css('.skeleton-loader')).nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdapterHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdapterHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the ngx-skeleton-loader element with neutral hooks', () => {
    expect(fixture.debugElement.query(By.css('ngx-skeleton-loader'))).toBeTruthy();
    expect(loaderElement().classList).toContain('ngx-skeleton-shape');
    expect(loaderElement().getAttribute('data-ngx-skeleton-shape')).toBe('');
  });

  it('maps width/height on the inner loader', () => {
    host.model = { ...host.model, width: '250px', height: '2rem' };
    fixture.detectChanges();

    const el = innerElement();
    expect(el.style.width).toBe('250px');
    expect(el.style.height).toBe('2rem');
  });

  it('maps circle shape', () => {
    host.model = { ...host.model, shape: 'circle' };
    fixture.detectChanges();
    expect(innerElement().classList).toContain('circle');
  });

  it('maps size to equal width/height', () => {
    host.model = { ...host.model, size: '3rem' };
    fixture.detectChanges();
    expect(innerElement().style.width).toBe('3rem');
    expect(innerElement().style.height).toBe('3rem');
  });

  it('maps animation engine and honors none', () => {
    expect(innerElement().classList).toContain('progress');

    host.model = { ...host.model, animation: 'pulse' };
    fixture.detectChanges();
    expect(innerElement().classList).toContain('pulse');

    host.model = { ...host.model, animation: 'none' };
    fixture.detectChanges();
    expect(innerElement().classList).not.toContain('progress');
    expect(innerElement().classList).not.toContain('pulse');
  });

  it('applies styleClass to the loader host', () => {
    host.model = { ...host.model, styleClass: 'my-custom-class' };
    fixture.detectChanges();
    expect(loaderElement().classList).toContain('my-custom-class');
  });
});

describe('provideMaterialSkeleton (directive integration)', () => {
  it('renders Material skeletons through the directive', async () => {
    await TestBed.configureTestingModule({
      imports: [DirectiveHostComponent],
      providers: [
        provideNgxSkeleton({ delayMs: 0, minimumDurationMs: 0 }),
        provideMaterialSkeleton(),
      ],
    }).compileComponents();

    const fixture: ComponentFixture<DirectiveHostComponent> =
      TestBed.createComponent(DirectiveHostComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('ngx-skeleton-loader'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.real-content'))).toBeNull();
  });
});
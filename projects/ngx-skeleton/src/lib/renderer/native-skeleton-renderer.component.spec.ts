import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkeletonRenderModel } from './skeleton-render-model';
import { NativeSkeletonRendererComponent } from './native-skeleton-renderer.component';

@Component({
  standalone: true,
  imports: [NativeSkeletonRendererComponent],
  template: `<ngx-skeleton-native [model]="model" />`,
})
class AdapterHostComponent {
  model: SkeletonRenderModel = {
    shape: 'rectangle',
    width: '100%',
    height: '1rem',
    animation: 'adapter-default',
  };
}

describe('NativeSkeletonRendererComponent', () => {
  let fixture: ComponentFixture<AdapterHostComponent>;
  let host: AdapterHostComponent;

  const shapeElement = (): HTMLElement =>
    fixture.debugElement.query(By.css('.ngx-skeleton-shape')).nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdapterHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdapterHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders a neutral shape element without any UI-library dependency', () => {
    expect(shapeElement()).toBeTruthy();
    expect(fixture.debugElement.query(By.css('p-skeleton'))).toBeNull();
    expect(fixture.debugElement.query(By.css('ngx-skeleton-loader'))).toBeNull();
    expect(shapeElement().getAttribute('data-ngx-skeleton-shape')).toBe('');
  });

  it('maps width and height', () => {
    host.model = { ...host.model, width: '250px', height: '2rem' };
    fixture.detectChanges();
    const el = shapeElement();
    expect(el.style.width).toBe('250px');
    expect(el.style.height).toBe('2rem');
  });

  it('maps size to equal width/height and circle radius', () => {
    host.model = { ...host.model, shape: 'circle', size: '3rem' };
    fixture.detectChanges();
    const el = shapeElement();
    expect(el.style.width).toBe('3rem');
    expect(el.style.height).toBe('3rem');
    expect(el.style.borderRadius).toBe('50%');
    expect(el.classList).toContain('ngx-skeleton-shape--circle');
  });

  it('honors explicit borderRadius', () => {
    host.model = { ...host.model, borderRadius: '8px' };
    fixture.detectChanges();
    expect(shapeElement().style.borderRadius).toBe('8px');
  });

  it('applies suite animation classes and marker', () => {
    host.model = { ...host.model, animation: 'shimmer' };
    fixture.detectChanges();
    const el = shapeElement();
    expect(el.classList).toContain('ngx-skeleton-animation--shimmer');
    expect(el.getAttribute('data-ngx-skeleton-animation')).toBe('shimmer');
  });

  it('applies styleClass', () => {
    host.model = { ...host.model, styleClass: 'my-custom-class' };
    fixture.detectChanges();
    expect(shapeElement().classList).toContain('my-custom-class');
  });
});
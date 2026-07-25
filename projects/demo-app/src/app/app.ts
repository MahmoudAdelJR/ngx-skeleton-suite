import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { SkeletonDirective, SkeletonAnimation, SkeletonGridConfig } from '../../../../projects/ngx-skeleton/src/public-api';

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  image: string;
}

interface UserProfile {
  id: number;
  name: string;
  role: string;
  avatar: string;
  repos: number;
  stars: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  // Source states
  readonly isBooleanLoading = signal<boolean>(true);
  readonly isSignalLoading = signal<boolean>(true);
  readonly observableLoading$ = new BehaviorSubject<boolean>(true);

  // Async data stream & promise sources
  userStream$ = new Subject<UserProfile>();
  userPromise: Promise<UserProfile> | undefined = undefined;

  // Configuration options
  selectedPreset: string = 'profile-card';
  selectedAnimation: SkeletonAnimation = 'wave';
  delayMs: number = 80;
  minDurationMs: number = 200;
  fadeInDuration: number = 250;

  readonly presetsList: string[] = [
    'profile-card',
    'card',
    'list-item',
    'avatar',
    'paragraph',
    'image-card',
  ];

  readonly productGridConfig: SkeletonGridConfig = {
    count: 3,
    minItemWidth: '17rem',
    gap: '1.5rem',
    itemPreset: 'card',
  };

  // Mock data
  readonly products: Product[] = [
    {
      id: 1,
      title: 'Quantum Wireless Headphones',
      category: 'Audio Equipment',
      price: 299.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    },
    {
      id: 2,
      title: 'Minimalist Mechanical Keyboard',
      category: 'Peripherals',
      price: 189.50,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    },
    {
      id: 3,
      title: 'Ultra-Wide Curved Display 34"',
      category: 'Monitors',
      price: 799.00,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    },
  ];

  constructor() {
    this.reloadAsyncData();
  }

  toggleAllLoading(): void {
    const nextState = !this.isBooleanLoading();
    this.isBooleanLoading.set(nextState);
    this.isSignalLoading.set(nextState);
    this.observableLoading$.next(nextState);

    if (nextState) {
      this.reloadAsyncData();
    }
  }

  reloadAsyncData(): void {
    // Reset loading state to show skeletons
    this.isBooleanLoading.set(true);
    this.isSignalLoading.set(true);
    this.observableLoading$.next(true);

    // Create fresh pending Promise
    this.userPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 101,
          name: 'Elena Rostova',
          role: 'Principal Frontend Engineer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
          repos: 58,
          stars: 2450,
        });
      }, 1200);
    });

    // Re-create Subject stream
    this.userStream$ = new Subject<UserProfile>();
    setTimeout(() => {
      this.userStream$.next({
        id: 102,
        name: 'Marcus Vance',
        role: 'Staff Solutions Architect',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
        repos: 84,
        stars: 3910,
      });
    }, 1400);

    // Finish loading flags after 1.2s
    setTimeout(() => {
      this.isBooleanLoading.set(false);
      this.isSignalLoading.set(false);
      this.observableLoading$.next(false);
    }, 1200);
  }

  triggerRapidFetch(): void {
    this.isBooleanLoading.set(true);
    setTimeout(() => {
      this.isBooleanLoading.set(false);
    }, 40);
  }
}

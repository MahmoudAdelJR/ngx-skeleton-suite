import { SkeletonPreset } from '../preset/preset.models';

export interface SkeletonResponsiveColumns {
  default: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface SkeletonGridConfig {
  count?: number;
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  minItemWidth?: string;
  columns?: number | SkeletonResponsiveColumns;
  itemPreset?: string | SkeletonPreset;
  alignItems?: 'stretch' | 'start' | 'center' | 'end';
}

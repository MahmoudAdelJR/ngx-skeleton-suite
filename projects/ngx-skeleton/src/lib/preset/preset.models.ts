export interface SkeletonShapeNode {
  type?: 'shape';
  shape?: 'rectangle' | 'circle';
  width?: string;
  height?: string;
  size?: string;
  borderRadius?: string;
  styleClass?: string;
}

export interface SkeletonStackNode {
  type: 'stack';
  direction?: 'row' | 'column';
  gap?: string;
  alignItems?: string;
  justifyContent?: string;
  grow?: boolean;
  children: SkeletonPresetNode[];
}

export type SkeletonPresetNode = SkeletonShapeNode | SkeletonStackNode;

export interface SkeletonPreset {
  name: string;
  containerClass?: string;
  shapes: SkeletonPresetNode[];
}

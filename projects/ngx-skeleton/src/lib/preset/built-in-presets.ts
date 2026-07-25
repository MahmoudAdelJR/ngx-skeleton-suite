import { SkeletonPreset } from './preset.models';

export const LINE_PRESET: SkeletonPreset = {
  name: 'line',
  shapes: [{ type: 'shape', width: '100%', height: '1rem' }],
};

export const PARAGRAPH_PRESET: SkeletonPreset = {
  name: 'paragraph',
  shapes: [
    {
      type: 'stack',
      direction: 'column',
      gap: '0.5rem',
      children: [
        { type: 'shape', width: '100%', height: '0.875rem' },
        { type: 'shape', width: '92%', height: '0.875rem' },
        { type: 'shape', width: '60%', height: '0.875rem' },
      ],
    },
  ],
};

export const AVATAR_PRESET: SkeletonPreset = {
  name: 'avatar',
  shapes: [{ type: 'shape', shape: 'circle', size: '3rem' }],
};

export const LIST_ITEM_PRESET: SkeletonPreset = {
  name: 'list-item',
  shapes: [
    {
      type: 'stack',
      direction: 'row',
      gap: '1rem',
      alignItems: 'center',
      children: [
        { type: 'shape', shape: 'circle', size: '2.5rem' },
        {
          type: 'stack',
          direction: 'column',
          gap: '0.4rem',
          grow: true,
          children: [
            { type: 'shape', width: '70%', height: '1rem' },
            { type: 'shape', width: '40%', height: '0.75rem' },
          ],
        },
      ],
    },
  ],
};

export const PROFILE_CARD_PRESET: SkeletonPreset = {
  name: 'profile-card',
  containerClass: 'ngx-skeleton-preset-profile-card',
  shapes: [
    {
      type: 'stack',
      direction: 'row',
      gap: '1.25rem',
      alignItems: 'center',
      children: [
        { type: 'shape', shape: 'circle', size: '4.5rem' },
        {
          type: 'stack',
          direction: 'column',
          gap: '0.5rem',
          grow: true,
          children: [
            { type: 'shape', width: '65%', height: '1.25rem' },
            { type: 'shape', width: '45%', height: '0.875rem' },
            { type: 'shape', width: '80%', height: '0.75rem' },
          ],
        },
      ],
    },
  ],
};

export const CARD_PRESET: SkeletonPreset = {
  name: 'card',
  containerClass: 'ngx-skeleton-preset-card',
  shapes: [
    {
      type: 'stack',
      direction: 'column',
      gap: '1rem',
      children: [
        { type: 'shape', width: '100%', height: '10rem' },
        { type: 'shape', width: '75%', height: '1.25rem' },
        { type: 'shape', width: '100%', height: '0.875rem' },
        { type: 'shape', width: '40%', height: '0.875rem' },
      ],
    },
  ],
};

export const TABLE_ROW_PRESET: SkeletonPreset = {
  name: 'table-row',
  shapes: [
    {
      type: 'stack',
      direction: 'row',
      gap: '1rem',
      alignItems: 'center',
      children: [
        { type: 'shape', width: '20%', height: '1rem' },
        { type: 'shape', width: '40%', height: '1rem' },
        { type: 'shape', width: '25%', height: '1rem' },
        { type: 'shape', width: '15%', height: '1rem' },
      ],
    },
  ],
};

export const IMAGE_CARD_PRESET: SkeletonPreset = {
  name: 'image-card',
  shapes: [
    {
      type: 'stack',
      direction: 'column',
      gap: '0.75rem',
      children: [
        { type: 'shape', width: '100%', height: '12rem', borderRadius: '0.5rem' },
        { type: 'shape', width: '60%', height: '1.1rem' },
      ],
    },
  ],
};

export const BUILT_IN_PRESETS: SkeletonPreset[] = [
  LINE_PRESET,
  PARAGRAPH_PRESET,
  AVATAR_PRESET,
  LIST_ITEM_PRESET,
  PROFILE_CARD_PRESET,
  CARD_PRESET,
  TABLE_ROW_PRESET,
  IMAGE_CARD_PRESET,
];

import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://MahmoudAdelJR.github.io',
  base: '/ngx-skeleton-suite',
  build: {
    assets: 'assets',
  },
  integrations: [
    starlight({
      title: 'NGX-SKELETON SUITE',
      description: 'Zero-CLS Angular Skeleton Loading Library with Composite Presets & CSS Grid Engine.',
      customCss: ['./src/styles/starlight-custom.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/MahmoudAdelJR/ngx-skeleton-suite' },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Overview & Features', slug: '' },
            { label: 'Installation & Setup', slug: 'getting-started' },
          ],
        },
        {
          label: 'Guides & Customization',
          items: [
            { label: 'Styling & Custom SCSS', slug: 'styling-and-themes' },
            { label: 'Presets Catalog', slug: 'presets-catalog' },
            { label: 'Responsive CSS Grid', slug: 'responsive-grid' },
            { label: 'Async & Signals', slug: 'async-sources' },
            { label: 'Flicker & CLS Protection', slug: 'cls-stability' },
          ],
        },
        {
          label: 'Reference & Interactive',
          items: [
            { label: 'API Reference', slug: 'api-reference' },
            { label: 'Interactive Playground', slug: 'playground' },
          ],
        },
      ],
    }),
  ],
});

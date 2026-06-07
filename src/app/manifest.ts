import type { MetadataRoute } from 'next';
import { templateMetadata } from '@/tool';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: templateMetadata.appName,
    short_name: templateMetadata.shortName,
    description: templateMetadata.appDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#f1f5f9',
    theme_color: '#8b5cf6',
    icons: [
      { src: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
  };
}

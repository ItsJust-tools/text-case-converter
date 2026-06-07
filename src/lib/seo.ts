import type { Metadata } from 'next';
import { getPublicSiteUrl, templateMetadata } from '@/tool';

export function generateSeoMetadata(): Metadata {
  const siteUrl = getPublicSiteUrl();
  const description = templateMetadata.appDescription;

  return {
    title: {
      default: templateMetadata.appName,
      template: `%s | ${templateMetadata.appName}`,
    },
    description,
    keywords: [
      'text case converter',
      'case converter',
      'uppercase',
      'lowercase',
      'title case',
      'camelCase',
      'snake_case',
      'kebab-case',
      'PascalCase',
      'text transformer',
      'developer tools',
      'web tools',
    ],
    authors: [{ name: 'ItsJust Tools' }],
    creator: 'ItsJust Tools',
    publisher: 'ItsJust Tools',
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: templateMetadata.appName,
      description,
      url: siteUrl,
      siteName: templateMetadata.appName,
      locale: templateMetadata.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: templateMetadata.appName,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}
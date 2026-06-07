import type { ToolConfig } from '@itsjust/core';
import { getPublicSiteUrl } from '@/tool';

interface JsonLdProps {
  config: ToolConfig;
}

export function JsonLd({ config }: JsonLdProps) {
  const siteUrl = getPublicSiteUrl();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.name,
    description: config.description,
    url: siteUrl,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
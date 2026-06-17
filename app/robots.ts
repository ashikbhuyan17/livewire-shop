import type { MetadataRoute } from 'next';
import { resolveMetadataBase } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const host = resolveMetadataBase().origin;
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout', '/api/', '/user/'],
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}

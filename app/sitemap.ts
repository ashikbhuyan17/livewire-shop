import type { MetadataRoute } from 'next';
import { resolveMetadataBase } from '@/lib/site';

const STATIC = [
  '',
  '/about',
  '/contact',
  '/faq',
  '/help',
  '/brands',
  '/our-outlets',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = resolveMetadataBase().origin;
  const lastModified = new Date();
  return STATIC.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === '' ? ('daily' as const) : ('weekly' as const),
    priority: path === '' ? 1 : 0.8,
  }));
}

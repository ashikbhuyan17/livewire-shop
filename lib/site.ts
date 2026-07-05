import { cache } from 'react';
import type { Metadata } from 'next';
import { publicFetcher } from '@/lib/fetcher';
import { DEMO_SITE_SETTINGS, type DemoSiteSettings } from '@/lib/demo-site-data';

export const SITE_BRAND_SHORT = 'Livewire';

export type SiteSettingsData = DemoSiteSettings;

const SETTINGS_REVALIDATE = 3600;

type SettingsResponse = {
  success?: boolean;
  status?: boolean;
  data?: SiteSettingsData;
};

/** Single cached settings fetch shared by layout + metadata. Falls back to demo data. */
export const getSiteSettingsPublic = cache(async (): Promise<SiteSettingsData> => {
  const res = await publicFetcher<SettingsResponse>(
    '/settings',
    {},
    SETTINGS_REVALIDATE,
  );

  const apiData = res?.data;
  if (!apiData) return DEMO_SITE_SETTINGS;

  return { ...DEMO_SITE_SETTINGS, ...apiData };
});

export function resolveMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw.endsWith('/') ? raw.slice(0, -1) : raw);
    } catch {
      /* fallthrough */
    }
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL('http://localhost:3000');
}

export function getAbsoluteImageFilename(
  filename?: string | null,
): string | undefined {
  if (!filename?.trim()) return undefined;
  const base = process.env.NEXT_PUBLIC_IMG_URL?.replace(/\/$/, '');
  if (!base) return undefined;
  return `${base}/${String(filename).replace(/^\//, '')}`;
}

export function slugToLabel(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/** Per-page defaults merged with layout (title uses root template suffix). */
export function buildPageMeta(input: {
  title: string;
  description: string;
  pathname: string;
  keywords?: string[];
  robots?: Metadata['robots'];
  ogImage?: string | null;
}): Metadata {
  const {
    title,
    description,
    pathname,
    keywords,
    robots = { index: true, follow: true },
    ogImage,
  } = input;
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const meta: Metadata = {
    title,
    description,
    robots,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      siteName: SITE_BRAND_SHORT,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
    },
  };
  if (keywords?.length) meta.keywords = keywords;
  if (ogImage) {
    meta.openGraph = {
      ...meta.openGraph,
      images: [{ url: ogImage, alt: title }],
    };
    meta.twitter = { ...meta.twitter, images: [ogImage] };
  }
  return meta;
}

/** Account, checkout — avoid indexing transactional / personal URLs. */
export const PRIVATE_ROUTE_ROBOTS: Metadata['robots'] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

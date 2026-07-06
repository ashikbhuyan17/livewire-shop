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

type BusinessSettingsData = {
  business_name?: string;
  business_email?: string;
  business_phone?: string;
  business_address?: string;
  about_text?: string;
  about?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  title?: string;
  logo?: string;
  fav_icon?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp?: string;
  tiktok?: string;
  pinterest?: string;
  weaccept?: SiteSettingsData['weaccept'];
};

type BusinessSettingsResponse = {
  success?: boolean;
  message?: string;
  data?: BusinessSettingsData;
};

function buildCopyrightText(businessName?: string): string {
  const name = businessName?.trim() || SITE_BRAND_SHORT;
  return `© ${new Date().getFullYear()} ${name}. All rights reserved.`;
}

function mapBusinessSettings(data: BusinessSettingsData): SiteSettingsData {
  return {
    ...DEMO_SITE_SETTINGS,
    meta_title: data.meta_title || data.title || DEMO_SITE_SETTINGS.meta_title,
    meta_description:
      data.meta_description || DEMO_SITE_SETTINGS.meta_description,
    meta_keywords: data.meta_keywords || DEMO_SITE_SETTINGS.meta_keywords,
    about_text:
      data.about_text?.trim() ||
      data.about?.trim() ||
      DEMO_SITE_SETTINGS.about_text,
    phone_1: data.business_phone || DEMO_SITE_SETTINGS.phone_1,
    mail: data.business_email || DEMO_SITE_SETTINGS.mail,
    address: data.business_address || DEMO_SITE_SETTINGS.address,
    copyright_text: buildCopyrightText(data.business_name || data.title),
    light_logo: data.logo || DEMO_SITE_SETTINGS.light_logo,
    fav_icon: data.fav_icon || DEMO_SITE_SETTINGS.fav_icon,
    fb_link: data.facebook || DEMO_SITE_SETTINGS.fb_link,
    insta_link: data.instagram || DEMO_SITE_SETTINGS.insta_link,
    twitter_link: data.twitter || DEMO_SITE_SETTINGS.twitter_link,
    youtube_link: data.youtube || DEMO_SITE_SETTINGS.youtube_link,
    linkedin_link: data.linkedin || DEMO_SITE_SETTINGS.linkedin_link,
    whatsapp: data.whatsapp || DEMO_SITE_SETTINGS.whatsapp,
    tiktok_link: data.tiktok || DEMO_SITE_SETTINGS.tiktok_link,
    pinterest_link: data.pinterest || DEMO_SITE_SETTINGS.pinterest_link,
    weaccept: Array.isArray(data.weaccept) ? data.weaccept : [],
  };
}

/** Single cached settings fetch shared by layout + metadata. Falls back to demo data. */
export const getSiteSettingsPublic = cache(async (): Promise<SiteSettingsData> => {
  const businessRes = await publicFetcher<BusinessSettingsResponse>(
    '/business-settings',
    {},
    SETTINGS_REVALIDATE,
  );

  if (businessRes?.success && businessRes.data) {
    return mapBusinessSettings(businessRes.data);
  }

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

import { cache } from 'react';
import { publicFetcher } from '@/lib/fetcher';

const REVALIDATE = 3600;

export type FooterPage = {
  id?: number;
  title?: string;
  slug?: string;
  content?: string | null;
  type?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
};

type FooterPagesResponse = {
  success?: boolean;
  message?: string;
  data?: Array<{
    id?: number;
    title?: string;
    slug?: string;
  }>;
};

type FooterPageDetailResponse = {
  success?: boolean;
  message?: string;
  data?: {
    id?: number;
    type?: string;
    title?: string;
    slug?: string;
    content?: string | null;
    seo_title?: string | null;
    seo_desc?: string | null;
    seo_keywords?: string | null;
  };
};

export function footerPageHref(slug: string): string {
  return `/pages/${encodeURIComponent(slug.trim())}`;
}

function mapFooterPageDetail(
  item: NonNullable<FooterPageDetailResponse['data']>,
): FooterPage {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    content: item.content,
    type: item.type,
    meta_title: item.seo_title,
    meta_description: item.seo_desc,
    meta_keywords: item.seo_keywords,
  };
}

export const getFooterPages = cache(async (): Promise<FooterPage[]> => {
  const res = await publicFetcher<FooterPagesResponse>(
    '/footer-pages',
    {},
    REVALIDATE,
  );

  if (!res?.success || !Array.isArray(res.data)) return [];

  return res.data.filter((page) => page.slug?.trim() && page.title?.trim());
});

export const getFooterPageBySlug = cache(
  async (slug: string): Promise<FooterPage | null> => {
    const key = slug.trim();
    if (!key) return null;

    const res = await publicFetcher<FooterPageDetailResponse>(
      `/footer-page/${encodeURIComponent(key)}`,
      {},
      REVALIDATE,
    );

    if (!res?.success || !res.data?.slug?.trim()) return null;
    return mapFooterPageDetail(res.data);
  },
);

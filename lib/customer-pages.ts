import { cache } from 'react';
import { publicFetcher } from '@/lib/fetcher';

const REVALIDATE = 3600;

export type CustomerPage = {
  id?: number;
  title?: string;
  slug?: string;
  content?: string | null;
  custom_css?: string | null;
  custom_js?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  meta_image?: string | null;
  type?: string | null;
  status?: string | null;
};

export type CustomerPagesResponse = {
  status?: boolean;
  message?: string;
  data?: CustomerPage[];
};

export function customerPageHref(slug: string): string {
  return `/pages/${encodeURIComponent(slug.trim())}`;
}

export function isCustomerPageActive(page: CustomerPage): boolean {
  const status = String(page.status ?? '1').trim();
  return status === '1' || status === 'true' || status === 'active';
}

export const getCustomerPages = cache(async (): Promise<CustomerPage[]> => {
  try {
    const res = await publicFetcher<CustomerPagesResponse>(
      '/customer-pages',
      {},
      REVALIDATE,
    );
    if (!res?.status || !Array.isArray(res.data)) return [];
    return res.data.filter(
      (p) => p.slug?.trim() && p.title?.trim() && isCustomerPageActive(p),
    );
  } catch {
    return [];
  }
});

export async function getCustomerPageBySlug(
  slug: string,
): Promise<CustomerPage | null> {
  const key = slug.trim();
  if (!key) return null;
  const pages = await getCustomerPages();
  return pages.find((p) => p.slug === key) ?? null;
}

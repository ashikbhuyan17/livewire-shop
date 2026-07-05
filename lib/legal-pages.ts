import { cache } from 'react';
import { publicFetcher } from '@/lib/fetcher';

const REVALIDATE = 3600;

export type LegalPage = {
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
  google_schema?: string | null;
  type?: string | null;
  status?: string | null;
};

type LegalPagesResponse = {
  success?: boolean;
  status?: boolean;
  message?: string;
  data?: LegalPage[];
};

export function legalPageHref(slug: string): string {
  return `/pages/${encodeURIComponent(slug.trim())}`;
}

export function isLegalPageActive(page: LegalPage): boolean {
  const status = String(page.status ?? '1').trim();
  return status === '1' || status === 'true' || status === 'active';
}

export const getLegalPages = cache(async (): Promise<LegalPage[]> => {
  const res = await publicFetcher<LegalPagesResponse>(
    '/legal-pages',
    {},
    REVALIDATE,
  );

  if (!res?.success && !res?.status) return [];
  if (!Array.isArray(res.data)) return [];

  return res.data.filter(
    (p) => p.slug?.trim() && p.title?.trim() && isLegalPageActive(p),
  );
});

export async function getLegalPageBySlug(
  slug: string,
): Promise<LegalPage | null> {
  const key = slug.trim();
  if (!key) return null;
  const pages = await getLegalPages();
  return pages.find((p) => p.slug === key) ?? null;
}

import type { CustomerPage } from '@/lib/customer-pages';
import {
  getCustomerPageBySlug,
  getCustomerPages,
} from '@/lib/customer-pages';
import type { LegalPage } from '@/lib/legal-pages';
import { getLegalPageBySlug, getLegalPages } from '@/lib/legal-pages';

export type ContentPage = CustomerPage | LegalPage;

export function contentPageHref(slug: string): string {
  return `/pages/${encodeURIComponent(slug.trim())}`;
}

export async function getAllContentPages(): Promise<ContentPage[]> {
  const [customer, legal] = await Promise.all([
    getCustomerPages(),
    getLegalPages(),
  ]);
  return [...customer, ...legal];
}

export async function getContentPageBySlug(
  slug: string,
): Promise<ContentPage | null> {
  const key = slug.trim();
  if (!key) return null;
  return (await getLegalPageBySlug(key)) ?? (await getCustomerPageBySlug(key));
}

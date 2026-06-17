import type { Metadata } from 'next';
import CatalogBreadcrumbs from '@/components/category/CatalogBreadcrumbs';
import SearchResults from '@/components/search/SearchResults';
import { fetchSearchProducts } from '@/lib/search';
import { SITE_BRAND_SHORT, buildPageMeta } from '@/lib/site';

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  if (!query) {
    return buildPageMeta({
      title: 'Search products',
      description: `Search groceries, brands, and deals on ${SITE_BRAND_SHORT}.`,
      pathname: '/search',
      keywords: ['search', 'products', 'groceries', SITE_BRAND_SHORT],
    });
  }
  return buildPageMeta({
    title: `Search: ${query}`,
    description: `Shop products matching "${query}" on ${SITE_BRAND_SHORT}.`,
    pathname: `/search?q=${encodeURIComponent(query)}`,
    keywords: [query, 'search', SITE_BRAND_SHORT],
    robots: { index: false, follow: true },
  });
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  const result = await fetchSearchProducts(query);

  return (
    <div className="mx-auto max-w-[95rem] px-2 py-4 sm:px-4">
      <CatalogBreadcrumbs
        items={[
          { label: 'Home', href: '/' },
          {
            label: query ? `Search: ${query}` : 'Search',
          },
        ]}
      />
      <SearchResults result={result} />
    </div>
  );
}

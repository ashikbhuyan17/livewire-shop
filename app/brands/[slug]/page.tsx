import Link from 'next/link';
import AllProducts from '@/components/common/AllProducts';
import type { Metadata } from 'next';
import { SITE_BRAND_SHORT, buildPageMeta, slugToLabel } from '@/lib/site';
import { publicFetcher } from '@/lib/fetcher';

const REVALIDATE = 300;

function hrefPage(slug: string, page: number) {
  if (page <= 1) return `/brands/${encodeURIComponent(slug)}`;
  return `/brands/${encodeURIComponent(slug)}?page=${page}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = slugToLabel(slug);
  return buildPageMeta({
    title: `${label}`,
    description: `Shop ${label} products online — ${SITE_BRAND_SHORT}.`,
    pathname: `/brands/${slug}`,
    keywords: [label, 'brand', 'grocery', SITE_BRAND_SHORT],
  });
}

export default async function BrandProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(String(sp.page ?? '1'), 10) || 1);
  const qs = page > 1 ? `?page=${page}` : '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await publicFetcher(
    `/brand-products/${slug}${qs}`,
    {},
    REVALIDATE,
  ).catch(() => ({}));

  const label = slugToLabel(slug);
  const pg = res?.data;
  const current = pg?.current_page ?? page;
  const last = pg?.last_page ?? 1;
  const total = pg?.total;

  return (
    <div className="max-w-[95rem] mx-auto px-4 py-4">
      <div className="text-sm text-gray-500 justify-between flex items-start mb-4 border-b border-gray-200 pb-3">
        <div>
          <Link href="/">Home</Link> &gt;{' '}
          <Link href="/brands" className="hover:text-gray-700">
            Our brands
          </Link>{' '}
          &gt; <span className="text-gray-700">{label}</span>
        </div>
        <div className="text-black font-semibold">{label}</div>
      </div>

      <AllProducts allProducts={res} />

      {last > 1 && (
        <nav
          className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t pt-4"
          aria-label="Pagination"
        >
          {current > 1 ? (
            <Link
              href={hrefPage(slug, current - 1)}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
            >
              Previous
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-sm text-muted-foreground">
              Previous
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            Page {current} of {last}
            {total != null ? ` · ${total} items` : ''}
          </span>
          {current < last ? (
            <Link
              href={hrefPage(slug, current + 1)}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
            >
              Next
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-sm text-muted-foreground">
              Next
            </span>
          )}
        </nav>
      )}
    </div>
  );
}

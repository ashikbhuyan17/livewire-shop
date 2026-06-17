import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import PartnerLogo from '@/public/partner_logo.webp';
import type { Metadata } from 'next';
import { buildPageMeta, slugToLabel } from '@/lib/site';
import { publicFetcher } from '@/lib/fetcher';

export const metadata: Metadata = buildPageMeta({
  title: 'Our brands',
  description:
    'Browse trusted grocery and FMCG brands — discover products by brand at BestFood City.',
  pathname: '/brands',
  keywords: ['shop brands', 'grocery brands', 'BestFood City brands'],
});

export default async function BrandsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await publicFetcher('/brands', {}, 600).catch(() => ({}));
  const brands = Array.isArray(res?.data) ? res.data : res?.data?.data ?? [];

  const imgBase = process.env.NEXT_PUBLIC_IMG_URL?.replace(/\/$/, '') ?? '';

  return (
    <div className="max-w-[95rem] mx-auto px-4 py-4">
      <div className="text-sm text-gray-500 justify-between flex items-start mb-4 border-b border-gray-200 pb-3">
        <div>
          <Link href="/">Home</Link> &gt;{' '}
          <span className="text-gray-700">Our brands</span>
        </div>
        <div className="text-black font-semibold">Our brands</div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-3 items-stretch mx-auto mt-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {brands.map((b: any) => {
          const slug = b?.slug != null ? String(b.slug) : '';
          if (!slug) return null;
          const label =
            (b?.name && String(b.name)) ||
            (b?.title && String(b.title)) ||
            slugToLabel(slug);
          const raw = b?.image ?? b?.logo ?? b?.brand_image ?? b?.thumbnail;
          const src =
            raw && imgBase
              ? `${imgBase}/${String(raw).replace(/^\//, '')}`
              : PartnerLogo;

          return (
            <Link
              key={b?.id ?? slug}
              href={`/brands/${encodeURIComponent(slug)}`}
              prefetch={false}
            >
              <Card className="overflow-hidden h-full rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-muted/40 p-3 flex items-center justify-center">
                  <Image
                    alt={label}
                    src={src}
                    width={220}
                    height={160}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-center text-sm font-semibold bg-[#e8edf0] py-2 px-1">
                  {label}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

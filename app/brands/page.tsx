import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import PartnerLogo from '@/public/partner_logo.webp';
import type { Metadata } from 'next';
import { fetchBrands } from '@/lib/brands';
import { buildPageMeta, SITE_BRAND_SHORT } from '@/lib/site';

export const revalidate = 600;

export const metadata: Metadata = buildPageMeta({
  title: 'Our brands',
  description: `Browse trusted gadget and mobile brands at ${SITE_BRAND_SHORT}.`,
  pathname: '/brands',
  keywords: ['shop brands', 'mobile brands', 'Livewire brands'],
});

export default async function BrandsPage() {
  const brands = await fetchBrands();

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
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${encodeURIComponent(brand.slug)}`}
          >
            <Card className="overflow-hidden h-full rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] bg-muted/40 p-3 flex items-center justify-center">
                <Image
                  alt={brand.title}
                  src={brand.image || PartnerLogo}
                  width={220}
                  height={160}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-center text-sm font-semibold bg-[#e8edf0] py-2 px-1">
                {brand.title}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

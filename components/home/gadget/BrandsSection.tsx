import Image from 'next/image';
import Link from 'next/link';
import type { BrandItem } from '@/lib/brands';
import PartnerLogo from '@/public/partner_logo.webp';

type Props = {
  brands: BrandItem[];
};

export default function BrandsSection({ brands }: Props) {
  if (brands.length === 0) return null;

  return (
    <section
      className="px-1 sm:px-4 lg:px-6"
      aria-labelledby="shop-brands-heading"
    >
      <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
        <h2
          id="shop-brands-heading"
          className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl md:text-2xl"
        >
          Shop by Brands
        </h2>
        <Link
          href="/brands"
          className="shrink-0 rounded-md border-2 border-primary bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary transition hover:bg-primary hover:text-white sm:px-4 sm:py-2 sm:text-xs"
        >
          See all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2.5 min-[480px]:grid-cols-3 sm:grid-cols-4 sm:gap-3 md:gap-3.5 lg:grid-cols-6 lg:gap-4">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${encodeURIComponent(brand.slug)}`}
            className="group overflow-hidden rounded-xl bg-[#f3f4f6] transition-all duration-300 hover:bg-white hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)] hover:ring-2 hover:ring-primary/25 sm:rounded-2xl"
          >
            <div className="relative flex aspect-[4/3] items-center justify-center p-3">
              <Image
                src={brand.image || PartnerLogo}
                alt={brand.title}
                width={160}
                height={120}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="border-t border-slate-200/80 bg-white/80 px-2 py-2 text-center">
              <span className="line-clamp-2 text-[11px] font-semibold leading-snug text-slate-800 transition-colors duration-300 group-hover:text-primary sm:text-xs">
                {brand.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

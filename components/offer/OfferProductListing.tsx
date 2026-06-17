import Image from 'next/image';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import GridBanner from '@/public/grid_banner.webp';
import ProductCard from '@/components/common/ProductCard';
import { publicFetcher } from '@/lib/fetcher';
import { enrichProductForCard } from '@/lib/product-utils';

export { enrichProductForCard };

type ProductListResponse = {
  status?: boolean;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[];
};

export type OfferProductListingProps = {
  apiPath: string;
  eyebrow: string;
  title: string;
  description: string;
  gridSectionTitle: string;
  emptyTitle: string;
  emptyHint: string;
  promoLink: string;
  chip1: string;
  chip2: string;
  HeroIcon: LucideIcon;
};

export default async function OfferProductListing({
  apiPath,
  eyebrow,
  title,
  description,
  gridSectionTitle,
  emptyTitle,
  emptyHint,
  promoLink,
  chip1,
  chip2,
  HeroIcon,
}: OfferProductListingProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products: any[] = [];

  try {
    const res = (await publicFetcher(
      apiPath,
      {},
      300,
    )) as ProductListResponse;
    const raw = res?.data;
    if (Array.isArray(raw)) {
      products = raw.filter(Boolean).map((p) => enrichProductForCard(p));
    }
  } catch {
    products = [];
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-[#F7941D]/12 via-muted/35 to-background px-4 sm:px-6 md:px-10 py-6 md:py-9 shadow-sm">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <HeroIcon className="h-3.5 w-3.5" aria-hidden />
              {eyebrow}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>
            {products.length > 0 && (
              <p className="mt-3 text-xs font-medium text-foreground/80 md:text-sm">
                {products.length}{' '}
                {products.length === 1 ? 'product' : 'products'} on offer right
                now
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
            <span className="inline-flex items-center rounded-full border border-border/80 bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
              {chip1}
            </span>
            <span className="inline-flex items-center rounded-full border border-border/80 bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
              {chip2}
            </span>
          </div>
        </div>
      </section>

      <div>
        <h2 className="sr-only">Promotions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Link
              key={i}
              href={promoLink}
              className="group overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <Image
                alt=""
                src={GridBanner}
                className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-1 border-b border-border/80 pb-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground md:text-xl">
            {gridSectionTitle}
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Tap a card for details, sizes, and add to bag.
          </p>
        </div>
        {products.length === 0 ? (
          <div
            className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-16 text-center"
            role="status"
          >
            <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 items-stretch mx-auto">
            {products.map((product) => (
              <div
                key={product?.id}
                className="flex justify-center sm:justify-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Hash,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Search,
  Star,
  Store,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { CURRENCY_SYMBOL, formatAmount } from '@/lib/currency';
import { cn } from '@/lib/utils';

const imgBase = process.env.NEXT_PUBLIC_IMG_URL?.replace(/\/$/, '') ?? '';

function imgUrl(path?: string | null) {
  if (!path?.trim()) return '';
  return `${imgBase}/${path.replace(/^\//, '')}`;
}

type VendorProductVariant = {
  regular_price?: string;
  sale_price?: string;
};

export type VendorStoreProduct = {
  id?: number;
  name?: string;
  slug?: string;
  thumbnail_img?: string | null;
  productvariants?: VendorProductVariant[];
};

type VendorStoreVendor = {
  id?: number;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string | null;
  avg_rating?: string | null;
  email?: string;
  phone?: string;
  company_address?: string;
  city?: string;
  country?: string;
};

export type VendorStoreInitialData = {
  message?: string;
  vendor?: VendorStoreVendor | null;
  products?: VendorStoreProduct[];
};

/** Loose shape for /vendor-review rows — display API fields as-is. */
export type VendorReviewRow = {
  id: number;
  rating?: string;
  review?: string;
  created_at?: string;
  user?: { name?: string; profile_image?: string | null };
};

function variantPricing(product: VendorStoreProduct) {
  const v = product.productvariants?.[0];
  const reg = Number(v?.regular_price ?? 0);
  const sale = Number(v?.sale_price ?? 0);
  const hasSale = sale > 0 && reg > 0 && sale !== reg;
  const showSale = hasSale && sale < reg;
  const effective = showSale ? sale : sale > 0 ? sale : reg;
  const pct =
    showSale && reg > 0 ? Math.round(((reg - sale) / reg) * 100) : 0;
  return { reg, effective, pct, showSale };
}

function ratingStars(avgRating?: string | null) {
  const raw = Number(avgRating ?? 0);
  const outOf5 = Math.min(5, Math.max(0, raw / 20));
  return {
    score: raw > 0 ? `${Math.round(outOf5 * 10) / 10}` : '—',
  };
}

export default function VendorStoreView({
  initialData,
  vendorId,
  initialReviews,
  reviewsFetchFailed = false,
}: {
  initialData: VendorStoreInitialData;
  vendorId: string;
  initialReviews: VendorReviewRow[];
  reviewsFetchFailed?: boolean;
}) {
  const vendor = initialData?.vendor;
  const [q, setQ] = useState('');

  const products = useMemo(() => {
    const raw = initialData.products;
    return Array.isArray(raw) ? raw : [];
  }, [initialData.products]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter(
      (p) =>
        String(p.name ?? '')
          .toLowerCase()
          .includes(s) ||
        String(p.slug ?? '')
          .toLowerCase()
          .includes(s),
    );
  }, [products, q]);

  const [activeTab, setActiveTab] = useState('products');

  const reviewStats = useMemo(() => {
    if (!initialReviews.length) return { avg: null, count: 0 };
    const sum = initialReviews.reduce(
      (acc, r) => acc + (Number(r.rating) || 0),
      0,
    );
    return { avg: sum / initialReviews.length, count: initialReviews.length };
  }, [initialReviews]);

  if (!vendor) return null;

  const { score } = ratingStars(vendor.avg_rating);

  const displayName =
    vendor.company_name?.trim() ||
    [vendor.first_name, vendor.last_name].filter(Boolean).join(' ') ||
    'Store';

  const locationText = [
    vendor.company_address?.trim(),
    vendor.city?.trim(),
    vendor.country?.trim(),
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen bg-[#f6f7f8] pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d4f4a] via-[#126b5f] to-[#0a3d38] pb-28 pt-6 sm:pb-32 sm:pt-8">
        <div
          className="pointer-events-none absolute -right-16 top-8 h-64 w-64 rounded-full bg-white/5 blur-3xl sm:right-10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-[#F7941D]/10 blur-2xl"
          aria-hidden
        />
        <div className="pointer-events-none absolute right-[12%] top-1/4 opacity-[0.12]">
          <Home className="h-32 w-32 text-white sm:h-40 sm:w-40" strokeWidth={1} />
        </div>

        <div className="relative mx-auto max-w-[95rem] px-4 sm:px-6">
          <nav
            className="mb-3 flex flex-wrap items-center gap-1 text-xs text-white/85 sm:text-sm"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-white hover:underline">
              Home
            </Link>
            <span className="text-white/50" aria-hidden>
              /
            </span>
            <span className="font-medium text-white">{displayName}</span>
          </nav>
          <div className="relative z-10 -mb-20 max-w-lg rounded-2xl border border-white/10 bg-white p-4 shadow-xl shadow-black/15 sm:-mb-24 sm:p-5">
            <div className="flex gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-muted sm:h-24 sm:w-24">
                {vendor.profile_image ? (
                  <Image
                    src={imgUrl(vendor.profile_image)}
                    alt=""
                    width={120}
                    height={120}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-headerBg/10 text-headerBg">
                    <Store className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold leading-tight text-gray-900 sm:text-xl">
                  {displayName}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#F7941D] text-[#F7941D]" />
                    <span className="font-medium text-foreground">{score}</span>
                    <span>out of 5 · seller rating</span>
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                    asChild
                  >
                    <a href={`mailto:${vendor.email ?? ''}`}>
                      <MessageCircle className="h-4 w-4 text-[#F7941D]" />
                      Chat now
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="h-9 gap-1.5 bg-[#F7941D] font-semibold text-white shadow-sm hover:bg-[#e88610]"
                    onClick={() =>
                      toast.message('Follow', {
                        description: 'Store follows will be available soon.',
                      })
                    }
                  >
                    <Store className="h-4 w-4" />
                    Follow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[95rem] px-4 pt-24 sm:px-6 sm:pt-28">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-[4.5rem] z-30 -mx-4 border-b border-gray-200/90 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-28">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="flex h-11 w-full gap-1 rounded-xl border border-gray-200/80 bg-gradient-to-b from-gray-50 to-gray-100/90 p-1 sm:w-auto">
                <TabsTrigger
                  value="products"
                  className="flex-1 rounded-lg px-2 text-xs font-semibold text-gray-600 transition-all data-[state=active]:bg-white data-[state=active]:text-[#0d4f4a] data-[state=active]:shadow-md sm:flex-initial sm:px-5 sm:text-sm"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Package className="hidden h-4 w-4 sm:inline" />
                    Products
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex-1 rounded-lg px-2 text-xs font-semibold text-gray-600 transition-all data-[state=active]:bg-white data-[state=active]:text-[#0d4f4a] data-[state=active]:shadow-md sm:flex-initial sm:px-5 sm:text-sm"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="hidden h-4 w-4 sm:inline" />
                    Reviews
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="flex-1 rounded-lg px-2 text-xs font-semibold text-gray-600 transition-all data-[state=active]:bg-white data-[state=active]:text-[#0d4f4a] data-[state=active]:shadow-md sm:flex-initial sm:px-5 sm:text-sm"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <User className="hidden h-4 w-4 sm:inline" />
                    Profile
                  </span>
                </TabsTrigger>
              </TabsList>
              {activeTab === 'products' ? (
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search products…"
                    className="h-10 rounded-full border-gray-200 bg-white pl-9 pr-4 text-sm shadow-inner"
                    aria-label="Search products in this store"
                  />
                </div>
              ) : (
                <div className="hidden h-10 sm:block sm:w-40" aria-hidden />
              )}
            </div>
          </div>

          <TabsContent value="products" className="mt-6 outline-none">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  Shop this store
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hand-picked items from {displayName}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-gray-200/80">
                {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-muted-foreground">
                No products match your search.
              </div>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filtered.map((p) => (
                  <li key={p.id ?? p.slug}>
                    <VendorProductCard product={p} />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 outline-none">
            <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gradient-to-r from-[#0d4f4a]/[0.06] via-white to-[#F7941D]/[0.06] px-5 py-5 sm:px-8 sm:py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                      Customer reviews
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      What shoppers say about {displayName}
                    </p>
                  </div>
                  {!reviewsFetchFailed && reviewStats.count > 0 ? (
                    <div className="flex items-center gap-4 rounded-xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
                      <div className="text-center">
                        <p className="text-3xl font-bold tabular-nums text-[#0d4f4a]">
                          {reviewStats.avg != null
                            ? (Math.round(reviewStats.avg * 10) / 10).toFixed(1)
                            : '—'}
                        </p>
                        <ReviewStarsRow
                          rating={Math.round(reviewStats.avg ?? 0)}
                          className="mt-1 justify-center"
                        />
                      </div>
                      <div className="h-10 w-px bg-gray-200" aria-hidden />
                      <p className="text-sm text-muted-foreground">
                        Based on{' '}
                        <span className="font-semibold text-foreground">
                          {reviewStats.count}
                        </span>{' '}
                        {reviewStats.count === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {reviewsFetchFailed ? (
                  <div className="rounded-xl border border-red-200 bg-red-50/80 px-5 py-10 text-center">
                    <p className="text-sm font-medium text-red-900">
                      We couldn&apos;t load reviews right now.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4 border-red-200 bg-white text-red-900 hover:bg-red-50"
                      onClick={() => window.location.reload()}
                    >
                      Refresh page
                    </Button>
                  </div>
                ) : null}

                {!reviewsFetchFailed && initialReviews.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
                    <Star className="mx-auto h-10 w-10 text-gray-300" />
                    <p className="mt-3 text-sm font-medium text-gray-700">
                      No reviews yet
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Be the first to share your experience with this store.
                    </p>
                  </div>
                ) : null}

                {!reviewsFetchFailed && initialReviews.length > 0 ? (
                  <ul className="space-y-4">
                    {initialReviews.map((item) => (
                      <li key={item.id}>
                        <VendorReviewCard review={item} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6 outline-none">
            <div className="grid gap-5 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="h-full overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm">
                  <div className="border-b border-gray-100 bg-gradient-to-r from-[#0d4f4a] to-[#126b5f] px-5 py-4 sm:px-6">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                      <Store className="h-5 w-5 text-white/90" />
                      About this store
                    </h2>
                  </div>
                  <div className="space-y-3 p-4 sm:p-5">
                    <p className="text-sm leading-snug text-gray-600">
                      Browse curated products from this verified seller. Every
                      item listed here is fulfilled and supported by the store
                      team.
                    </p>
                    <div className="flex gap-3 rounded-xl bg-gray-50/90 p-4 ring-1 ring-gray-100">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0d4f4a]/10 text-[#0d4f4a]">
                        <Hash className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Store ID
                        </p>
                        <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-gray-900 sm:text-base">
                          {vendorId}
                        </p>
                        <p className="mt-1 text-xs leading-snug text-muted-foreground">
                          Quote this when contacting support about orders from
                          this seller.
                        </p>
                      </div>
                    </div>
                    {locationText ? (
                      <div className="flex gap-3 rounded-xl bg-gray-50/90 p-4 ring-1 ring-gray-100">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0d4f4a]/10 text-[#0d4f4a]">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Location
                          </p>
                          <p className="mt-1 text-sm font-medium leading-snug text-gray-900">
                            {locationText}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="rounded-xl bg-amber-50/80 p-4 text-sm text-amber-950/90 ring-1 ring-amber-100">
                        This seller has not added a public address yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-black/[0.02]">
                  <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#0d4f4a] via-[#126b5f] to-[#0a3833] px-5 py-5 sm:px-6 sm:py-6">
                    <div
                      className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full bg-[#F7941D]/20 blur-2xl"
                      aria-hidden
                    />
                    <div className="relative flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 shadow-inner ring-1 ring-white/20 backdrop-blur-sm">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                          Contact
                        </h2>
                        <p className="mt-1 text-sm leading-snug text-white/80">
                          Reach the store directly by email or phone.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Get in touch
                      </p>
                      <a
                        href={
                          vendor.email
                            ? `mailto:${vendor.email}`
                            : undefined
                        }
                        className={cn(
                          'group flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all',
                          vendor.email
                            ? 'hover:border-[#F7941D]/30 hover:bg-white hover:shadow-md'
                            : 'pointer-events-none opacity-50',
                        )}
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F7941D]/12 text-[#F7941D] shadow-sm ring-1 ring-[#F7941D]/10 transition-transform group-hover:scale-105">
                          <Mail className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                            Email
                          </span>
                          <span className="mt-0.5 block truncate text-sm font-semibold text-gray-900 group-hover:text-[#0d4f4a]">
                            {vendor.email ?? '—'}
                          </span>
                        </span>
                      </a>
                      {vendor.phone ? (
                        <a
                          href={`tel:${vendor.phone}`}
                          className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-all hover:border-emerald-500/25 hover:bg-white hover:shadow-md"
                        >
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-700 shadow-sm ring-1 ring-emerald-500/10 transition-transform group-hover:scale-105">
                            <Phone className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                              Phone
                            </span>
                            <span className="mt-0.5 block text-sm font-semibold text-gray-900 group-hover:text-[#0d4f4a]">
                              {vendor.phone}
                            </span>
                          </span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ReviewStarsRow({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const r = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div
      className={cn('flex gap-0.5', className)}
      aria-label={`${r} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={`star-${i}`}
          className={cn(
            'h-3.5 w-3.5 sm:h-4 sm:w-4',
            i < r
              ? 'fill-[#F7941D] text-[#F7941D]'
              : 'fill-gray-200 text-gray-200',
          )}
        />
      ))}
    </div>
  );
}

function VendorReviewCard({ review }: { review: VendorReviewRow }) {
  const src = review.user?.profile_image
    ? imgUrl(review.user.profile_image)
    : '';

  return (
    <article className="overflow-hidden rounded-xl border border-gray-100 bg-white ring-1 ring-gray-100/80 transition-shadow hover:shadow-md">
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-gray-100 to-gray-50 shadow-sm sm:h-14 sm:w-14">
          {src ? (
            <Image
              src={src}
              alt=""
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <User className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">
                {review.user?.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {review.created_at}
              </p>
            </div>
            <ReviewStarsRow
              rating={Number(review.rating) || 0}
              className="shrink-0 sm:pt-0.5"
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            {review.review}
          </p>
        </div>
      </div>
    </article>
  );
}

function VendorProductCard({ product }: { product: VendorStoreProduct }) {
  const { reg, effective, pct, showSale } = variantPricing(product);
  const href = `/product/${product.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm transition-all duration-200 hover:border-[#F7941D]/35 hover:shadow-md">
      <Link href={href} className="block">
        <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-white p-3">
          {product.thumbnail_img ? (
            <Image
              src={imgUrl(product.thumbnail_img)}
              alt={product.name ?? 'Product'}
              width={400}
              height={400}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Package className="h-10 w-10 opacity-40" />
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col border-t border-gray-100 p-2.5 sm:p-3">
        <Link href={href}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[11px] font-medium leading-snug text-gray-900 sm:text-xs sm:leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto space-y-1 pt-2">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
            <span className="text-sm font-bold text-[#F7941D] sm:text-base">
              <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
              {formatAmount(effective)}
            </span>
            {showSale ? (
              <>
                <span className="text-[10px] text-muted-foreground line-through sm:text-xs">
                  <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
                  {formatAmount(reg)}
                </span>
                {pct > 0 ? (
                  <span className="text-[10px] font-semibold text-emerald-600 sm:text-xs">
                    −{pct}%
                  </span>
                ) : null}
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className={cn(
                  'h-3 w-3 sm:h-3.5 sm:w-3.5',
                  i < 4
                    ? 'fill-[#F7941D] text-[#F7941D]'
                    : 'fill-gray-200 text-gray-200',
                )}
              />
            ))}
            <span className="ml-0.5">(0)</span>
          </div>
        </div>
      </div>
    </article>
  );
}

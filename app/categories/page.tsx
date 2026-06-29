import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/home-demo-data';
import { SITE_BRAND_SHORT, buildPageMeta } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'All Categories',
  description: `Browse all product categories at ${SITE_BRAND_SHORT} — phones, laptops, tablets, audio, accessories and more.`,
  pathname: '/categories',
  keywords: [
    'categories',
    'shop',
    'phones',
    'laptops',
    'accessories',
    SITE_BRAND_SHORT,
  ],
});

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-slate-50/60">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(120%_120%_at_0%_0%,#3b82f6_0%,#2563eb_45%,#1d4ed8_100%)] py-10 text-white sm:py-14">
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:38px_38px]"
          aria-hidden
        />
        {/* Glow blobs */}
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-secondary/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/15 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-[95rem] px-3 sm:px-4 lg:px-6">
          <nav
            className="flex flex-wrap items-center gap-1 text-xs text-white/80 sm:text-sm"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="text-white/50">/</span>
            <span className="font-medium text-white">Categories</span>
          </nav>

          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/20 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            {CATEGORIES.length}+ Categories
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-[2.5rem] md:leading-tight">
            Shop by{' '}
            <span className="bg-gradient-to-r from-secondary to-amber-200 bg-clip-text text-transparent">
              Categories
            </span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
            Explore our full range of gadgets and accessories — find exactly
            what you need.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-[95rem] px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-500">
            {CATEGORIES.length} categories
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 min-[480px]:grid-cols-3 sm:grid-cols-4 sm:gap-3 md:gap-3.5 lg:grid-cols-6 lg:gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-white pb-3 pt-1 shadow-sm transition-all duration-300 hover:shadow-[0_8px_24px_rgba(37,99,235,0.14)] hover:ring-2 hover:ring-primary/25 sm:rounded-2xl sm:pb-3.5"
            >
              <div className="relative flex h-[5.75rem] items-end justify-center px-2 sm:h-[6.5rem] md:h-[7rem]">
                <span
                  className="absolute bottom-3 left-1/2 h-5 w-[70%] -translate-x-1/2 rounded-[100%] bg-primary/10 blur-md transition-all duration-300 group-hover:h-6 group-hover:w-[78%] group-hover:bg-primary/20"
                  aria-hidden
                />
                <span
                  className="absolute bottom-2 left-1/2 h-2 w-[55%] -translate-x-1/2 rounded-full bg-primary/15 transition-all duration-300 group-hover:w-[62%] group-hover:bg-primary/25"
                  aria-hidden
                />
                <Image
                  src={category.image}
                  alt={category.name}
                  width={140}
                  height={140}
                  className="relative z-10 max-h-[4.75rem] w-auto max-w-[85%] object-contain drop-shadow-[0_10px_14px_rgba(37,99,235,0.18)] transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105 sm:max-h-[5.5rem] md:max-h-[6rem]"
                />
              </div>

              <div className="flex min-h-[2.35rem] items-center justify-center px-2 text-center sm:min-h-[2.5rem]">
                <span className="line-clamp-2 text-[11px] font-semibold leading-snug text-slate-800 transition-colors duration-300 group-hover:text-primary sm:text-xs md:text-[13px]">
                  {category.name}
                </span>
              </div>

              <span className="mx-auto inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wide text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Shop now
                <ChevronRight className="h-3 w-3" />
              </span>

              <span
                className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

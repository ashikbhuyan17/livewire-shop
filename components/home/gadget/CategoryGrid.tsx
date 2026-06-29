import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/home-demo-data';

export default function CategoryGrid() {
  return (
    <section
      className="mt-8 sm:mt-10"
      aria-labelledby="shop-categories-heading"
    >
      <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
        <h2
          id="shop-categories-heading"
          className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl md:text-2xl"
        >
          Shop by Categories
        </h2>
        <Link
          href="/categories"
          className="shrink-0 rounded-md border-2 border-primary bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary transition hover:bg-primary hover:text-white sm:px-4 sm:py-2 sm:text-xs"
        >
          See all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2.5 min-[480px]:grid-cols-3 sm:grid-cols-4 sm:gap-3 md:gap-3.5 lg:grid-cols-8 lg:gap-4">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-xl bg-[#f3f4f6] pb-3 pt-1 transition-all duration-300 hover:bg-white hover:shadow-[0_8px_24px_rgba(2,80,162,0.12)] hover:ring-2 hover:ring-primary/25 sm:rounded-2xl sm:pb-3.5"
          >
            {/* Floating image stage */}
            <div className="relative flex h-[5.25rem] items-end justify-center px-2 sm:h-[5.75rem] md:h-[6.25rem] lg:h-[5.5rem] xl:h-[6rem]">
              {/* Soft primary glow under product */}
              <span
                className="absolute bottom-3 left-1/2 h-5 w-[70%] -translate-x-1/2 rounded-[100%] bg-primary/10 blur-md transition-all duration-300 group-hover:h-6 group-hover:w-[78%] group-hover:bg-primary/20"
                aria-hidden
              />
              {/* Floating platform */}
              <span
                className="absolute bottom-2 left-1/2 h-2 w-[55%] -translate-x-1/2 rounded-full bg-primary/15 transition-all duration-300 group-hover:w-[62%] group-hover:bg-primary/25"
                aria-hidden
              />

              <Image
                src={category.image}
                alt={category.name}
                width={140}
                height={140}
                className="relative z-10 max-h-[4.25rem] w-auto max-w-[85%] object-contain drop-shadow-[0_10px_14px_rgba(2,80,162,0.18)] transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105 group-hover:drop-shadow-[0_16px_22px_rgba(2,80,162,0.28)] sm:max-h-[4.75rem] md:max-h-[5.25rem] lg:max-h-[4.5rem] xl:max-h-[5rem]"
              />
            </div>

            {/* Label */}
            <div className="flex min-h-[2.35rem] items-center justify-center px-2 text-center sm:min-h-[2.5rem]">
              <span className="line-clamp-2 text-[11px] font-semibold leading-snug text-slate-800 transition-colors duration-300 group-hover:text-primary sm:text-xs md:text-[13px]">
                {category.name}
              </span>
            </div>

            {/* Bottom primary accent on hover */}
            <span
              className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

'use client';

import CategorySidebar from '../common/CategorySidebar';
import HeroSlider from './HeroSlider';

function Hero({
  categories,
  data,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}) {
  return (
    <div className="flex w-full min-w-0 gap-0 overflow-x-hidden overflow-y-visible">
      <section
        id="hero-shop-categories"
        aria-label="Shop by category"
        className="scroll-mt-[7.75rem] relative z-20 hidden min-h-0 w-full max-w-none shrink-0 overflow-visible lg:flex lg:h-[320px] lg:w-[19.5rem] lg:max-w-[19.5rem] lg:flex-col"
      >
        <div
          data-category-shell
          className="flex min-h-0 w-full flex-1 flex-col overflow-hidden border border-gray-200/80 bg-white shadow-sm"
        >
          <div
            data-category-scroll
            className="min-h-0 w-full flex-1 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]"
          >
            <CategorySidebar categories={categories} embedded />
          </div>
        </div>
      </section>
      <main className="relative z-0 min-w-0 w-full flex-1 overflow-hidden sm:ring-1 sm:ring-black/[0.04]">
        <HeroSlider data={data} />
      </main>
    </div>
  );
}

export default Hero;

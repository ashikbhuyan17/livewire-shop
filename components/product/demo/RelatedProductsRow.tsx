'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DemoProductCard from '@/components/home/gadget/DemoProductCard';
import { RELATED_PRODUCTS } from '@/lib/product-demo-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const arrowClass =
  'top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-0 sm:h-10 sm:w-10';

export default function RelatedProductsRow() {
  return (
    <section className="mt-10 sm:mt-12" aria-labelledby="related-products-heading">
      <Carousel
        opts={{ align: 'start', dragFree: true }}
        className="w-full"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2
            id="related-products-heading"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            Related Products
          </h2>
          <Link
            href="/search?q=redmi"
            className="inline-flex shrink-0 items-center gap-1 rounded-md border-2 border-primary bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-white sm:px-4 sm:py-2"
          >
            See all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="relative px-1 sm:px-2">
          <CarouselPrevious className={`${arrowClass} left-0 sm:left-1`} />
          <CarouselContent className="-ml-3 sm:-ml-4">
            {RELATED_PRODUCTS.map((product, index) => (
              <CarouselItem
                key={`related-${product.id}-${index}`}
                className="basis-[72%] pl-3 sm:basis-[48%] sm:pl-4 md:basis-[38%] lg:basis-[28%] xl:basis-[22%]"
              >
                <DemoProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className={`${arrowClass} right-0 sm:right-1`} />
        </div>
      </Carousel>
    </section>
  );
}

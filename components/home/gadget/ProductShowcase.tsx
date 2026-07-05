'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DemoProductCard from './DemoProductCard';
import type { DemoProduct } from '@/lib/home-demo-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type ProductShowcaseProps = {
  id: string;
  title: string;
  subtitle?: string;
  products: DemoProduct[];
  seeAllHref?: string;
  className?: string;
};

const arrowClass =
  'top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-0 sm:h-10 sm:w-10';

export default function ProductShowcase({
  id,
  title,
  subtitle,
  products,
  seeAllHref = '#',
  className,
}: ProductShowcaseProps) {
  return (
    <section id={id} className={className} aria-labelledby={`${id}-heading`}>
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full"
      >
        <div className="mb-5 flex items-end justify-between gap-4 max-sm:px-1">
          <div className="min-w-0">
            <h2
              id={`${id}-heading`}
              className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>

          <Link
            href={seeAllHref}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-blue-50 sm:px-4 sm:text-sm"
          >
            See all
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>

        <div className="relative px-1 sm:px-2">
          <CarouselPrevious className={`${arrowClass} left-0 sm:left-1`} />
          <CarouselContent className="-ml-3 sm:-ml-4">
            {products.map((product, index) => (
              <CarouselItem
                key={`${id}-${product.id}-${index}`}
                className="basis-[72%] pl-3 sm:basis-[48%] sm:pl-4 md:basis-[38%] lg:basis-[28%] xl:basis-[22%] 2xl:basis-[18%]"
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

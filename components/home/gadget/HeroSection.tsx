'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_BANNERS } from '@/lib/home-demo-data';
import { cn } from '@/lib/utils';

const DESKTOP_HERO_MIN_H =
  'min-h-[20rem] sm:min-h-[22rem] md:min-h-[26rem] lg:min-h-[30rem] xl:min-h-[36rem]';

export default function HeroSection() {
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    setSelected(mainApi.selectedScrollSnap());
  }, [mainApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on('select', onSelect);
    return () => {
      mainApi.off('select', onSelect);
    };
  }, [mainApi, onSelect]);

  const scrollPrev = () => mainApi?.scrollPrev();
  const scrollNext = () => mainApi?.scrollNext();

  const [mainBanner, ...sideBanners] = HERO_BANNERS;

  return (
    <section className="w-full" aria-label="Featured promotions">
      {/* Desktop: asymmetric grid */}
      <div
        className={cn(
          'hidden gap-3 md:grid md:grid-cols-12 md:gap-4 md:items-stretch',
          DESKTOP_HERO_MIN_H,
        )}
      >
        <Link
          href={mainBanner.href ?? '#'}
          className={cn(
            'group relative col-span-8 overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200/80',
            DESKTOP_HERO_MIN_H,
          )}
        >
          <Image
            src={mainBanner.image}
            alt={mainBanner.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </Link>

        <div
          className={cn(
            'col-span-4 flex flex-col gap-3 md:gap-4',
            DESKTOP_HERO_MIN_H,
          )}
        >
          {sideBanners.slice(0, 2).map((banner) => (
            <Link
              key={banner.id}
              href={banner.href ?? '#'}
              className="group relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200/80"
            >
              <Image
                src={banner.image}
                alt={banner.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile: carousel */}
      <div className="relative md:hidden">
        <div ref={mainRef} className="overflow-hidden rounded-xl">
          <div className="flex">
            {HERO_BANNERS.map((banner, i) => (
              <div key={banner.id} className="min-w-0 shrink-0 grow-0 basis-full">
                <Link
                  href={banner.href ?? '#'}
                  className="relative block min-h-[15rem] overflow-hidden rounded-xl bg-slate-100 sm:min-h-[18rem]"
                >
                  <Image
                    src={banner.image}
                    alt={banner.alt}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="mt-3 flex justify-center gap-1.5">
          {HERO_BANNERS.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => mainApi?.scrollTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === selected ? 'w-6 bg-primary' : 'w-1.5 bg-slate-300',
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

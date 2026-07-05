'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroBanner } from '@/lib/home-demo-data';
import { cn } from '@/lib/utils';

const DESKTOP_HERO_MIN_H =
  'min-h-[20rem] sm:min-h-[22rem] md:min-h-[26rem] lg:min-h-[30rem] xl:min-h-[36rem]';

const MOBILE_HERO_SLIDE =
  'relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-slate-200/80 sm:aspect-[5/2]';

const MOBILE_AD_BANNER =
  'relative aspect-[4/3] min-w-0 flex-1 overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-slate-200/80';

function MobileAdBanner({ banner }: { banner: HeroBanner }) {
  const content = (
    <Image
      src={banner.image}
      alt={banner.alt}
      fill
      sizes="(max-width: 768px) 50vw, 33vw"
      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
    />
  );

  if (banner.href) {
    return (
      <Link href={banner.href} className={cn('group block', MOBILE_AD_BANNER)}>
        {content}
      </Link>
    );
  }

  return <div className={cn('group', MOBILE_AD_BANNER)}>{content}</div>;
}

type Props = {
  sliders?: HeroBanner[];
  adBanners?: HeroBanner[];
};

function BannerSlide({
  banner,
  priority = false,
  sizes,
  className,
}: {
  banner: HeroBanner;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const content = (
    <Image
      src={banner.image}
      alt={banner.alt}
      fill
      priority={priority}
      sizes={sizes}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
    />
  );

  if (banner.href) {
    return (
      <Link
        href={banner.href}
        className={cn('group relative block h-full w-full', className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={cn('group relative h-full w-full', className)}>
      {content}
    </div>
  );
}

function SliderCarousel({
  banners,
  className,
  slideClassName,
  sizes,
  showArrows = true,
  showDots = true,
}: {
  banners: HeroBanner[];
  className?: string;
  slideClassName?: string;
  sizes: string;
  showArrows?: boolean;
  showDots?: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: banners.length > 1 }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (banners.length === 0) return null;

  if (banners.length === 1) {
    return (
      <div className={cn('relative', className, slideClassName)}>
        <BannerSlide banner={banners[0]} priority sizes={sizes} />
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <div ref={emblaRef} className={cn('relative', slideClassName)}>
        <div className="flex h-full">
          {banners.map((banner, i) => (
            <div
              key={banner.id}
              className="relative h-full min-w-0 shrink-0 grow-0 basis-full"
            >
              <BannerSlide
                banner={banner}
                priority={i === 0}
                sizes={sizes}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>

      {showArrows ? (
        <>
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      ) : null}

      {showDots ? (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-4">
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === selected ? 'w-6 bg-primary' : 'w-1.5 bg-white/80',
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function HeroSection({ sliders = [], adBanners = [] }: Props) {
  const hasSliders = sliders.length > 0;
  const hasAds = adBanners.length > 0;

  if (!hasSliders && !hasAds) return null;

  return (
    <section
      className="w-full px-1 sm:px-4  lg:px-6"
      aria-label="Featured promotions"
    >
      {/* Desktop: sliders carousel (left) + ad banners (right) */}
      <div
        className={cn(
          'hidden gap-3 md:grid md:gap-4 md:items-stretch',
          hasSliders && hasAds && 'md:grid-cols-12',
          hasSliders && !hasAds && 'md:grid-cols-1',
          !hasSliders && hasAds && 'md:grid-cols-2',
          (hasSliders || hasAds) && DESKTOP_HERO_MIN_H,
        )}
      >
        {hasSliders ? (
          <SliderCarousel
            banners={sliders}
            className={cn(
              'overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200/80',
              hasAds ? 'col-span-8' : 'col-span-full',
              DESKTOP_HERO_MIN_H,
            )}
            slideClassName={DESKTOP_HERO_MIN_H}
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        ) : null}

        {hasAds ? (
          <div
            className={cn(
              'flex flex-col gap-3 md:gap-4',
              hasSliders
                ? 'col-span-4'
                : 'col-span-full md:grid md:grid-cols-2 md:gap-4',
              hasSliders && DESKTOP_HERO_MIN_H,
            )}
          >
            {adBanners.slice(0, 2).map((banner) =>
              banner.href ? (
                <Link
                  key={banner.id}
                  href={banner.href}
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
              ) : (
                <div
                  key={banner.id}
                  className="group relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200/80"
                >
                  <Image
                    src={banner.image}
                    alt={banner.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              ),
            )}
          </div>
        ) : null}
      </div>

      {/* Mobile: slider + ad banners side by side */}
      <div className="mt-1 flex flex-col gap-2 md:hidden">
        {hasSliders ? (
          <SliderCarousel
            banners={sliders}
            slideClassName={MOBILE_HERO_SLIDE}
            sizes="100vw"
          />
        ) : null}

        {hasAds ? (
          <div className="flex gap-2">
            {adBanners.slice(0, 2).map((banner) => (
              <MobileAdBanner key={banner.id} banner={banner} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

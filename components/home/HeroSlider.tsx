/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeroSlider({ data }: { data: any }) {
  const imgBase = process.env.NEXT_PUBLIC_IMG_URL;

  const slides: { id: string | number; link?: string; src: string }[] = (
    data?.data ?? []
  )
    .map((item: any, idx: number) => {
      const raw = item?.image;
      if (!raw || typeof raw !== 'string') return null;

      const src =
        raw.startsWith('http://') || raw.startsWith('https://')
          ? raw
          : imgBase
            ? `${imgBase.replace(/\/$/, '')}/${raw.replace(/^\//, '')}`
            : '';

      if (!src) return null;

      return {
        id: item?.id ?? idx,
        link: item?.link ?? '#',
        src,
      };
    })
    .filter(Boolean) as { id: string | number; link?: string; src: string }[];

  const autoplay = React.useRef(
    Autoplay({
      delay: 2500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || slides.length === 0) {
    return (
      <div className="relative w-full min-w-0 animate-pulse">
        <div className="h-[160px] w-full bg-gray-200 md:h-[320px] sm:rounded-lg" />
      </div>
    );
  }

  return (
    <div className="relative w-full min-w-0">
      <Carousel
        className="h-[160px] w-full overflow-hidden md:h-[320px]"
        opts={{ loop: true }}
        plugins={[autoplay.current]}
      >
        <CarouselContent>
          {slides.map((slide, index: number) => (
            <CarouselItem key={slide.id}>
              <Link href={slide.link ?? '#'} prefetch className="block">
                <div className="relative w-full h-[160px] md:h-[320px]">
                  <Image
                    src={slide.src}
                    alt={`Slide ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    className="object-cover"
                    unoptimized
                    priority={index === 0}
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
          <ChevronLeft size={20} />
        </CarouselPrevious>

        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
          <ChevronRight size={20} />
        </CarouselNext>
      </Carousel>
    </div>
  );
}

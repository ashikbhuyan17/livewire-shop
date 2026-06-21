'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import { STATIC_PRODUCT } from '@/lib/product-demo-data';
import { cn } from '@/lib/utils';

export default function ProductGallery() {
  const [active, setActive] = useState(0);
  const images = STATIC_PRODUCT.images;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
      {/* Thumbnails */}
      <div className="order-2 flex gap-2 overflow-x-auto scrollbar-hide sm:order-1 sm:flex-col sm:overflow-visible">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 transition sm:h-[4.5rem] sm:w-[4.5rem]',
              active === i
                ? 'border-primary shadow-sm'
                : 'border-slate-200 hover:border-primary/40',
            )}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="72px"
              className="object-contain p-0.5"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative order-1 h-[340px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white sm:order-2 sm:h-[400px] md:h-[440px] lg:h-[460px]">
        <span className="absolute left-0 top-0 z-10 rounded-br-xl bg-primary px-3 py-1.5 text-sm font-bold text-white">
          {STATIC_PRODUCT.discountPercent}%
        </span>
        <span className="absolute right-3 top-3 z-10 rounded-md bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-900">
          Discount
        </span>
        <span className="absolute bottom-3 left-3 z-10 rounded-lg bg-slate-900/85 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur-sm sm:text-xs">
          {STATIC_PRODUCT.careBadge}
        </span>

        <Image
          src={images[active]}
          alt={STATIC_PRODUCT.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 sm:p-6"
        />

        <button
          type="button"
          className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary hover:text-primary"
          aria-label="Zoom image"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

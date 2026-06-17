'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import DemoProductCard from './DemoProductCard';
import { FLASH_SALE_PRODUCTS } from '@/lib/home-demo-data';

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white sm:h-11 sm:w-11 sm:text-base">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[9px] font-medium uppercase tracking-wide text-slate-500 sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

export default function FlashSaleSection() {
  const [endDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 12);
    d.setHours(20, 17, 53, 0);
    return d;
  });
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  return (
    <section
      className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-4 shadow-lg sm:mt-12 sm:p-6"
      aria-labelledby="flash-sale-heading"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-white">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-300" />
            <h2 id="flash-sale-heading" className="text-xl font-bold sm:text-2xl">
              Flash Sale
            </h2>
          </div>
          <p className="mt-1 text-sm text-blue-100">
            Guaranteed lowest price · Replacement guarantee · Free delivery
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
            Offer ending in
          </span>
          <div className="flex gap-2 rounded-2xl bg-white/95 px-3 py-2.5 shadow-sm sm:gap-3 sm:px-4">
            <TimeBlock value={timeLeft.days} label="Days" />
            <span className="self-center text-lg font-bold text-slate-300">:</span>
            <TimeBlock value={timeLeft.hours} label="Hour" />
            <span className="self-center text-lg font-bold text-slate-300">:</span>
            <TimeBlock value={timeLeft.minutes} label="Min" />
            <span className="self-center text-lg font-bold text-slate-300">:</span>
            <TimeBlock value={timeLeft.seconds} label="Sec" />
          </div>
          <Link
            href="/offer/flash-sale"
            className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-blue-50"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-5 -mx-1 overflow-x-auto pb-2 scrollbar-hide sm:mt-6">
        <div className="flex gap-3 px-1 sm:grid sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {FLASH_SALE_PRODUCTS.map((product) => (
            <div
              key={`flash-${product.id}`}
              className="w-[72%] shrink-0 sm:w-auto sm:shrink"
            >
              <DemoProductCard product={product} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

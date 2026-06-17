'use client';

import Link from 'next/link';
import { GitCompareArrows } from 'lucide-react';
import { useCompareStore } from '@/stores/compare-store';
import { MAX_COMPARE_PRODUCTS } from '@/lib/compare-utils';

type Props = {
  initialCount: number;
};

export default function CompareHeaderLink({ initialCount }: Props) {
  const hydrated = useCompareStore((s) => s.hydrated);
  const count = useCompareStore((s) => s.count);
  const compareCount = hydrated ? count : initialCount;

  return (
    <Link
      prefetch
      href="/compare"
      aria-label={
        compareCount > 0
          ? `Compare products (${compareCount} of ${MAX_COMPARE_PRODUCTS})`
          : 'Compare products'
      }
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100 md:h-10 md:w-10"
    >
      <GitCompareArrows className="h-5 w-5" />
      {compareCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
          {compareCount > MAX_COMPARE_PRODUCTS
            ? `${MAX_COMPARE_PRODUCTS}+`
            : compareCount}
        </span>
      )}
    </Link>
  );
}

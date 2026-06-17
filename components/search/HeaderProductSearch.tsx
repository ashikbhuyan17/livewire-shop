'use client';

import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ProductSearchForm from '@/components/search/ProductSearchForm';

function HeaderProductSearchInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onSearchPage = pathname === '/search';
  const query = onSearchPage ? (searchParams.get('q') ?? '').trim() : '';

  return (
    <ProductSearchForm
      variant="header"
      defaultQuery={query}
      resetNavigateTo={onSearchPage && query ? '/search' : undefined}
    />
  );
}

export default function HeaderProductSearch() {
  return (
    <Suspense
      fallback={
        <div
          className="h-8 w-full animate-pulse rounded-full bg-white/30 md:h-9 lg:h-10"
          aria-hidden
        />
      }
    >
      <HeaderProductSearchInner />
    </Suspense>
  );
}

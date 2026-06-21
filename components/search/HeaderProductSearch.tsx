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
          className="h-9 w-full animate-pulse rounded-md bg-white/30 md:h-10 lg:h-11"
          aria-hidden
        />
      }
    >
      <HeaderProductSearchInner />
    </Suspense>
  );
}

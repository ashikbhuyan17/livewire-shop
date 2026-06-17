import { PackageSearch, AlertCircle } from 'lucide-react';
import ProductList from '@/components/category/ProductList';
import ProductSearchForm from '@/components/search/ProductSearchForm';
import type { SearchProductsResult } from '@/lib/search';

type Props = {
  result: SearchProductsResult;
};

export default function SearchResults({ result }: Props) {
  const { products, query, ok } = result;
  const count = products.length;

  if (!query) {
    return (
      <div className="space-y-8 py-4 md:py-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PackageSearch className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Search our store
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Find groceries, brands, and daily essentials — type a product name or
            keyword below.
          </p>
        </div>
        <ProductSearchForm variant="page" autoFocus className="mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border border-border bg-white p-4 md:space-y-4 md:p-5">
        <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
          {count === 1 ? '1 result' : `${count} results`} for &ldquo;{query}
          &rdquo;
        </h1>
        <ProductSearchForm
          variant="page"
          layout="inline"
          defaultQuery={query}
          resetNavigateTo="/search"
          className="w-full max-w-none"
        />
      </section>

      {!ok ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            We couldn&apos;t load search results right now. Please try again in
            a moment.
          </p>
        </div>
      ) : null}

      <ProductList
        products={products}
        emptyTitle={`No products found for "${query}"`}
        emptyHint="Check spelling, try fewer words, or browse categories from the menu."
      />

    </div>
  );
}

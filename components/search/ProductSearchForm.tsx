'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { buildSearchPageUrl } from '@/lib/search';

type Props = {
  defaultQuery?: string;
  variant?: 'header' | 'page';
  /** Page layout: stacked (landing) or inline pill (results toolbar). */
  layout?: 'stacked' | 'inline';
  className?: string;
  autoFocus?: boolean;
  /** When the field is cleared, navigate here (e.g. `/search` to drop `?q=`). */
  resetNavigateTo?: string;
};

export default function ProductSearchForm({
  defaultQuery = '',
  variant = 'header',
  layout = 'stacked',
  className,
  autoFocus = false,
  resetNavigateTo,
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultQuery);

  useEffect(() => {
    setValue(defaultQuery);
  }, [defaultQuery]);

  const handleValueChange = useCallback(
    (next: string) => {
      setValue(next);
      if (!next.trim() && resetNavigateTo) {
        router.replace(resetNavigateTo);
      }
    },
    [resetNavigateTo, router],
  );

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      router.push(resetNavigateTo ?? '/search');
      return;
    }
    router.push(buildSearchPageUrl(trimmed));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const inputHandlers = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleValueChange(e.target.value);
    },
    onInput: (e: React.FormEvent<HTMLInputElement>) => {
      handleValueChange(e.currentTarget.value);
    },
    onSearch: (e: React.FormEvent<HTMLInputElement>) => {
      handleValueChange(e.currentTarget.value);
    },
  };

  if (variant === 'page') {
    const inputId =
      layout === 'inline' ? 'page-product-search-inline' : 'page-product-search';

    if (layout === 'inline') {
      return (
        <form
          onSubmit={handleSubmit}
          className={cn('w-full', className)}
          role="search"
        >
          <label className="sr-only" htmlFor={inputId}>
            Refine search
          </label>
          <div
            className={cn(
              'flex w-full items-center gap-1 overflow-hidden rounded-full border border-border/80 bg-white p-1 shadow-sm',
              'ring-1 ring-black/[0.04] transition-shadow focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20',
            )}
          >
            <span
              className="pointer-events-none flex shrink-0 items-center pl-3 text-primary"
              aria-hidden
            >
              <Search className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <Input
              ref={inputRef}
              id={inputId}
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Refine your search…"
              className="h-11 min-w-0 flex-1 border-0 bg-transparent px-2 py-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-12"
              {...inputHandlers}
            />
            <button
              type="submit"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-[#267322] sm:h-11 sm:px-6"
            >
              Search
            </button>
          </div>
        </form>
      );
    }

    return (
      <form
        onSubmit={handleSubmit}
        className={cn('w-full max-w-3xl', className)}
        role="search"
      >
        <label className="sr-only" htmlFor={inputId}>
          Search products
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              ref={inputRef}
              id={inputId}
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              autoFocus={autoFocus}
              placeholder="Search groceries, brands, deals…"
              className="h-12 rounded-xl border-border bg-white pl-12 pr-4 text-base shadow-sm focus-visible:ring-primary/30 sm:h-14 sm:text-lg"
              {...inputHandlers}
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-[#267322] sm:h-14 sm:min-w-[8.5rem] sm:text-base"
          >
            <Search className="h-5 w-5" aria-hidden />
            Search
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative block w-full', className)}
      role="search"
    >
      <label className="sr-only" htmlFor="header-product-search">
        Search products
      </label>
      <div
        className={cn(
          'group flex h-9 w-full items-stretch overflow-hidden rounded-md border-0 bg-white shadow-sm transition-all duration-200',
          'focus-within:shadow-md',
          'md:h-10 lg:h-11',
        )}
      >
        <span
          className="pointer-events-none hidden shrink-0 items-center pl-3 text-gray-400 sm:flex"
          aria-hidden
        >
          <Search className="h-4 w-4" strokeWidth={2} />
        </span>
        <Input
          ref={inputRef}
          id="header-product-search"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder="Search products..."
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-1.5 py-0 text-[13px] text-gray-900 shadow-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 md:px-2 md:text-sm lg:text-[14px]"
          {...inputHandlers}
        />
        <button
          type="submit"
          title="Search"
          aria-label="Search products"
          className="flex shrink-0 items-center justify-center bg-secondary px-3 text-slate-900 transition-colors hover:bg-secondary/90 md:px-4 lg:min-w-[3.25rem]"
        >
          <Search className="h-4 w-4 md:h-[1.125rem] md:w-[1.125rem]" strokeWidth={2.25} aria-hidden />
        </button>
      </div>
    </form>
  );
}

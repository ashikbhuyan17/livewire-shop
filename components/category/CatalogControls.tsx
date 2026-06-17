'use client';

import { type ReactNode, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpDown, Filter, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  CATALOG_SORT_OPTIONS,
  buildCatalogPageHref,
  hasActiveCatalogFilters,
  type ParsedCatalogParams,
} from '@/lib/catalog-utils';
import type { ProductTag } from '@/lib/catalog';

type Props = {
  tags: ProductTag[];
  params: ParsedCatalogParams;
  children?: ReactNode;
};

export function CatalogFilterPanel({
  tags,
  params,
  pending,
  onToggleTag,
}: {
  tags: ProductTag[];
  params: ParsedCatalogParams;
  pending: boolean;
  onToggleTag: (name: string) => void;
}) {
  if (!tags.length) {
    return (
      <p className="text-sm text-muted-foreground">No tags available.</p>
    );
  }

  return (
    <aside className="w-full lg:w-64">
      <section className="rounded-lg border border-border bg-card p-4">
        <h4 className="mb-3 text-sm font-semibold text-foreground">Tags</h4>
        <ul className="max-h-72 space-y-2.5 overflow-y-auto">
          {tags.map((tag) => {
            const checked = params.tags.includes(tag.name);
            return (
              <li key={tag.id}>
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors',
                    checked
                      ? 'border-primary/40 bg-primary/5 text-foreground'
                      : 'border-transparent hover:bg-muted/60',
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => onToggleTag(tag.name)}
                    disabled={pending}
                  />
                  <span className="leading-tight">{tag.name}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}

function CatalogSortBar({
  params,
  pending,
  hasFilters,
  onSelectSort,
  onClear,
  filterTrigger,
}: {
  params: ParsedCatalogParams;
  pending: boolean;
  hasFilters: boolean;
  onSelectSort: (value: (typeof CATALOG_SORT_OPTIONS)[number]['value']) => void;
  onClear: () => void;
  filterTrigger?: ReactNode;
}) {
  return (
    <div className="mb-4 rounded-lg border border-border/70 bg-muted/25 p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ArrowUpDown className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight">Sort by</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filterTrigger}

          <div
            className="inline-flex flex-wrap gap-1 rounded-lg border border-border/80 bg-background p-1 shadow-sm"
            role="group"
            aria-label="Sort options"
          >
            {CATALOG_SORT_OPTIONS.map((opt) => {
              const active = params.filter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={pending}
                  onClick={() => onSelectSort(opt.value)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-all sm:text-sm',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                  aria-pressed={active}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {hasFilters ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={onClear}
              className="h-9 gap-1.5 border-border bg-background text-foreground hover:bg-destructive/5 hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Clear
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function CatalogControls({ tags, params, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const hasFilters = hasActiveCatalogFilters(params);

  const navigate = (overrides: Partial<ParsedCatalogParams>) => {
    const href = buildCatalogPageHref(pathname, params, overrides);
    startTransition(() => router.push(href));
  };

  const toggleTag = (name: string) => {
    const next = params.tags.includes(name)
      ? params.tags.filter((t) => t !== name)
      : [...params.tags, name];
    navigate({ tags: next });
  };

  const clearAll = () => {
    navigate({ filter: '', tags: [], page: 1 });
  };

  const filterPanelProps = {
    tags,
    params,
    pending,
    onToggleTag: toggleTag,
  };

  const mobileFilterTrigger = tags.length > 0 ? (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-9 gap-1.5 border-primary/30 bg-background"
        >
          <Filter className="h-3.5 w-3.5" />
          Tags
          {params.tags.length > 0 ? (
            <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {params.tags.length}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[min(100%,20rem)] overflow-y-auto"
      >
        <SheetHeader className="mb-4 text-left">
          <SheetTitle>Filter by tag</SheetTitle>
        </SheetHeader>
        <CatalogFilterPanel {...filterPanelProps} />
        {hasFilters ? (
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full gap-1.5"
            disabled={pending}
            onClick={clearAll}
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </Button>
        ) : null}
      </SheetContent>
    </Sheet>
  ) : null;

  return (
    <div
      className={cn(
        'flex flex-col gap-6 lg:flex-row lg:items-start',
        pending && 'pointer-events-none opacity-70',
      )}
    >
      {tags.length > 0 ? (
        <aside className="hidden shrink-0 lg:block">
          <CatalogFilterPanel {...filterPanelProps} />
          {hasFilters ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 w-full gap-1.5"
              disabled={pending}
              onClick={clearAll}
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          ) : null}
        </aside>
      ) : null}

      <section className="min-w-0 flex-1">
        <CatalogSortBar
          params={params}
          pending={pending}
          hasFilters={hasFilters}
          onSelectSort={(value) =>
            navigate({ filter: params.filter === value ? '' : value })
          }
          onClear={clearAll}
          filterTrigger={mobileFilterTrigger}
        />
        {children}
      </section>
    </div>
  );
}

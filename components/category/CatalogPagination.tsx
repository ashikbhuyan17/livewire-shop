import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  buildCatalogPageHref,
  type ParsedCatalogParams,
} from '@/lib/catalog-utils';

type Props = {
  pathname: string;
  params: ParsedCatalogParams;
  currentPage: number;
  lastPage: number;
  total: number;
};

export default function CatalogPagination({
  pathname,
  params,
  currentPage,
  lastPage,
  total,
}: Props) {
  if (lastPage <= 1 && total === 0) return null;

  const prevHref =
    currentPage > 1
      ? buildCatalogPageHref(pathname, params, { page: currentPage - 1 })
      : null;
  const nextHref =
    currentPage < lastPage
      ? buildCatalogPageHref(pathname, params, { page: currentPage + 1 })
      : null;

  return (
    <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        {total} product{total === 1 ? '' : 's'}
        {lastPage > 1 ? ` · Page ${currentPage} of ${lastPage}` : ''}
      </p>
      <nav className="flex items-center gap-2" aria-label="Pagination">
        {prevHref ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={prevHref}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
        )}
        {nextHref ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={nextHref}>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </nav>
    </footer>
  );
}

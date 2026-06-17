import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { blogsListHref } from '@/lib/blogs';

type Props = {
  currentPage: number;
  lastPage: number;
};

export default function BlogPagination({ currentPage, lastPage }: Props) {
  if (lastPage <= 1) return null;

  const prevHref = blogsListHref(Math.max(1, currentPage - 1));
  const nextHref = blogsListHref(Math.min(lastPage, currentPage + 1));

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-3"
      aria-label="Blog pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-headerBg/30 hover:text-headerBg"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-4 py-2 text-sm text-slate-400">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </span>
      )}

      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
        Page {currentPage} of {lastPage}
      </span>

      {currentPage < lastPage ? (
        <Link
          href={nextHref}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-headerBg/30 hover:text-headerBg"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-4 py-2 text-sm text-slate-400">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildNotificationsHref } from '@/lib/notification-utils';

type Props = {
  currentPage: number;
  lastPage: number;
};

export default function NotificationsPagination({
  currentPage,
  lastPage,
}: Props) {
  if (lastPage <= 1) return null;

  const prevHref = buildNotificationsHref(Math.max(1, currentPage - 1));
  const nextHref = buildNotificationsHref(
    Math.min(lastPage, currentPage + 1),
  );

  return (
    <nav
      className="mt-6 flex items-center justify-center gap-2"
      aria-label="Notifications pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </span>
      )}
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {lastPage}
      </span>
      {currentPage < lastPage ? (
        <Link
          href={nextHref}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

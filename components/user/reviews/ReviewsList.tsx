import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Calendar, ImageIcon, Store } from 'lucide-react';
import { Card } from '@/components/ui/card';
import StarRating from '@/components/user/reviews/StarRating';
import type { MyReviewItem } from '@/lib/user-reviews';
import { cn } from '@/lib/utils';

type Props = {
  reviews: MyReviewItem[];
};

function imgUrl(path: string | null | undefined): string | null {
  if (!path?.trim()) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = (process.env.NEXT_PUBLIC_IMG_URL || '').replace(/\/+$/, '');
  const rel = path.replace(/^\/+/, '');
  return base ? `${base}/${rel}` : `/${rel}`;
}

function statusStyles(status: string | null | undefined) {
  const s = (status ?? '').trim().toLowerCase();
  if (s === 'approve' || s === 'approved') {
    return {
      label: 'Published',
      className:
        'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300',
    };
  }
  if (s === 'pending') {
    return {
      label: 'Pending',
      className:
        'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-200',
    };
  }
  if (s === 'reject' || s === 'rejected') {
    return {
      label: 'Rejected',
      className:
        'border-red-200 bg-red-50 text-red-800 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-300',
    };
  }
  const label = status?.trim() || 'Unknown';
  return {
    label: label.charAt(0).toUpperCase() + label.slice(1),
    className: 'border-border bg-muted/60 text-muted-foreground',
  };
}

function ReviewCard({ review }: { review: MyReviewItem }) {
  const product = review.product;
  const productName = product?.name?.trim() || 'Product';
  const productSlug = product?.slug?.trim();
  const productHref = productSlug ? `/product/${productSlug}` : null;
  const productImage = imgUrl(product?.thumbnail_img);
  const reviewImage = imgUrl(review.image);
  const rating = Math.min(
    5,
    Math.max(
      0,
      parseInt(String(review.ratting ?? review.rating ?? '0'), 10) || 0,
    ),
  );
  const dateLabel = review.created_at
    ? new Date(review.created_at).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    : '';
  const status = statusStyles(review.status);
  const hasReply = Boolean(review.reply_message?.trim());
  const hasText = Boolean(review.review?.trim());

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-3">
        <div className="flex gap-2">
          <Link
            href={productHref ?? '#'}
            className={cn(
              'relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-border/80',
              !productHref && 'pointer-events-none',
            )}
            tabIndex={productHref ? 0 : -1}
            aria-hidden={!productHref}
          >
            {productImage ? (
              <Image
                src={productImage}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground/50" />
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-start justify-between gap-1">
              {productHref ? (
                <Link
                  href={productHref}
                  className="line-clamp-1 text-xs font-semibold text-foreground hover:text-primary sm:text-sm"
                >
                  {productName}
                </Link>
              ) : (
                <p className="line-clamp-1 text-xs font-semibold text-foreground sm:text-sm">
                  {productName}
                </p>
              )}
              <span
                className={cn(
                  'shrink-0 rounded-full border px-1.5 py-px text-[9px] font-semibold leading-none',
                  status.className,
                )}
              >
                {status.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <StarRating rating={rating} />
              {dateLabel ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground sm:text-xs">
                  <Calendar className="h-3 w-3" aria-hidden />
                  {dateLabel}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-2">
          {hasText ? (
            <p className="line-clamp-3 text-xs leading-relaxed text-foreground/90">
              {review.review}
            </p>
          ) : (
            <p className="text-xs italic text-muted-foreground">
              No written feedback.
            </p>
          )}

          {/* {reviewImage ? (
            <div className="relative h-20 w-full overflow-hidden rounded-md border border-border/80 bg-muted">
              <Image
                src={reviewImage}
                alt="Review photo"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          ) : null} */}
        </div>

        {hasReply ? (
          <div className="mt-2 rounded-md border border-border/80 bg-muted/40 p-2">
            <p className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold text-foreground">
              <Store className="h-3 w-3 text-primary" aria-hidden />
              Seller reply
            </p>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {review.reply_message}
            </p>
          </div>
        ) : null}

        {productHref ? (
          <Link
            href={productHref}
            className="mt-2 inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:text-primary/80"
          >
            View product
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        ) : null}
      </div>
    </Card>
  );
}

export default function ReviewsList({ reviews }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-4">
      {reviews.map((review) => (
        <li
          key={String(review.id ?? `${review.product_id}-${review.created_at}`)}
        >
          <ReviewCard review={review} />
        </li>
      ))}
    </ul>
  );
}

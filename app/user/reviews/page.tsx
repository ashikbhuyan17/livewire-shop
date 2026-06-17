import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import ReviewsEmpty from '@/components/user/reviews/ReviewsEmpty';
import ReviewsList from '@/components/user/reviews/ReviewsList';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';
import { fetchMyReviews, type MyReviewItem } from '@/lib/user-reviews';

export const metadata: Metadata = buildPageMeta({
  title: 'My reviews',
  description: 'View your product reviews submitted on BestFood City.',
  pathname: '/user/reviews',
  robots: PRIVATE_ROUTE_ROBOTS,
});

export default async function UserReviewsPage() {
  const res = await fetchMyReviews();
  const ok =
    res?.status === true ||
    res?.status === 'success' ||
    res?.status === 'Success';
  const reviews: MyReviewItem[] =
    ok && Array.isArray(res.data) ? res.data : [];

  return (
    <section className="mx-auto w-full max-w-[90rem] px-4 py-5 sm:px-6 sm:py-6">
      <header className="mb-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              My reviews
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
              {reviews.length > 0
                ? `${reviews.length} review${reviews.length === 1 ? '' : 's'} across your orders`
                : 'Track feedback you have shared on products'}
            </p>
          </div>
        </div>
      </header>

      {!ok ? (
        <div
          className="rounded-2xl border border-destructive/25 bg-destructive/5 px-5 py-4 text-sm text-destructive"
          role="alert"
        >
          {res?.message?.trim() ||
            'Could not load your reviews. Please try again later.'}
        </div>
      ) : reviews.length === 0 ? (
        <ReviewsEmpty />
      ) : (
        <ReviewsList reviews={reviews} />
      )}
    </section>
  );
}

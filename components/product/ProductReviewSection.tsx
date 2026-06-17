'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Autoplay from 'embla-carousel-autoplay';
import {
  ImagePlus,
  Loader2,
  PencilLine,
  Send,
  Star,
  User,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { submitProductReviewWithFields } from '@/lib/fetcher';
import {
  isImageFileSizeValid,
  getImageFileTooLargeMessage,
} from '@/lib/fileUpload';

type NormalizedReview = {
  id: string;
  rating: number;
  text: string;
  authorName: string;
  authorAvatarUrl: string | null;
  imageUrl: string | null;
  createdAt: string | null;
};

function firstValidationError(errors: unknown): string | undefined {
  if (!errors || typeof errors !== 'object') return undefined;
  for (const v of Object.values(errors as Record<string, unknown>)) {
    if (Array.isArray(v) && typeof v[0] === 'string') return v[0];
    if (typeof v === 'string') return v;
  }
  return undefined;
}

function toNumber(v: unknown, fallback = 0): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : fallback;
}

function resolveImageUrl(path: unknown): string | null {
  if (typeof path !== 'string' || !path.trim()) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = (process.env.NEXT_PUBLIC_IMG_URL || '').replace(/\/+$/, '');
  const rel = path.replace(/^\/+/, '');
  return base ? `${base}/${rel}` : `/${rel}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function normalizeReviews(raw: unknown): NormalizedReview[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((r, idx): NormalizedReview | null => {
      if (!r || typeof r !== 'object') return null;
      const obj = r as Record<string, unknown>;
      const user = (obj.user ?? obj.customer ?? {}) as Record<string, unknown>;
      const rating = toNumber(obj.ratting ?? obj.rating ?? user.rating);
      const text = String(
        obj.review ?? obj.comment ?? obj.message ?? '',
      ).trim();
      const authorName =
        String(
          obj.user_name ??
            obj.customer_name ??
            user.name ??
            user.full_name ??
            'Anonymous',
        ) || 'Anonymous';
      const authorAvatarUrl = resolveImageUrl(
        obj.user_image ?? user.image ?? user.profile_image,
      );
      const imageUrl = resolveImageUrl(obj.image ?? obj.review_image);
      const createdAt =
        typeof obj.created_at === 'string'
          ? obj.created_at
          : typeof obj.createdAt === 'string'
            ? obj.createdAt
            : null;
      const id = String(obj.id ?? `${idx}-${authorName}-${createdAt ?? ''}`);
      return {
        id,
        rating,
        text,
        authorName,
        authorAvatarUrl,
        imageUrl,
        createdAt,
      };
    })
    .filter(
      (r): r is NormalizedReview =>
        r !== null && (r.rating > 0 || r.text.length > 0),
    );
}

type Props = {
  productId: string | number | undefined;
  vendorId: string | number | undefined;
  reviews: unknown;
  isAuthenticated: boolean;
};

export default function ProductReviewSection({
  productId,
  vendorId,
  reviews,
  isAuthenticated,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname || '/'}${
    searchParams && searchParams.toString() ? `?${searchParams.toString()}` : ''
  }`;
  const signInHref = `/signin?redirect=${encodeURIComponent(currentUrl)}`;
  const normalized = useMemo(() => normalizeReviews(reviews), [reviews]);

  const ratedCount = normalized.filter((r) => r.rating > 0).length;
  const avgRating = ratedCount
    ? normalized.reduce((acc, r) => acc + r.rating, 0) / ratedCount
    : 0;

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    !!productId && !!vendorId && rating > 0 && text.trim().length >= 3;

  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0];
    e.target.value = '';
    if (!next) return;
    if (!next.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (!isImageFileSizeValid(next)) {
      toast.error(getImageFileTooLargeMessage());
      return;
    }
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(URL.createObjectURL(next));
  };

  const clearImage = () => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setText('');
    clearImage();
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && submitting) return;
    setOpen(next);
    if (!next) resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !vendorId) {
      toast.error('Missing product details, cannot submit review.');
      return;
    }
    if (rating < 1) {
      toast.error('Please select a rating');
      return;
    }
    if (text.trim().length < 3) {
      toast.error('Please write at least a few words');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitProductReviewWithFields({
        product_id: productId,
        vendor_id: vendorId,
        ratting: rating,
        review: text.trim(),
        image: file,
      });
      console.log('🚀 ~ handleSubmit ~ res:', res);

      const ok =
        res?.status === true ||
        res?.status === 'success' ||
        String(res?.status || '').toLowerCase() === 'success';

      if (ok) {
        toast.success(res?.message ?? 'Review submitted, thanks!');
        resetForm();
        setOpen(false);
        router.refresh();
      } else {
        const msg =
          (typeof res?.message === 'string' && res.message) ||
          firstValidationError(res?.errors) ||
          'Failed to submit review';
        toast.error(msg);
      }
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const stars = [1, 2, 3, 4, 5];
  const displayRating = hoverRating || rating;

  const ratingLabel = displayRating
    ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][displayRating]
    : 'Tap a star';

  return (
    <section className="mt-10 border-t pt-8" aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-5">
          <div>
            <h2
              id="reviews-heading"
              className="text-xl font-semibold tracking-tight"
            >
              Customer Reviews
            </h2>
            <p className="text-sm text-muted-foreground">
              {ratedCount
                ? `Based on ${ratedCount} ${ratedCount === 1 ? 'review' : 'reviews'}`
                : 'No reviews yet — be the first to share your experience.'}
            </p>
          </div>
          {ratedCount > 0 ? (
            <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-2 shadow-sm">
              <span className="text-3xl font-bold leading-none">
                {avgRating.toFixed(1)}
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5">
                  {stars.map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= Math.round(avgRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">out of 5</span>
              </div>
            </div>
          ) : null}
        </div>

        {isAuthenticated ? (
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="h-10 rounded-full px-5 text-sm font-semibold shadow-sm">
                <PencilLine className="h-4 w-4" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg p-0 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 via-yellow-100/40 to-transparent px-6 py-5 border-b">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-lg font-semibold">
                    Write a review
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Share your honest opinion to help others choose.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 px-6 py-5"
                aria-busy={submitting}
              >
                <div className="space-y-2">
                  <Label className="text-sm">Your rating</Label>
                  <div
                    className="flex items-center gap-1"
                    role="radiogroup"
                    aria-label="Rating"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {stars.map((s) => {
                      const filled = s <= displayRating;
                      return (
                        <button
                          key={s}
                          type="button"
                          role="radio"
                          aria-checked={rating === s}
                          aria-label={`${s} star${s > 1 ? 's' : ''}`}
                          onMouseEnter={() => setHoverRating(s)}
                          onFocus={() => setHoverRating(s)}
                          onBlur={() => setHoverRating(0)}
                          onClick={() => setRating(s)}
                          className="rounded-md p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              filled
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground/40'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                      {ratingLabel}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review-text" className="text-sm">
                    Your review
                  </Label>
                  <Textarea
                    id="review-text"
                    placeholder="What did you like or dislike about this product?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={1000}
                    rows={5}
                    className="resize-y rounded-md border-gray-300"
                  />
                  <p className="text-right text-xs text-muted-foreground">
                    {text.length}/1000
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Add a photo (optional)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    aria-label="Upload review photo"
                    onChange={handlePickImage}
                  />
                  {preview ? (
                    <div className="relative overflow-hidden rounded-lg border">
                      <Image
                        src={preview}
                        alt="Review photo preview"
                        width={520}
                        height={240}
                        unoptimized
                        className="h-44 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        aria-label="Remove photo"
                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed bg-white px-3 py-6 text-sm text-muted-foreground transition hover:border-primary/50 hover:bg-muted/30 hover:text-foreground"
                    >
                      <ImagePlus className="h-5 w-5" />
                      Click to upload
                    </button>
                  )}
                </div>

                <DialogFooter className="flex flex-row gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleOpenChange(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="flex-1 rounded-md text-sm font-semibold text-white"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit review
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            asChild
            className="h-10 rounded-full px-5 text-sm font-semibold shadow-sm"
          >
            <Link href={signInHref}>
              <PencilLine className="h-4 w-4" />
              Sign in to review
            </Link>
          </Button>
        )}
      </div>

      <div className="mt-6">
        {normalized.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-yellow-100 text-yellow-600">
              <Star className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">No reviews yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Be the first to leave a review for this product.
            </p>
          </div>
        ) : (
          <Carousel
            opts={{ align: 'start', loop: normalized.length > 5 }}
            plugins={[
              Autoplay({
                delay: 3500,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-3">
              {normalized.map((r) => (
                <CarouselItem
                  key={r.id}
                  className="pl-2 md:pl-3 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div className="flex h-full flex-col gap-2 rounded-lg bg-white p-3">
                    {r.rating > 0 ? (
                      <div className="flex items-center gap-0.5">
                        {stars.map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${
                              s <= Math.round(r.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    ) : null}

                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 shrink-0">
                        {r.authorAvatarUrl ? (
                          <AvatarImage
                            src={r.authorAvatarUrl}
                            alt={r.authorName}
                          />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-3.5 w-3.5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-foreground leading-tight">
                          {r.authorName}
                        </p>
                        {r.createdAt ? (
                          <time
                            dateTime={r.createdAt}
                            className="text-[10px] text-muted-foreground"
                          >
                            {formatDate(r.createdAt)}
                          </time>
                        ) : null}
                      </div>
                    </div>

                    <p className="line-clamp-3 min-h-[2.85rem] whitespace-pre-line text-[12px] leading-snug text-foreground/90">
                      {r.text || ''}
                    </p>

                    {r.imageUrl ? (
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-muted">
                        <Image
                          src={r.imageUrl}
                          alt={`Review by ${r.authorName}`}
                          fill
                          sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
}

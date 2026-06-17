import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  rating: number;
  className?: string;
  size?: 'sm' | 'md';
};

export default function StarRating({
  rating,
  className,
  size = 'sm',
}: Props) {
  const starSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div
      className={cn('inline-flex items-center gap-px', className)}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            starSize,
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-transparent text-muted-foreground/25',
          )}
        />
      ))}
    </div>
  );
}

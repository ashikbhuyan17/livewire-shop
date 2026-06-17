'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlist-store';

type Props = {
  initialCount: number;
};

export default function WishlistHeaderLink({ initialCount }: Props) {
  const hydrated = useWishlistStore((s) => s.hydrated);
  const count = useWishlistStore((s) => s.count);
  const wishlistCount = hydrated ? count : initialCount;

  return (
    <Link
      prefetch
      href="/wishlist"
      aria-label={
        wishlistCount > 0
          ? `View wishlist (${wishlistCount} items)`
          : 'View wishlist'
      }
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100 md:h-10 md:w-10"
    >
      <Heart className="h-5 w-5" />
      {wishlistCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {wishlistCount > 99 ? '99+' : wishlistCount}
        </span>
      )}
    </Link>
  );
}

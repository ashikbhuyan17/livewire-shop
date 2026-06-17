'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import { addToWishlist, removeFromWishlist } from '@/lib/wishlist';
import { isWishlistApiSuccess } from '@/lib/wishlist-utils';
import { useWishlistStore } from '@/stores/wishlist-store';

type Props = {
  productId: number;
  className?: string;
};

export default function WishlistButton({ productId, className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const hydrated = useWishlistStore((s) => s.hydrated);
  const inWishlist = useWishlistStore((s) => s.productIds.includes(productId));
  const addProduct = useWishlistStore((s) => s.addProduct);
  const removeProduct = useWishlistStore((s) => s.removeProduct);

  const handleClick = async () => {
    if (!productId || loading) return;

    setLoading(true);
    try {
      const profile: { data?: { id?: number } } = await fetcher('/user-profile');
      if (!profile?.data?.id) {
        const redirect = encodeURIComponent(pathname || `/product`);
        router.push(`/signin?redirect=${redirect}`);
        return;
      }

      if (inWishlist) {
        const res = await removeFromWishlist(productId);
        if (isWishlistApiSuccess(res?.status) || res?.ok) {
          removeProduct(productId);
          toast.success('Removed from wishlist');
          router.refresh();
        } else {
          toast.error(
            typeof res?.message === 'string'
              ? res.message
              : 'Failed to remove from wishlist',
          );
        }
      } else {
        const res = await addToWishlist(productId);
        if (isWishlistApiSuccess(res?.status) || res?.ok) {
          addProduct(productId);
          toast.success('Added to wishlist');
          router.refresh();
        } else {
          toast.error(
            typeof res?.message === 'string'
              ? res.message
              : 'Failed to add to wishlist',
          );
        }
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={loading || !hydrated}
      onClick={handleClick}
      className={
        className ??
        'flex-1 border-border/70 hover:bg-secondary/10'
      }
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
      ) : (
        <Heart
          className={`mr-2 h-4 w-4 text-primary ${inWishlist ? 'fill-primary' : ''}`}
        />
      )}
      {inWishlist ? 'In Wishlist' : 'Wishlist'}
    </Button>
  );
}

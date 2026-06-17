/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import { removeFromWishlist } from '@/lib/wishlist';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CURRENCY_SYMBOL } from '@/lib/currency';
import { formatBDT } from '@/lib/order-utils';
import { isWishlistApiSuccess } from '@/lib/wishlist-utils';
import { useWishlistStore } from '@/stores/wishlist-store';

interface WishlistProductCardProps {
  id: number;
  productId: number;
  slug: string;
  image: string;
  title: string;
  newPrice: number;
  oldPrice?: number;
}

export default function WishlistProductCard({
  productId,
  slug,
  image,
  title,
  newPrice,
  oldPrice,
}: WishlistProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const removeProduct = useWishlistStore((s) => s.removeProduct);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsRemoving(true);

    try {
      const user: any = await fetcher('/user-profile');
      if (!user?.data?.id) {
        router.push(`/signin?redirect=${encodeURIComponent(pathname || '/wishlist')}`);
        return;
      }

      const res = await removeFromWishlist(productId);

      if (isWishlistApiSuccess(res?.status) || res?.ok) {
        setIsRemoved(true);
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
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsRemoving(false);
    }
  };

  if (isRemoved) {
    return null;
  }

  return (
    <Card className="bg-white border border-gray-200 overflow-hidden transition-shadow h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        <Link href={`/product/${slug}`} prefetch className="block shrink-0">
          <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${image}`}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
              className="object-cover"
            />
          </div>
        </Link>

        <div className="px-3 pt-3 pb-0 flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#ff0050] font-bold text-base">
              <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
              {formatBDT(newPrice)}
            </span>
            {oldPrice != null && oldPrice > newPrice && (
              <span className="text-gray-400 font-medium text-sm line-through">
                <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
                {formatBDT(oldPrice)}
              </span>
            )}
          </div>

          <Link href={`/product/${slug}`} prefetch className="shrink-0">
            <h3 className="text-sm text-gray-800 font-medium leading-tight line-clamp-2 hover:text-primary transition-colors mb-2">
              {title}
            </h3>
          </Link>

          <div className="mt-auto">
            <Button
              onClick={handleRemove}
              disabled={isRemoving}
              variant="outline"
              className={cn(
                'w-full border-gray-200 bg-white hover:bg-gray-50',
                'flex items-center justify-center gap-2 h-auto py-2',
              )}
            >
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#279ACE]" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 text-[#279ACE]" />
                  <span className="text-[#279ACE] text-sm font-medium">
                    Remove
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

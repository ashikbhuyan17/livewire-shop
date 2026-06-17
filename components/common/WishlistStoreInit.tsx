'use client';

import { useLayoutEffect, useRef } from 'react';
import { useWishlistStore } from '@/stores/wishlist-store';

export default function WishlistStoreInit({
  productIds,
}: {
  productIds: number[];
}) {
  const didInit = useRef(false);

  useLayoutEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    useWishlistStore.getState().init(productIds);
  }, [productIds]);

  return null;
}

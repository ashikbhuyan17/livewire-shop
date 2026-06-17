'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { PENDING_CART_CLEAR_KEY } from '@/lib/pending-cart-clear';

export default function OrdersCartClearEffect() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(PENDING_CART_CLEAR_KEY)) {
        sessionStorage.removeItem(PENDING_CART_CLEAR_KEY);
        useCartStore.getState().clearCart();
      }
    } catch {
      /* private mode */
    }
  }, []);

  return null;
}

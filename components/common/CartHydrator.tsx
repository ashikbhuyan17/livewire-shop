'use client';

import type { Cart } from '@/lib/cart';
import { ensureCartHydrated } from '@/stores/cart-store';

export default function CartHydrator({ cart }: { cart: Cart }) {
  ensureCartHydrated(cart);
  return null;
}

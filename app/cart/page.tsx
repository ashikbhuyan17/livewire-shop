import { getCart } from '@/lib/cart';
import CartPageClient from '@/components/cart/CartPageClient';
import type { Metadata } from 'next';
import { SITE_BRAND_SHORT, buildPageMeta } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Shopping Cart',
  description: `Review items in your ${SITE_BRAND_SHORT} shopping cart.`,
  pathname: '/cart',
});

export default async function CartPage() {
  const initialCart = await getCart();
  return <CartPageClient initialCart={initialCart} />;
}

import type { Metadata } from 'next';
import PreOrderPageClient from '@/components/pre-order/PreOrderPageClient';
import { SITE_BRAND_SHORT, buildPageMeta } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Pre-Order',
  description: `Can't find a product? Pre-order anything with ${SITE_BRAND_SHORT} — share the details and we'll source it for you.`,
  pathname: '/pre-order',
  keywords: ['pre-order', 'product request', 'source product', SITE_BRAND_SHORT],
});

export default function PreOrderPage() {
  return <PreOrderPageClient />;
}

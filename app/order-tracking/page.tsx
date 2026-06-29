import type { Metadata } from 'next';
import OrderTrackingClient from '@/components/order-tracking/OrderTrackingClient';
import { SITE_BRAND_SHORT, buildPageMeta } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Order Tracking',
  description: `Track your ${SITE_BRAND_SHORT} order status using your order ID.`,
  pathname: '/order-tracking',
  keywords: ['order tracking', 'track order', 'delivery status', SITE_BRAND_SHORT],
});

export default function OrderTrackingPage() {
  return <OrderTrackingClient />;
}

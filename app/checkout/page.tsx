import CheckoutPageClient from '@/components/checkout/CheckoutClient';
import { fetcher } from '@/lib/fetcher';
import React from 'react';
import type { Metadata } from 'next';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Review & confirm',
  description:
    'Review your bag, delivery details, and total — then place your order at Livewire.',
  pathname: '/checkout',
  robots: PRIVATE_ROUTE_ROBOTS,
});

async function CheckoutPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, vat, tax, profile]: [any, any, any, any] = await Promise.all([
    fetcher('/shipping-charge'),
    fetcher('/vat'),
    fetcher('/tax'),
    fetcher('/user-profile', { cache: 'no-store' }, false),
  ]);

  return (
    <CheckoutPageClient
      vat={vat?.data?.rate}
      tax={tax?.data?.rate}
      shippingAreas={data}
      userProfile={profile}
    />
  );
}

export default CheckoutPage;

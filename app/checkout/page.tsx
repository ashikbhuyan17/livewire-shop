import CheckoutPageClient from '@/components/checkout/CheckoutClient';
import { getCart } from '@/lib/cart';
import { fetcher, publicFetcher } from '@/lib/fetcher';
import { AUTH_TOKEN_COOKIE } from '@/lib/auth-cookies';
import { cookies } from 'next/headers';
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

async function fetchUserProfileIfAuthed() {
  const token = (await cookies()).get(AUTH_TOKEN_COOKIE)?.value?.trim();
  if (!token) return null;

  try {
    return await fetcher('/user-profile', { cache: 'no-store' }, false);
  } catch {
    return null;
  }
}

async function CheckoutPage() {
  const initialCart = await getCart();
  type RateResponse = { data?: { rate?: string | number } };
  const [data, vat, tax, profile] = await Promise.all([
    publicFetcher<{ data?: unknown[] }>('/shipping-charge', {}, 600),
    publicFetcher<RateResponse>('/vat', {}, 600),
    publicFetcher<RateResponse>('/tax', {}, 600),
    fetchUserProfileIfAuthed(),
  ]);

  return (
    <CheckoutPageClient
      initialCart={initialCart}
      vat={vat?.data?.rate ?? 0}
      tax={tax?.data?.rate ?? 0}
      shippingAreas={data}
      userProfile={profile}
    />
  );
}

export default CheckoutPage;

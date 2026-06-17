'use server';

import { cookies } from 'next/headers';
import { AUTH_TOKEN_COOKIE } from '@/lib/auth-cookies';
import { fetcher, type ApiEnvelope } from '@/lib/fetcher';
import {
  getWishlistProductIds,
  type WishlistApiItem,
} from '@/lib/wishlist-utils';

export type { WishlistApiItem };

export type WishlistMutationResult = {
  ok: boolean;
  status?: unknown;
  message?: string;
};

async function wishlistPost(
  slug: string,
  productId: number | string,
): Promise<WishlistMutationResult> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(AUTH_TOKEN_COOKIE)?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${slug}`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ product_id: Number(productId) }),
    cache: 'no-store',
  });

  let data: Record<string, unknown> = {};
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    data = {};
  }

  return { ok: res.ok, ...data } as WishlistMutationResult;
}

export async function fetchWishlist(): Promise<ApiEnvelope<WishlistApiItem[]>> {
  return fetcher<ApiEnvelope<WishlistApiItem[]>>(
    '/wishlist',
    { cache: 'no-store' },
    false,
  );
}

export async function addToWishlist(productId: number | string) {
  return wishlistPost('/wishlist/store', productId);
}

export async function removeFromWishlist(productId: number | string) {
  return wishlistPost('/wishlist/remove', productId);
}

export async function getWishlistSummary() {
  try {
    const res = await fetchWishlist();
    const items = Array.isArray(res?.data) ? res.data : [];
    return {
      count: items.length,
      productIds: getWishlistProductIds(items),
    };
  } catch {
    return { count: 0, productIds: [] as number[] };
  }
}

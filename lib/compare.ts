'use server';

import { cookies } from 'next/headers';
import { AUTH_TOKEN_COOKIE } from '@/lib/auth-cookies';
import { fetcher, type ApiEnvelope } from '@/lib/fetcher';
import {
  getCompareProductIds,
  type CompareApiItem,
} from '@/lib/compare-utils';

export type { CompareApiItem };

export type CompareMutationResult = {
  ok: boolean;
  status?: unknown;
  message?: string;
};

async function comparePost(
  slug: string,
  productId: number | string,
): Promise<CompareMutationResult> {
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

  return { ok: res.ok, ...data } as CompareMutationResult;
}

export async function fetchCompare(): Promise<ApiEnvelope<CompareApiItem[]>> {
  return fetcher<ApiEnvelope<CompareApiItem[]>>(
    '/compare',
    { cache: 'no-store' },
    false,
  );
}

export async function addToCompare(productId: number | string) {
  return comparePost('/compare/store', productId);
}

export async function removeFromCompare(productId: number | string) {
  return comparePost('/compare/remove', productId);
}

export async function getCompareSummary() {
  try {
    const res = await fetchCompare();
    const items = Array.isArray(res?.data) ? res.data : [];
    return {
      count: items.length,
      productIds: getCompareProductIds(items),
    };
  } catch {
    return { count: 0, productIds: [] as number[] };
  }
}

import { enrichProductForCard } from '@/lib/product-utils';

export type SearchApiResponse = {
  status?: boolean;
  message?: string;
  data?: Record<string, unknown>[];
};

export type SearchProductsResult = {
  products: Record<string, unknown>[];
  message: string;
  query: string;
  ok: boolean;
};

export function buildSearchPageUrl(query: string): string {
  const q = query.trim();
  if (!q) return '/search';
  return `/search?q=${encodeURIComponent(q)}`;
}

export function buildSearchApiPath(query: string): string {
  const q = query.trim();
  if (!q) return '';
  return `/search-product/${encodeURIComponent(q)}`;
}

/** Product search — always fresh (no CDN cache). */
export async function fetchSearchProducts(
  query: string,
): Promise<SearchProductsResult> {
  const q = query.trim();
  if (!q) {
    return { products: [], message: '', query: '', ok: true };
  }

  const apiPath = buildSearchApiPath(q);
  const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

  if (!base) {
    return { products: [], message: '', query: q, ok: false };
  }

  try {
    const res = await fetch(`${base}${apiPath}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const json = (await res.json()) as SearchApiResponse;
    const raw = Array.isArray(json?.data) ? json.data : [];
    const products = raw
      .filter(Boolean)
      .map((p) => enrichProductForCard(p as Record<string, unknown>));

    return {
      products,
      message: json?.message ?? '',
      query: q,
      ok: Boolean(json?.status),
    };
  } catch {
    return { products: [], message: '', query: q, ok: false };
  }
}

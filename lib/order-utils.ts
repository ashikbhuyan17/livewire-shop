import { formatAmount } from '@/lib/currency';

/** @deprecated Use `formatAmount` from `@/lib/currency`. */
export function formatBDT(amount: string | number) {
  return formatAmount(amount);
}

export { CURRENCY_SYMBOL, formatAmount, formatMoney } from '@/lib/currency';

export function orderImageUrl(path: string | null | undefined) {
  if (!path) return '/placeholder.svg';
  const base = process.env.NEXT_PUBLIC_IMG_URL ?? '';
  const normalized = path.replace(/^\//, '');
  return `${base}/${normalized}`;
}

export function getOrderStatusBadgeVariant(statusName: string) {
  const s = statusName.toLowerCase();
  if (s.includes('deliver')) return 'default';
  if (s.includes('cancel')) return 'destructive';
  if (s.includes('pending')) return 'secondary';
  if (s.includes('process')) return 'secondary';
  if (s.includes('way') || s.includes('ship')) return 'outline';
  return 'outline';
}

export function formatOrderDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Default orders shown per page. */
export const ORDERS_PER_PAGE = 3;

export type OrdersSearchParamsInput = {
  keyword?: string;
  filter?: string;
  page?: string;
};

export function parseOrdersSearchParams(sp: OrdersSearchParamsInput) {
  const keyword = String(sp.keyword ?? '').trim();
  const filter = String(sp.filter ?? 'all').trim() || 'all';
  const page = Math.max(1, parseInt(String(sp.page ?? '1'), 10) || 1);
  return { keyword, filter, page };
}

/** Build /user/orders URL — omit default values. */
export function buildOrdersHref(params: {
  keyword?: string;
  filter?: string;
  page?: number;
}) {
  const qs = new URLSearchParams();
  const filter = String(params.filter ?? 'all').trim() || 'all';
  const keyword = String(params.keyword ?? '').trim();
  const page = params.page ?? 1;

  if (filter !== 'all') qs.set('filter', filter);
  if (keyword) qs.set('keyword', keyword);
  if (page > 1) qs.set('page', String(page));

  const q = qs.toString();
  return q ? `/user/orders?${q}` : '/user/orders';
}

/** API filter value from order status row. */
export function statusToFilterValue(status: { id: number | string }) {
  return String(status.id);
}

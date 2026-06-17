export type DashboardRole = 'user' | 'affiliate' | string;

export type UserDashboardData = {
  role: 'user';
  totalOrders: number;
  pendingOrders: number;
  wish: number;
  todayTotalOrders: number;
  todayPendingOrders: number;
  todayWish: number;
};

export type AffiliateDashboardData = {
  role: 'affiliate';
  totalOrders: number;
  totalPendingOrders: number;
  totalShippedOrders: number;
  totalDeliveredOrders: number;
  totalCancelledOrders: number;
  totalReturnOrders: number;
  totalSale: string | number;
  myShop: number;
  accountBalance: string | number;
  withdrawalBalance: string | number;
  todayTotalOrders: number;
  todayPendingOrders: number;
  todayShippedOrders: number;
  todayDeliveredOrders: number;
  todayCancelledOrders: number;
  todayReturnOrders: number;
};

export type DashboardOverviewData = UserDashboardData | AffiliateDashboardData;

export type DashboardOverviewResponse = {
  status?: boolean;
  message?: string;
  data?: DashboardOverviewData;
};

export type AffiliateShopUser = {
  name?: string;
  ref_code?: string | null;
};

export type AffiliateShopData = {
  user?: AffiliateShopUser;
  affiliate_links?: {
    affiliate_url?: string;
  };
};

export type AffiliateShopResponse = {
  status?: boolean;
  message?: string;
  data?: AffiliateShopData;
};

function num(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function isAffiliateDashboard(
  data: DashboardOverviewData | null | undefined,
): data is AffiliateDashboardData {
  return data?.role === 'affiliate';
}

export function isUserDashboard(
  data: DashboardOverviewData | null | undefined,
): data is UserDashboardData {
  return data?.role === 'user';
}

export function normalizeUserDashboard(
  raw: Record<string, unknown>,
): UserDashboardData {
  return {
    role: 'user',
    totalOrders: num(raw.totalOrders),
    pendingOrders: num(raw.pendingOrders),
    wish: num(raw.wish),
    todayTotalOrders: num(raw.todayTotalOrders),
    todayPendingOrders: num(raw.todayPendingOrders),
    todayWish: num(raw.todayWish),
  };
}

export function normalizeAffiliateDashboard(
  raw: Record<string, unknown>,
): AffiliateDashboardData {
  return {
    role: 'affiliate',
    totalOrders: num(raw.totalOrders),
    totalPendingOrders: num(raw.totalPendingOrders),
    totalShippedOrders: num(raw.totalShippedOrders),
    totalDeliveredOrders: num(raw.totalDeliveredOrders),
    totalCancelledOrders: num(raw.totalCancelledOrders),
    totalReturnOrders: num(raw.totalReturnOrders),
    totalSale: String(raw.totalSale ?? '0'),
    myShop: num(raw.myShop),
    accountBalance: String(raw.accountBalance ?? '0'),
    withdrawalBalance: String(raw.withdrawalBalance ?? '0'),
    todayTotalOrders: num(raw.todayTotalOrders),
    todayPendingOrders: num(raw.todayPendingOrders),
    todayShippedOrders: num(raw.todayShippedOrders),
    todayDeliveredOrders: num(raw.todayDeliveredOrders),
    todayCancelledOrders: num(raw.todayCancelledOrders),
    todayReturnOrders: num(raw.todayReturnOrders),
  };
}

export function parseDashboardOverview(
  response: DashboardOverviewResponse | null | undefined,
): DashboardOverviewData | null {
  const raw = response?.data;
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as Record<string, unknown>;
  if (record.role === 'affiliate') {
    return normalizeAffiliateDashboard(record);
  }
  if (record.role === 'user') {
    return normalizeUserDashboard(record);
  }
  return null;
}

export function buildAffiliateShareUrl(shop: AffiliateShopData | null | undefined): string {
  const base = String(shop?.affiliate_links?.affiliate_url ?? '').trim();
  if (!base) return '';

  const ref = String(shop?.user?.ref_code ?? '').trim();
  if (!ref) return base;

  if (base.includes('ref=') && !base.endsWith('=')) {
    return base;
  }
  if (base.endsWith('=')) {
    return `${base}${ref}`;
  }
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}ref=${encodeURIComponent(ref)}`;
}

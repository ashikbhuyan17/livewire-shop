import type { Metadata } from 'next';
import { fetcher } from '@/lib/fetcher';
import { fetchAffiliateShop } from '@/lib/fetcher';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';
import {
  parseDashboardOverview,
  type AffiliateShopData,
  type DashboardOverviewResponse,
} from '@/lib/dashboard-utils';
import { isPartnerUser } from '@/lib/partner-utils';
import DashboardOverview from '@/components/user/dashboard/DashboardOverview';

export const metadata: Metadata = buildPageMeta({
  title: 'Dashboard',
  description:
    'Your BestFood City dashboard — orders, wishlist, partner sales, and account overview.',
  pathname: '/user',
  robots: PRIVATE_ROUTE_ROBOTS,
});

export default async function UserDashboardPage() {
  const [overviewRes, profileRes] = await Promise.all([
    fetcher<DashboardOverviewResponse>(
      '/dashboard-overview',
      { cache: 'no-store' },
      false,
    ),
    fetcher<{
      data?: { name?: string; ref_code?: string | number | null };
    }>('/user-profile', { cache: 'no-store' }, false),
  ]);

  const overview = parseDashboardOverview(overviewRes);
  const isPartner = isPartnerUser(profileRes?.data?.ref_code);

  let affiliateShop: AffiliateShopData | null = null;
  if (isPartner || overview?.role === 'affiliate') {
    const shopRes = await fetchAffiliateShop();
    affiliateShop = shopRes?.data ?? null;
  }

  return (
    <DashboardOverview
      overview={overview}
      affiliateShop={affiliateShop}
      userName={profileRes?.data?.name}
      isPartner={isPartner}
      partnerRefCode={profileRes?.data?.ref_code}
    />
  );
}

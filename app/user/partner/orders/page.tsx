import type { Metadata } from 'next';
import PartnerHubNav from '@/components/user/partner/PartnerHubNav';
import AffiliateOrdersList from '@/components/user/partner/AffiliateOrdersList';
import { fetchAffiliateOrders } from '@/lib/fetcher';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';
import { requirePartnerProfile } from '@/lib/partner-profile';

export const metadata: Metadata = buildPageMeta({
  title: 'Referral orders',
  description: 'Orders placed through your BestFood City partner referral link.',
  pathname: '/user/partner/orders',
  robots: PRIVATE_ROUTE_ROBOTS,
});

export default async function PartnerOrdersPage() {
  const partner = await requirePartnerProfile();
  const ordersRes = await fetchAffiliateOrders(partner.id);
  const orders = Array.isArray(ordersRes?.data?.orders)
    ? ordersRes.data.orders
    : [];

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Referral orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} order{orders.length !== 1 ? 's' : ''} from your
          referral link
        </p>
      </header>

      <PartnerHubNav />

      <div className="mt-6">
        <AffiliateOrdersList orders={orders} />
      </div>
    </section>
  );
}

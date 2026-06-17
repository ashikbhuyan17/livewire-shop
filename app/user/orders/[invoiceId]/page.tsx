import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import OrderDetailsView from '@/components/user/orders/OrderDetailsView';
import { fetchOrderDetails } from '@/lib/fetcher';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';

type Props = {
  params: Promise<{ invoiceId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { invoiceId } = await params;
  const id = decodeURIComponent(invoiceId);
  return buildPageMeta({
    title: `Order ${id}`,
    description: `Order details for ${id} on BestFood City.`,
    pathname: `/user/orders/${encodeURIComponent(id)}`,
    robots: PRIVATE_ROUTE_ROBOTS,
  });
}

export default async function UserOrderDetailsPage({ params }: Props) {
  const { invoiceId } = await params;
  const id = decodeURIComponent(invoiceId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await fetchOrderDetails(id);
  const order = Array.isArray(res?.data) ? res.data[0] : null;

  if (!res?.status || !order) {
    notFound();
  }

  return <OrderDetailsView order={order} />;
}

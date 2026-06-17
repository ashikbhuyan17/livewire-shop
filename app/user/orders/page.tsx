import type { Metadata } from 'next';
import { fetchOrderStatuses, fetchUserOrders } from '@/lib/fetcher';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';
import { parseOrdersSearchParams } from '@/lib/order-utils';
import OrdersCartClearEffect from '@/components/user/orders/OrdersCartClearEffect';
import OrdersFilters from '@/components/user/orders/OrdersFilters';
import OrdersList from '@/components/user/orders/OrdersList';
import OrdersPagination from '@/components/user/orders/OrdersPagination';
import EmptyOrdersState from '@/components/user/orders/EmptyOrdersState';

export const metadata: Metadata = buildPageMeta({
  title: 'My orders',
  description:
    'View and track your BestFood City orders, order history, and delivery status.',
  pathname: '/user/orders',
  robots: PRIVATE_ROUTE_ROBOTS,
});

type PageProps = {
  searchParams: Promise<{
    keyword?: string;
    filter?: string;
    page?: string;
  }>;
};

export default async function UserOrdersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { keyword, filter, page } = parseOrdersSearchParams(sp);

  const [statusRes, ordersRes] = await Promise.all([
    fetchOrderStatuses(),
    fetchUserOrders({ filter, keyword, page }),
  ]);

  const statuses = Array.isArray(statusRes.data) ? statusRes.data : [];
  const paginated = ordersRes.data ?? {};
  const orders = Array.isArray(paginated.data) ? paginated.data : [];
  const currentPage = paginated.current_page ?? page;
  const lastPage = paginated.last_page ?? 1;
  const total = paginated.total ?? orders.length;

  const isPristine = !keyword && filter === 'all';
  if (isPristine && orders.length === 0) {
    return <EmptyOrdersState />;
  }

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <OrdersCartClearEffect />

      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My Orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your order history
        </p>
      </header>

      <OrdersFilters statuses={statuses} />

      <OrdersList orders={orders} total={total} />

      <OrdersPagination
        currentPage={currentPage}
        lastPage={lastPage}
        keyword={keyword}
        filter={filter}
      />
    </section>
  );
}

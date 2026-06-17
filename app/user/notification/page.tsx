import type { Metadata } from 'next';
import { fetchCustomerNotifications } from '@/lib/notifications';
import { parseNotificationsPage } from '@/lib/notification-utils';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';
import NotificationsList, {
  NotificationsEmpty,
} from '@/components/user/notifications/NotificationsList';
import NotificationsPagination from '@/components/user/notifications/NotificationsPagination';

export const metadata: Metadata = buildPageMeta({
  title: 'Notifications',
  description:
    'View your BestFood City order updates and account notifications.',
  pathname: '/user/notification',
  robots: PRIVATE_ROUTE_ROBOTS,
});

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function UserNotificationsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { page } = parseNotificationsPage(sp);

  const res = await fetchCustomerNotifications({ page });
  const paginated = res?.data ?? {};
  const notifications = Array.isArray(paginated.data) ? paginated.data : [];
  const currentPage = paginated.current_page ?? page;
  const lastPage = paginated.last_page ?? 1;
  const total = paginated.total ?? notifications.length;

  if (notifications.length === 0) {
    return (
      <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Order updates and alerts from BestFood City
          </p>
        </header>
        <NotificationsEmpty />
      </section>
    );
  }

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Order updates and alerts from BestFood City
        </p>
      </header>

      <NotificationsList notifications={notifications} total={total} />

      <NotificationsPagination
        currentPage={currentPage}
        lastPage={lastPage}
      />
    </section>
  );
}

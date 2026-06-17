'use server';

import { fetcher, type ApiEnvelope } from '@/lib/fetcher';
import {
  countUnreadNotifications,
  NOTIFICATIONS_PER_PAGE,
  type NotificationsPaginatedData,
} from '@/lib/notification-utils';

export async function fetchCustomerNotifications(params?: {
  page?: number;
  perPage?: number;
}): Promise<ApiEnvelope<NotificationsPaginatedData>> {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? NOTIFICATIONS_PER_PAGE;
  const qs = new URLSearchParams();
  if (page > 1) qs.set('page', String(page));
  if (perPage !== NOTIFICATIONS_PER_PAGE) {
    qs.set('per_page', String(perPage));
  }

  const query = qs.toString();
  const slug = query
    ? `/customer-notification?${query}`
    : '/customer-notification';

  return fetcher<ApiEnvelope<NotificationsPaginatedData>>(
    slug,
    { cache: 'no-store' },
    false,
  );
}

export async function getNotificationSummary() {
  try {
    const res = await fetchCustomerNotifications({ page: 1, perPage: 50 });
    if (res?.status === false) {
      return { count: 0, unreadCount: 0 };
    }

    const paginated = res?.data;
    if (!paginated) {
      return { count: 0, unreadCount: 0 };
    }

    const items = Array.isArray(paginated.data) ? paginated.data : [];
    const total = paginated.total ?? items.length;
    const unreadCount = countUnreadNotifications(items);

    return {
      count: total,
      unreadCount,
    };
  } catch {
    return { count: 0, unreadCount: 0 };
  }
}

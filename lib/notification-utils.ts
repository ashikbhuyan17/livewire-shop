export type CustomerNotification = {
  id: number;
  user_id: string;
  title: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type NotificationsPaginatedData = {
  data?: CustomerNotification[];
  current_page?: number;
  last_page?: number;
  total?: number;
  per_page?: number;
};

export const NOTIFICATIONS_PER_PAGE = 12;

export function isUnreadNotification(
  notification: Pick<CustomerNotification, 'status'>,
): boolean {
  return String(notification.status) === '0';
}

export function countUnreadNotifications(
  notifications: CustomerNotification[],
): number {
  return notifications.filter(isUnreadNotification).length;
}

export function formatNotificationDateTime(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    return { date: dateStr, time: '' };
  }

  return {
    date: d.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    time: d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

export function extractOrderRefFromNotification(
  notification: Pick<CustomerNotification, 'title' | 'message'>,
): string | null {
  const combined = `${notification.title} ${notification.message}`;
  const match = combined.match(/#?(OR-\d+)/i);
  return match ? match[1].toUpperCase() : null;
}

export function parseNotificationsPage(sp: { page?: string }) {
  const page = Math.max(1, parseInt(String(sp.page ?? '1'), 10) || 1);
  return { page };
}

export function buildNotificationsHref(page?: number) {
  if (!page || page <= 1) return '/user/notification';
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  return `/user/notification?${qs.toString()}`;
}

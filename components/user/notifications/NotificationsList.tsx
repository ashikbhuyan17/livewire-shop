import Link from 'next/link';
import { Bell, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  extractOrderRefFromNotification,
  formatNotificationDateTime,
  isUnreadNotification,
} from '@/lib/notification-utils';
import type { CustomerNotification } from '@/lib/notification-utils';
import { cn } from '@/lib/utils';

type Props = {
  notifications: CustomerNotification[];
  total: number;
};

function NotificationCard({
  notification,
}: {
  notification: CustomerNotification;
}) {
  const unread = isUnreadNotification(notification);
  const { date, time } = formatNotificationDateTime(notification.created_at);
  const orderRef = extractOrderRefFromNotification(notification);

  return (
    <article
      className={cn(
        'rounded-xl border p-4 transition-colors sm:p-5',
        unread
          ? 'border-headerBg/25 bg-headerBg/[0.04] shadow-sm'
          : 'border-border/70 bg-card',
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            unread
              ? 'bg-headerBg/15 text-headerBg'
              : 'bg-muted text-muted-foreground',
          )}
        >
          <Bell className="h-5 w-5" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2
              className={cn(
                'text-sm font-semibold leading-snug text-foreground sm:text-base',
                unread && 'text-headerBg',
              )}
            >
              {notification.title}
            </h2>
            {unread ? (
              <span className="shrink-0 rounded-full bg-headerBg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                New
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {notification.message}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <time dateTime={notification.created_at}>
              {date}
              {time ? ` · ${time}` : ''}
            </time>
            {orderRef ? (
              <Link
                href={`/user/orders/${encodeURIComponent(orderRef)}`}
                className="inline-flex items-center gap-1 font-medium text-headerBg hover:underline"
              >
                <Package className="h-3.5 w-3.5" aria-hidden />
                View {orderRef}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NotificationsList({ notifications, total }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {total === 1 ? '1 notification' : `${total} notifications`}
      </p>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </div>
  );
}

export function NotificationsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-headerBg/10 text-headerBg">
        <Bell className="h-7 w-7" strokeWidth={1.75} aria-hidden />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        No notifications yet
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Order updates and account alerts will show up here when you have
        something new.
      </p>
      <Button asChild className="mt-6 rounded-full bg-headerBg hover:bg-headerBg/90">
        <Link href="/user/orders">View my orders</Link>
      </Button>
    </div>
  );
}

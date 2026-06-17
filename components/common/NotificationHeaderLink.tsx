'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';

type Props = {
  initialCount: number;
};

export default function NotificationHeaderLink({ initialCount }: Props) {
  const count = initialCount;

  return (
    <Link
      prefetch
      href="/user/notification"
      aria-label={
        count > 0 ? `View notifications (${count})` : 'View notifications'
      }
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100 md:h-10 md:w-10"
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

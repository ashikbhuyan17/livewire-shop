import type { ReactNode } from 'react';
import type { UserCookie } from '@/action/token';
import UserSidebar from './UserSidebar';

type Props = {
  user: UserCookie | null;
  isPartner?: boolean;
  children: ReactNode;
};

export default function UserDashboardShell({
  user,
  isPartner = false,
  children,
}: Props) {
  return (
    <div className="min-h-[calc(100dvh-7.25rem)] bg-slate-50/60">
      <div className="mx-auto w-full max-w-[95rem] px-3 py-4 sm:px-4 md:px-6 md:py-6">
        <div className="flex w-full flex-col gap-5 md:flex-row md:items-start md:gap-6">
          <UserSidebar user={user} isPartner={isPartner} />

          <div
            id="user-dashboard-content"
            className="min-h-[500px] min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] md:min-h-[calc(100dvh-7rem)] lg:min-h-[calc(100dvh-9rem)]"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

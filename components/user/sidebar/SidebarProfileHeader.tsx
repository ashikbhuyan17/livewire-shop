'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPointsCount } from '@/lib/reward-point-utils';
import type { UserCookie } from '@/action/token';

type Props = {
  user: UserCookie | null;
  onNavigate?: () => void;
  className?: string;
};

function getInitials(user: UserCookie | null): string {
  if (!user) return 'U';
  const source = (user.name || user.email || 'U').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function SidebarProfileHeader({
  user,
  onNavigate,
  className,
}: Props) {
  const initials = getInitials(user);
  const imgUrl = user?.profile_image
    ? `${process.env.NEXT_PUBLIC_IMG_URL}/${user.profile_image}`
    : null;
  const rewardPoints = Number(user?.reward_point ?? 0);
  const pointsLabel = `${formatPointsCount(
    Number.isFinite(rewardPoints) ? rewardPoints : 0,
  )} pts`;
  const contact = user?.phone || user?.email || null;

  return (
    <Link
      href="/user/account"
      onClick={onNavigate}
      aria-label={
        user?.name ? `View ${user.name}'s profile` : 'View your profile'
      }
      className={cn(
        'group/profile flex min-w-0 items-center gap-3 rounded-xl p-1.5 transition-colors',
        'hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-headerBg/40',
        className,
      )}
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 text-base font-semibold text-headerBg ring-1 ring-emerald-200/70">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt=""
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
        <span
          aria-hidden
          title="Online"
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
        />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {user?.name || 'Guest user'}
        </p>
        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5">
          {contact ? (
            <p className="truncate text-xs text-slate-500" translate="no">
              {contact}
            </p>
          ) : null}
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/12 px-2 py-0.5 text-[10px] font-bold tabular-nums tracking-wide text-amber-800 ring-1 ring-amber-500/25 dark:text-amber-300">
            <Coins className="h-3 w-3 shrink-0" aria-hidden />
            {pointsLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

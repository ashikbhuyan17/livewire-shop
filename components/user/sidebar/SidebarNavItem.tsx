'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isNavItemActive, type UserNavItem } from '@/lib/user-nav';

type Props = {
  item: UserNavItem;
  /** Fires after navigation triggers (used to close the mobile drawer). */
  onNavigate?: () => void;
};

export default function SidebarNavItem({ item, onNavigate }: Props) {
  const pathname = usePathname();
  const active = isNavItemActive(item, pathname);
  const Icon = item.icon;

  return (
    <li className="relative">
      <Link
        href={item.href}
        prefetch={false}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'group/nav relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-headerBg/40',
          active
            ? 'bg-emerald-50 text-headerBg shadow-[inset_0_0_0_1px_rgba(45,122,39,0.08)]'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
        )}
      >
        {/* Active accent bar (left) */}
        <span
          aria-hidden
          className={cn(
            'absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-headerBg transition-all duration-200',
            active ? 'opacity-100' : 'opacity-0',
          )}
        />

        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200',
            active
              ? 'border-headerBg/15 bg-white text-headerBg'
              : 'border-slate-200/70 bg-slate-50 text-slate-500 group-hover/nav:border-slate-200 group-hover/nav:text-slate-700',
          )}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
        </span>

        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>

        {item.badge ? (
          <span
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums',
              active
                ? 'bg-headerBg text-white'
                : 'bg-slate-100 text-slate-600 group-hover/nav:bg-slate-200',
            )}
          >
            {item.badge}
          </span>
        ) : (
          <ChevronRight
            aria-hidden
            className={cn(
              'h-4 w-4 shrink-0 transition-all duration-200',
              active
                ? 'text-headerBg/70'
                : 'text-slate-300 group-hover/nav:translate-x-0.5 group-hover/nav:text-slate-500',
            )}
          />
        )}
      </Link>
    </li>
  );
}

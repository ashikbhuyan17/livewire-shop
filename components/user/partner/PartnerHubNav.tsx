'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutGrid, Package, Wallet } from 'lucide-react';

const TABS = [
  {
    href: '/user/partner',
    label: 'Overview',
    icon: LayoutGrid,
    exact: true,
  },
  {
    href: '/user/partner/orders',
    label: 'Referral orders',
    icon: Package,
    exact: false,
  },
  {
    href: '/user/partner/withdraw',
    label: 'Withdrawals',
    icon: Wallet,
    exact: false,
  },
] as const;

export default function PartnerHubNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Refer and Earn sections"
      className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-4"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const path = pathname?.replace(/\/+$/, '') || '/';
        const href = tab.href.replace(/\/+$/, '') || '/';
        const active = tab.exact
          ? path === href
          : path === href || path.startsWith(`${href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-headerBg text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

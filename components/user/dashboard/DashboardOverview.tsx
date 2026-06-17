import Link from 'next/link';
import { LayoutDashboard, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type {
  AffiliateShopData,
  DashboardOverviewData,
} from '@/lib/dashboard-utils';
import {
  isAffiliateDashboard,
  isUserDashboard,
} from '@/lib/dashboard-utils';
import UserRoleDashboard from './UserRoleDashboard';
import AffiliateRoleDashboard from './AffiliateRoleDashboard';

type Props = {
  overview: DashboardOverviewData | null;
  affiliateShop: AffiliateShopData | null;
  userName?: string;
  isPartner?: boolean;
  partnerRefCode?: string | number | null;
};

function roleLabel(role: string | undefined): string {
  if (role === 'affiliate') return 'Affiliate';
  if (role === 'user') return 'Customer';
  return 'Member';
}

export default function DashboardOverview({
  overview,
  affiliateShop,
  userName,
  isPartner = false,
  partnerRefCode,
}: Props) {
  const greetingName = userName?.trim() || 'there';
  const role = overview?.role;

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="relative mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-headerBg/[0.14] via-white to-emerald-50/50 p-5 shadow-sm sm:p-6">
        <div
          className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-headerBg/10 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-headerBg ring-1 ring-headerBg/15">
              <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
              Dashboard
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back, {greetingName}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              {isAffiliateDashboard(overview) || isPartner
                ? 'Track partner sales, balances, and share your referral link.'
                : 'A quick look at your orders, pending activity, and wishlist.'}
            </p>
          </div>

          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ring-1',
              role === 'affiliate' || isPartner
                ? 'bg-violet-500/10 text-violet-800 ring-violet-500/20'
                : 'bg-emerald-500/10 text-emerald-800 ring-emerald-500/20',
            )}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {role === 'affiliate' || isPartner ? 'Partner' : roleLabel(role)}
          </span>
        </div>
      </header>

      {isPartner ? (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-violet-200/70 bg-gradient-to-r from-violet-50/90 to-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-700">
              <Share2 className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-slate-900">Refer &amp; Earn</p>
              <p className="text-sm text-slate-600">
                Manage referral orders, your share link, and withdrawals.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="shrink-0 rounded-xl bg-violet-700 hover:bg-violet-800"
          >
            <Link href="/user/partner">
              Open Refer &amp; Earn
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : null}

      {!overview ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            Dashboard data is unavailable right now.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Please refresh the page or try again later.
          </p>
        </div>
      ) : isAffiliateDashboard(overview) ? (
        <AffiliateRoleDashboard
          data={overview}
          shop={affiliateShop}
          refCode={partnerRefCode}
        />
      ) : isUserDashboard(overview) ? (
        <UserRoleDashboard data={overview} />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            Unsupported dashboard role
          </p>
        </div>
      )}
    </section>
  );
}

import {
  Banknote,
  Package,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Store,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import { CURRENCY_SYMBOL, formatAmount } from '@/lib/currency';
import type {
  AffiliateDashboardData,
  AffiliateShopData,
} from '@/lib/dashboard-utils';
import { buildPartnerShareUrl } from '@/lib/partner-utils';
import DashboardStatCard from './DashboardStatCard';
import AffiliateLinkCard from './AffiliateLinkCard';

type Props = {
  data: AffiliateDashboardData;
  shop: AffiliateShopData | null;
  refCode?: string | number | null;
};

export default function AffiliateRoleDashboard({ data, shop, refCode }: Props) {
  const effectiveRef = String(refCode ?? shop?.user?.ref_code ?? '').trim();
  const shareUrl = effectiveRef
    ? buildPartnerShareUrl(effectiveRef, shop?.affiliate_links?.affiliate_url)
    : '';

  return (
    <div className="space-y-8">
      <AffiliateLinkCard
        url={shareUrl}
        affiliateName={shop?.user?.name}
        refCode={effectiveRef || shop?.user?.ref_code}
      />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
          Wallet &amp; sales
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            label="Account balance"
            value={
              <>
                <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
                {formatAmount(data.accountBalance)}
              </>
            }
            icon={<Wallet className="h-5 w-5" strokeWidth={2} />}
            accent="emerald"
            showToday={false}
          />
          <DashboardStatCard
            label="Withdrawal balance"
            value={
              <>
                <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
                {formatAmount(data.withdrawalBalance)}
              </>
            }
            icon={<Banknote className="h-5 w-5" strokeWidth={2} />}
            accent="sky"
            showToday={false}
          />
          <DashboardStatCard
            label="Total sales"
            value={
              <>
                <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
                {formatAmount(data.totalSale)}
              </>
            }
            icon={<TrendingUp className="h-5 w-5" strokeWidth={2} />}
            accent="violet"
            showToday={false}
          />
          <DashboardStatCard
            label="My shop"
            value={data.myShop}
            icon={<Store className="h-5 w-5" strokeWidth={2} />}
            accent="default"
            showToday={false}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
          Order overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <DashboardStatCard
            label="Total orders"
            value={data.totalOrders}
            todayValue={data.todayTotalOrders}
            icon={<Package className="h-5 w-5" strokeWidth={2} />}
          />
          <DashboardStatCard
            label="Pending"
            value={data.totalPendingOrders}
            todayValue={data.todayPendingOrders}
            icon={<Clock3 className="h-5 w-5" strokeWidth={2} />}
            accent="amber"
          />
          <DashboardStatCard
            label="Shipped"
            value={data.totalShippedOrders}
            todayValue={data.todayShippedOrders}
            icon={<Truck className="h-5 w-5" strokeWidth={2} />}
            accent="sky"
          />
          <DashboardStatCard
            label="Delivered"
            value={data.totalDeliveredOrders}
            todayValue={data.todayDeliveredOrders}
            icon={<CheckCircle2 className="h-5 w-5" strokeWidth={2} />}
            accent="emerald"
          />
          <DashboardStatCard
            label="Cancelled"
            value={data.totalCancelledOrders}
            todayValue={data.todayCancelledOrders}
            icon={<XCircle className="h-5 w-5" strokeWidth={2} />}
            accent="rose"
          />
          <DashboardStatCard
            label="Returns"
            value={data.totalReturnOrders}
            todayValue={data.todayReturnOrders}
            icon={<RotateCcw className="h-5 w-5" strokeWidth={2} />}
            accent="violet"
          />
        </div>
      </section>
    </div>
  );
}

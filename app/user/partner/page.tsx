import { Share2 } from 'lucide-react';
import AffiliateLinkCard from '@/components/user/dashboard/AffiliateLinkCard';
import PartnerHubNav from '@/components/user/partner/PartnerHubNav';
import {
  fetchAffiliateOrders,
  fetchAffiliateShop,
} from '@/lib/fetcher';
import { CURRENCY_SYMBOL, formatAmount } from '@/lib/currency';
import { buildPartnerShareUrl } from '@/lib/partner-utils';
import { requirePartnerProfile } from '@/lib/partner-profile';

export default async function PartnerHubPage() {
  const partner = await requirePartnerProfile();

  const [shopRes, ordersRes] = await Promise.all([
    fetchAffiliateShop(),
    fetchAffiliateOrders(partner.id),
  ]);

  const affiliateUrl = shopRes?.data?.affiliate_links?.affiliate_url;
  const shareUrl = buildPartnerShareUrl(partner.ref_code, affiliateUrl);
  const orders = Array.isArray(ordersRes?.data?.orders)
    ? ordersRes.data.orders
    : [];

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="relative mb-6 overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-500/[0.08] via-white to-headerBg/[0.06] p-5 sm:p-6">
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-700 ring-1 ring-violet-200">
              <Share2 className="h-3.5 w-3.5" aria-hidden />
              Refer &amp; Earn
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome, {partner.name.split(' ')[0]}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Share your link, track referral orders, and withdraw your earnings.
            </p>
          </div>
          <div className="rounded-xl bg-white/90 px-3 py-2 text-right shadow-sm ring-1 ring-slate-200/80">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Referral code
            </p>
            <p className="font-mono text-sm font-bold text-violet-800">
              {partner.ref_code}
            </p>
          </div>
        </div>
      </header>

      <PartnerHubNav />

      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(
            [
              ['Account balance', partner.account_balance],
              ['Withdrawal balance', partner.withdrawal_balance],
              ['Referral orders', orders.length],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                {label}
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
                {label === 'Referral orders' ? (
                  value
                ) : (
                  <>
                    <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
                    {formatAmount(value)}
                  </>
                )}
              </p>
            </div>
          ))}
        </div>

        <AffiliateLinkCard
          url={shareUrl}
          affiliateName={partner.name}
          refCode={partner.ref_code}
        />
      </div>
    </section>
  );
}

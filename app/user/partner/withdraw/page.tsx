import type { Metadata } from 'next';
import PartnerHubNav from '@/components/user/partner/PartnerHubNav';
import WithdrawalHistoryList from '@/components/user/partner/WithdrawalHistoryList';
import WithdrawalRequestForm from '@/components/user/partner/WithdrawalRequestForm';
import {
  fetchAffiliateWithdrawalHistory,
  fetchAffiliateWithdrawalPage,
} from '@/lib/fetcher';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';
import { requirePartnerProfile } from '@/lib/partner-profile';

export const metadata: Metadata = buildPageMeta({
  title: 'Withdrawals',
  description: 'Request payouts and view your partner withdrawal history.',
  pathname: '/user/partner/withdraw',
  robots: PRIVATE_ROUTE_ROBOTS,
});

export default async function PartnerWithdrawPage() {
  const partner = await requirePartnerProfile();

  const [withdrawPageRes, historyRes] = await Promise.all([
    fetchAffiliateWithdrawalPage(),
    fetchAffiliateWithdrawalHistory(partner.id),
  ]);

  const availableBalance =
    withdrawPageRes?.data?.account_balance ?? partner.account_balance;
  const history = Array.isArray(historyRes?.data) ? historyRes.data : [];

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Withdrawals
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Request a payout and track your withdrawal history
        </p>
      </header>

      <PartnerHubNav />

      <div className="mt-6 space-y-8">
        <WithdrawalRequestForm availableBalance={availableBalance} />

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Withdrawal history
          </h2>
          <WithdrawalHistoryList items={history} />
        </div>
      </div>
    </section>
  );
}

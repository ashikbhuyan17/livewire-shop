import type { Metadata } from 'next';
import AccountTabs from '@/components/user/account/AccountTabs';
import { fetcher } from '@/lib/fetcher';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'My account',
  description:
    'Manage your BestFood City profile, contact details, address, and password.',
  pathname: '/user/account',
  robots: PRIVATE_ROUTE_ROBOTS,
});

export default async function AccountPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = await fetcher(
    '/user-profile',
    { cache: 'no-store' },
    false,
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <AccountTabs user={profile} />
    </div>
  );
}

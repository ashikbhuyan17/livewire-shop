import type { Metadata } from 'next';
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Refer & Earn',
  description:
    'Share your link, track referral orders, and withdraw earnings at BestFood City.',
  pathname: '/user/partner',
  robots: PRIVATE_ROUTE_ROBOTS,
});

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

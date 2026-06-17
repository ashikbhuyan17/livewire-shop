import type { Metadata } from 'next';
import { buildPageMeta } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Our outlets',
  description:
    'Find BestFood City store locations and outlet addresses near you — visit or plan your route.',
  pathname: '/our-outlets',
  keywords: ['store locator', 'outlets', 'BestFood City stores'],
});

export default function OurOutletsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

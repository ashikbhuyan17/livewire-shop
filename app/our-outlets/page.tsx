import type { Metadata } from 'next';
import OutletsDemo from '@/components/our-outlets/OutletsDemo';
import { SITE_BRAND_SHORT, buildPageMeta } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Shop Location',
  description: `Find ${SITE_BRAND_SHORT} outlets and care points across Bangladesh.`,
  pathname: '/our-outlets',
  keywords: ['shop location', 'store', 'outlets', 'Livewire branches', SITE_BRAND_SHORT],
});

export default function OurOutletsPage() {
  return <OutletsDemo />;
}

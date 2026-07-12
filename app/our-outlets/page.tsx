import type { Metadata } from 'next';
import OutletsDemo from '@/components/our-outlets/OutletsDemo';
import { fetchBusinessLocations } from '@/lib/business-locations';
import { DEMO_OUTLETS } from '@/lib/pages-demo-data';
import { SITE_BRAND_SHORT, buildPageMeta } from '@/lib/site';

export const revalidate = 3600;

export const metadata: Metadata = buildPageMeta({
  title: 'Shop Location',
  description: `Find ${SITE_BRAND_SHORT} outlets and care points across Bangladesh.`,
  pathname: '/our-outlets',
  keywords: ['shop location', 'store', 'outlets', 'Livewire branches', SITE_BRAND_SHORT],
});

export default async function OurOutletsPage() {
  const apiLocations = await fetchBusinessLocations();
  const locations =
    apiLocations.length > 0
      ? apiLocations
      : DEMO_OUTLETS.map((outlet) => ({
          id: outlet.id,
          title: outlet.name,
          slug: outlet.id,
          image: outlet.image,
          address: outlet.address,
          phone: outlet.phone,
          email: '',
          mapEmbedCode: '',
          description: '',
          mapUrl: outlet.mapUrl,
        }));

  return <OutletsDemo locations={locations} />;
}

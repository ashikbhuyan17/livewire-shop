import OfferBuySaveMore from '@/components/offer/OfferBuySaveMore';
import OfferType1 from '@/components/offer/OfferType1';
import OfferType2 from '@/components/offer/OfferType2';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_BRAND_SHORT, buildPageMeta, slugToLabel } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'deals') {
    return buildPageMeta({
      title: 'Daily deals',
      description: `Shop daily deals and limited-time savings across groceries and essentials — ${SITE_BRAND_SHORT}.`,
      pathname: '/offer/deals',
      keywords: ['daily deals', 'grocery offers', 'flash savings', SITE_BRAND_SHORT],
    });
  }
  if (slug === 'buy-save-more') {
    return buildPageMeta({
      title: 'Buy & save more — flash sale',
      description: `Flash sale prices and stack-up savings on groceries and essentials — ${SITE_BRAND_SHORT}.`,
      pathname: '/offer/buy-save-more',
      keywords: ['flash sale', 'buy and save', 'grocery deals', SITE_BRAND_SHORT],
    });
  }
  const label = slugToLabel(slug);
  return buildPageMeta({
    title: `${label} offers`,
    description: `Discover ${label} offers, bundles, and limited-time savings — ${SITE_BRAND_SHORT}.`,
    pathname: `/offer/${slug}`,
    keywords: [label, 'offers', 'deals', SITE_BRAND_SHORT],
  });
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const crumbLabel =
    slug === 'deals'
      ? 'Daily deals'
      : slug === 'buy-save-more'
        ? 'Buy & save more'
        : slug;
  const crumbTitle =
    slug === 'deals'
      ? 'Daily deals'
      : slug === 'buy-save-more'
        ? 'Buy & save more'
        : slug;
  const titleSentenceCase = slug === 'deals' || slug === 'buy-save-more';
  return (
    <div className="max-w-[95rem] mx-auto px-4 py-4">
      <div className="text-sm text-gray-500 justify-between flex items-start mb-4 border-b border-gray-200 pb-3">
        <div className="">
          <Link href="/">Home</Link> &gt;{' '}
          <span className="text-gray-700">{crumbLabel}</span>
        </div>
        <div
          className={`text-black font-semibold ${titleSentenceCase ? '' : 'uppercase'}`}
        >
          {crumbTitle}
        </div>
      </div>
      {slug === 'deals' ? (
        <OfferType1 />
      ) : slug === 'buy-save-more' ? (
        <OfferBuySaveMore />
      ) : (
        <OfferType2 />
      )}
    </div>
  );
}

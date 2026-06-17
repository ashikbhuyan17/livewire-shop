import { Sparkles } from 'lucide-react';
import OfferProductListing from '@/components/offer/OfferProductListing';

const PROMO_LINK = '/offer/deals/shop-now-think-later';

export default async function OfferType1() {
  return (
    <OfferProductListing
      apiPath="/daily-deals"
      eyebrow="Today's picks"
      title="Daily deals"
      description="Hand-picked savings across groceries and everyday essentials — same trusted quality, sharper prices than regular shelf tags."
      gridSectionTitle="Shop daily deals"
      emptyTitle="No daily deals at the moment"
      emptyHint="Please check back soon — new offers drop regularly."
      promoLink={PROMO_LINK}
      chip1="Refreshed often"
      chip2="Fast delivery"
      HeroIcon={Sparkles}
    />
  );
}

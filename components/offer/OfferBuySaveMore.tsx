import { Zap } from 'lucide-react';
import OfferProductListing from '@/components/offer/OfferProductListing';

const PROMO_LINK = '/offer/deals/shop-now-think-later';

export default async function OfferBuySaveMore() {
  return (
    <OfferProductListing
      apiPath="/flash-sale"
      eyebrow="Flash sale"
      title="Buy & save more"
      description="Limited-time flash prices on popular items — stack up savings before sizes and packs run out. Inventory updates often."
      gridSectionTitle="Shop flash sale"
      emptyTitle="No flash sale items right now"
      emptyHint="Check back soon — new flash lines are added regularly."
      promoLink={PROMO_LINK}
      chip1="While stocks last"
      chip2="Fast delivery"
      HeroIcon={Zap}
    />
  );
}

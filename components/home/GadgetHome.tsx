import HeroSection from './gadget/HeroSection';
import TrustBar from './gadget/TrustBar';
import CategoryGrid from './gadget/CategoryGrid';
import FlashSaleSection from './gadget/FlashSaleSection';
import ProductShowcase from './gadget/ProductShowcase';
import PromoBanner from './gadget/PromoBanner';
import {
  BEST_DEAL_PRODUCTS,
  RECENTLY_ADDED_PRODUCTS,
} from '@/lib/home-demo-data';

export default function GadgetHome() {
  return (
    <main className="mx-auto w-full max-w-[95rem] px-3 pb-10 pt-3 sm:px-4 sm:pb-12 sm:pt-4 lg:px-6">
      <HeroSection />
      <TrustBar />
      <CategoryGrid />
      <FlashSaleSection />
      <ProductShowcase
        id="best-deals"
        title="Best Deal Products"
        subtitle="Hand-picked offers on top brands"
        products={BEST_DEAL_PRODUCTS}
        seeAllHref="/offer/best-deals"
        className="mt-10 sm:mt-12"
      />
      <PromoBanner />
      <ProductShowcase
        id="recently-added"
        title="Recently Added"
        subtitle="Fresh arrivals just landed"
        products={RECENTLY_ADDED_PRODUCTS}
        seeAllHref="/search?q=new"
        className="mt-10 sm:mt-12"
      />
    </main>
  );
}

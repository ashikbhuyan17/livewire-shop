import HeroSection from './gadget/HeroSection';
import TrustBar from './gadget/TrustBar';
import CategoryGrid from './gadget/CategoryGrid';
import FlashSaleSection from './gadget/FlashSaleSection';
import ProductShowcase from './gadget/ProductShowcase';
import PromoBanner from './gadget/PromoBanner';
import BrandsSection from './gadget/BrandsSection';
import {
  BEST_DEAL_PRODUCTS,
  RECENTLY_ADDED_PRODUCTS,
} from '@/lib/home-demo-data';
import { fetchMiddleCategories } from '@/fetch/buildCategoryMenu';
import { fetchHomeHeroData } from '@/lib/home-banners';
import { fetchAuthenticityItems } from '@/lib/authenticity';
import { fetchHomeBrands } from '@/lib/brands';

export default async function GadgetHome() {
  const [
    { sliders, adBanners },
    middleCategories,
    authenticityItems,
    brands,
  ] = await Promise.all([
    fetchHomeHeroData(),
    fetchMiddleCategories(),
    fetchAuthenticityItems(),
    fetchHomeBrands(),
  ]);

  return (
    <main className="mx-auto w-full max-w-[95rem] space-y-4 md:space-y-10">
      <HeroSection sliders={sliders} adBanners={adBanners} />
      <TrustBar items={authenticityItems} />
      <CategoryGrid categories={middleCategories} />
      <FlashSaleSection />
      <ProductShowcase
        id="best-deals"
        title="Best Deal Products"
        subtitle="Hand-picked offers on top brands"
        products={BEST_DEAL_PRODUCTS}
        seeAllHref="/offer/best-deals"
        className="px-0 lg:px-6"
      />
      <PromoBanner />
      <ProductShowcase
        id="recently-added"
        title="Recently Added"
        subtitle="Fresh arrivals just landed"
        products={RECENTLY_ADDED_PRODUCTS}
        seeAllHref="/search?q=new"
        className="px-0 lg:px-6"
      />
      <BrandsSection brands={brands} />
    </main>
  );
}

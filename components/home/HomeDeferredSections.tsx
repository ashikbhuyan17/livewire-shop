import Deals from '@/components/home/Deals';
import HomeProducts from '@/components/common/HomeProducts';
import CoverageArea from '@/components/home/CoverageArea';
import Image from 'next/image';
import BannerImage1 from '@/public/home_banner_1.webp';
import Link from 'next/link';
import { fetcher, publicFetcher } from '@/lib/fetcher';

const HOME_CACHE = 180;

type ApiBanner = {
  id?: number;
  title_1?: string;
  btn_link?: string;
  image?: string;
};

function bannerUrl(image?: string): string {
  const rel = (image || '').trim().replace(/^\/+/, '');
  if (!rel) return '';
  const base = (process.env.NEXT_PUBLIC_IMG_URL || '').replace(/\/+$/, '');
  return base ? `${base}/${rel}` : `/${rel}`;
}

export default async function HomeDeferredSections() {
  const [frontCategory, flashSaleProducts, dailyDealsProducts, bannerRes] =
    await Promise.all([
      fetcher('/front-category-products', {}, HOME_CACHE),
      fetcher('/flash-sale', {}, HOME_CACHE),
      fetcher('/daily-deals', {}, HOME_CACHE),
      publicFetcher<{ data?: ApiBanner[] }>('/banner', {}, HOME_CACHE).catch(
        () => ({ data: [] as ApiBanner[] }),
      ),
    ]);

  const banners = Array.isArray(bannerRes?.data) ? bannerRes.data : [];
  const flashSaleBanner = banners[0];
  const dailyDealsBanner = banners[3];
  const categoryBanner = banners[1];
  const bottomBanner = banners[2];

  const dailyDeals =
    (dailyDealsProducts as { data?: unknown[] } | undefined)?.data ?? [];

  const categoryBannerUrl = bannerUrl(categoryBanner?.image);
  const categoryBannerHref =
    categoryBanner?.btn_link && categoryBanner.btn_link.trim() !== '#'
      ? categoryBanner.btn_link
      : '/offer/deals/shop-now-think-later';

  const fc = frontCategory as { data?: unknown[] } | unknown[] | undefined;
  const categoryRows = Array.isArray(fc) ? fc : (fc?.data ?? []);
  const categoryProductSections = categoryRows.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (row: any) => row?.products?.length,
  );

  return (
    <>
      <Deals
        title="Flash Sale"
        allProducts={(flashSaleProducts as { data?: unknown })?.data}
        layOut="xl:flex-row"
        flashBannerUrl={bannerUrl(flashSaleBanner?.image)}
        flashBannerHref={flashSaleBanner?.btn_link}
        flashBannerTitle={flashSaleBanner?.title_1}
      />
      {dailyDeals.length > 0 ? (
        <Deals
          title="Daily Deals"
          allProducts={dailyDeals}
          layOut="xl:flex-row-reverse"
          flashBannerUrl={bannerUrl(dailyDealsBanner?.image)}
          flashBannerHref={
            dailyDealsBanner?.btn_link?.trim() &&
            dailyDealsBanner.btn_link.trim() !== '#'
              ? dailyDealsBanner.btn_link
              : '/offer/deals'
          }
          flashBannerTitle={dailyDealsBanner?.title_1}
        />
      ) : null}
      <Link href={categoryBannerHref} prefetch className="my-2">
        {categoryBannerUrl ? (
          <Image
            alt={categoryBanner?.title_1 ?? ''}
            src={categoryBannerUrl}
            width={1920}
            height={480}
            className="w-full"
            sizes="(max-width: 1536px) 100vw, 95rem"
          />
        ) : (
          <Image alt="" src={BannerImage1} className="w-full" />
        )}
      </Link>
      {categoryProductSections.map((item) => {
        const row = item as {
          id?: number | string;
          name?: string;
          products?: unknown[];
        };
        return (
          <HomeProducts
            key={row.id ?? row.name}
            products={row.products ?? []}
            title={row.name}
          />
        );
      })}
      <CoverageArea
        leadBannerUrl={bannerUrl(bottomBanner?.image)}
        leadBannerTitle={bottomBanner?.title_1}
        leadBannerHref={bottomBanner?.btn_link}
      />
    </>
  );
}

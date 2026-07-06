import { cache } from 'react';
import { publicFetcher } from '@/lib/fetcher';
import { resolveApiImage } from '@/lib/home-banners';

const REVALIDATE = 600;
const HOME_BRAND_LIMIT = 12;

export type BrandItem = {
  id: string;
  title: string;
  slug: string;
  image: string;
};

type BrandsResponse = {
  success?: boolean;
  message?: string;
  data?: Array<{
    id?: number;
    title?: string;
    slug?: string;
    image?: string;
    logo?: string;
    brand_image?: string;
    thumbnail?: string;
  }>;
};

function mapBrand(
  item: NonNullable<BrandsResponse['data']>[number],
): BrandItem | null {
  const slug = item.slug?.trim();
  if (!slug) return null;

  const title = item.title?.trim() || slug;
  const image = resolveApiImage(
    item.image ?? item.logo ?? item.brand_image ?? item.thumbnail,
  );

  return {
    id: String(item.id ?? slug),
    title,
    slug,
    image,
  };
}

export const fetchBrands = cache(async (): Promise<BrandItem[]> => {
  const res = await publicFetcher<BrandsResponse>('/brands', {}, REVALIDATE);
  if (!res?.success || !Array.isArray(res.data)) return [];
  return res.data
    .map(mapBrand)
    .filter((item): item is BrandItem => item !== null);
});

export const fetchHomeBrands = cache(async (): Promise<BrandItem[]> => {
  const brands = await fetchBrands();
  return brands.slice(0, HOME_BRAND_LIMIT);
});

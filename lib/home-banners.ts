import { cache } from 'react';
import { publicFetcher } from '@/lib/fetcher';
import type { HeroBanner } from '@/lib/home-demo-data';

const REVALIDATE = 180;

type ApiBannerItem = {
  id?: number;
  title?: string;
  target_url?: string | null;
  image?: string;
};

type ApiSuccessResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export function resolveApiImage(raw?: string | null): string {
  const rel = (raw || '').trim();
  if (!rel) return '';
  if (rel.startsWith('http://') || rel.startsWith('https://')) return rel;
  const base = (process.env.NEXT_PUBLIC_IMG_URL || '').replace(/\/+$/, '');
  return base ? `${base}/${rel.replace(/^\//, '')}` : `/${rel.replace(/^\//, '')}`;
}

function mapBannerItem(item: ApiBannerItem): HeroBanner | null {
  const image = resolveApiImage(item.image);
  if (!image) return null;

  const href = item.target_url?.trim() || undefined;

  return {
    id: String(item.id ?? image),
    image,
    alt: item.title?.trim() || 'Promotion',
    href,
  };
}

function mapBannerList(data: ApiBannerItem[] | undefined): HeroBanner[] {
  if (!Array.isArray(data)) return [];
  return data
    .map(mapBannerItem)
    .filter((b): b is HeroBanner => b !== null);
}

export const fetchSliders = cache(async (): Promise<HeroBanner[]> => {
  const res = await publicFetcher<ApiSuccessResponse<ApiBannerItem[]>>(
    '/sliders',
    {},
    REVALIDATE,
  );

  if (!res?.success) return [];
  return mapBannerList(res.data);
});

export const fetchAdsBanners = cache(
  async (position = 1): Promise<HeroBanner[]> => {
    const res = await publicFetcher<ApiSuccessResponse<ApiBannerItem[]>>(
      `/ads-banner/${position}`,
      {},
      REVALIDATE,
    );

    if (!res?.success) return [];
    return mapBannerList(res.data);
  },
);

export async function fetchHomeHeroData(): Promise<{
  sliders: HeroBanner[];
  adBanners: HeroBanner[];
}> {
  const [sliders, adBanners] = await Promise.all([
    fetchSliders(),
    fetchAdsBanners(1),
  ]);
  return { sliders, adBanners };
}

import { cache } from 'react';
import { publicFetcher } from '@/lib/fetcher';
import { resolveApiImage } from '@/lib/home-banners';

const REVALIDATE = 3600;

export type BusinessLocation = {
  id: string;
  title: string;
  slug: string;
  image: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedCode: string;
  description: string;
  mapUrl: string;
};

type ApiBusinessLocation = {
  id?: number;
  title?: string;
  slug?: string;
  image?: string;
  address?: string;
  phone?: string;
  email?: string;
  map_embed_code?: string;
  description?: string;
};

type BusinessLocationsResponse = {
  success?: boolean;
  message?: string;
  data?: ApiBusinessLocation[];
};

function extractMapUrl(embedCode?: string | null): string {
  const raw = (embedCode || '').trim();
  if (!raw) return '#';
  const match = raw.match(/src=["']([^"']+)["']/i);
  return match?.[1]?.trim() || '#';
}

function mapLocation(item: ApiBusinessLocation): BusinessLocation | null {
  const title = item.title?.trim();
  const address = item.address?.trim();
  if (!title || !address) return null;

  const mapEmbedCode = item.map_embed_code?.trim() || '';

  return {
    id: String(item.id ?? item.slug ?? title),
    title,
    slug: item.slug?.trim() || String(item.id ?? ''),
    image: resolveApiImage(item.image),
    address,
    phone: item.phone?.trim() || '',
    email: item.email?.trim() || '',
    mapEmbedCode,
    description: item.description?.trim() || '',
    mapUrl: extractMapUrl(mapEmbedCode),
  };
}

export const fetchBusinessLocations = cache(
  async (): Promise<BusinessLocation[]> => {
    const res = await publicFetcher<BusinessLocationsResponse>(
      '/business-locations',
      {},
      REVALIDATE,
    );

    if (!res?.success || !Array.isArray(res.data)) return [];

    return res.data
      .map(mapLocation)
      .filter((item): item is BusinessLocation => item !== null);
  },
);

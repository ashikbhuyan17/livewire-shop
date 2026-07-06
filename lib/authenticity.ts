import { cache } from 'react';
import { publicFetcher } from '@/lib/fetcher';
import { resolveApiImage } from '@/lib/home-banners';

const REVALIDATE = 3600;

export type AuthenticityItem = {
  id: string;
  title: string;
  image: string;
};

type AuthenticityResponse = {
  success?: boolean;
  message?: string;
  data?: Array<{
    id?: number;
    title?: string;
    image?: string;
  }>;
};

export const fetchAuthenticityItems = cache(
  async (): Promise<AuthenticityItem[]> => {
    const res = await publicFetcher<AuthenticityResponse>(
      '/authenticity',
      {},
      REVALIDATE,
    );

    if (!res?.success || !Array.isArray(res.data)) return [];

    return res.data
      .map((item) => {
        const title = item.title?.trim();
        if (!title) return null;
        return {
          id: String(item.id ?? title),
          title,
          image: resolveApiImage(item.image),
        };
      })
      .filter((item): item is AuthenticityItem => item !== null);
  },
);

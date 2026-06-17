import { fetcher } from '@/lib/fetcher';

export type MyReviewProduct = {
  id?: number;
  name?: string;
  slug?: string;
  thumbnail_img?: string | null;
};

export type MyReviewItem = {
  id?: number;
  user_id?: string;
  product_id?: string;
  vendor_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  ratting?: string;
  rating?: string;
  review?: string | null;
  image?: string | null;
  profile_image?: string | null;
  reply_message?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  product?: MyReviewProduct | null;
};

export type MyReviewsApiResponse = {
  status?: string | boolean;
  message?: string;
  data?: MyReviewItem[];
};

export async function fetchMyReviews(): Promise<MyReviewsApiResponse> {
  return fetcher<MyReviewsApiResponse>(
    '/my-reviews',
    { cache: 'no-store' },
    false,
  );
}

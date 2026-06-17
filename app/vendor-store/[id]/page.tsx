import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import VendorStoreView, {
  type VendorStoreInitialData,
} from '@/components/vendor/VendorStoreView';
import { fetchVendorReviews, publicFetcher } from '@/lib/fetcher';
import { SITE_BRAND_SHORT, buildPageMeta } from '@/lib/site';

type VendorStoreResponse = {
  message?: string;
  vendor?: {
    id?: number;
    company_name?: string;
    first_name?: string;
    last_name?: string;
    profile_image?: string | null;
    avg_rating?: string | null;
    email?: string;
    phone?: string;
    company_address?: string;
    city?: string;
    country?: string;
  };
  products?: unknown[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return buildPageMeta({
      title: 'Vendor store',
      description: `Vendor storefront on ${SITE_BRAND_SHORT}.`,
      pathname: `/vendor-store/${id}`,
    });
  }
  try {
    const res = (await publicFetcher(
      `/vendor-store/${id}`,
      {},
      300,
    )) as VendorStoreResponse;
    const v = res?.vendor;
    const name =
      v?.company_name?.trim() ||
      [v?.first_name, v?.last_name].filter(Boolean).join(' ') ||
      'Vendor store';
    return buildPageMeta({
      title: name,
      description: `Shop products from ${name} on ${SITE_BRAND_SHORT}.`,
      pathname: `/vendor-store/${id}`,
    });
  } catch {
    return buildPageMeta({
      title: 'Vendor store',
      description: `Vendor storefront on ${SITE_BRAND_SHORT}.`,
      pathname: `/vendor-store/${id}`,
    });
  }
}

export default async function VendorStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const [storeResult, reviewsResult] = await Promise.allSettled([
    publicFetcher(`/vendor-store/${id}`, {}, 120) as Promise<VendorStoreResponse>,
    fetchVendorReviews(id),
  ]);

  if (storeResult.status === 'rejected') {
    notFound();
  }
  const res = storeResult.value;

  const reviewsRes: Awaited<ReturnType<typeof fetchVendorReviews>> =
    reviewsResult.status === 'fulfilled'
      ? reviewsResult.value
      : { ok: false, message: 'Could not load reviews' };

  if (!res?.vendor) {
    notFound();
  }

  const initialReviews = reviewsRes.ok ? reviewsRes.data : [];
  const reviewsFetchFailed = !reviewsRes.ok;

  return (
    <VendorStoreView
      initialData={res as VendorStoreInitialData}
      vendorId={id}
      initialReviews={initialReviews}
      reviewsFetchFailed={reviewsFetchFailed}
    />
  );
}

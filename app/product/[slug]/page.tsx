import ProductDetails from '@/components/product/ProductDetails';
import SimilarProducts from '@/components/product/SimilarProducts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetcher, publicFetcher } from '@/lib/fetcher';
import {
  SITE_BRAND_SHORT,
  buildPageMeta,
  getAbsoluteImageFilename,
} from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productRes: any = await publicFetcher(
    `/product-details/${slug}`,
    {},
    180,
  );
  const p = productRes?.data;
  if (!productRes?.status || !p) {
    return buildPageMeta({
      title: 'Product',
      description: `Product details on ${SITE_BRAND_SHORT}.`,
      pathname: `/product/${slug}`,
    });
  }
  const name = String(p.name ?? slug);
  const raw =
    typeof p.short_description === 'string' ? p.short_description.trim() : '';
  const description =
    raw.slice(0, 160) || `Buy ${name} online at ${SITE_BRAND_SHORT}.`;

  return buildPageMeta({
    title: name,
    description,
    pathname: `/product/${slug}`,
    ogImage: getAbsoluteImageFilename(p.thumbnail_img),
    keywords: [name, 'buy online', 'grocery', SITE_BRAND_SHORT],
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product: any = await fetcher(`/product-details/${slug}`);

  if (!product?.status || !product?.data) {
    notFound();
  }

  return (
    <div className="max-w-[95rem] mx-auto px-4 py-8">
      <ProductDetails slug={slug} product={product} />
      <SimilarProducts slug={slug} />
    </div>
  );
}

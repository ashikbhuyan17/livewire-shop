import ProductDetailDemo from '@/components/product/demo/ProductDetailDemo';
import type { Metadata } from 'next';
import { SITE_BRAND_SHORT, buildPageMeta } from '@/lib/site';
import { STATIC_PRODUCT } from '@/lib/product-demo-data';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMeta({
    title: STATIC_PRODUCT.name,
    description: `Buy ${STATIC_PRODUCT.name} at the best price in Bangladesh — ${SITE_BRAND_SHORT}. EMI, warranty & fast delivery.`,
    pathname: `/product/${STATIC_PRODUCT.slug}`,
    keywords: [
      STATIC_PRODUCT.name,
      STATIC_PRODUCT.brand,
      'buy online',
      'smartphone Bangladesh',
      SITE_BRAND_SHORT,
    ],
  });
}

export default function ProductPage() {
  return <ProductDetailDemo />;
}

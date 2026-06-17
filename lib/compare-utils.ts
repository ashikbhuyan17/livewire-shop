import { getProductVariants } from '@/lib/product-utils';
import { getVariantAvailableStock, isInStock } from '@/lib/stock-utils';

export const MAX_COMPARE_PRODUCTS = 4;

export type CompareApiItem = Record<string, unknown>;

export function isCompareApiSuccess(status: unknown) {
  if (status === true) return true;
  return String(status ?? '').toLowerCase() === 'success';
}

/** API returns `products[]`; legacy may use singular `product`. */
export function resolveCompareProduct(item: CompareApiItem) {
  const products = item.products;
  if (Array.isArray(products) && products.length > 0) {
    return products[0] as CompareApiItem;
  }
  const product = item.product;
  if (product && typeof product === 'object' && !Array.isArray(product)) {
    return product as CompareApiItem;
  }
  return {};
}

function resolveCompareVariant(product: CompareApiItem) {
  const first = getProductVariants(product)[0];
  if (first?.id) return first as CompareApiItem;
  return {};
}

function resolveCompareColorId(
  product: CompareApiItem,
  variant: CompareApiItem,
) {
  const fromVariant = variant.productcolor_id ?? variant.product_color_id;
  if (fromVariant != null && fromVariant !== '') return Number(fromVariant);
  const colors = product.productcolors;
  if (Array.isArray(colors) && colors.length > 0) {
    const c = colors[0] as CompareApiItem;
    return Number(c.id ?? 0);
  }
  return 0;
}

export type CompareProductRow = {
  compareId: number;
  productId: number;
  slug: string;
  name: string;
  imageUrl: string;
  thumbnailImg: string;
  price: number;
  originalPrice?: number;
  variantName: string;
  inStock: boolean;
  availableStock: number;
  productVariantId: number;
  productColorId: number;
  createdAt: string;
};

export function mapCompareItemToRow(item: CompareApiItem): CompareProductRow {
  const product = resolveCompareProduct(item);
  const variant = resolveCompareVariant(product);
  const sale = Number(variant.sale_price ?? 0);
  const regular = Number(variant.regular_price ?? 0);
  const price = sale > 0 ? sale : regular;
  const originalPrice = regular > price ? regular : undefined;
  const availableStock = getVariantAvailableStock(variant);
  const thumbnailImg = String(product.thumbnail_img ?? '');
  const imgBase = process.env.NEXT_PUBLIC_IMG_URL ?? '';

  return {
    compareId: Number(item.id),
    productId: Number(product.id ?? item.product_id),
    slug: String(product.slug ?? ''),
    name: String(product.name ?? ''),
    imageUrl: thumbnailImg
      ? `${imgBase.replace(/\/$/, '')}/${thumbnailImg.replace(/^\//, '')}`
      : '',
    thumbnailImg,
    price,
    originalPrice,
    variantName: String(variant.variant_name ?? '—'),
    inStock: isInStock(availableStock),
    availableStock,
    productVariantId: Number(variant.id ?? 0),
    productColorId: resolveCompareColorId(product, variant),
    createdAt: String(item.created_at ?? ''),
  };
}

export function getCompareProductIds(items: unknown): number[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const row = item as CompareApiItem;
      const product = resolveCompareProduct(row);
      const id = product.id ?? row.product_id;
      const n = Number(id);
      return Number.isFinite(n) ? n : null;
    })
    .filter((id): id is number => id != null);
}

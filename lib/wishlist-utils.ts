import { getProductVariants } from '@/lib/product-utils';
import { getVariantAvailableStock, isInStock } from '@/lib/stock-utils';

export type WishlistApiItem = Record<string, unknown>;

export function isWishlistApiSuccess(status: unknown) {
  if (status === true) return true;
  return String(status ?? '').toLowerCase() === 'success';
}

export function mapWishlistItemToCard(item: WishlistApiItem) {
  const product = (item.product as WishlistApiItem | undefined) ?? {};
  const variant = getProductVariants(product)[0] ?? {};
  const sale = Number(variant.sale_price ?? product.new_price ?? 0);
  const regular = Number(variant.regular_price ?? product.old_price ?? 0);
  const newPrice = sale > 0 ? sale : regular;
  const oldPrice = regular > newPrice ? regular : undefined;

  return {
    id: Number(item.id),
    productId: Number(product.id ?? item.product_id),
    slug: String(product.slug ?? ''),
    image: String(product.thumbnail_img ?? ''),
    title: String(product.name ?? ''),
    newPrice,
    oldPrice,
  };
}

export type UserWishlistRow = {
  id: string;
  wishlistId: number;
  productId: number;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  thumbnailImg: string;
  category: string;
  inStock: boolean;
  availableStock: number;
  productVariantId: number;
  productColorId: number;
  createdAt: string;
};

function resolveWishlistVariant(product: WishlistApiItem) {
  const first = getProductVariants(product)[0];
  if (first?.id) return first as WishlistApiItem;
  return {};
}

function resolveWishlistColorId(
  product: WishlistApiItem,
  variant: WishlistApiItem,
) {
  const fromVariant = variant.productcolor_id ?? variant.product_color_id;
  if (fromVariant != null && fromVariant !== '') return Number(fromVariant);
  const colors = product.productcolors;
  if (Array.isArray(colors) && colors.length > 0) {
    const c = colors[0] as WishlistApiItem;
    return Number(c.id ?? 0);
  }
  return 0;
}

export function mapWishlistItemToUserRow(item: WishlistApiItem): UserWishlistRow {
  const product = (item.product as WishlistApiItem | undefined) ?? {};
  const variant = resolveWishlistVariant(product);
  const sale = Number(variant.sale_price ?? 0);
  const regular = Number(variant.regular_price ?? 0);
  const price = sale > 0 ? sale : regular;
  const originalPrice = regular > price ? regular : undefined;
  const availableStock = getVariantAvailableStock(variant);
  const thumbnailImg = String(product.thumbnail_img ?? '');
  const imgBase = process.env.NEXT_PUBLIC_IMG_URL ?? '';

  return {
    id: String(item.id ?? product.id),
    wishlistId: Number(item.id),
    productId: Number(product.id ?? item.product_id),
    slug: String(product.slug ?? ''),
    name: String(product.name ?? ''),
    price,
    originalPrice,
    image: thumbnailImg
      ? `${imgBase.replace(/\/$/, '')}/${thumbnailImg.replace(/^\//, '')}`
      : '',
    thumbnailImg,
    category: String(variant.variant_name ?? ''),
    inStock: isInStock(availableStock),
    availableStock,
    productVariantId: Number(variant.id ?? 0),
    productColorId: resolveWishlistColorId(product, variant),
    createdAt: String(item.created_at ?? ''),
  };
}

export function getWishlistProductIds(items: unknown): number[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const row = item as WishlistApiItem;
      const product = row.product as WishlistApiItem | undefined;
      const id = product?.id ?? row.product_id;
      const n = Number(id);
      return Number.isFinite(n) ? n : null;
    })
    .filter((id): id is number => id != null);
}

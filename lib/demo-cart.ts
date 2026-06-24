import type { CartItem } from '@/lib/cart';
import type { DemoProduct } from '@/lib/home-demo-data';
import {
  STATIC_PRODUCT,
  type ProductColorId,
  type ProductVariantId,
} from '@/lib/product-demo-data';

const DEMO_CART_IDS: Record<string, number> = {
  'iphone-17-pro-max': 1001,
  'redmi-pad-2': 1002,
  'oneplus-13s': 1003,
  'vivo-y19s-pro': 1004,
  'redmi-note-15-pro-plus': 1005,
  'redmi-15c': 101,
};

const COLOR_IDS: Record<ProductColorId, number> = {
  'moonlight-blue': 1,
  'midnight-black': 2,
  'mint-green': 3,
  'starlight-gold': 4,
};

const VARIANT_IDS: Record<ProductVariantId, number> = {
  '4-128': 1,
  '6-128': 2,
  '8-256': 3,
  '12-128': 4,
};

export const DEMO_STOCK = 50;

export function demoProductToCartItem(product: DemoProduct): CartItem {
  const label = product.variant
    ? `${product.name} ( ${product.variant} )`
    : product.name;

  return {
    id: DEMO_CART_IDS[product.id] ?? 9000,
    name: label,
    image: product.image,
    qty: 1,
    price: product.price,
    product_color_id: 0,
    product_variant_id: 0,
    available_stock: DEMO_STOCK,
  };
}

export function staticProductToCartItem(
  colorId: ProductColorId,
  variantId: ProductVariantId,
  price: number,
): CartItem {
  const color = STATIC_PRODUCT.colors.find((c) => c.id === colorId)!;
  const variant = STATIC_PRODUCT.variants.find((v) => v.id === variantId)!;

  return {
    id: STATIC_PRODUCT.id,
    name: `${STATIC_PRODUCT.name} ( ${color.name} / ${variant.label} )`,
    image: color.image,
    qty: 1,
    price,
    product_color_id: COLOR_IDS[colorId],
    product_variant_id: VARIANT_IDS[variantId],
    available_stock: DEMO_STOCK,
  };
}

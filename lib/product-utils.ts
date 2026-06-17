/** Variant row from list/card APIs (`productvariants`, nested under `productcolors`). */
export type ProductVariantShape = {
  id?: number | string;
  variant_id?: string;
  product_id?: string;
  productcolor_id?: string;
  product_color_id?: string;
  variant_name?: string;
  regular_price?: string | number;
  sale_price?: string | number;
  available_stock?: string | number;
  total_stock?: string | number;
  sold_stock?: string | number;
};

export type ProductColorShape = {
  id?: number | string;
  color_id?: string;
  color_name?: string;
  image?: string;
  images?: string;
  productvariants?: ProductVariantShape[];
};

type ProductLike = Record<string, unknown> | null | undefined;

function asVariant(value: unknown): ProductVariantShape | null {
  if (!value || typeof value !== 'object') return null;
  return value as ProductVariantShape;
}

/** Colors from product details API (`productcolors[]`). */
export function getProductColors(product: ProductLike): ProductColorShape[] {
  if (!product) return [];
  const colors = product.productcolors;
  if (!Array.isArray(colors) || colors.length === 0) return [];
  return colors.filter(Boolean) as ProductColorShape[];
}

/** Variants for a selected color row. */
export function getVariantsForColor(
  color: ProductColorShape | null | undefined,
): ProductVariantShape[] {
  if (!color) return [];
  const variants = color.productvariants;
  if (!Array.isArray(variants) || variants.length === 0) return [];
  return variants.filter(Boolean) as ProductVariantShape[];
}

export function isPreOrderProduct(product: ProductLike): boolean {
  if (!product) return false;
  const value = product.pre_order;
  return String(value) === '1' || value === 1 || value === true;
}

export function getVariantPricing(variant: ProductVariantShape | null | undefined) {
  const regular = Number(variant?.regular_price ?? 0);
  const sale = Number(variant?.sale_price ?? 0);
  const hasRegular = Number.isFinite(regular) && regular > 0;
  const hasSale = Number.isFinite(sale) && sale > 0;
  const hasDeal = hasSale && hasRegular && sale < regular;
  const effective = hasSale ? sale : hasRegular ? regular : 0;

  return {
    regular: hasRegular ? regular : 0,
    sale: hasSale ? sale : 0,
    effective,
    hasDeal,
  };
}

export function parseColorGalleryImages(
  color: ProductColorShape | null | undefined,
  fallback?: string,
): string[] {
  const paths: string[] = [];

  if (color?.image && String(color.image).trim()) {
    paths.push(String(color.image).trim());
  }

  if (color?.images) {
    try {
      const parsed = JSON.parse(String(color.images)) as unknown;
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          if (typeof entry === 'string' && entry.trim()) {
            paths.push(entry.trim());
          }
        }
      }
    } catch {
      /* ignore invalid JSON */
    }
  }

  const unique = [...new Set(paths)];
  if (unique.length > 0) return unique;
  return fallback?.trim() ? [fallback.trim()] : [];
}

/** Resolves variants from flat arrays, nested colors, or legacy `firstvariant`. */
export function getProductVariants(
  product: ProductLike,
): ProductVariantShape[] {
  if (!product) return [];

  const fromArray = product.productvariants;
  if (Array.isArray(fromArray) && fromArray.length > 0) {
    return fromArray.filter(Boolean) as ProductVariantShape[];
  }

  const colors = getProductColors(product);
  if (colors.length > 0) {
    return colors.flatMap((color) => getVariantsForColor(color));
  }

  const first = product.firstvariant ?? product.first_variant ?? null;

  const single = asVariant(first);
  if (single) return [single];

  return [];
}

/** Ensures `productvariants` (and color id) exist for `ProductCard` and cart actions. */
export function normalizeProductForCard<T extends Record<string, unknown>>(
  product: T,
): T & { productvariants: ProductVariantShape[] } {
  const variants = getProductVariants(product);
  const v0 = variants[0];
  const colorId = v0?.productcolor_id ?? v0?.product_color_id;

  const existingColors = product.productcolors;
  const productcolors =
    Array.isArray(existingColors) && existingColors.length > 0
      ? existingColors
      : colorId != null && `${colorId}` !== ''
        ? [{ id: colorId }]
        : product.productcolors;

  return {
    ...product,
    productvariants: variants,
    ...(productcolors !== undefined ? { productcolors } : {}),
  };
}

/** Adds optional `discount` badge amount when sale < regular. */
export function enrichProductForCard<T extends Record<string, unknown>>(
  product: T,
) {
  const normalized = normalizeProductForCard(product);
  const v0 = normalized.productvariants[0];
  if (!v0) return normalized;

  const reg = Number(v0.regular_price);
  const sale = Number(v0.sale_price);
  const hasDeal =
    !Number.isNaN(sale) && !Number.isNaN(reg) && sale > 0 && reg > sale;
  const discount = hasDeal ? Math.round(reg - sale) : undefined;
  if (!discount) return normalized;
  return { ...normalized, discount };
}

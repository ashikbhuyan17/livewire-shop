'use server';

import { publicFetcher } from '@/lib/fetcher';
import {
  buildCatalogQueryString,
  parseCatalogProductsResponse,
  type ParsedCatalogParams,
} from '@/lib/catalog-utils';

/** Product lists — short cache so navigation feels instant after prefetch. */
const CATALOG_REVALIDATE = 60;
/** Tags / subcategory lists change rarely. */
const META_REVALIDATE = 300;

export type ProductTag = {
  id: number;
  name: string;
};

export type CatalogCategory = {
  id?: number;
  name?: string;
  slug?: string;
  image?: string | null;
  banner_image?: string | null;
};

export type CatalogSubcategory = {
  id?: number;
  name?: string;
  slug?: string;
  category_id?: string;
  banner_image?: string | null;
  image?: string | null;
};

export async function fetchProductTags(): Promise<ProductTag[]> {
  try {
    const res = (await publicFetcher('/product-tags', {}, META_REVALIDATE)) as {
      data?: ProductTag[];
    };
    return Array.isArray(res?.data) ? res.data : [];
  } catch {
    return [];
  }
}

export async function fetchSubcategoriesByCategory(
  categorySlug: string,
): Promise<CatalogSubcategory[]> {
  try {
    const res = (await publicFetcher(
      `/subcategories-by-category/${categorySlug}`,
      {},
      META_REVALIDATE,
    )) as { data?: CatalogSubcategory[] };
    return Array.isArray(res?.data) ? res.data : [];
  } catch {
    return [];
  }
}

export async function fetchCategoryProducts(
  categorySlug: string,
  params: ParsedCatalogParams,
) {
  const qs = buildCatalogQueryString(params);
  const res = await publicFetcher(
    `/category-products/${categorySlug}${qs}`,
    {},
    CATALOG_REVALIDATE,
  );
  return {
    response: res,
    page: parseCatalogProductsResponse(res),
    category: (res as { category?: CatalogCategory })?.category,
  };
}

export async function fetchSubcategoryProducts(
  subcategorySlug: string,
  params: ParsedCatalogParams,
) {
  const qs = buildCatalogQueryString(params);
  const res = await publicFetcher(
    `/subcategory-products/${subcategorySlug}${qs}`,
    {},
    CATALOG_REVALIDATE,
  );
  return {
    response: res,
    page: parseCatalogProductsResponse(res),
    subcategory: (res as { subcategory?: CatalogSubcategory })?.subcategory,
  };
}

/** Resolve parent category slug from numeric category id. */
export async function resolveCategorySlugById(
  categoryId: string | number,
): Promise<string | null> {
  try {
    const res = (await publicFetcher('/categories', {}, META_REVALIDATE)) as {
      data?: { id?: number | string; slug?: string }[];
    };
    const id = String(categoryId);
    const match = res?.data?.find((c) => String(c.id) === id);
    return match?.slug?.trim() || null;
  } catch {
    return null;
  }
}

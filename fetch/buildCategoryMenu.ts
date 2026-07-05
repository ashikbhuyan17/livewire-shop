import { cache } from 'react';
import { publicFetcher } from '@/lib/fetcher';

const REVALIDATE = 300;

type ApiSubCategory = {
  title?: string;
  slug?: string;
  image?: string;
};

type ApiCategory = {
  title?: string;
  slug?: string;
  image?: string;
  subcategories?: ApiSubCategory[];
};

type CategoriesResponse = {
  success?: boolean;
  data?: ApiCategory[];
};

export type CategorySubMenuItem = {
  name: string;
  href: string;
  icon: string;
};

export type CategoryMenuItem = {
  name: string;
  icon: string;
  slug: string;
  subcategories: CategorySubMenuItem[];
};

export type HeaderCategoryItem = {
  name: string;
  icon: string;
  slug: string;
};

async function fetchCategories(query: string): Promise<ApiCategory[]> {
  const res = await publicFetcher<CategoriesResponse>(query, {}, REVALIDATE);
  if (!res?.success || !Array.isArray(res.data)) return [];
  return res.data;
}

function mapSubcategories(
  categorySlug: string,
  subs: ApiSubCategory[] = [],
): CategorySubMenuItem[] {
  return subs
    .filter((sub) => sub.slug && sub.title)
    .map((sub) => ({
      name: sub.title!.trim(),
      href: `/category/${categorySlug}/subcategory/${sub.slug}`,
      icon: (sub.image || '').replace(/^\//, ''),
    }));
}

function mapMenuItems(rows: ApiCategory[]): CategoryMenuItem[] {
  return rows
    .filter((cat) => cat.slug && cat.title)
    .map((cat) => ({
      name: cat.title!.trim(),
      icon: (cat.image || '').replace(/^\//, ''),
      slug: `/category/${cat.slug}`,
      subcategories: mapSubcategories(cat.slug!, cat.subcategories ?? []),
    }));
}

function mapHeaderItems(rows: ApiCategory[]): HeaderCategoryItem[] {
  return rows
    .filter((cat) => cat.slug && cat.title)
    .map((cat) => ({
      name: cat.title!.trim(),
      icon: (cat.image || '').replace(/^\//, ''),
      slug: `/category/${cat.slug}`,
    }));
}

/** Mega menu — all categories with subcategories */
const buildCategoryMenu = cache(async (): Promise<CategoryMenuItem[]> => {
  const rows = await fetchCategories('/categories');
  return mapMenuItems(rows);
});

/** Header nav — header_status=1 only */
export const fetchHeaderCategories = cache(
  async (): Promise<HeaderCategoryItem[]> => {
    const rows = await fetchCategories('/categories?header_status=1');
    return mapHeaderItems(rows);
  },
);

/** Home "Shop by Categories" — middle_status=1 only */
export const fetchMiddleCategories = cache(
  async (): Promise<HeaderCategoryItem[]> => {
    const rows = await fetchCategories('/categories?middle_status=1');
    return mapHeaderItems(rows);
  },
);

export default buildCategoryMenu;

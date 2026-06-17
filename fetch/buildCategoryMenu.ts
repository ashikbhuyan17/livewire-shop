import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { publicFetcher } from '@/lib/fetcher';

const MENU_REVALIDATE = 300;

async function loadCategoryMenu() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories: any = await publicFetcher('/categories', {}, MENU_REVALIDATE);

  const rows = categories?.data ?? [];
  const result = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows.map(async (category: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subcategories: any = await publicFetcher(
        `/subcategories-by-category/${category?.slug}`,
        {},
        MENU_REVALIDATE,
      );

      return {
        name: category?.name,
        icon: category?.image,
        slug: `/category/${category?.slug}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        subcategories: subcategories?.data?.map((sub: any) => ({
          name: sub?.name,
          href: `/category/${category?.slug}/subcategory/${sub?.slug}`,
        })),
      };
    }),
  );

  return result;
}

const getCategoryMenuCached = unstable_cache(
  loadCategoryMenu,
  ['category-menu'],
  { revalidate: MENU_REVALIDATE },
);

/** Per-request dedupe + cross-request cache for layout + home. */
const buildCategoryMenu = cache(getCategoryMenuCached);

export default buildCategoryMenu;

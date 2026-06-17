import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CatalogBanner from '@/components/category/CatalogBanner';
import CatalogBreadcrumbs from '@/components/category/CatalogBreadcrumbs';
import CatalogControls from '@/components/category/CatalogControls';
import CatalogPagination from '@/components/category/CatalogPagination';
import ProductList from '@/components/category/ProductList';
import SubcategoryPills from '@/components/category/SubcategoryPills';
import {
  fetchCategoryProducts,
  fetchProductTags,
  fetchSubcategoriesByCategory,
} from '@/lib/catalog';
import { parseCatalogSearchParams } from '@/lib/catalog-utils';
import { SITE_BRAND_SHORT, buildPageMeta, slugToLabel } from '@/lib/site';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    min?: string;
    max?: string;
    filter?: string;
    tags?: string | string[];
    'tags[]'?: string | string[];
    page?: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = slugToLabel(slug);
  return buildPageMeta({
    title: name,
    description: `Shop ${name} products online — great prices & delivery with ${SITE_BRAND_SHORT}.`,
    pathname: `/category/${slug}`,
    keywords: [name, 'category', SITE_BRAND_SHORT],
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const catalogParams = parseCatalogSearchParams(sp);

  const [productsResult, tags, subcategories] = await Promise.all([
    fetchCategoryProducts(slug, catalogParams),
    fetchProductTags(),
    fetchSubcategoriesByCategory(slug),
  ]);

  if (!(productsResult.response as { status?: boolean })?.status) {
    notFound();
  }

  const category = productsResult.category;
  const { products, currentPage, lastPage, total } = productsResult.page;
  const categoryName = category?.name ?? slug;
  const pathname = `/category/${slug}`;

  return (
    <div className="mx-auto max-w-[95rem] px-2 py-4 sm:px-4">
      <CatalogBreadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: categoryName },
        ]}
      />

      <CatalogBanner imagePath={category?.banner_image ?? null} alt={categoryName} />

      <div className="space-y-4 rounded-sm border border-border bg-white p-4">
        <SubcategoryPills
          categorySlug={slug}
          subcategories={subcategories}
        />

        <CatalogControls tags={tags} params={catalogParams}>
          <ProductList products={products} />
          <CatalogPagination
            pathname={pathname}
            params={catalogParams}
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
          />
        </CatalogControls>
      </div>
    </div>
  );
}

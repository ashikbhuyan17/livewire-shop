import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CatalogBanner from '@/components/category/CatalogBanner';
import CatalogBreadcrumbs from '@/components/category/CatalogBreadcrumbs';
import CatalogControls from '@/components/category/CatalogControls';
import CatalogPagination from '@/components/category/CatalogPagination';
import ProductList from '@/components/category/ProductList';
import SubcategoryPills from '@/components/category/SubcategoryPills';
import {
  fetchProductTags,
  fetchSubcategoriesByCategory,
  fetchSubcategoryProducts,
} from '@/lib/catalog';
import { parseCatalogSearchParams } from '@/lib/catalog-utils';
import { SITE_BRAND_SHORT, buildPageMeta, slugToLabel } from '@/lib/site';

type PageProps = {
  params: Promise<{ slug: string; subSlug: string }>;
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
  params: Promise<{ slug: string; subSlug: string }>;
}): Promise<Metadata> {
  const { slug, subSlug } = await params;
  const name = slugToLabel(subSlug);
  return buildPageMeta({
    title: name,
    description: `Browse ${name} products at ${SITE_BRAND_SHORT}.`,
    pathname: `/category/${slug}/subcategory/${subSlug}`,
    keywords: [name, 'subcategory', SITE_BRAND_SHORT],
  });
}

export default async function CategorySubcategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug, subSlug } = await params;
  const sp = await searchParams;
  const catalogParams = parseCatalogSearchParams(sp);

  const [productsResult, tags, subcategories] = await Promise.all([
    fetchSubcategoryProducts(subSlug, catalogParams),
    fetchProductTags(),
    fetchSubcategoriesByCategory(slug),
  ]);

  if (!(productsResult.response as { status?: boolean })?.status) {
    notFound();
  }

  const subcategory = productsResult.subcategory;
  const { products, currentPage, lastPage, total } = productsResult.page;
  const subName = subcategory?.name ?? slugToLabel(subSlug);
  const categoryLabel = slugToLabel(slug);
  const pathname = `/category/${slug}/subcategory/${subSlug}`;
  const bannerImage =
    subcategory?.banner_image ?? subcategory?.banner_image ?? null;

  return (
    <div className="mx-auto max-w-[95rem] px-2 py-4 sm:px-4">
      <CatalogBreadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: categoryLabel, href: `/category/${slug}` },
          { label: subName },
        ]}
      />

      <CatalogBanner imagePath={bannerImage} alt={subName} />

      <div className="space-y-4 rounded-sm border border-border bg-white p-4">
        <SubcategoryPills
          categorySlug={slug}
          subcategories={subcategories}
          activeSubSlug={subSlug}
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

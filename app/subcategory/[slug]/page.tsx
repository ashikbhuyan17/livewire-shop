import { redirect, notFound } from 'next/navigation';
import { fetchSubcategoryProducts, resolveCategorySlugById } from '@/lib/catalog';

/** Legacy `/subcategory/:slug` → `/category/:categorySlug/subcategory/:slug` */
export default async function LegacySubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const { response, subcategory } = await fetchSubcategoryProducts(slug, {
    min: 0,
    max: 99_999_999,
    filter: '',
    tags: [],
    page: 1,
  });

  if (!(response as { status?: boolean })?.status) {
    notFound();
  }

  const categoryId = subcategory?.category_id;
  const categorySlug = categoryId
    ? await resolveCategorySlugById(categoryId)
    : null;

  if (!categorySlug) {
    notFound();
  }

  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => qs.append(key, v));
    } else {
      qs.set(key, value);
    }
  }
  const q = qs.toString();
  redirect(
    `/category/${categorySlug}/subcategory/${slug}${q ? `?${q}` : ''}`,
  );
}

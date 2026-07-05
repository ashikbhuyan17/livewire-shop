import type { Metadata } from 'next';
import BlogsDemo from '@/components/blog/BlogsDemo';
import {
  fetchAllBlogs,
  fetchBlogCategories,
  fetchBlogsByCategory,
} from '@/lib/livewire-blogs';
import { SITE_BRAND_SHORT, buildPageMeta } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Blog',
  description: `Read the latest tech news, reviews, and buying guides from ${SITE_BRAND_SHORT}.`,
  pathname: '/blogs',
  keywords: ['blog', 'tech news', 'smartphone reviews', 'buying guide', SITE_BRAND_SHORT],
});

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogsPage({ searchParams }: PageProps) {
  const { category: categoryParam } = await searchParams;
  const categories = await fetchBlogCategories();

  const activeCategory =
    categoryParam && categories.some((c) => c.slug === categoryParam)
      ? categoryParam
      : 'all';

  const blogs =
    activeCategory === 'all'
      ? await fetchAllBlogs(categories)
      : await fetchBlogsByCategory(
          activeCategory,
          categories.find((c) => c.slug === activeCategory)?.title,
        );

  return (
    <BlogsDemo
      categories={categories}
      blogs={blogs}
      activeCategory={activeCategory}
    />
  );
}

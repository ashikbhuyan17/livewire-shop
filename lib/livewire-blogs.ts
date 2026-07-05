import 'server-only';

import { cache } from 'react';
import {
  formatBlogDate,
  type BlogCategory,
  type BlogDetailPost,
  type BlogPost,
} from '@/lib/blog-utils';
import { publicFetcher } from '@/lib/fetcher';
import { resolveApiImage } from '@/lib/home-banners';

export type { BlogCategory, BlogDetailPost, BlogPost } from '@/lib/blog-utils';
export { blogDetailHref, formatBlogDate } from '@/lib/blog-utils';

const REVALIDATE = 300;

type ApiSuccess<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type ApiBlogCategory = {
  id?: number;
  title?: string;
  slug?: string;
  image?: string;
};

type ApiBlogItem = {
  id?: number;
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
  created_at?: string;
};

type ApiBlogDetail = ApiBlogItem & {
  long_description?: string;
};

function mapCategory(raw: ApiBlogCategory): BlogCategory | null {
  if (!raw.slug?.trim() || !raw.title?.trim()) return null;
  return {
    id: String(raw.id ?? raw.slug),
    title: raw.title.trim(),
    slug: raw.slug.trim(),
    image: resolveApiImage(raw.image) || '',
  };
}

function mapPost(raw: ApiBlogItem, category?: string): BlogPost | null {
  if (!raw.slug?.trim() || !raw.title?.trim()) return null;
  return {
    id: String(raw.id ?? raw.slug),
    title: raw.title.trim(),
    slug: raw.slug.trim(),
    excerpt: raw.description?.trim() || '',
    image: resolveApiImage(raw.image) || '',
    date: formatBlogDate(raw.created_at),
    category,
  };
}

export const fetchBlogCategories = cache(async (): Promise<BlogCategory[]> => {
  const res = await publicFetcher<ApiSuccess<ApiBlogCategory[]>>(
    '/blog-categories',
    {},
    REVALIDATE,
  );
  if (!res?.success || !Array.isArray(res.data)) return [];
  return res.data
    .map(mapCategory)
    .filter((c): c is BlogCategory => c !== null);
});

export const fetchBlogsByCategory = cache(
  async (
    categorySlug: string,
    categoryTitle?: string,
  ): Promise<BlogPost[]> => {
    const slug = categorySlug.trim();
    if (!slug) return [];

    const res = await publicFetcher<ApiSuccess<ApiBlogItem[]>>(
      `/blog_by_category/${encodeURIComponent(slug)}`,
      {},
      REVALIDATE,
    );

    if (!res?.success || !Array.isArray(res.data)) return [];
    const label = categoryTitle?.trim() || slug;
    return res.data
      .map((item) => mapPost(item, label))
      .filter((b): b is BlogPost => b !== null);
  },
);

export async function fetchAllBlogs(
  categories: BlogCategory[],
): Promise<BlogPost[]> {
  if (categories.length === 0) return [];

  const lists = await Promise.all(
    categories.map((cat) => fetchBlogsByCategory(cat.slug, cat.title)),
  );

  const seen = new Set<string>();
  return lists.flat().filter((post) => {
    if (seen.has(post.slug)) return false;
    seen.add(post.slug);
    return true;
  });
}

export const fetchBlogBySlug = cache(
  async (slug: string): Promise<BlogDetailPost | null> => {
    const key = slug.trim();
    if (!key) return null;

    const res = await publicFetcher<ApiSuccess<ApiBlogDetail>>(
      `/blog/${encodeURIComponent(key)}`,
      {},
      REVALIDATE,
    );

    if (!res?.success || !res.data) return null;

    const base = mapPost(res.data);
    if (!base) return null;

    return {
      ...base,
      longDescription: res.data.long_description?.trim() || '',
    };
  },
);

export async function fetchRelatedPosts(
  currentSlug: string,
  limit = 5,
): Promise<BlogPost[]> {
  const categories = await fetchBlogCategories();
  const all = await fetchAllBlogs(categories);
  return all.filter((b) => b.slug !== currentSlug).slice(0, limit);
}

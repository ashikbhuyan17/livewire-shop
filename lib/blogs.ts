import { publicFetcher } from '@/lib/fetcher';
import { getAbsoluteImageFilename } from '@/lib/site';

export type BlogListItem = {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  author: string;
  author_image: string | null;
  published_date: string;
  short_description: string;
  status: string;
};

export type BlogDetail = BlogListItem & {
  long_description: string;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  meta_image?: string | null;
  google_schema?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type PaginatedBlogs = {
  current_page: number;
  data: BlogListItem[];
  last_page: number;
  per_page: number;
  total: number;
};

export type BlogsApiResponse = {
  status?: boolean;
  message?: string;
  data?: PaginatedBlogs;
};

export type BlogDetailApiResponse = {
  status?: boolean;
  message?: string;
  data?: BlogDetail;
};

const BLOG_REVALIDATE = 3600;

export function blogDetailHref(slug: string): string {
  return `/blog-details/${encodeURIComponent(slug)}`;
}

export function blogsListHref(page = 1): string {
  if (page <= 1) return '/blogs';
  return `/blogs?page=${page}`;
}

export function resolveBlogImage(path: string | null | undefined): string | null {
  return getAbsoluteImageFilename(path) ?? null;
}

export function formatBlogDate(dateString: string | null | undefined): string {
  if (!dateString?.trim()) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export async function fetchBlogs(page = 1): Promise<BlogsApiResponse | null> {
  const query = page > 1 ? `?page=${page}` : '';
  return publicFetcher<BlogsApiResponse>(`/blogs${query}`, {}, BLOG_REVALIDATE);
}

export async function fetchBlogBySlug(
  slug: string,
): Promise<BlogDetailApiResponse | null> {
  return publicFetcher<BlogDetailApiResponse>(
    `/blog-details/${encodeURIComponent(slug)}`,
    {},
    BLOG_REVALIDATE,
  );
}

export function publishedBlogs(items: BlogListItem[]): BlogListItem[] {
  return items.filter((b) => String(b.status ?? '1') === '1');
}

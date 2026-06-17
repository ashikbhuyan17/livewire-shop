import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailView from '@/components/blog/BlogDetailView';
import { buildPageMeta } from '@/lib/site';
import {
  blogDetailHref,
  fetchBlogBySlug,
  resolveBlogImage,
} from '@/lib/blogs';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetchBlogBySlug(slug);
  const blog = res?.status === true ? res.data : null;

  if (!blog) {
    return buildPageMeta({
      title: 'Article not found',
      description: 'The requested blog article could not be found.',
      pathname: blogDetailHref(slug),
    });
  }

  return buildPageMeta({
    title: blog.meta_title?.trim() || blog.title,
    description:
      blog.meta_description?.trim() ||
      blog.short_description?.trim() ||
      `Read ${blog.title} on BestFood City.`,
    pathname: blogDetailHref(slug),
    keywords: blog.meta_keywords
      ?.split(',')
      .map((k) => k.trim())
      .filter(Boolean),
    ogImage: resolveBlogImage(blog.meta_image ?? blog.image),
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug?.trim()) notFound();

  const res = await fetchBlogBySlug(slug);
  const blog = res?.status === true ? res.data : null;

  if (!blog || String(blog.status ?? '1') !== '1') notFound();

  return (
    <main className="min-h-screen bg-white">
      <BlogDetailView blog={blog} />
    </main>
  );
}

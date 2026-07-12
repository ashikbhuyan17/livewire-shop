import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailDemo from '@/components/blog/BlogDetailDemo';
import {
  blogDetailHref,
  fetchBlogBySlug,
  fetchRelatedPosts,
} from '@/lib/livewire-blogs';
import { buildPageMeta } from '@/lib/site';

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    return buildPageMeta({
      title: 'Article not found',
      description: 'The requested blog article could not be found.',
      pathname: blogDetailHref(slug),
    });
  }

  return buildPageMeta({
    title: blog.title,
    description: blog.excerpt,
    pathname: blogDetailHref(slug),
    keywords: ['blog', 'Livewire'],
    ogImage: blog.image || undefined,
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [blog, relatedPosts] = await Promise.all([
    fetchBlogBySlug(slug),
    fetchRelatedPosts(slug),
  ]);

  if (!blog) notFound();

  return (
    <main className="min-h-screen bg-slate-50/60">
      <BlogDetailDemo blog={blog} relatedPosts={relatedPosts} />
    </main>
  );
}

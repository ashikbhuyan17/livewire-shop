import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailDemo from '@/components/blog/BlogDetailDemo';
import { buildPageMeta } from '@/lib/site';
import { DEMO_BLOGS, getBlogBySlug } from '@/lib/pages-demo-data';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return DEMO_BLOGS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return buildPageMeta({
      title: 'Article not found',
      description: 'The requested blog article could not be found.',
      pathname: `/blog-details/${slug}`,
    });
  }

  return buildPageMeta({
    title: blog.title,
    description: blog.excerpt,
    pathname: `/blog-details/${slug}`,
    keywords: [blog.category, 'blog', 'Livewire'],
    ogImage: blog.image,
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) notFound();

  return (
    <main className="min-h-screen bg-slate-50/60">
      <BlogDetailDemo blog={blog} />
    </main>
  );
}

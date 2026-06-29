import type { Metadata } from 'next';
import BlogsDemo from '@/components/blog/BlogsDemo';
import { SITE_BRAND_SHORT, buildPageMeta } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Blog',
  description: `Read the latest tech news, reviews, and buying guides from ${SITE_BRAND_SHORT}.`,
  pathname: '/blogs',
  keywords: ['blog', 'tech news', 'smartphone reviews', 'buying guide', SITE_BRAND_SHORT],
});

export default function BlogsPage() {
  return <BlogsDemo />;
}

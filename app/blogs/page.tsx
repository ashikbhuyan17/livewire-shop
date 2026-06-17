import type { Metadata } from 'next';
import BlogEmpty from '@/components/blog/BlogEmpty';
import BlogGrid from '@/components/blog/BlogGrid';
import BlogHero from '@/components/blog/BlogHero';
import BlogPagination from '@/components/blog/BlogPagination';
import { buildPageMeta } from '@/lib/site';
import { fetchBlogs, publishedBlogs } from '@/lib/blogs';

export const metadata: Metadata = buildPageMeta({
  title: 'Blog',
  description:
    'Read tips, stories, and grocery insights from BestFood City — healthy eating, smart shopping, and more.',
  pathname: '/blogs',
  keywords: ['blog', 'grocery tips', 'healthy eating', 'BestFood City'],
});

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

function parsePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default async function BlogsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = parsePage(sp.page);

  const res = await fetchBlogs(page);
  const ok = res?.status === true;
  const paginated = res?.data;
  const blogs = ok && paginated ? publishedBlogs(paginated.data ?? []) : [];
  const currentPage = paginated?.current_page ?? page;
  const lastPage = paginated?.last_page ?? 1;

  return (
    <main className="min-h-screen bg-slate-50/50">
      <BlogHero />

      <section className="mx-auto max-w-[95rem] px-4 py-5 sm:px-6 sm:py-6">
        {!ok ? (
          <div
            className="rounded-2xl border border-destructive/25 bg-destructive/5 px-5 py-4 text-sm text-destructive"
            role="alert"
          >
            {res?.message?.trim() ||
              'Could not load blog posts. Please try again later.'}
          </div>
        ) : blogs.length === 0 ? (
          <BlogEmpty />
        ) : (
          <>
            <BlogGrid blogs={blogs} />
            <BlogPagination currentPage={currentPage} lastPage={lastPage} />
          </>
        )}
      </section>
    </main>
  );
}

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  contentPageHref,
  getAllContentPages,
  getContentPageBySlug,
} from '@/lib/content-page';
import { buildPageMeta } from '@/lib/site';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const pages = await getAllContentPages();
  return pages.map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getContentPageBySlug(slug);
  if (!page) {
    return buildPageMeta({
      title: 'Page not found',
      description: 'The requested page could not be found.',
      pathname: contentPageHref(slug),
    });
  }
  return buildPageMeta({
    title: page.meta_title?.trim() || page.title || 'Page',
    description:
      page.meta_description?.trim() ||
      `Read ${page.title ?? 'this page'} on BestFood City.`,
    pathname: contentPageHref(slug),
    keywords: page.meta_keywords
      ?.split(',')
      .map((k) => k.trim())
      .filter(Boolean),
  });
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getContentPageBySlug(slug);
  if (!page) notFound();

  const title = page.title?.trim() || 'Page';

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <header className="mb-6 border-b border-border pb-4 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
        </header>
        {page.content?.trim() ? (
          <article
            className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground sm:prose-base"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : (
          <p className="text-muted-foreground">No content available.</p>
        )}
      </div>
    </main>
  );
}

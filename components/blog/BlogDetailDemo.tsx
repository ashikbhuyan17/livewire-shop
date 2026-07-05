import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Search, Tag } from 'lucide-react';
import {
  blogDetailHref,
  type BlogDetailPost,
  type BlogPost,
} from '@/lib/blog-utils';

type Props = {
  blog: BlogDetailPost;
  relatedPosts: BlogPost[];
};

export default function BlogDetailDemo({ blog, relatedPosts }: Props) {
  return (
    <div className="bg-slate-50/60">
      <div className="mx-auto max-w-[95rem] px-3 py-5 sm:px-4 sm:py-7 lg:px-6">
        <nav
          className="mb-5 flex flex-wrap items-center gap-1 text-xs text-slate-500 sm:text-sm"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/blogs" className="transition hover:text-primary">
            Blogs
          </Link>
          <span className="text-slate-300">/</span>
          <span className="line-clamp-1 font-medium text-slate-800">
            {blog.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem] lg:gap-8">
          <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="relative h-56 w-full bg-slate-50 sm:h-80 lg:h-96">
              {blog.image ? (
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain p-4"
                />
              ) : null}
              {blog.category ? (
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
                  {blog.category}
                </span>
              ) : null}
            </div>

            <div className="p-5 sm:p-7 lg:p-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                {blog.date ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {blog.date}
                  </span>
                ) : null}
                {blog.category ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    {blog.category}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                {blog.title}
              </h1>

              {blog.excerpt ? (
                <p className="mt-5 rounded-xl border-l-4 border-primary bg-primary/5 px-4 py-3 text-[15px] font-medium leading-relaxed text-slate-700">
                  {blog.excerpt}
                </p>
              ) : null}

              {blog.longDescription ? (
                <div
                  className="prose prose-slate mt-5 max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800 sm:prose-base"
                  dangerouslySetInnerHTML={{ __html: blog.longDescription }}
                />
              ) : null}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4 sm:p-5">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Enjoyed this article?
                  </p>
                  <p className="text-xs text-slate-500">
                    Explore more reviews & guides on the Livewire blog.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/blogs"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase text-slate-700 transition hover:border-primary/40 hover:text-primary"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    All Articles
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase text-white transition hover:bg-primary/90"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-[calc(9.75rem+1rem)] lg:self-start">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Link
                href="/blogs"
                className="flex h-12 w-full items-center rounded-xl bg-white pl-11 pr-4 text-sm text-slate-400 shadow-sm ring-1 ring-slate-200 transition hover:ring-primary"
              >
                Search…
              </Link>
            </div>

            {relatedPosts.length > 0 ? (
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <h3 className="border-b border-slate-100 px-4 py-3.5 text-base font-bold text-slate-900">
                  Related Post
                </h3>
                <ul className="divide-y divide-slate-100">
                  {relatedPosts.map((post) => (
                    <li key={post.id}>
                      <Link
                        href={blogDetailHref(post.slug)}
                        className="flex gap-3 p-3 transition hover:bg-slate-50"
                      >
                        <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              sizes="64px"
                              className="object-contain p-1"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-[13px] font-bold leading-snug text-slate-900">
                            {post.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500">
                            {post.excerpt}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link
              href="/blogs"
              className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary to-[#1d4ed8] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-95"
            >
              Back to all blogs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

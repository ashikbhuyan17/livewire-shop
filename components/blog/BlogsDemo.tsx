'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import {
  blogDetailHref,
  type BlogCategory,
  type BlogPost,
} from '@/lib/blog-utils';
import { cn } from '@/lib/utils';

type Props = {
  categories: BlogCategory[];
  blogs: BlogPost[];
  activeCategory: string;
};

export default function BlogsDemo({
  categories,
  blogs,
  activeCategory,
}: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q),
    );
  }, [blogs, query]);

  const sidebarPosts = blogs.slice(0, 6);

  return (
    <div className="bg-slate-50/60">
      <div className="border-b border-slate-200 bg-gradient-to-r from-primary to-[#1d4ed8] py-10 text-center text-white sm:py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Livewire Blog
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/85 sm:text-base">
            Latest tech news, reviews, buying guides, and tips on smartphones &
            gadgets.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[95rem] px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/blogs"
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition sm:text-sm',
              activeCategory === 'all'
                ? 'border-primary bg-primary text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary',
            )}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blogs?category=${encodeURIComponent(cat.slug)}`}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition sm:text-sm',
                activeCategory === cat.slug
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary',
              )}
            >
              {cat.title}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem] lg:gap-8">
          <div>
            {filtered.length === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
                No articles found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((blog) => (
                  <article
                    key={blog.id}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
                  >
                    <Link
                      href={blogDetailHref(blog.slug)}
                      className="relative block h-40 overflow-hidden bg-slate-50 sm:h-44"
                    >
                      {blog.image ? (
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 40vw"
                          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                          No image
                        </div>
                      )}
                      {blog.category ? (
                        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                          {blog.category}
                        </span>
                      ) : null}
                    </Link>
                    <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                      {blog.date ? (
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                          {blog.date}
                        </p>
                      ) : null}
                      <Link href={blogDetailHref(blog.slug)}>
                        <h2 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition group-hover:text-primary sm:text-base">
                          {blog.title}
                        </h2>
                      </Link>
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                        {blog.excerpt}
                      </p>
                      <Link
                        href={blogDetailHref(blog.slug)}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-primary"
                      >
                        See more
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-[calc(9.75rem+1rem)] lg:self-start">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="h-12 w-full rounded-xl bg-white pl-11 pr-4 text-sm shadow-sm outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-primary"
                aria-label="Search articles"
              />
            </div>

            {sidebarPosts.length > 0 ? (
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <h3 className="border-b border-slate-100 px-4 py-3.5 text-base font-bold text-slate-900">
                  Related Post
                </h3>
                <ul className="max-h-[28rem] divide-y divide-slate-100 overflow-y-auto">
                  {sidebarPosts.map((post) => (
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
          </aside>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search, User } from 'lucide-react';
import {
  BLOG_CATEGORIES,
  DEMO_BLOGS,
  DEMO_RELATED_POSTS,
} from '@/lib/pages-demo-data';
import { cn } from '@/lib/utils';

export default function BlogsDemo() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return DEMO_BLOGS.filter((blog) => {
      const matchesCat =
        activeCategory === 'All' || blog.category === activeCategory;
      const matchesQuery =
        !query.trim() ||
        blog.title.toLowerCase().includes(query.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="bg-slate-50/60">
      {/* Hero */}
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
        {/* Category pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['All', ...BLOG_CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition sm:text-sm',
                activeCategory === cat
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem] lg:gap-8">
          {/* Blog grid */}
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
                      href={`/blog-details/${blog.slug}`}
                      className="relative block h-40 overflow-hidden bg-slate-50 sm:h-44"
                    >
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 40vw"
                        className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                        {blog.category}
                      </span>
                    </Link>
                    <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {blog.author}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span>{blog.date}</span>
                      </div>
                      <Link href={`/blog-details/${blog.slug}`}>
                        <h2 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition group-hover:text-primary sm:text-base">
                          {blog.title}
                        </h2>
                      </Link>
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                        {blog.excerpt}
                      </p>
                      <Link
                        href={`/blog-details/${blog.slug}`}
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

          {/* Sidebar */}
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

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <h3 className="border-b border-slate-100 px-4 py-3.5 text-base font-bold text-slate-900">
                Related Post
              </h3>
              <ul className="max-h-[28rem] divide-y divide-slate-100 overflow-y-auto">
                {DEMO_RELATED_POSTS.map((post) => (
                  <li key={post.id}>
                    <Link
                      href="/blogs"
                      className="flex gap-3 p-3 transition hover:bg-slate-50"
                    >
                      <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
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
          </aside>
        </div>
      </div>
    </div>
  );
}

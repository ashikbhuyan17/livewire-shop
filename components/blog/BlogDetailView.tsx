import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import {
  blogsListHref,
  formatBlogDate,
  resolveBlogImage,
  type BlogDetail,
} from '@/lib/blogs';

type Props = {
  blog: BlogDetail;
};

export default function BlogDetailView({ blog }: Props) {
  const imageUrl = resolveBlogImage(blog.image);
  const authorImage = resolveBlogImage(blog.author_image);
  const dateLabel = formatBlogDate(blog.published_date);

  return (
    <article>
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
          <Link
            href={blogsListHref()}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-headerBg"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to blog
          </Link>

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              {dateLabel ? (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" aria-hidden />
                  {dateLabel}
                </span>
              ) : null}
              {blog.author ? (
                <span className="inline-flex items-center gap-2">
                  {authorImage ? (
                    <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
                      <Image
                        src={authorImage}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </span>
                  ) : (
                    <User className="h-4 w-4" aria-hidden />
                  )}
                  <span className="font-medium text-slate-700">{blog.author}</span>
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
              {blog.title}
            </h1>

            {blog.short_description ? (
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                {blog.short_description}
              </p>
            ) : null}
          </header>
        </div>
      </div>

      {imageUrl ? (
        <div className="w-full border-b border-slate-200/80 bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">
          <div className="relative mx-auto max-w-4xl">
            <Image
              src={imageUrl}
              alt={blog.title}
              width={1200}
              height={800}
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="mx-auto h-auto max-h-[min(70vh,560px)] w-full object-contain"
            />
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        {blog.long_description?.trim() ? (
          <div
            className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-headerBg prose-img:rounded-xl sm:prose-lg"
            dangerouslySetInnerHTML={{ __html: blog.long_description }}
          />
        ) : (
          <p className="text-slate-600">No content available for this article.</p>
        )}

        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
          <p className="text-sm font-semibold text-slate-900">
            Enjoyed this article?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Explore more tips and updates on our blog, or shop fresh groceries
            today.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={blogsListHref()}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-headerBg/30 hover:text-headerBg"
            >
              More articles
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-headerBg px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-headerBg/90"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

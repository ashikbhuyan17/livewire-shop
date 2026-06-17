import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  blogDetailHref,
  formatBlogDate,
  resolveBlogImage,
  type BlogListItem,
} from '@/lib/blogs';

type Props = {
  blog: BlogListItem;
};

export default function BlogCard({ blog }: Props) {
  const imageUrl = resolveBlogImage(blog.image);
  const authorImage = resolveBlogImage(blog.author_image);
  const dateLabel = formatBlogDate(blog.published_date);

  return (
    <Card className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={blogDetailHref(blog.slug)} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-contain p-1"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-3 sm:p-3.5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-slate-500">
            {dateLabel ? (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" aria-hidden />
                {dateLabel}
              </span>
            ) : null}
            {blog.author ? (
              <span className="inline-flex min-w-0 items-center gap-1 truncate">
                {authorImage ? (
                  <span className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200">
                    <Image
                      src={authorImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="16px"
                    />
                  </span>
                ) : (
                  <User className="h-3 w-3 shrink-0" aria-hidden />
                )}
                <span className="truncate">{blog.author}</span>
              </span>
            ) : null}
          </div>

          <h2 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-headerBg sm:text-[15px]">
            {blog.title}
          </h2>

          {blog.short_description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
              {blog.short_description}
            </p>
          ) : null}
        </div>
      </Link>
    </Card>
  );
}

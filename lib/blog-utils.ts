export type BlogCategory = {
  id: string;
  title: string;
  slug: string;
  image: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  date: string;
  category?: string;
};

export type BlogDetailPost = BlogPost & {
  longDescription: string;
};

export function blogDetailHref(slug: string): string {
  return `/blogs/${encodeURIComponent(slug.trim())}`;
}

export function formatBlogDate(dateString?: string | null): string {
  if (!dateString?.trim()) return '';
  try {
    return new Date(dateString)
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .toUpperCase()
      .replace(',', ',');
  } catch {
    return dateString;
  }
}

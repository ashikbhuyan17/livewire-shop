import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { CatalogSubcategory } from '@/lib/catalog';

type Props = {
  categorySlug: string;
  subcategories: CatalogSubcategory[];
  activeSubSlug?: string;
};

const pillClass = (active: boolean) =>
  cn(
    'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
    active
      ? 'border-primary bg-primary text-primary-foreground'
      : 'border-border bg-background text-foreground hover:border-primary/50',
  );

export default function SubcategoryPills({
  categorySlug,
  subcategories,
  activeSubSlug,
}: Props) {
  if (!subcategories.length) return null;

  const base = `/category/${categorySlug}`;
  const allActive = !activeSubSlug;

  return (
    <nav
      aria-label="Subcategories"
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
    >
      {allActive ? (
        <span
          aria-current="page"
          className={pillClass(true)}
        >
          All
        </span>
      ) : (
        <Link prefetch href={base} className={pillClass(false)}>
          All
        </Link>
      )}
      {subcategories.map((sub) => {
        const slug = sub.slug ?? '';
        if (!slug) return null;
        const active = activeSubSlug === slug;
        const href = `${base}/subcategory/${slug}`;
        if (active) {
          return (
            <span
              key={slug}
              aria-current="page"
              className={pillClass(true)}
            >
              {sub.name}
            </span>
          );
        }
        return (
          <Link key={slug} prefetch href={href} className={pillClass(false)}>
            {sub.name}
          </Link>
        );
      })}
    </nav>
  );
}

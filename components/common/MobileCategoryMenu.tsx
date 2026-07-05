'use client';

import CategorySidebar from '@/components/common/CategorySidebar';
import type { CategoryMenuItem } from '@/fetch/buildCategoryMenu';

type Props = {
  categories: CategoryMenuItem[];
  className?: string;
};

/** Shared mobile category UI — bottom nav drawer, header menu & footer */
export default function MobileCategoryMenu({ categories, className }: Props) {
  if (categories.length === 0) return null;

  return (
    <CategorySidebar
      isCollapsible
      embedded
      categories={categories}
      className={className}
    />
  );
}

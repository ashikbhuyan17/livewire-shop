'use client';

import Link from 'next/link';
import MobileCategoryMenu from '@/components/common/MobileCategoryMenu';
import type { CategoryMenuItem } from '@/fetch/buildCategoryMenu';

type Props = {
  categories: CategoryMenuItem[];
};

export default function FooterCategories({ categories }: Props) {
  if (categories.length === 0) return null;

  const footerList = categories.slice(0, 8);

  return (
    <>
      <div className="hidden lg:block">
        <ul className="space-y-2.5 text-sm">
          {footerList.map((category) => (
            <li key={category.slug}>
              <Link
                href={category.slug}
                className="text-blue-50/85 transition hover:translate-x-0.5 hover:text-white"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:hidden overflow-hidden rounded-2xl bg-white p-1 shadow-sm">
        <MobileCategoryMenu categories={footerList} />
      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import MobileCategoryMenu from '@/components/common/MobileCategoryMenu';
import type { CategoryMenuItem } from '@/fetch/buildCategoryMenu';
import { resolveApiImage } from '@/lib/home-banners';
import { cn } from '@/lib/utils';

type Props = {
  categories: CategoryMenuItem[];
};

const scrollStyles =
  '[scrollbar-width:thin] [scrollbar-color:#FEB300_#f8fafc] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-secondary/80 [&::-webkit-scrollbar-track]:bg-transparent';

function DesktopCategoryMegaMenu({ categories }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
    setHoveredIndex(null);
  }, [categories]);

  const active = categories[activeIndex] ?? categories[0];
  const subcategories = active?.subcategories ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/5">
      <div className="flex h-[23rem]">
        <aside
          className={cn(
            'w-[10.75rem] shrink-0 border-r border-slate-100 bg-secondary/10',
            scrollStyles,
            'overflow-y-auto py-2',
          )}
        >
          <nav aria-label="Category list" className="space-y-0.5 px-2">
            {categories.map((category, index) => {
              const isActive = index === activeIndex;
              const isHovered = hoveredIndex === index;

              return (
                <button
                  key={category.slug}
                  type="button"
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    setActiveIndex(index);
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className="group relative w-full px-1 py-0.5 text-left"
                >
                  <span
                    className={cn(
                      'relative flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-secondary/30 font-semibold text-slate-900 shadow-sm ring-1 ring-secondary/25'
                        : 'text-slate-600 group-hover:bg-secondary/15 group-hover:text-slate-900',
                      isHovered && !isActive && 'translate-x-0.5',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-200',
                        isActive
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-60',
                      )}
                      aria-hidden
                    />
                    <span className="truncate pl-1 transition-transform duration-200 group-hover:translate-x-0.5">
                      {category.name}
                    </span>
                    <ChevronRight
                      className={cn(
                        'ml-auto h-3.5 w-3.5 shrink-0 transition-all duration-200',
                        isActive
                          ? 'translate-x-0 text-primary opacity-100'
                          : 'translate-x-[-4px] text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:text-primary/70 group-hover:opacity-100',
                      )}
                      aria-hidden
                    />
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-2.5">
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Browse
              </p>
              <h3 className="truncate text-base font-bold text-slate-900">
                {active.name}
              </h3>
            </div>
            <Link
              href={active.slug}
              className="group inline-flex shrink-0 items-center gap-0.5 rounded-md px-2 py-1 text-xs font-bold text-primary transition-all hover:bg-primary/5 hover:text-primary/90"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div
            className={cn(
              'min-h-0 flex-1 overflow-y-auto px-4 py-4',
              scrollStyles,
            )}
          >
            {subcategories.length > 0 ? (
              <div className="grid grid-cols-3 justify-items-center gap-2.5">
                {subcategories.map((sub) => {
                  const imageSrc = resolveApiImage(sub.icon);
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="group w-[5.25rem]"
                    >
                      <div className="flex h-full flex-col items-center justify-center rounded-lg border border-slate-200/90 bg-white px-2 py-2.5 text-center transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/35 group-hover:bg-primary/[0.03] group-hover:shadow-[0_6px_16px_rgba(37,99,235,0.1)]">
                        <div className="flex h-11 w-full items-center justify-center">
                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={sub.name}
                              width={64}
                              height={64}
                              className="mx-auto max-h-10 w-auto max-w-[3.5rem] object-contain transition-transform duration-200 group-hover:scale-105"
                            />
                          ) : (
                            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-xs font-bold text-slate-400 ring-1 ring-slate-200/80">
                              {sub.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="mt-0.5 line-clamp-2 w-full text-center text-[11px] font-semibold leading-tight text-slate-700 transition-colors duration-200 group-hover:text-primary">
                          {sub.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full flex-col items-start justify-center gap-3 px-4 text-left">
                <p className="text-sm text-slate-500">
                  Explore our full {active.name.toLowerCase()} collection.
                </p>
                <Link
                  href={active.slug}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  Shop {active.name}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryMegaMenu({ categories }: Props) {
  if (categories.length === 0) return null;

  return (
    <>
      <div className="hidden lg:block">
        <DesktopCategoryMegaMenu categories={categories} />
      </div>
      <div className="lg:hidden">
        <MobileCategoryMenu categories={categories} />
      </div>
    </>
  );
}

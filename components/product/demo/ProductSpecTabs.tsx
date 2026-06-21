'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { STATIC_PRODUCT } from '@/lib/product-demo-data';
import { cn } from '@/lib/utils';

type Tab = 'specification' | 'description';

export default function ProductSpecTabs() {
  const [tab, setTab] = useState<Tab>('specification');
  const [openSections, setOpenSections] = useState<string[]>([
    STATIC_PRODUCT.specifications[0].category,
  ]);

  const toggleSection = (category: string) => {
    setOpenSections((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <section className="mt-10 sm:mt-12" aria-label="Product details">
      <div className="flex gap-0 overflow-hidden rounded-t-xl border border-b-0 border-slate-200">
        {(
          [
            { id: 'specification' as const, label: 'Specification' },
            { id: 'description' as const, label: 'Description' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wide transition sm:px-6 sm:py-3.5',
              tab === t.id
                ? 'bg-primary text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-b-xl border border-slate-200 bg-white p-4 sm:p-6">
        {tab === 'description' ? (
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
            {STATIC_PRODUCT.description}
          </p>
        ) : (
          <div className="space-y-2">
            {STATIC_PRODUCT.specifications.map((section) => {
              const isOpen = openSections.includes(section.category);
              return (
                <div
                  key={section.category}
                  className="overflow-hidden rounded-lg border border-slate-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.category)}
                    className="flex w-full items-center justify-between bg-secondary/30 px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-800"
                  >
                    {section.category}
                    {isOpen ? (
                      <Minus className="h-4 w-4 shrink-0" />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <dl className="divide-y divide-slate-100">
                      {section.items.map((item) => (
                        <div
                          key={item.label}
                          className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[minmax(8rem,30%)_1fr] sm:gap-4"
                        >
                          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-sm">
                            {item.label}
                          </dt>
                          <dd className="text-sm text-slate-800">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

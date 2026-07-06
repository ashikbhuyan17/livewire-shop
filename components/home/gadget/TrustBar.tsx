import Image from 'next/image';
import Link from 'next/link';
import type { AuthenticityItem } from '@/lib/authenticity';
import { TRUST_ITEMS } from '@/lib/home-demo-data';
import { BadgeCheck, CreditCard, RefreshCw, Tag, Truck } from 'lucide-react';

const ICONS = {
  shield: BadgeCheck,
  truck: Truck,
  'credit-card': CreditCard,
  refresh: RefreshCw,
  tag: Tag,
} as const;

type Props = {
  items: AuthenticityItem[];
};

export default function TrustBar({ items }: Props) {
  const displayItems =
    items.length > 0
      ? items
      : TRUST_ITEMS.map((item, index) => ({
          id: String(index),
          title: item.label,
          image: '',
        }));

  return (
    <section className="px-1 sm:px-4 lg:px-6">
      <div
        className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 p-2 shadow-sm sm:mt-6 sm:px-6"
        aria-label="Store guarantees"
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {displayItems.map((item, index) => {
            const fallbackIcon =
              TRUST_ITEMS[index]?.icon ?? TRUST_ITEMS[0]?.icon ?? 'shield';
            const Icon = ICONS[fallbackIcon as keyof typeof ICONS];

            return (
              <li
                key={item.id}
                className="flex items-center gap-2.5 rounded-xl bg-white/70 px-3 py-2.5 ring-1 ring-blue-100/80 sm:gap-3 sm:px-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      width={36}
                      height={36}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <Icon className="h-4 w-4" strokeWidth={2.25} />
                  )}
                </span>
                <span className="text-xs font-semibold leading-tight text-slate-800 sm:text-sm">
                  {item.title}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

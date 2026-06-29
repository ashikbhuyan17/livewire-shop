'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Store } from 'lucide-react';
import { DEMO_OUTLETS } from '@/lib/pages-demo-data';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function OutletsDemo() {
  const handleDetails = (name: string) => {
    toast.info(`Details for ${name} coming soon.`);
  };

  return (
    <div className="mx-auto max-w-[95rem] px-3 py-5 sm:px-4 sm:py-7 lg:px-6">
      {/* Breadcrumb */}
      <nav
        className="mb-5 flex flex-wrap items-center gap-1 text-xs text-slate-500 sm:text-sm"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="transition hover:text-primary">
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-800">Shop Location</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Our Outlets
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Visit any Livewire store across Bangladesh for genuine products &
          after-sales support.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_OUTLETS.map((outlet) => (
          <article
            key={outlet.id}
            className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
              <Image
                src={outlet.image}
                alt={outlet.name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              {outlet.offDay ? (
                <span className="absolute right-3 top-3 rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                  Off: {outlet.offDay}
                </span>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <h2 className="flex items-start gap-2 text-base font-bold leading-snug text-slate-900">
                <Store className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {outlet.name}
              </h2>

              <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-slate-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                {outlet.address}
              </p>

              <a
                href={`tel:${outlet.phone}`}
                className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-primary"
              >
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                {outlet.phone}
              </a>

              <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                <Button
                  asChild
                  className="h-10 rounded-lg bg-slate-900 text-xs font-bold uppercase text-secondary hover:bg-slate-800"
                >
                  <a href={outlet.mapUrl} target="_blank" rel="noopener noreferrer">
                    Shop Map
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDetails(outlet.name)}
                  className="h-10 rounded-lg border-secondary/60 bg-secondary/20 text-xs font-bold uppercase text-slate-900 hover:bg-secondary/40"
                >
                  Show Details
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

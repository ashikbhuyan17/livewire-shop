'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Store } from 'lucide-react';
import type { BusinessLocation } from '@/lib/business-locations';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  locations: BusinessLocation[];
};

export default function OutletsDemo({ locations }: Props) {
  const [activeLocation, setActiveLocation] = useState<BusinessLocation | null>(
    null,
  );

  return (
    <div className="mx-auto max-w-[95rem] px-3 py-5 sm:px-4 sm:py-7 lg:px-6">
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

      {locations.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
          No outlet locations available right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((outlet) => (
            <article
              key={outlet.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                {outlet.image ? (
                  <Image
                    src={outlet.image}
                    alt={outlet.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-100">
                    <Store className="h-10 w-10 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h2 className="flex items-start gap-2 text-base font-bold leading-snug text-slate-900">
                  <Store className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {outlet.title}
                </h2>

                <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-slate-500">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  {outlet.address}
                </p>

                {outlet.phone ? (
                  <a
                    href={`tel:${outlet.phone}`}
                    className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-primary"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-primary" />
                    {outlet.phone}
                  </a>
                ) : null}

                <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                  <Button
                    asChild
                    className="h-10 rounded-lg bg-slate-900 text-xs font-bold uppercase text-secondary hover:bg-slate-800"
                  >
                    <a
                      href={outlet.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Shop Map
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveLocation(outlet)}
                    className="h-10 rounded-lg border-secondary/60 bg-secondary/20 text-xs font-bold uppercase text-slate-900 hover:bg-secondary/40"
                  >
                    Show Details
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog
        open={activeLocation != null}
        onOpenChange={(open) => {
          if (!open) setActiveLocation(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          {activeLocation ? (
            <>
              <DialogHeader>
                <DialogTitle>{activeLocation.title}</DialogTitle>
              </DialogHeader>
              {activeLocation.description ? (
                <p className="text-sm leading-relaxed text-slate-600">
                  {activeLocation.description}
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  No additional details available.
                </p>
              )}
              {activeLocation.mapEmbedCode ? (
                <div
                  className="mt-2 overflow-hidden rounded-xl [&>iframe]:aspect-video [&>iframe]:h-auto [&>iframe]:w-full"
                  dangerouslySetInnerHTML={{
                    __html: activeLocation.mapEmbedCode,
                  }}
                />
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

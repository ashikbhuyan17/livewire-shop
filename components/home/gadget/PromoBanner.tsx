import Link from 'next/link';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="mt-10 sm:mt-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 py-10 text-white sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-100 ring-1 ring-white/20">
            <Sparkles className="h-3.5 w-3.5" />
            Bangladesh&apos;s trusted gadget destination
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Why shop with us?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Genuine products, EMI up to 36 months, 2-year replacement warranty, and
            the best prices on mobiles, laptops, and gadgets — delivered fast
            across Bangladesh.
          </p>
          <div className="mt-6">
            <Link
              href="/our-outlets"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-primary/90"
            >
              <ShieldCheck className="h-4 w-4" />
              Visit our stores
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

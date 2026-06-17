import type { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE_BRAND_SHORT } from '@/lib/site';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

const PERKS = [
  {
    icon: Truck,
    title: 'Fast doorstep delivery',
    description: 'Same-day grocery delivery across major cities.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted by thousands',
    description: 'Secure checkout, real-time order tracking, and easy returns.',
  },
  {
    icon: Sparkles,
    title: 'Daily flash deals',
    description: 'Save more with hand-picked deals updated every day.',
  },
];

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: Props) {
  return (
    <main className="relative min-h-[calc(100dvh-5.5rem)] overflow-hidden bg-slate-50 lg:min-h-[calc(100dvh-7.25rem)]">
      {/* Soft ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(45,122,39,0.12),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(255,215,0,0.12),_transparent_60%)]"
      />

      <div className="mx-auto flex min-h-[calc(100dvh-5.5rem)] w-full max-w-[95rem] flex-col items-stretch px-4 py-6 sm:px-6 lg:min-h-[calc(100dvh-7.25rem)] lg:py-10">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-headerBg"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-headerBg text-white shadow-sm">
            <span className="text-base font-bold">B</span>
          </span>
          <span className="hidden sm:inline">{SITE_BRAND_SHORT}</span>
        </Link>

        <div className="flex flex-1 items-center justify-center py-6 lg:py-10">
          <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.25)] ring-1 ring-slate-200/70 lg:grid-cols-2">
            {/* Decorative side */}
            <aside
              aria-hidden
              className={cn(
                'relative hidden flex-col gap-10 p-10 lg:flex',
                'bg-gradient-to-br from-headerBg via-[#1f5c1c] to-[#16401a] text-white',
              )}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

              <div className="relative">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
                  {SITE_BRAND_SHORT}
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight">
                  Fresh groceries,
                  <br />
                  delivered with care.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
                  Join thousands of happy customers shopping daily essentials,
                  flash deals, and trusted brands — all in one place.
                </p>
              </div>

              <ul className="relative space-y-4">
                {PERKS.map(({ icon: Icon, title: t, description }) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{t}</p>
                      <p className="text-xs text-white/70">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Form side */}
            <section className="flex flex-col justify-center p-6 sm:p-10">
              <header className="mb-6">
                {eyebrow ? (
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-headerBg">
                    {eyebrow}
                  </p>
                ) : null}
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
                ) : null}
              </header>

              {children}

              {footer ? (
                <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
                  {footer}
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

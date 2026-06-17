import { Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SITE_BRAND_SHORT } from '@/lib/site';

export default function GoogleCallbackLoading() {
  return (
    <main className="relative min-h-[calc(100dvh-5.5rem)] overflow-hidden bg-slate-50 lg:min-h-[calc(100dvh-7.25rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(45,122,39,0.14),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(255,215,0,0.14),_transparent_60%)]"
      />

      <div className="mx-auto flex min-h-[calc(100dvh-5.5rem)] w-full max-w-lg flex-col items-center justify-center px-4 py-12 sm:px-6 lg:min-h-[calc(100dvh-7.25rem)]">
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.22)] ring-1 ring-slate-200/80">
          <div className="bg-gradient-to-br from-headerBg via-[#1f5c1c] to-[#16401a] px-8 py-7 text-center text-white">
            <Link
              href="/"
              className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label={`${SITE_BRAND_SHORT} home`}
            >
              B
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              {SITE_BRAND_SHORT}
            </p>
            <h1 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              Signing you in
            </h1>
          </div>

          <div className="flex flex-col items-center px-8 py-10 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span
                className="absolute inset-0 rounded-full border-2 border-headerBg/15"
                aria-hidden
              />
              <span
                className="absolute inset-1 animate-ping rounded-full border border-headerBg/25"
                aria-hidden
              />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-headerBg/10">
                <Loader2
                  className="h-7 w-7 animate-spin text-headerBg"
                  aria-hidden
                />
              </span>
            </div>

            <p className="mt-6 text-base font-medium text-slate-800">
              Finishing your sign-in
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
              We&apos;re securing your session. You&apos;ll be redirected in a
              moment.
            </p>

            <div
              className="mt-8 flex items-center gap-1.5"
              aria-hidden
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-headerBg/70 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>

            <p className="mt-8 inline-flex items-center gap-1.5 text-xs text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-secondary" aria-hidden />
              Encrypted connection
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

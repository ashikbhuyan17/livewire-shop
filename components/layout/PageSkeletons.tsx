export function HeaderSkeleton() {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 shadow-md" aria-hidden>
      <div className="bg-primary px-3 py-2.5 sm:px-4 lg:px-6">
        <div className="mx-auto flex max-w-[95rem] items-center gap-3">
          <div className="h-9 w-28 animate-pulse rounded-lg bg-white/20" />
          <div className="h-10 min-w-0 flex-1 animate-pulse rounded-lg bg-white/15" />
          <div className="h-10 w-10 animate-pulse rounded-lg bg-white/20" />
        </div>
      </div>
      <div className="hidden h-12 border-b border-slate-200 bg-white lg:block">
        <div className="mx-auto flex h-full max-w-[95rem] items-center gap-2 px-6">
          <div className="h-9 w-9 animate-pulse rounded-md bg-slate-100" />
          <div className="h-4 flex-1 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function PageListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="mx-auto max-w-[95rem] animate-pulse px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
      <div className="mb-4 h-4 w-40 rounded bg-slate-200" />
      <div className="mb-2 h-8 w-56 rounded bg-slate-200" />
      <div className="mb-6 h-4 w-72 max-w-full rounded bg-slate-100" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl bg-slate-100">
            <div className="aspect-[4/3] bg-slate-200" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-full rounded bg-slate-200" />
              <div className="h-3 w-2/3 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageArticleSkeleton() {
  return (
    <div className="mx-auto max-w-[95rem] animate-pulse px-3 py-4 sm:px-4 lg:px-6">
      <div className="mb-4 h-4 w-48 rounded bg-slate-200" />
      <div className="aspect-[21/9] rounded-2xl bg-slate-200" />
      <div className="mx-auto mt-6 max-w-3xl space-y-3">
        <div className="h-8 w-full rounded bg-slate-200" />
        <div className="h-4 w-32 rounded bg-slate-100" />
        <div className="space-y-2 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 w-full rounded bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageFormSkeleton() {
  return (
    <div className="mx-auto max-w-xl animate-pulse px-4 py-6">
      <div className="mb-6 h-8 w-48 rounded bg-slate-200" />
      <div className="space-y-4 rounded-2xl border border-slate-200 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-11 rounded-lg bg-slate-100" />
        ))}
        <div className="h-28 rounded-lg bg-slate-100" />
        <div className="h-11 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

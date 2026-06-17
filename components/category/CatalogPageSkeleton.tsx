export default function CatalogPageSkeleton() {
  return (
    <div className="mx-auto max-w-[95rem] px-2 py-4 sm:px-4">
      <div className="mb-4 flex animate-pulse justify-between border-b border-gray-200 pb-3">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
      <div className="mb-6 h-36 animate-pulse rounded-sm bg-muted sm:h-44 md:h-52" />
      <div className="space-y-4 rounded-sm border border-border bg-white p-4">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>
        <div className="h-14 animate-pulse rounded-lg bg-muted/80" />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square animate-pulse rounded-xl bg-muted" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

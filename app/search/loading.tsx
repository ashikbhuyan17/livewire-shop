export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-[95rem] px-2 py-4 sm:px-4">
      <div className="mb-4 h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="mb-6 h-14 max-w-3xl animate-pulse rounded-xl bg-muted" />
      <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-xl bg-muted/80"
          />
        ))}
      </div>
    </div>
  );
}

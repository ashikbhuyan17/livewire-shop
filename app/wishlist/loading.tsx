export default function WishlistLoading() {
  return (
    <main className="min-h-screen max-md:pb-24">
      <div className="mx-auto w-full max-w-[95rem] space-y-5 px-4 py-4">
        <div
          className="h-14 w-full animate-pulse rounded border bg-muted"
          aria-hidden
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-xl bg-muted"
              aria-hidden
            />
          ))}
        </div>
      </div>
    </main>
  );
}

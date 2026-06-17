export default function HomeDeferredSkeleton() {
  return (
    <div className="space-y-4 py-2">
      <div className="h-48 animate-pulse rounded-lg bg-muted/80" />
      <div className="h-48 animate-pulse rounded-lg bg-muted/80" />
      <div className="h-32 animate-pulse rounded-lg bg-muted/60" />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    </div>
  );
}

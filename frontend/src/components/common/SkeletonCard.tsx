export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-5 w-16 bg-muted rounded-full" />
      </div>
      <div className="h-2 bg-muted rounded-full mb-3" />
      <div className="h-3 w-24 bg-muted rounded" />
    </div>
  )
}

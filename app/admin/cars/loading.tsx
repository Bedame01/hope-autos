export default function Loading() {
  return (
    <div className="space-y-7" aria-label="Loading car inventory">
      <div className="space-y-3">
        <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
        <div className="h-10 w-64 max-w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-full bg-muted" />
      </div>
      <div className="h-14 animate-pulse rounded-2xl bg-card" />
      <div className="min-h-72 animate-pulse rounded-3xl border border-border/80 bg-card" />
    </div>
  )
}

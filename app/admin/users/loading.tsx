export default function Loading() {
  return (
    <div className="space-y-7" aria-label="Loading user management">
      <div className="space-y-3">
        <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-10 w-72 max-w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-24 animate-pulse rounded-3xl bg-card" />
        <div className="h-24 animate-pulse rounded-3xl bg-card" />
      </div>
      <div className="min-h-72 animate-pulse rounded-3xl border border-border/80 bg-card" />
    </div>
  )
}

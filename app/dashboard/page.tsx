"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Heart, Loader2, MessageSquare, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Car, Inquiry } from "@/lib/types"
import CarCard from "@/app/components/CarCard"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  const refreshData = useCallback(async (background = false) => {
    if (background) setRefreshing(true)
    else setLoading(true)
    setError("")

    try {
      const [favoritesResponse, inquiriesResponse] = await Promise.all([
        fetch("/api/user/favorites", { cache: "no-store" }),
        fetch("/api/user/inquiries", { cache: "no-store" }),
      ])
      const [favoritesData, inquiriesData] = await Promise.all([
        favoritesResponse.json(),
        inquiriesResponse.json(),
      ])

      if (!favoritesResponse.ok) throw new Error(favoritesData.error || "Unable to load favorites.")
      if (!inquiriesResponse.ok) throw new Error(inquiriesData.error || "Unable to load inquiries.")

      setFavoriteCars(favoritesData)
      setInquiries(inquiriesData)
    } catch (loadError) {
      console.error("Error loading dashboard data:", loadError)
      setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard data.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard")
    } else if (status === "authenticated") {
      void refreshData()
    }
  }, [status, router, refreshData])

  useEffect(() => {
    if (status !== "authenticated") return
    const handleFocus = () => void refreshData(true)
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [status, refreshData])

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-muted/20 px-4">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
      </main>
    )
  }

  if (!session) return null

  const activeInquiries = inquiries.filter((inquiry) => inquiry.status !== "closed").length

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Your Hope Autos</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Welcome back{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Your saved vehicles and conversations, all in one place.
            </p>
          </div>
          <Button variant="outline" className="w-fit rounded-full" onClick={() => void refreshData(true)} disabled={refreshing}>
            {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </div>

        {error && (
          <div className="flex flex-col gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
            <p role="alert">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void refreshData()} className="w-fit rounded-full">
              Try again
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5 sm:p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                <Heart className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Favorite vehicles</p>
                <p className="text-2xl font-semibold tracking-tight text-foreground">{favoriteCars.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5 sm:p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Open inquiries</p>
                <p className="text-2xl font-semibold tracking-tight text-foreground">{activeInquiries}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <section aria-labelledby="favorites-title">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Saved for later</p>
              <h2 id="favorites-title" className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Your favorites</h2>
            </div>
            <Button variant="ghost" size="sm" asChild className="shrink-0 rounded-full">
              <Link href="/favorites">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          {favoriteCars.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {favoriteCars.slice(0, 3).map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          ) : (
            <Card className="rounded-3xl border-dashed border-border bg-card shadow-none">
              <CardContent className="px-6 py-10 text-center">
                <Heart className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="font-medium text-foreground">No saved vehicles yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Tap the heart on a listing to add it here.</p>
                <Button asChild className="mt-5 rounded-full px-5"><Link href="/cars">Browse inventory</Link></Button>
              </CardContent>
            </Card>
          )}
        </section>

        <section aria-labelledby="inquiries-title">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Stay in touch</p>
              <h2 id="inquiries-title" className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Recent inquiries</h2>
            </div>
            <Button variant="outline" size="sm" asChild className="shrink-0 rounded-full">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              {inquiries.length > 0 ? (
                <div className="divide-y divide-border">
                  {inquiries.slice(0, 4).map((inquiry) => (
                    <article key={inquiry.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-foreground">
                            {inquiry.car ? `${inquiry.car.year} ${inquiry.car.make} ${inquiry.car.model}` : "General inquiry"}
                          </h3>
                          <Badge variant={inquiry.status === "new" ? "default" : inquiry.status === "contacted" ? "secondary" : "outline"} className="rounded-full capitalize">
                            {inquiry.status}
                          </Badge>
                        </div>
                        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{inquiry.message}</p>
                      </div>
                      <time className="shrink-0 text-xs text-muted-foreground" dateTime={inquiry.createdAt}>
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </time>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="font-medium text-foreground">No inquiries yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Questions about a car? We’re happy to help.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}

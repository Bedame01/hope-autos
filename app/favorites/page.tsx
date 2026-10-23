"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Heart, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Car } from "@/lib/types"
import CarCard from "@/app/components/CarCard"

export default function FavoritesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const loadFavorites = useCallback(async () => {
    setError("")
    try {
      const response = await fetch("/api/user/favorites")
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to load your favorites.")
      setCars(data)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load your favorites.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/favorites")
    } else if (status === "authenticated") {
      void loadFavorites()
    }
  }, [status, router, loadFavorites])

  const removeFavorite = async (carId: string) => {
    setRemovingId(carId)
    setError("")
    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to remove this favorite.")
      setCars((favorites) => favorites.filter((car) => car.id !== carId))
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Unable to remove this favorite.")
    } finally {
      setRemovingId(null)
    }
  }

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-muted/20 px-4">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-muted-foreground">Loading your saved vehicles...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Your shortlist</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Favorite vehicles</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {cars.length} saved {cars.length === 1 ? "vehicle" : "vehicles"} ready for another look.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full">
            <Link href="/cars">Browse inventory <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
            {error}
          </div>
        )}

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cars.map((car) => (
              <div key={car.id} className="relative">
                <CarCard car={car} />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-label={`Remove ${car.year} ${car.make} ${car.model} from favorites`}
                  title="Remove from favorites"
                  disabled={removingId === car.id}
                  onClick={() => void removeFavorite(car.id)}
                  className="absolute left-3 top-3 z-10 h-10 w-10 rounded-full border-white/70 bg-white/95 text-red-600 shadow-sm hover:bg-white"
                >
                  {removingId === car.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Card className="rounded-3xl border-dashed border-border bg-card shadow-none">
            <CardContent className="px-6 py-14 text-center sm:py-20">
              <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
                <Heart className="h-6 w-6" />
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Your shortlist starts here</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Save vehicles you like and compare them here whenever you’re ready.
              </p>
              <Button asChild className="mt-6 rounded-full px-6">
                <Link href="/cars">Explore vehicles</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

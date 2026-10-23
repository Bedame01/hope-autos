"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Car, FilterOptions } from "@/lib/types"
import CarCard from "../components/CarCard"
import Footer from "../components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Loader2, Search, SlidersHorizontal, X } from "lucide-react"

const initialFilters: FilterOptions = {
  fuelType: "Any",
  bodyType: "Any",
  transmission: "Any",
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState<FilterOptions>(initialFilters)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const requestId = useRef(0)
  const debouncedSearchQuery = useDebounce(searchQuery, 350)
  const debouncedFilters = useDebounce(filters, 250)

  const fetchCars = useCallback(async (searchFilters: FilterOptions, query: string) => {
    const currentRequest = ++requestId.current
    setSearching(true)
    setError("")

    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set("search", query.trim())

      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value && value !== "Any") params.set(key, value.toString())
      })

      const response = await fetch(`/api/cars?${params.toString()}`)
      if (!response.ok) throw new Error(`Inventory request failed (${response.status})`)

      const data: unknown = await response.json()
      if (!Array.isArray(data)) throw new Error("The inventory response was not in the expected format.")

      if (currentRequest === requestId.current) setCars(data as Car[])
    } catch (fetchError) {
      console.error("Error fetching cars:", fetchError)
      if (currentRequest === requestId.current) {
        setError("We couldn’t load the inventory. Please try again.")
      }
    } finally {
      if (currentRequest === requestId.current) {
        setSearching(false)
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void fetchCars(debouncedFilters, debouncedSearchQuery)
  }, [debouncedFilters, debouncedSearchQuery, fetchCars])

  const handleFilterChange = (key: keyof FilterOptions, value: string | number) => {
    setFilters((current) => ({ ...current, [key]: value || "Any" }))
  }

  const clearFilters = () => {
    setFilters(initialFilters)
    setSearchQuery("")
  }

  const activeFiltersCount =
    Object.values(filters).filter((value) => value && value !== "Any").length + (searchQuery.trim() ? 1 : 0)

  const toggleBodyType = (bodyType: string) => {
    setFilters((current) => ({ ...current, bodyType: current.bodyType === bodyType ? "Any" : bodyType }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 sm:px-6 lg:px-10 lg:pt-8">
        <section
          id="hope-cars-hero"
          className="relative isolate overflow-hidden rounded-[2rem] bg-[#171717] bg-cover bg-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16"
          style={{
            backgroundImage: "linear-gradient(90deg, rgba(15,15,15,.92) 0%, rgba(15,15,15,.72) 48%, rgba(15,15,15,.2) 100%), url('/image/herocar5.jpg')",
            color: "#fff",
          }}
        >
          <div className="relative max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-500 opacity-70">
              <span className="h-px w-7 bg-blue-500" /> Hope Autos collection
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">Find the car that feels like you.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 opacity-75 sm:text-base sm:leading-7">
              Explore our handpicked range of quality vehicles. Compare the details, find your favourite, and let’s get you moving.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs opacity-75 sm:text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ffffff]/20 bg-[#ffffff]/10 px-3.5 py-2 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Carefully selected
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ffffff]/20 bg-[#ffffff]/10 px-3.5 py-2 backdrop-blur">
                <Filter className="h-3.5 w-3.5" /> Made easy to explore
              </span>
            </div>
          </div>
        </section>

        <section aria-label="Search and filter inventory" className="relative z-10 mx-auto -mt-5 max-w-6xl rounded-3xl border border-border bg-card p-4 shadow-lg shadow-black/[0.04] sm:-mt-7 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search vehicles</span>
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search make, model, year, or keyword"
                className="h-12 rounded-2xl border-border bg-background pl-11 pr-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            <Button
              type="button"
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters((visible) => !visible)}
              aria-expanded={showFilters}
              className={`h-12 rounded-2xl px-5 ${showFilters ? "bg-blue-500 text-background hover:bg-blue-600" : ""}`}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-background/20 px-1 text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-muted-foreground">Popular:</span>
            {["SUV", "Sedan", "Coupe", "Hatchback"].map((bodyType) => (
              <button
                key={bodyType}
                type="button"
                aria-pressed={filters.bodyType === bodyType}
                onClick={() => toggleBodyType(bodyType)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  filters.bodyType === bodyType
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {bodyType}
              </button>
            ))}
            {activeFiltersCount > 0 && (
              <button type="button" onClick={clearFilters} className="ml-auto text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Clear all
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="filter-make" className="mb-1.5 block text-xs font-medium text-muted-foreground">Make</label>
                <Input id="filter-make" placeholder="e.g. Toyota" value={filters.make || ""} onChange={(event) => handleFilterChange("make", event.target.value)} />
              </div>
              <div>
                <label htmlFor="filter-model" className="mb-1.5 block text-xs font-medium text-muted-foreground">Model</label>
                <Input id="filter-model" placeholder="e.g. Camry" value={filters.model || ""} onChange={(event) => handleFilterChange("model", event.target.value)} />
              </div>
              <div>
                <label htmlFor="filter-min-price" className="mb-1.5 block text-xs font-medium text-muted-foreground">Minimum price</label>
                <Input id="filter-min-price" type="number" min="0" placeholder="No minimum" value={filters.minPrice || ""} onChange={(event) => handleFilterChange("minPrice", Number.parseInt(event.target.value, 10) || "")} />
              </div>
              <div>
                <label htmlFor="filter-max-price" className="mb-1.5 block text-xs font-medium text-muted-foreground">Maximum price</label>
                <Input id="filter-max-price" type="number" min="0" placeholder="No maximum" value={filters.maxPrice || ""} onChange={(event) => handleFilterChange("maxPrice", Number.parseInt(event.target.value, 10) || "")} />
              </div>
              <div>
                <label htmlFor="filter-min-year" className="mb-1.5 block text-xs font-medium text-muted-foreground">From year</label>
                <Input id="filter-min-year" type="number" min="1900" max="2100" placeholder="Any year" value={filters.minYear || ""} onChange={(event) => handleFilterChange("minYear", Number.parseInt(event.target.value, 10) || "")} />
              </div>
              <div>
                <label htmlFor="filter-max-year" className="mb-1.5 block text-xs font-medium text-muted-foreground">To year</label>
                <Input id="filter-max-year" type="number" min="1900" max="2100" placeholder="Any year" value={filters.maxYear || ""} onChange={(event) => handleFilterChange("maxYear", Number.parseInt(event.target.value, 10) || "")} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Fuel type</label>
                <Select value={filters.fuelType || "Any"} onValueChange={(value) => handleFilterChange("fuelType", value)}>
                  <SelectTrigger><SelectValue placeholder="Any fuel" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any fuel</SelectItem>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Transmission</label>
                <Select value={filters.transmission || "Any"} onValueChange={(value) => handleFilterChange("transmission", value)}>
                  <SelectTrigger><SelectValue placeholder="Any transmission" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any transmission</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Body type</label>
                <div className="flex flex-wrap gap-2">
                  {["SUV", "Sedan", "Hatchback", "Coupe", "Truck", "Convertible"].map((bodyType) => (
                    <button
                      key={bodyType}
                      type="button"
                      aria-pressed={filters.bodyType === bodyType}
                      onClick={() => toggleBodyType(bodyType)}
                      className={`rounded-xl border px-3 py-2 text-xs transition ${
                        filters.bodyType === bodyType ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {bodyType}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="mx-auto mt-12 max-w-6xl" aria-live="polite">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">The collection</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-blue-500 sm:text-3xl">
                {searchQuery ? "Search results" : "Available vehicles"}
              </h2>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              {searching && <Loader2 className="h-4 w-4 animate-spin" />}
              {searching ? "Updating vehicles…" : `${cars.length} vehicle${cars.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {error ? (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center">
              <h3 className="text-lg font-semibold text-foreground">Inventory unavailable</h3>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              <Button className="mt-5 rounded-full" onClick={() => void fetchCars(debouncedFilters, debouncedSearchQuery)}>Try again</Button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="aspect-[4/3] animate-pulse bg-muted" />
                  <div className="space-y-4 p-6">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-14 animate-pulse rounded bg-muted" />
                    <div className="h-10 animate-pulse rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cars.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Search className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-semibold text-foreground">
                {searchQuery ? `No cars matched “${searchQuery}”` : "No vehicles match those filters"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Try a different search or clear some filters to see more of our collection.
              </p>
              {activeFiltersCount > 0 && (
                <Button variant="outline" className="mt-6 rounded-full" onClick={clearFilters}>Clear search and filters</Button>
              )}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  )
}

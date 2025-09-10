"use client"

import { useState, useEffect, useCallback } from "react"
import type { Car, FilterOptions } from "@/lib/types"
import CarCard from "../components/CarCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Loader2, X } from "lucide-react"

// Debounce hook for search delay
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    fuelType: "Any",
    bodyType: "Any",
    transmission: "Any",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Debounce search query with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const debouncedFilters = useDebounce(filters, 300)

  const fetchCars = useCallback(async (searchFilters: FilterOptions, query?: string) => {
    setSearching(true)
    try {
      const params = new URLSearchParams()

      // Add search query
      if (query && query.trim()) {
        params.append("search", query.trim())
      }

      // Add filters - only add non-"Any" values
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value && value !== "Any") {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/cars?${params}`)
      const data = await response.json()
      setCars(data)
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setSearching(false)
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchCars(filters)
  }, [])

  // Search when debounced values change
  useEffect(() => {
    if (!loading) {
      fetchCars(debouncedFilters, debouncedSearchQuery)
    }
  }, [debouncedFilters, debouncedSearchQuery, fetchCars, loading])

  const handleFilterChange = (key: keyof FilterOptions, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || "Any",
    }))
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const clearFilters = () => {
    setFilters({
      fuelType: "Any",
      bodyType: "Any",
      transmission: "Any",
    })
    setSearchQuery("")
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  // Count active filters (excluding "Any" values)
  const activeFiltersCount = Object.values(filters).filter((v) => v && v !== "Any").length + (searchQuery ? 1 : 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Our Inventory</h1>
          <p className="text-lg text-muted-foreground">Browse our selection of quality vehicles</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-2">
            <div className="search-input-container">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by make, model, year, or features..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {searching && (
                  <div className="search-delay-indicator">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="text-sm text-primary font-normal">({activeFiltersCount} active)</span>
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? "Hide" : "Show"} Filters
                </Button>
              </div>
            </div>
          </CardHeader>

          {showFilters && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Make</label>
                  <Input
                    placeholder="e.g., Toyota"
                    value={filters.make || ""}
                    onChange={(e) => handleFilterChange("make", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Model</label>
                  <Input
                    placeholder="e.g., Camry"
                    value={filters.model || ""}
                    onChange={(e) => handleFilterChange("model", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Min Price</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ""}
                    onChange={(e) => handleFilterChange("minPrice", Number.parseInt(e.target.value) || "")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Max Price</label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handleFilterChange("maxPrice", Number.parseInt(e.target.value) || "")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Min Year</label>
                  <Input
                    type="number"
                    placeholder="2000"
                    value={filters.minYear || ""}
                    onChange={(e) => handleFilterChange("minYear", Number.parseInt(e.target.value) || "")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Max Year</label>
                  <Input
                    type="number"
                    placeholder="2024"
                    value={filters.maxYear || ""}
                    onChange={(e) => handleFilterChange("maxYear", Number.parseInt(e.target.value) || "")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Fuel Type</label>
                  <Select
                    value={filters.fuelType || "Any"}
                    onValueChange={(value) => handleFilterChange("fuelType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Body Type</label>
                  <Select
                    value={filters.bodyType || "Any"}
                    onValueChange={(value) => handleFilterChange("bodyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Hatchback">Hatchback</SelectItem>
                      <SelectItem value="Coupe">Coupe</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Convertible">Convertible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Transmission</label>
                  <Select
                    value={filters.transmission || "Any"}
                    onValueChange={(value) => handleFilterChange("transmission", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-muted-foreground">
              {searching ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Searching...
                </span>
              ) : (
                <>
                  Showing {cars.length} vehicle{cars.length !== 1 ? "s" : ""}
                  {searchQuery && <span className="text-primary ml-1">for "{searchQuery}"</span>}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Cars Grid */}
        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? `No cars found for "${searchQuery}"` : "No cars found"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || activeFiltersCount > 0
                ? "Try adjusting your search or filters to see more results."
                : "No vehicles are currently available."}
            </p>
            {(searchQuery || activeFiltersCount > 0) && (
              <Button onClick={clearFilters} variant="outline">
                Clear Search & Filters
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-[var(--border-line)] mt-8 pt-8 md:pt-10 text-center text-sm sm:text-base">
        <p className="text-[var(--text-color)] mb-1.5">
          © {new Date().getFullYear()} Hope Autos Limited. All rights reserved.
        </p>
        <p className="text-[var(--text-color)]">No 1 Nigeria Best Vehicle Dealership</p>
      </div>
    </div>
  )
}

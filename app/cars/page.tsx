"use client"

import { useState, useEffect } from "react"
import type { Car, FilterOptions } from "@/lib/types"
import CarCard from "../components/CarCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import Footer from "../components/Footer"
import { set } from "date-fns"

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({ fuelType: "" })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchCars()
  }, [filters])

  const fetchCars = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })

      const response = await fetch(`/api/cars?${params}`)
      const data = await response.json()
      setCars(data)
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof FilterOptions, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const clearFilters = () => {
    setFilters({ fuelType: "" })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">Our Inventory</h1>
          <p className="text-lg text-[var(--text-color)]">Browse our selection of quality vehicles</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>
          </CardHeader>

          {showFilters && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Make</label>
                  <Input
                    placeholder="e.g., Toyota"
                    value={filters.make || ""}
                    onChange={(e) => handleFilterChange("make", e.target.value)}
                    className="border border-[var(--border-line)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Min Price</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ""}
                    onChange={(e) => handleFilterChange("minPrice", Number.parseInt(e.target.value))}
                    className="border border-[var(--border-line)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Max Price</label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handleFilterChange("maxPrice", Number.parseInt(e.target.value))}
                    className="border border-[var(--border-line)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Fuel Type</label>
                  <Select
                    value={filters.fuelType || ""}
                    onValueChange={(value) => handleFilterChange("fuelType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">Any</SelectItem>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <Button onClick={fetchCars}>Apply Filters</Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-[var(--text-color)]">
            Showing {cars.length} vehicle{cars.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Cars Grid */}
        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <CarCard data-aos="fade-up" data-aos-duration="1500" key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
            <p className="text-[var(--text-color)]">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

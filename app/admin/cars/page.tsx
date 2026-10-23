"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { Car } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCars, setFilteredCars] = useState<Car[]>([])

  useEffect(() => {
    fetchCars()
  }, [])

  useEffect(() => {
    const filtered = cars.filter(
      (car) =>
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.year.toString().includes(searchTerm),
    )
    setFilteredCars(filtered)
  }, [cars, searchTerm])

  const fetchCars = async () => {
    try {
      const response = await fetch("/api/admin/cars")
      const data = await response.json()
      setCars(data)
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return

    try {
      const response = await fetch(`/api/admin/cars/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCars(cars.filter((car) => car.id !== id))
      } else {
        alert("Failed to delete car")
      }
    } catch (error) {
      console.error("Error deleting car:", error)
      alert("Failed to delete car")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-3xl border border-border/80 bg-card">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600/20 border-t-blue-600"></div>
          <p className="text-sm text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Your collection</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Car inventory</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Manage listings, availability, and vehicle details.</p>
        </div>
        <Button asChild className="w-fit rounded-full px-5">
          <Link href="/admin/cars/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Car
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card data-aos="zoom-in" data-aos-duration="1300" className="rounded-3xl border-border/80 shadow-sm py-2 md:py-3">
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cars by make, model, or year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 rounded-2xl border-border/80 bg-background pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cars Table */}
      <Card data-aos="zoom-in" data-aos-duration="1300" className="rounded-3xl border-border/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">All vehicles</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Browse and update your active listings.</p>
            </div>
            <Badge variant="secondary" className="rounded-full px-3">{filteredCars.length} vehicles</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCars.length > 0 ? (
            <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 text-left font-medium">Vehicle</th>
                    <th className="px-4 py-3 text-left font-medium">Price</th>
                    <th className="px-4 py-3 text-left font-medium">Mileage</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => (
                    <tr key={car.id} className="border-b border-border/70 last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-foreground">
                            {car.year} {car.make} {car.model}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {car.color} • {car.fuelType}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">${car.price.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-muted-foreground">{car.mileage.toLocaleString()} miles</p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={car.isAvailable ? "default" : "secondary"} className="rounded-full">
                          {car.isAvailable ? "Available" : "Sold"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <Button size="icon" variant="outline" className="rounded-xl" aria-label={`View ${car.make} ${car.model}`} asChild>
                            <Link href={`/cars/${car.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="icon" variant="outline" className="rounded-xl" aria-label={`Edit ${car.make} ${car.model}`} asChild>
                            <Link href={`/admin/cars/${car.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(car.id)}
                            aria-label={`Delete ${car.make} ${car.model}`}
                            className="rounded-xl text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 md:hidden">
              {filteredCars.map((car) => (
                <article key={car.id} className="rounded-2xl border border-border/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-5 text-foreground">{car.year} {car.make} {car.model}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{car.color} · {car.fuelType}</p>
                    </div>
                    <Badge variant={car.isAvailable ? "default" : "secondary"} className="shrink-0 rounded-full">
                      {car.isAvailable ? "Available" : "Sold"}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">${car.price.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{car.mileage.toLocaleString()} miles</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" className="rounded-xl" aria-label={`View ${car.make} ${car.model}`} asChild>
                        <Link href={`/cars/${car.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                      <Button size="icon" variant="outline" className="rounded-xl" aria-label={`Edit ${car.make} ${car.model}`} asChild>
                        <Link href={`/admin/cars/${car.id}/edit`}><Edit className="h-4 w-4" /></Link>
                      </Button>
                      <Button size="icon" variant="outline" className="rounded-xl text-red-600" aria-label={`Delete ${car.make} ${car.model}`} onClick={() => handleDelete(car.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="font-medium text-foreground">No cars found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search or add a vehicle to your inventory.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="border-t border-border pt-6 text-center text-sm">
        <p className="mb-1.5 text-muted-foreground">
          © {new Date().getFullYear()} Hope Autos Limited. All rights reserved.
        </p>
        <p className="text-muted-foreground">No 1 Nigeria Best Vehicle Dealership</p>
      </div>

    </div>
  )
}

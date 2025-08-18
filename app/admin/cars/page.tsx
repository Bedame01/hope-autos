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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Inventory</h1>
          <p className="text-gray-600">Manage your car inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/cars/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Car
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card data-aos="zoom-in" data-aos-duration="1300">
        <CardContent className="px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cars by make, model, or year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cars Table */}
      <Card data-aos="zoom-in" data-aos-duration="1300">
        <CardHeader>
          <CardTitle>Cars ({filteredCars.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCars.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Car</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Mileage</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => (
                    <tr key={car.id} className="border-b hover:bg-[var(--background)]">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {car.year} {car.make} {car.model}
                          </p>
                          <p className="text-sm text-gray-500">
                            {car.color} • {car.fuelType}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">${car.price.toLocaleString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900">{car.mileage.toLocaleString()} miles</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={car.isAvailable ? "default" : "secondary"}>
                          {car.isAvailable ? "Available" : "Sold"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/cars/${car.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/cars/${car.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(car.id)}
                            className="text-red-600 hover:text-red-700"
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
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No cars found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="border-t border-[var(--border-line)] mt-18 mb-3 pt-8 md:pt-10 text-center">
        <p className="text-[var(--text-color)] text-sm">
          © {new Date().getFullYear()} Hope Autos. All rights reserved. |
          <Link href="/privacy" className="hover:text-gray-500 ml-1">
            Privacy Policy
          </Link>{" "}
          |
          <Link href="/terms" className="hover:text-gray-500 ml-1">
            Terms of Service
          </Link>
        </p>
      </div>

    </div>
  )
}

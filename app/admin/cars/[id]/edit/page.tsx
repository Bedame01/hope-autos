"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import type { Car } from "@/lib/types"
import ImageUpload from "../../components/ImageUpload"

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [car, setCar] = useState<Car | null>(null)
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    color: "",
    fuelType: "",
    transmission: "",
    bodyType: "",
    description: "",
    features: "",
    images: [] as string[],
    isAvailable: true,
  })

  useEffect(() => {
    fetchCar()
  }, [carId])

  const fetchCar = async () => {
    try {
      const response = await fetch(`/api/admin/cars/${carId}`)
      if (response.ok) {
        const carData: Car = await response.json()
        setCar(carData)
        setFormData({
          make: carData.make,
          model: carData.model,
          year: carData.year,
          price: carData.price,
          mileage: carData.mileage,
          color: carData.color,
          fuelType: carData.fuelType,
          transmission: carData.transmission,
          bodyType: carData.bodyType,
          description: carData.description,
          features: carData.features.join(", "),
          images: carData.images,
          isAvailable: carData.isAvailable,
        })
      } else {
        router.push("/admin/cars")
      }
    } catch (error) {
      console.error("Error fetching car:", error)
      router.push("/admin/cars")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const carData = {
        ...formData,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      }

      const response = await fetch(`/api/admin/cars/${carId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carData),
      })

      if (response.ok) {
        router.push("/admin/cars")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update car")
      }
    } catch (error) {
      console.error("Error updating car:", error)
      alert("Failed to update car")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!car) {
    return <div>Car not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/cars">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Car</h1>
          <p className="text-[var(--text-color)]">
            {car.year} {car.make} {car.model}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Car Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Car Images */}
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => handleChange("images", images)}
              maxImages={8}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Make *</label>
                <Input
                  required
                  value={formData.make}
                  onChange={(e) => handleChange("make", e.target.value)}
                  placeholder="e.g., Toyota"
                  className="border border-[var(--border-line)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Model *</label>
                <Input
                  required
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  placeholder="e.g., Camry"
                  className="border border-[var(--border-line)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Year *</label>
                <Input
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleChange("year", Number.parseInt(e.target.value))}
                  className="border border-[var(--border-line)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Price *</label>
                <Input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange("price", Number.parseInt(e.target.value))}
                  placeholder="25000"
                  className="border border-[var(--border-line)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Mileage *</label>
                <Input
                  type="number"
                  required
                  min="0"
                  value={formData.mileage}
                  onChange={(e) => handleChange("mileage", Number.parseInt(e.target.value))}
                  placeholder="15000"
                  className="border border-[var(--border-line)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Color *</label>
                <Input
                  required
                  value={formData.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  placeholder="e.g., Silver"
                  className="border border-[var(--border-line)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Fuel Type *</label>
                <Select value={formData.fuelType} onValueChange={(value) => handleChange("fuelType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Transmission *</label>
                <Select value={formData.transmission} onValueChange={(value) => handleChange("transmission", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Body Type *</label>
                <Select value={formData.bodyType} onValueChange={(value) => handleChange("bodyType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Coupe">Coupe</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the vehicle..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Features</label>
              <Input
                value={formData.features}
                onChange={(e) => handleChange("features", e.target.value)}
                placeholder="Backup Camera, Bluetooth, Cruise Control (comma separated)"
              />
              <p className="text-xs text-gray-400 mt-1">Separate features with commas</p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => handleChange("isAvailable", e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="isAvailable" className="text-sm font-medium text-[var(--text-color)]">
                Available for sale
              </label>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/cars">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

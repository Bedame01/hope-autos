"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, DollarSign } from "lucide-react"
import Link from "next/link"
import type { Car } from "@/lib/types"
import ImageUpload from "../../components/ImageUpload"
import VehicleQrControls from "../../components/VehicleQrControls"
import { useCurrency } from "@/app/contexts/CurrencyContext"

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string
  const { currency, exchangeRate, getCurrencySymbol, formatPrice } = useCurrency()

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
        price: Math.round(formData.price),
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
      [field]:
        field === "price"
          ? currency === "NGN"
            ? Number(value) / exchangeRate
            : Number(value)
          : value,
    }))
  }

  if (loading) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-border/80 bg-card">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-muted-foreground">Loading vehicle details...</p>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="rounded-3xl border border-border/80 bg-card p-8 text-center">
        <p className="font-medium text-foreground">Vehicle not found.</p>
        <p className="mt-1 text-sm text-muted-foreground">It may have been removed from your inventory.</p>
      </div>
    )
  }

  const currencySymbol = getCurrencySymbol()
  const displayedInputPrice = currency === "NGN" ? Math.round(formData.price * exchangeRate) : formData.price
  const formattedUsdPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(formData.price)

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button variant="outline" size="sm" className="w-fit rounded-full" asChild>
          <Link href="/admin/cars">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Link>
        </Button>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Inventory / Edit listing</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Edit vehicle</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            {car.year} {car.make} {car.model}
          </p>
        </div>
      </div>

      <VehicleQrControls car={car} />

      <Card className="rounded-3xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Vehicle details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Car Images */}
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => handleChange("images", images)}
              maxImages={8}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Make *</label>
                <Input
                  required
                  value={formData.make}
                  onChange={(e) => handleChange("make", e.target.value)}
                  placeholder="e.g., Toyota"
                  className="py-5.5"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Model *</label>
                <Input
                  required
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  placeholder="e.g., Camry"
                  className="py-5.5"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Year *</label>
                <Input
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleChange("year", Number.parseInt(e.target.value))}
                  className="py-5.5"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Price ({currencySymbol}) *</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                    <span className="text-muted-foreground font-semibold">{currencySymbol}</span>
                  </div>
                  <Input
                    type="number"
                    required
                    min="0"
                    value={displayedInputPrice}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder={currency === "USD" ? "25000" : "41250000"}
                    className="pl-8 py-5.5"
                  />
                </div>
                {formData.price > 0 && (
                  <div className="mt-2 rounded-xl border border-border/70 bg-muted/40 p-3">
                    <p className="text-sm text-muted-foreground">
                      Display price: <span className="font-bold text-primary">{formatPrice(formData.price)}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      USD equivalent: <span className="font-medium text-foreground">{formattedUsdPrice}</span>
                    </p>
                    {currency === "USD" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        NGN equivalent: {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          maximumFractionDigits: 0,
                        }).format(formData.price * exchangeRate)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Mileage *</label>
                <Input
                  type="number"
                  required
                  min="0"
                  value={formData.mileage}
                  onChange={(e) => handleChange("mileage", Number.parseInt(e.target.value))}
                  placeholder="15000"
                  className="py-5.5"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Color *</label>
                <Input
                  required
                  value={formData.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  placeholder="e.g., Silver"
                  className="py-5.5"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Fuel type *</label>
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
                <label className="mb-2 block text-sm font-medium text-foreground">Transmission *</label>
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
                <label className="mb-2 block text-sm font-medium text-foreground">Body type *</label>
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
              <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the vehicle..."
                rows={4}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Features</label>
              <Input
                value={formData.features}
                onChange={(e) => handleChange("features", e.target.value)}
                placeholder="Backup Camera, Bluetooth, Cruise Control (comma separated)"
                className="py-5.5"
              />
              <p className="text-xs text-muted-foreground mt-1">Separate features with commas</p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => handleChange("isAvailable", e.target.checked)}
                className="rounded border-input"
              />
              <label htmlFor="isAvailable" className="text-sm font-medium text-foreground">
                Available for sale
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row">
              <Button type="submit" disabled={saving} className="w-full rounded-full px-6 py-5.5 sm:w-auto">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button type="button" variant="outline" className="w-full rounded-full px-6 py-5.5 sm:w-auto" asChild>
                <Link href="/admin/cars">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

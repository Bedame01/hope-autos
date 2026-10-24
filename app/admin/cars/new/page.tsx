"use client"

import type React from "react"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, DollarSign } from "lucide-react"
import Link from "next/link"
import ImageUpload from "../components/ImageUpload"
import VehicleQrControls from "../components/VehicleQrControls"
import { useCurrency } from "@/app/contexts/CurrencyContext"
import type { Car } from "@/lib/types"
import { MAX_VEHICLE_IMAGES } from "@/lib/car-images"

export default function NewCarPage() {
  const router = useRouter()
  const { currency, exchangeRate, getCurrencySymbol, formatPrice } = useCurrency()
  const [loading, setLoading] = useState(false)
  const [createdCar, setCreatedCar] = useState<Car | null>(null)
  const idempotencyKey = useRef<string | null>(null)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const storageKey = "hope-autos-car-create-key"
      const requestKey =
        idempotencyKey.current || sessionStorage.getItem(storageKey) || crypto.randomUUID()
      idempotencyKey.current = requestKey
      sessionStorage.setItem(storageKey, requestKey)

      const carData = {
        ...formData,
        price: Math.round(formData.price),
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        images: formData.images.length > 0 ? formData.images : ["/placeholder.svg"],
      }

      const response = await fetch("/api/admin/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": requestKey,
        },
        body: JSON.stringify(carData),
      })

      if (response.ok) {
        const savedCar: Car = await response.json()
        sessionStorage.removeItem(storageKey)
        idempotencyKey.current = null
        setCreatedCar(savedCar)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to add car")
      }
    } catch (error) {
      console.error("Error adding car:", error)
      alert("Failed to add car")
    } finally {
      setLoading(false)
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

  const currencySymbol = getCurrencySymbol()
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
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Inventory / New listing</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Add a vehicle</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">Add a new vehicle to your inventory.</p>
        </div>
      </div>

      {createdCar ? (
        <Card className="rounded-3xl border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle>Vehicle saved successfully</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {createdCar.year} {createdCar.make} {createdCar.model} is in your inventory. Its QR code can be retried if generation fails.
            </p>
            <VehicleQrControls car={createdCar} autoOpen />
            <Button type="button" variant="outline" className="rounded-full" onClick={() => router.push("/admin/cars")}>
              Back to inventory
            </Button>
          </CardContent>
        </Card>
      ) : <Card className="rounded-3xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Vehicle details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    <span className="text-muted-foreground">{currencySymbol}</span>
                  </div>
                  <Input
                    type="number"
                    required
                    min="0"
                    value={currency === "NGN" ? Math.round(formData.price * exchangeRate) : formData.price}
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
                    {currency === "NGN" && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        USD equivalent: <span className="font-medium text-foreground">{formattedUsdPrice}</span>
                      </p>
                    )}
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

            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => handleChange("images", images)}
              maxImages={MAX_VEHICLE_IMAGES}
              className="col-span-full"
            />

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
              <Button type="submit" disabled={loading} className="w-full rounded-full px-6 py-5.5 sm:w-auto">
                {loading ? "Adding..." : "Add Car"}
              </Button>
              <Button type="button" variant="outline" className="w-full rounded-full px-6 py-5.5 sm:w-auto" asChild>
                <Link href="/admin/cars">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>}
    </div>
  )
}

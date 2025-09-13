"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Save, Check } from "lucide-react"
import { useCurrency } from "@/app/contexts/CurrencyContext"

export default function CurrencySettings() {
  const { currency, setCurrency, formatPrice } = useCurrency()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  ]

  const handleSave = async () => {
    setSaving(true)

    try {
      // Save to API
      await fetch("/api/admin/currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error saving currency settings:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Currency Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="currency">Default Currency</Label>
          <Select value={currency} onValueChange={(value) => setCurrency(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  <div className="flex items-center space-x-2">
                    <span>{curr.flag}</span>
                    <span>{curr.symbol}</span>
                    <span>{curr.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Price Preview</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Toyota Camry 2023:</span>
              <span className="font-bold text-primary">{formatPrice(25000)}</span>
            </div>
            <div className="flex justify-between">
              <span>Honda CR-V 2022:</span>
              <span className="font-bold text-primary">{formatPrice(32000)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tesla Model 3 2024:</span>
              <span className="font-bold text-primary">{formatPrice(45000)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Current Currency:</span>
          </div>
          <Badge variant="secondary">
            {currencies.find((c) => c.code === currency)?.flag} {currencies.find((c) => c.code === currency)?.symbol}{" "}
            {currencies.find((c) => c.code === currency)?.name}
          </Badge>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Currency Settings
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

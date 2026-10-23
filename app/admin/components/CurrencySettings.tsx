"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Save, Check } from "lucide-react"
import { useCurrency } from "@/app/contexts/CurrencyContext"
import useLanguage from "@/hooks/useLanguage"

export default function CurrencySettings() {
  const { currency, setCurrency, formatPrice } = useLanguage()
  const { exchangeRate, setExchangeRate } = useCurrency()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [rateInput, setRateInput] = useState(String(exchangeRate))
  const [error, setError] = useState("")

  useEffect(() => {
    setRateInput(String(exchangeRate))
  }, [exchangeRate])

  const handleRateChange = (value: string) => {
    setRateInput(value)
    setSaved(false)
    setError("")
  }

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  ]

  const handleSave = async () => {
    const nextRate = Number(rateInput)
    if (!Number.isFinite(nextRate) || nextRate <= 0) {
      setError("Enter a valid rate greater than zero.")
      return
    }

    setSaving(true)
    setError("")

    try {
      const response = await fetch("/api/admin/currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchangeRate: nextRate }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to save exchange rate")

      setExchangeRate(result.exchangeRate)
      setRateInput(String(result.exchangeRate))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error saving currency settings:", error)
      setError(error instanceof Error ? error.message : "Failed to save exchange rate")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="rounded-3xl border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10">
            <DollarSign className="h-4 w-4 text-blue-600" />
          </span>
          <span>Currency Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="currency">Default Currency</Label>
          <Select value={currency} onValueChange={(value) => setCurrency(value as "USD" | "NGN")}>
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

        <div>
          <Label htmlFor="exchange-rate">NGN per 1 USD</Label>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
              ₦
            </span>
            <input
              id="exchange-rate"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={rateInput}
              onChange={(event) => handleRateChange(event.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-background pl-8 pr-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              aria-describedby="exchange-rate-help"
            />
          </div>
          <p id="exchange-rate-help" className="mt-2 text-xs leading-5 text-muted-foreground">
            Used across vehicle price displays and currency conversions. Current rate: 1 USD = ₦{exchangeRate.toLocaleString("en-NG")}.
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
          <h4 className="mb-3 font-medium text-foreground">Price preview</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span>Toyota Camry 2023:</span>
              <span className="font-bold text-primary">{formatPrice(25000)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span>Honda CR-V 2022:</span>
              <span className="font-bold text-primary">{formatPrice(32000)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span>Tesla Model 3 2024:</span>
              <span className="font-bold text-primary">{formatPrice(45000)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/40 p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Current Currency:</span>
          </div>
          <Badge variant="secondary" className="max-w-[60%] rounded-full">
            {currencies.find((c) => c.code === currency)?.flag} {currencies.find((c) => c.code === currency)?.symbol}{" "}
            {currencies.find((c) => c.code === currency)?.name}
          </Badge>
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button onClick={handleSave} disabled={saving} className="w-full rounded-full bg-blue-600 text-white hover:bg-blue-700">
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
